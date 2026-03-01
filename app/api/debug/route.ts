import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbUrlPrefix = process.env.DATABASE_URL?.substring(0, 20) ?? "undefined";
  return NextResponse.json({
    hasDbUrl,
    dbUrlPrefix,
    nodeEnv: process.env.NODE_ENV,
  });
}
