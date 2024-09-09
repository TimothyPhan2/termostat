import { callChain } from "@/lib/langchain";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { targetWord, userGuess } = await req.json();
        console.log("Received request:", { targetWord, userGuess });
        const res = await callChain(userGuess, targetWord);
      
        console.log("Response from callChain:", res);
        return NextResponse.json(res);
    } catch (error) {
        return NextResponse.error();
    }
}