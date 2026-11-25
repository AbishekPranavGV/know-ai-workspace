import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const goals = await prisma.goal.findMany({
      orderBy: { createdAt: "desc" },
    })

    const formatted = goals.map(g => ({
      ...g,
      keyResults: JSON.parse(g.keyResults || "[]"),
    }))

    return NextResponse.json({ success: true, goals: formatted })
  } catch (error) {
    console.error("GET /api/goals error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, category, targetDate, keyResults } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: "Goal title is required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst()
    const workspace = await prisma.workspace.findFirst()

    if (!user || !workspace) {
      return NextResponse.json({ success: false, error: "Workspace context missing" }, { status: 404 })
    }

    const created = await prisma.goal.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category || "Academic",
        targetDate: targetDate || null,
        progress: 0,
        status: "ACTIVE",
        keyResults: JSON.stringify(keyResults || []),
      },
    })

    return NextResponse.json({
      success: true,
      goal: {
        ...created,
        keyResults: JSON.parse(created.keyResults),
      },
    })
  } catch (error) {
    console.error("POST /api/goals error:", error)
    return NextResponse.json({ success: false, error: "Failed to create goal" }, { status: 500 })
  }
}
