import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const user = await prisma.user.findFirst({
      include: {
        mfaConfig: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials,
        avatarUrl: user.avatarUrl,
        mfaEnabled: user.mfaConfig?.enabled ?? false,
      },
    })
  } catch (error) {
    console.error("GET /api/user/profile error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user profile" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Valid name is required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        eventType: "SEC-007",
        outcome: "SUCCESS",
        securityClassification: "INFO",
        metadata: JSON.stringify({ action: "profile_updated", newName: updated.name }),
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
      },
    })
  } catch (error) {
    console.error("PATCH /api/user/profile error:", error)
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
  }
}
