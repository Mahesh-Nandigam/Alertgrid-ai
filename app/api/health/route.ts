import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "AlertGrid AI System Online", timestamp: new Date().toISOString() });
}
