import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const cfDbUrl = (env as any).DATABASE_URL;
    const processDbUrl = process.env.DATABASE_URL;
    return NextResponse.json({
      hasCfEnv: !!cfDbUrl,
      cfPrefix: cfDbUrl?.substring(0, 20) ?? "undefined",
      hasProcessEnv: !!processDbUrl,
      processPrefix: processDbUrl?.substring(0, 20) ?? "undefined",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
