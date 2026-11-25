import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const files = await prisma.fileAsset.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      files,
      storageUsed: "19.3 MB",
      storageLimit: "15.0 GB",
      percentUsed: 0.13,
    })
  } catch (error) {
    console.error("GET /api/files error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch files" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, size, type, source, url } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "File name is required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst()
    const workspace = await prisma.workspace.findFirst()

    if (!user || !workspace) {
      return NextResponse.json({ success: false, error: "Workspace context missing" }, { status: 404 })
    }

    const created = await prisma.fileAsset.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        name: name.trim(),
        size: size || "1.2 MB",
        type: type || "doc",
        source: source || "LOCAL",
        url: url || `/files/${name.trim()}`,
      },
    })

    return NextResponse.json({ success: true, file: created })
  } catch (error) {
    console.error("POST /api/files error:", error)
    return NextResponse.json({ success: false, error: "Failed to save file asset" }, { status: 500 })
  }
}
