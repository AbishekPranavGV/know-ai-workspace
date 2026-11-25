import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existing) {
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        emailVerified: true,
      },
    })

    // Auto-provision personal workspace for the user
    const ws = await prisma.workspace.create({
      data: {
        name: `${user.name.split(" ")[0]}'s Personal Space`,
        slug: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ownerId: user.id,
      },
    })

    await prisma.workspaceMembership.create({
      data: {
        userId: user.id,
        workspaceId: ws.id,
        role: "OWNER",
      },
    })

    // Create welcoming note
    await prisma.note.create({
      data: {
        workspaceId: ws.id,
        authorId: user.id,
        title: "Welcome to KNOW AKS!",
        content: `Hi ${user.name},\n\nWelcome to your all-in-one digital workspace. Here you can capture notes, manage tasks, collaborate with your team, and study effectively.\n\nEnjoy free, universal digital productivity!`,
        color: "bg-indigo-500",
        wordCount: 35,
      },
    })

    // Log account creation
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        eventType: "SEC-001",
        outcome: "SUCCESS",
        deviceInfo: req.headers.get("user-agent") || "Web Browser",
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        securityClassification: "INFO",
        metadata: JSON.stringify({ action: "account_created" }),
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("POST /api/auth/register error:", error)
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 })
  }
}
