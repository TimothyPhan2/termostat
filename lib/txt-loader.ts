import { TextLoader } from "langchain/document_loaders/fs/text";

export async function getChunkedDocsFromTXT(txtFilePath: string){
    try {
        const loader = new TextLoader(txtFilePath);

        const docs = await loader.load();

        const chunkedDocs = docs.flatMap((doc) => {
            return doc.pageContent.split('\n').map((line) => {
                return {
                    pageContent: line.trim(),
                    metadata: doc.metadata,
                };
            });
        });


        return chunkedDocs;

    } catch (e) {
        console.error(e);
        throw new Error("TXT docs chunking failed !");
    }
}
