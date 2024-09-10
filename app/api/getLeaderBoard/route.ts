import { NextResponse } from "next/server";
import { getDb } from "@/db/db";
import { leaderboardTable, usersTable } from "@/db/schema";
import { sql } from "drizzle-orm";
export const fetchCache = 'force-no-store'
export async function GET() {
    const db = getDb();
    try {
        const result = await db.execute(sql`
            SELECT 
              ${leaderboardTable.user_id},
              ${usersTable.name},
              ${usersTable.profile_pic},
              ${leaderboardTable.score},
              ${leaderboardTable.gamesWon}
            FROM ${leaderboardTable}
            INNER JOIN ${usersTable} ON ${leaderboardTable.user_id} = ${usersTable.user_id}
          `);
      
          console.log("Fetched leaderboard data:", result);
      
          return NextResponse.json(result, {
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0',
    
            }
          });
    } catch (error) {
        console.error("Error getting leaderboard", error);
        return NextResponse.error();
    }
}