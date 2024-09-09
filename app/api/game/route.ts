import { callChain } from "@/lib/langchain";
import { NextResponse } from "next/server";
export const runtime = "edge"
export async function POST(req: Request) {
    try {
        const { targetWord, userGuess } = await req.json();
        const res = await callChain(userGuess, targetWord);
        console.log(res);
        
        return NextResponse.json(res, {
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache',
              'Access-Control-Allow-Origin': '*', // Or specify allowed origins
              'Access-Control-Allow-Methods': 'POST',
              'Access-Control-Allow-Headers': 'Content-Type',
            }
          });
    } catch (error) {
        return NextResponse.error();
    }
}