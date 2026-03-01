import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const sql = getDb();
  const projects = await sql`
    SELECT id, title, tagline, description, image
    FROM projects ORDER BY RANDOM() LIMIT 2
  `;

  if (projects.length < 2) {
    return NextResponse.json({ error: "Not enough projects" }, { status: 500 });
  }

  return NextResponse.json({ left: projects[0], right: projects[1] });
}
