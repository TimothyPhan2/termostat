import { getRandomLine } from "@/lib/txt-loader";
import { createHints } from "@/lib/langchain";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "data/words2.txt"); //changed from words.txt to words2.txt
        const targetWord = await getRandomLine(filePath);
        
        // Generate hints for the target word
        const hintsResult = await createHints(targetWord);
        const hints = JSON.parse(hintsResult.answer).hints;

        return NextResponse.json({ targetWord, hints }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        return NextResponse.error();
    }
}