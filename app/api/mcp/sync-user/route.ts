import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const payload = await request.json()

  console.info("MCP sync requested", payload)

  return NextResponse.json({ status: "ok" })
}
