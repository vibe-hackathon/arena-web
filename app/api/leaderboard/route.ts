import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const sql = getDb();

  const projects = await sql`
    SELECT id, title, tagline, elo, wins, losses, draws
    FROM projects ORDER BY elo DESC
  `;

  const totalVotes = await sql`SELECT COUNT(*) as count FROM votes`;

  return NextResponse.json({
    projects,
    totalVotes: Number(totalVotes[0].count),
  });
}
