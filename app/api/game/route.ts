import { callChain } from "@/lib/langchain";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { targetWord, userGuess } = await req.json();
        const res = await callChain(userGuess, targetWord);
      
        
        return NextResponse.json(res);
    } catch (error) {
        return NextResponse.error();
    }
}