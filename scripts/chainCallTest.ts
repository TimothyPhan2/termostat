import { callChain } from "../lib/langchain.ts";


async function main() {
    try {
        const results = await callChain("oven"); //example of words passed to the chain. ensure arg order is: (guessedWord, targetWord) where targetWord exists in Pinecone
        console.log(results);
        console.log("Chain called successfully");
    } catch (e) {
        console.log("Error calling chain", e);
    }
}

main();