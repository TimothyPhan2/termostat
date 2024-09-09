import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
// import { config } from "dotenv";

// config({ path: ".env.local" }); // or .env.local

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql);
}

