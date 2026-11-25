import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, description, status, priority, dueDate } = body

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate }),
      },
    })

    return NextResponse.json({ success: true, task: updated })
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}
