import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, content, color, pinned } = body

    const wordCount = typeof content === "string" ? content.trim().split(/\s+/).filter(Boolean).length : undefined

    const updated = await prisma.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(color !== undefined && { color }),
        ...(pinned !== undefined && { pinned }),
        ...(wordCount !== undefined && { wordCount }),
      },
    })

    return NextResponse.json({ success: true, note: updated })
  } catch (error) {
    console.error("PUT /api/notes/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to update note" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/notes/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete note" }, { status: 500 })
  }
}
