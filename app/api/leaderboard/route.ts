import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
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
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
