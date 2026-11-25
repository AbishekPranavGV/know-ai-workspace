import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const updated = await prisma.session.update({
      where: { id },
      data: { revoked: true },
    })

    // Log the security event (SEC-008)
    const user = await prisma.user.findFirst()
    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          eventType: "SEC-008",
          outcome: "SUCCESS",
          deviceInfo: updated.deviceInfo,
          ipAddress: updated.ipAddress,
          securityClassification: "WARNING",
          metadata: JSON.stringify({ action: "session_revoked", sessionId: id }),
        },
      })
    }

    return NextResponse.json({ success: true, revokedId: id })
  } catch (error) {
    console.error("DELETE /api/security/sessions/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to revoke session" }, { status: 500 })
  }
}
