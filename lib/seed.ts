import { neon } from "@neondatabase/serverless";
import { MOCK_PROJECTS } from "./mock-data";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      elo INTEGER NOT NULL DEFAULT 1000,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      draws INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      left_id TEXT NOT NULL REFERENCES projects(id),
      right_id TEXT NOT NULL REFERENCES projects(id),
      result TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  for (const p of MOCK_PROJECTS) {
    await sql`
      INSERT INTO projects (id, title, tagline, description, image)
      VALUES (${p.id}, ${p.title}, ${p.tagline}, ${p.description}, ${p.image})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  console.log("Seed complete: tables created, projects inserted.");
}

seed().catch(console.error);
