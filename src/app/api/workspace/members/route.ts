import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const workspace = await prisma.workspace.findFirst({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!workspace) {
      return NextResponse.json({ success: false, error: "Workspace not found" }, { status: 404 })
    }

    const members = workspace.members.map(m => ({
      membershipId: m.id,
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      joinedAt: m.joinedAt,
      isOwner: m.role === "OWNER",
    }))

    return NextResponse.json({
      success: true,
      workspaceName: workspace.name,
      members,
    })
  } catch (error) {
    console.error("GET /api/workspace/members error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch workspace members" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, role } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Member email is required" }, { status: 400 })
    }

    const workspace = await prisma.workspace.findFirst()
    if (!workspace) {
      return NextResponse.json({ success: false, error: "Workspace not found" }, { status: 404 })
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {},
      create: {
        email: email.toLowerCase().trim(),
        name: name ? name.trim() : email.split("@")[0],
      },
    })

    const membership = await prisma.workspaceMembership.upsert({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspace.id,
        },
      },
      update: {
        role: role || "MEMBER",
      },
      create: {
        userId: user.id,
        workspaceId: workspace.id,
        role: role || "MEMBER",
      },
    })

    // Log the security event (SEC-006 - Permission / membership modified)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        eventType: "SEC-006",
        outcome: "SUCCESS",
        securityClassification: "INFO",
        metadata: JSON.stringify({ action: "member_invited", email: user.email, role: membership.role }),
      },
    })

    return NextResponse.json({
      success: true,
      member: {
        membershipId: membership.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        role: membership.role,
        joinedAt: membership.joinedAt,
        isOwner: membership.role === "OWNER",
      },
    })
  } catch (error) {
    console.error("POST /api/workspace/members error:", error)
    return NextResponse.json({ success: false, error: "Failed to add member" }, { status: 500 })
  }
}
