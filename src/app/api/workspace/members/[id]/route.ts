import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { role } = body

    if (!role) {
      return NextResponse.json({ success: false, error: "Role is required" }, { status: 400 })
    }

    const updated = await prisma.workspaceMembership.update({
      where: { id },
      data: { role },
      include: {
        user: true,
      },
    })

    // Log permission change
    await prisma.auditLog.create({
      data: {
        userId: updated.userId,
        eventType: "SEC-006",
        outcome: "SUCCESS",
        securityClassification: "WARNING",
        metadata: JSON.stringify({ action: "role_modified", newRole: role }),
      },
    })

    return NextResponse.json({
      success: true,
      member: {
        membershipId: updated.id,
        userId: updated.userId,
        name: updated.user.name,
        email: updated.user.email,
        role: updated.role,
      },
    })
  } catch (error) {
    console.error("PUT /api/workspace/members/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to update member role" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const target = await prisma.workspaceMembership.findUnique({
      where: { id },
    })

    if (target?.role === "OWNER") {
      return NextResponse.json({ success: false, error: "Cannot remove workspace OWNER" }, { status: 400 })
    }

    await prisma.workspaceMembership.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, removedId: id })
  } catch (error) {
    console.error("DELETE /api/workspace/members/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to remove member" }, { status: 500 })
  }
}
