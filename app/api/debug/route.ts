import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    return NextResponse.json({
      hasDbUrl: !!dbUrl,
      dbUrlPrefix: dbUrl?.substring(0, 30) ?? "undefined",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
