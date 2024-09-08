import { saveLB } from "@/db/functions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {user_id, score, gamesWon} = await req.json();
        await saveLB({user_id, score, gamesWon});
        console.log("Leaderboard entry saved successfully");
        return NextResponse.json({message: "Leaderboard entry saved successfully"});
    } catch (error) {
        console.error("Error saving leaderboard entry", error);
        return NextResponse.error();
    }
}