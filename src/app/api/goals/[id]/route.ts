import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { progress, status, keyResults, title, description } = body

    const data: Record<string, any> = {}
    if (typeof progress === "number") data.progress = progress
    if (status) data.status = status
    if (title) data.title = title
    if (description !== undefined) data.description = description
    if (keyResults) data.keyResults = JSON.stringify(keyResults)

    const updated = await prisma.goal.update({
      where: { id },
      data,
    })

    return NextResponse.json({
      success: true,
      goal: {
        ...updated,
        keyResults: JSON.parse(updated.keyResults || "[]"),
      },
    })
  } catch (error) {
    console.error("PUT /api/goals/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to update goal" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.goal.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error("DELETE /api/goals/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete goal" }, { status: 500 })
  }
}
