import { NextResponse } from "next/server";
import packageJson from "../../../package.json";

export const dynamic = "force-static";

export async function GET() {
  const version = packageJson.version;
  return NextResponse.json(version);
}
