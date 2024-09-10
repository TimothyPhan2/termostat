import { saveLB } from "@/db/functions";
import { NextResponse } from "next/server";
export const fetchCache = 'force-no-store'
export async function POST(req: Request) {
    try {
        const {user_id, score, gamesWon} = await req.json();
        await saveLB({user_id, score, gamesWon});
        console.log("Leaderboard entry saved successfully");
        return NextResponse.json({message: "Leaderboard entry saved successfully"}, {
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0',
    
            }
          });
    } catch (error) {
        console.error("Error saving leaderboard entry", error);
        return NextResponse.error();
    }
}