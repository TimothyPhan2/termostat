import { callChain } from "../lib/langchain.ts";


async function main() {
    try {
        const results = await callChain("october", "sing"); //example of words passed to the chain
        //console.log(results);
        console.log("Chain called successfully");
    } catch (e) {
        console.log("Error calling chain", e);
    }
}

main();