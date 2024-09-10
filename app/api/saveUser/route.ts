import { saveUser } from "@/db/functions";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic"
export const fetchCache = 'force-no-store'
export async function POST(req: Request){
    try {
        const { user_id, name, profile_pic, streak } = await req.json();
        await saveUser({user_id, name, profile_pic, streak});
        console.log("User saved successfully");
        return NextResponse.json({message: "User saved successfully"}, {
            headers: {
              'Cache-Control': 'no-store, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0',
    
            }
          });
    } catch (error) {
        console.error("Error saving user", error);
        return NextResponse.error();
    }
}