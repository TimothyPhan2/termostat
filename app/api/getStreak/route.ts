import { NextResponse } from "next/server";
import { getDb } from "@/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";



export const fetchCache = "force-no-store";
export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get("userId") ?? "";
    
    const db = getDb();
    try {
        const result = await db.select({ streak: usersTable.streak })
            .from(usersTable)
            .where(eq(usersTable.user_id, userId as string))
            .execute();


        return NextResponse.json(result, {
            headers: {
                "Cache-Control": "no-store, max-age=0",
                Pragma: "no-cache",
                Expires: "0",
            },
        });
    } catch (error) {
        console.error("Error getting user streak", error);
        return NextResponse.error();
    }
}
