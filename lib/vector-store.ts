import { env } from './config.ts';
import { OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from '@pinecone-database/pinecone';
import { getPineconeClient } from './pinecone-client.ts';

export async function embedAndStoreDocs(
  client: Pinecone,
  // @ts-ignore docs type errors
  docs: Document<Record<string, any>>[]
) {
  /*create and store the embeddings in the vectorStore*/
  try {
    docs.forEach((doc, index) => {
      if (!doc.text) {
        console.warn(`Document ${index} has an undefined or empty text field`);
      }
    });

    const embeddings = new OpenAIEmbeddings({ apiKey: env.OPENAI_API_KEY });
    const index = client.Index(env.PINECONE_INDEX_NAME);
    //delete any existing namespace before storing new docs
    const stats = await index.describeIndexStats();
    const namespaceExists = stats.namespaces && stats.namespaces[env.PINECONE_NAMESPACE];
    if (namespaceExists) {
      await index.namespace(env.PINECONE_NAMESPACE).deleteAll();
    }

    //embed the TXT documents
    // namespaces are separated in pinecone by the userId
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: env.PINECONE_NAMESPACE,
      textKey: 'text',
    });
    console.log('Docs embedded and stored successfully !');
  } catch (error) {
    console.log('error ', error);
    throw new Error('Failed to load your docs !');
  }
}

export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new OpenAIEmbeddings({ apiKey: env.OPENAI_API_KEY });
    const index = client.Index(env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: env.PINECONE_NAMESPACE,
      textKey: 'text',
    });

    return vectorStore;
  } catch (error) {
    console.log('error ', error);
    throw new Error('Something went wrong while getting vector store !');
  }
}

export async function getWordVector(word: string) {
  const client = await getPineconeClient();
  const index = client.Index(env.PINECONE_INDEX_NAME);
  const queryResponse = await index.namespace(env.PINECONE_NAMESPACE).query({
    topK: 1,
    vector: new Array(1536).fill(0),  // Placeholder vector
    filter: {
      "text": { "$eq": word }
    },
    includeMetadata: true,
    includeValues: true
  });

  if (queryResponse.matches && queryResponse.matches.length > 0) {
    return queryResponse.matches[0].values as number[];
  }
  return new Array(1536).fill(0); //blank vector
}

export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, a, i) => sum + a * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

export function getSimilarityScore(cosScore: number) {
  //0.75 to 0.88

  if (cosScore < 0.75) {
    // Map cosScore from [0, 0.75) to [0, 100)
    return Math.floor((cosScore / 0.75) * 100);
  } else if (cosScore >= 0.87) {
    // Map cosScore from [0.87, 1] to [950, 1000]
    return Math.ceil(((cosScore - 0.87) / (1 - 0.87)) * 50 + 950);
  } else if (cosScore >= 0.85) {
    // Map cosScore from [0.85, 0.87) to [900, 950)
    return Math.floor(((cosScore - 0.85) / (0.87 - 0.85)) * 50 + 900);
  } else if (cosScore >= 0.84) {
    // Map cosScore from [0.84, 0.85) to [850, 900)
    return Math.floor(((cosScore - 0.84) / (0.85 - 0.84)) * 50 + 850);
  } else if (cosScore >= 0.83) {
    // Map cosScore from [0.83, 0.84) to [800, 850)
    return Math.floor(((cosScore - 0.83) / (0.84 - 0.83)) * 50 + 800);
  } /* else {
    // Map cosScore from [0.75, 0.83) to [100, 800)
    return Math.floor(((cosScore - 0.75) / (0.83 - 0.75)) * 700 + 100);
  } */
  
  const cosSim = Math.ceil(((cosScore - 0.75) / 0.10) * 1000);

  return Math.min(1000, cosSim);
}
