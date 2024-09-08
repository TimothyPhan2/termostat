import { TextLoader } from "langchain/document_loaders/fs/text";
import { promises as fs } from "fs";

export async function getChunkedDocsFromTXT(txtFilePath: string) {
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

export async function getRandomLine(filePath: string): Promise<string> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const lines = data.split('\n');
        const randomLine = lines[Math.floor(Math.random() * lines.length)].trim();
        return randomLine;
    } catch (error) {
        console.error('Error reading file:', error);
        throw new Error('Could not read file');
    }
}