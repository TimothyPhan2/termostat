import {
  getVectorStore,
  getWordVector,
  cosineSimilarity,
  getSimilarityScore,
} from "./vector-store.ts";
import { getPineconeClient } from "./pinecone-client.ts";
import { OpenAI, ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
//import { ChatGroq } from "@langchain/groq";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { env } from "./config.ts";
import { getRandomLine } from "./txt-loader.ts";

export async function callChain(guessedWord: string, targetWord: string) {
  const embeddings = new OpenAIEmbeddings({ apiKey: env.OPENAI_API_KEY });

  // const targetWord = await getRandomLine("data/words.txt"); //gets random word from words.txt

  const tWordVector = await getWordVector(targetWord);
  const gWordVector = (await embeddings.embedDocuments([guessedWord]))[0];
  const cosSim = cosineSimilarity(tWordVector, gWordVector);
  console.log(cosSim);

  const simScore = getSimilarityScore(cosSim);

  //const simScore = Math.ceil(((cosineSimilarity(tWordVector, gWordVector) + 1) / 2) * 1000);
  console.log(
    `Similarity score between ${guessedWord} and ${targetWord} is ${simScore}`
  );

  const systemTemplate = [
    `You are a word association game engine. A similarity score has been calculated using the vector values of each word's embeddings.`,
    `The words are a user  guessed word, and a target word that the user is trying to guess. The similarity score is calculated based on the cosine similarity between the two words' embeddings.`,
    `The calculated similarity score is: ${simScore}.`,
    `The guessed word is: ${guessedWord}.`,
    `The target word is: ${targetWord}.`,
    `The similarity should be represented as a very specific score between 0 and 1000, where the higher the score, the more similar the words are.`,
    `Despite the calculated similarity score, further assess the score based on how users might associate the guessed word with the target word.`,
    `If the target word is included in the context:
     - Increase the score by 10-20% of the remaining points (1000 - current score), but do not exceed 999.
     - Words closer to the start of the context array should receive a higher boost.
     - Example: If the current score is 700, the maximum boost should be between 30-60 points (10-20% of 300).`,
    `Only return a score of 1000 if the guessed word is exactly the same as the target word.`,
    `Only increase the calculated similarity score if necessary. Do not decrease the calculated similarity score.`,
    `If the guessed word is not a valid word, return a score of 0.`,
    //`Context: {context}`,
    `Return the similarity score as a number between 0 and 1000. Remember, only return 1000 if the guessed word is exactly the same as the target word.`,
    `Create 3 hints for the user to help them guess the target word.`,
    `The hints should be a sentence that gives the user a clue about the target word.`,
    `Hint 1 should be a broad overarching theme or category that the target word could belong to.`,
    `Hint 2 should be the type of word that the target word is.`,
    `Hint 3 should be the number of letters in the target word.`,
    `Return response as a JSON object with the following schema:
        {{
          "similarityScore": "number",
          "hints": {{
            "hint1": "string",
            "hint2": "string",
            "hint3": "string"
            }}
        }}`,
    `Ensure that the output is a valid JSON object.`,
    `Context: {context}`,
  ].join("\n\n");

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "{input}"],
  ] as const);

  const llm = new ChatOpenAI({
    apiKey: env.OPENAI_API_KEY,
    model: "gpt-4o",
    temperature: 0,
    streaming: false,
  });

  const pineconeClient = await getPineconeClient();
  const vectorStore = await getVectorStore(pineconeClient);

  const similarityChain = await createStuffDocumentsChain({ llm, prompt });
  const ragChain = await createRetrievalChain({
    retriever: vectorStore.asRetriever(30), //specify the amount of context documents to return
    combineDocsChain: similarityChain,
  });

  const result = await ragChain.invoke({
    input: `${guessedWord}`,
  });

  return result;
}
