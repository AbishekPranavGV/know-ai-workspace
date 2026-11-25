import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const notes = await prisma.note.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ success: true, notes })
  } catch (error) {
    console.error("GET /api/notes error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title = "Untitled Note", content = "", color = "bg-indigo-500", workspaceId } = body

    // Get or fallback to first workspace and user
    const ws = workspaceId
      ? await prisma.workspace.findUnique({ where: { id: workspaceId } })
      : await prisma.workspace.findFirst()

    const user = await prisma.user.findFirst()

    if (!ws || !user) {
      return NextResponse.json({ success: false, error: "No workspace or user found" }, { status: 400 })
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length

    const note = await prisma.note.create({
      data: {
        workspaceId: ws.id,
        authorId: user.id,
        title,
        content,
        color,
        wordCount,
      },
    })

    return NextResponse.json({ success: true, note })
  } catch (error) {
    console.error("POST /api/notes error:", error)
    return NextResponse.json({ success: false, error: "Failed to create note" }, { status: 500 })
  }
}
