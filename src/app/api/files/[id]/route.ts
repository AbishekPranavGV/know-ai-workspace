import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.fileAsset.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error("DELETE /api/files/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 })
  }
}
