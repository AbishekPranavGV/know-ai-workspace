import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user || !user.passwordHash) {
      // Log failed attempt SEC-002
      await prisma.auditLog.create({
        data: {
          eventType: "SEC-002",
          outcome: "FAILED",
          deviceInfo: req.headers.get("user-agent") || "Web Browser",
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          securityClassification: "WARNING",
          metadata: JSON.stringify({ email, reason: "invalid_user" }),
        },
      })

      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      // Log failed attempt SEC-002
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          eventType: "SEC-002",
          outcome: "FAILED",
          deviceInfo: req.headers.get("user-agent") || "Web Browser",
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          securityClassification: "WARNING",
          metadata: JSON.stringify({ email, reason: "password_mismatch" }),
        },
      })

      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Create session & log SEC-001
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        deviceInfo: req.headers.get("user-agent") || "Web Browser",
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        eventType: "SEC-001",
        outcome: "SUCCESS",
        deviceInfo: req.headers.get("user-agent") || "Web Browser",
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        securityClassification: "INFO",
        metadata: JSON.stringify({ sessionId: session.id }),
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      sessionToken: session.sessionToken,
    })
  } catch (error) {
    console.error("POST /api/auth/login error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
