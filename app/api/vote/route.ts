import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const K_FACTOR = 32;

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export async function POST(req: NextRequest) {
  const { leftId, rightId, result } = await req.json();

  if (!leftId || !rightId || !["left", "right", "skip"].includes(result)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const sql = getDb();

  // Get current ELOs
  const rows = await sql`
    SELECT id, elo, wins, losses, draws
    FROM projects WHERE id IN (${leftId}, ${rightId})
  `;

  const left = rows.find((r) => r.id === leftId);
  const right = rows.find((r) => r.id === rightId);
  if (!left || !right) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const leftElo = left.elo as number;
  const rightElo = right.elo as number;
  const expLeft = expectedScore(leftElo, rightElo);
  const expRight = expectedScore(rightElo, leftElo);

  let newLeftElo: number, newRightElo: number;
  let leftWins = left.wins as number;
  let leftLosses = left.losses as number;
  let leftDraws = left.draws as number;
  let rightWins = right.wins as number;
  let rightLosses = right.losses as number;
  let rightDraws = right.draws as number;

  if (result === "skip") {
    newLeftElo = Math.round(leftElo + K_FACTOR * (0.5 - expLeft));
    newRightElo = Math.round(rightElo + K_FACTOR * (0.5 - expRight));
    leftDraws++;
    rightDraws++;
  } else if (result === "left") {
    newLeftElo = Math.round(leftElo + K_FACTOR * (1 - expLeft));
    newRightElo = Math.round(rightElo + K_FACTOR * (0 - expRight));
    leftWins++;
    rightLosses++;
  } else {
    newLeftElo = Math.round(leftElo + K_FACTOR * (0 - expLeft));
    newRightElo = Math.round(rightElo + K_FACTOR * (1 - expRight));
    leftLosses++;
    rightWins++;
  }

  // Update ELOs
  await sql`
    UPDATE projects
    SET elo = ${newLeftElo}, wins = ${leftWins}, losses = ${leftLosses}, draws = ${leftDraws}
    WHERE id = ${leftId}
  `;

  await sql`
    UPDATE projects
    SET elo = ${newRightElo}, wins = ${rightWins}, losses = ${rightLosses}, draws = ${rightDraws}
    WHERE id = ${rightId}
  `;

  // Record vote
  await sql`
    INSERT INTO votes (left_id, right_id, result)
    VALUES (${leftId}, ${rightId}, ${result})
  `;

  return NextResponse.json({ success: true });
}
