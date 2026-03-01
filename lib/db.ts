import { neon } from "@neondatabase/serverless";
import { cache } from "react";

export const getDb = cache(() => {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error("DATABASE_URL not found in environment");
  }
  
  const sql = neon(dbUrl);
  return sql;
});
