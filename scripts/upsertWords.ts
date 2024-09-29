import { getChunkedDocsFromTXT } from "../lib/txt-loader.ts";
import { getPineconeClient } from "../lib/pinecone-client.ts";
import { embedAndStoreDocs } from "../lib/vector-store.ts";

export async function upsertWordsToPinecone() {
    try {
        const pineconeClient = await getPineconeClient();
        const docs = await getChunkedDocsFromTXT("data/words2.txt");
        await embedAndStoreDocs(pineconeClient, docs);
    } catch (e) {
        console.error(e);
    }
}

async function main() {
    try {
        await upsertWordsToPinecone();
        console.log("Words upserted successfully");
    } catch (e) {
        console.log("Error upserting words");
    }
}

main();