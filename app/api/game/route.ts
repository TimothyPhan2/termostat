import { callChain } from "@/lib/langchain";
import { NextResponse } from "next/server";
import { scoreResponse } from "@/lib/vector-store";

export async function POST(req: Request) {
    
    try {
        const { targetWord, userGuess } = await req.json();
        //const res = await callChain(userGuess, targetWord);
        const res = await scoreResponse(userGuess, targetWord);
        
        return NextResponse.json(res, {
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