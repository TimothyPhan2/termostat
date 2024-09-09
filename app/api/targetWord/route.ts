import { getRandomLine } from "@/lib/txt-loader";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const targetWord = await getRandomLine("data/words.txt"); //gets random word from words.txt
        return NextResponse.json({ targetWord }, {
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache',
              'Access-Control-Allow-Origin': '*', // Or specify allowed origins
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Content-Type',
            }
          });
    } catch (error) {
        return NextResponse.error();
    }
}