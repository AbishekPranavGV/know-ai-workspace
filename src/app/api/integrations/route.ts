import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const integrations = await prisma.integration.findMany({
      orderBy: { createdAt: "asc" },
    })

    const formatted = integrations.map(i => ({
      ...i,
      config: JSON.parse(i.config || "{}"),
    }))

    return NextResponse.json({ success: true, integrations: formatted })
  } catch (error) {
    console.error("GET /api/integrations error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch integrations" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { provider, status, config } = body

    if (!provider) {
      return NextResponse.json({ success: false, error: "Provider identifier required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst()
    const workspace = await prisma.workspace.findFirst()

    if (!user || !workspace) {
      return NextResponse.json({ success: false, error: "Workspace context missing" }, { status: 404 })
    }

    const updated = await prisma.integration.upsert({
      where: {
        workspaceId_provider: {
          workspaceId: workspace.id,
          provider,
        },
      },
      update: {
        status: status || "CONNECTED",
        config: config ? JSON.stringify(config) : undefined,
        lastSyncAt: new Date(),
      },
      create: {
        workspaceId: workspace.id,
        userId: user.id,
        provider,
        name: provider.replace("_", " "),
        status: status || "CONNECTED",
        config: JSON.stringify(config || {}),
        lastSyncAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      integration: {
        ...updated,
        config: JSON.parse(updated.config || "{}"),
      },
    })
  } catch (error) {
    console.error("POST /api/integrations error:", error)
    return NextResponse.json({ success: false, error: "Failed to update integration" }, { status: 500 })
  }
}
