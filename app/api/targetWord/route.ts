import { getRandomLine } from "@/lib/txt-loader";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const targetWord = await getRandomLine("data/words.txt"); //gets random word from words.txt
        return NextResponse.json({ targetWord });
    } catch (error) {
        return NextResponse.error();
    }
}