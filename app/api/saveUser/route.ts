import { saveUser } from "@/db/functions";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        const { user_id, name, profile_pic, streak } = await req.json();
        await saveUser({user_id, name, profile_pic, streak});
        console.log("User saved successfully");
        return NextResponse.json({message: "User saved successfully"});
    } catch (error) {
        console.error("Error saving user", error);
        return NextResponse.error();
    }
}