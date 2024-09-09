import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { env } from "@/lib/config";

config({ path: ".env.local" }); // or .env.local

export function getDb() {
  const sql = neon(env.DATABASE_URL!);
  return drizzle(sql);
}

