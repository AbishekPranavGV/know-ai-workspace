import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const sessions = await prisma.session.findMany({
      where: { revoked: false },
      orderBy: { lastActive: "desc" },
    })

    const formatted = sessions.map((s, idx) => ({
      id: s.id,
      device: s.deviceInfo || "Web Browser",
      ip: s.ipAddress || "127.0.0.1",
      location: s.location || "Localhost",
      lastActive: idx === 0 ? "Active now" : "2h ago",
      current: idx === 0,
      type: (s.deviceInfo || "").toLowerCase().includes("iphone") || (s.deviceInfo || "").toLowerCase().includes("android") ? "mobile" : "desktop",
    }))

    return NextResponse.json({ success: true, sessions: formatted })
  } catch (error) {
    console.error("GET /api/security/sessions error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch sessions" }, { status: 500 })
  }
}
