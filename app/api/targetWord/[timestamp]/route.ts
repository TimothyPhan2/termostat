import { getRandomLine } from "@/lib/txt-loader";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(){
    try {
      const filePath = path.join(process.cwd(), "data/words.txt");
        const targetWord = await getRandomLine(filePath); //gets random word from words.txt
      
        return NextResponse.json({ targetWord }, {
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