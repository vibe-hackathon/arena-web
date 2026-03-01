import { neon } from "@neondatabase/serverless";
import projects from "../public/hackathon_projects.json";

async function updateDb() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log("Clearing existing data...");
  await sql`DELETE FROM votes`;
  await sql`DELETE FROM projects`;

  console.log("Inserting new projects...");
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await sql`
      INSERT INTO projects (id, title, tagline, description, image)
      VALUES (${String(i + 1)}, ${p.title}, ${p.tagline}, ${p.description}, ${p.image_url})
    `;
  }

  console.log(`Successfully inserted ${projects.length} projects.`);
}

updateDb().catch(console.error);
