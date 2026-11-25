import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error("GET /api/tasks error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description = "", status = "TODO", priority = "MEDIUM", dueDate = "", labels = [] } = body

    if (!title || typeof title !== "string") {
      return NextResponse.json({ success: false, error: "Task title is required" }, { status: 400 })
    }

    const ws = await prisma.workspace.findFirst()
    const user = await prisma.user.findFirst()

    if (!ws) {
      return NextResponse.json({ success: false, error: "No workspace found" }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        workspaceId: ws.id,
        assigneeId: user?.id,
        title,
        description,
        status,
        priority,
        dueDate,
        labels: JSON.stringify(labels),
      },
    })

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error("POST /api/tasks error:", error)
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}
