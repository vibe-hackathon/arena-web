import { neon } from "@neondatabase/serverless";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDb() {
  // In Cloudflare Workers, env vars come from getCloudflareContext()
  const { env } = getCloudflareContext();
  const dbUrl = (env as any).DATABASE_URL || process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error("DATABASE_URL not found in environment");
  }
  
  const sql = neon(dbUrl);
  return sql;
}
