import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Both current and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "New password must be at least 8 characters" }, { status: 400 })
    }

    const user = await prisma.user.findFirst()
    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: "User account not configured for password auth" }, { status: 400 })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isMatch) {
      // Audit log failed attempt
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          eventType: "SEC-004",
          outcome: "FAILED",
          securityClassification: "WARNING",
          metadata: JSON.stringify({ reason: "incorrect_current_password" }),
        },
      })
      return NextResponse.json({ success: false, error: "Current password does not match" }, { status: 400 })
    }

    const newHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    })

    // Audit log successful password change
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        eventType: "SEC-004",
        outcome: "SUCCESS",
        securityClassification: "INFO",
        metadata: JSON.stringify({ action: "password_changed" }),
      },
    })

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("POST /api/user/password error:", error)
    return NextResponse.json({ success: false, error: "Failed to update password" }, { status: 500 })
  }
}
