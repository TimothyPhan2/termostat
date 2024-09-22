import { getDb } from "./db";
import { usersTable, leaderboardTable } from "./schema";
import { sql } from "drizzle-orm";
export async function saveUser(user: {user_id: string, name: string | null, profile_pic: string, streak: number}) {
    const db = getDb();
    try {
        await db.insert(usersTable).values({
            user_id: user.user_id,
            name: user.name,
            profile_pic: user.profile_pic,
            streak: user.streak
        }).onConflictDoUpdate({
            target: usersTable.user_id,
            set:{
                name: user.name,
                profile_pic: user.profile_pic,
                streak: user.streak
            }
        })
        console.log("User saved successfully");
    } catch (error) {
        console.error("Error saving user", error);
    }
}

export async function saveLB(entry: {user_id: string, score:number, gamesWon: number}) {
    const db = getDb();
    try {
        await db.insert(leaderboardTable).values({
            user_id: entry.user_id,
            score: entry.score,
            gamesWon: entry.gamesWon
        }).onConflictDoUpdate({
            target: leaderboardTable.user_id,
            set:{
                 score: sql`${leaderboardTable.score} + ${entry.score}`,
                gamesWon: sql`${leaderboardTable.gamesWon} + ${entry.gamesWon}`
            }
        })
        console.log("Leaderboard entry saved successfully");
    } catch (error) {
        console.error("Error saving leaderboard entry", error);
    }
}