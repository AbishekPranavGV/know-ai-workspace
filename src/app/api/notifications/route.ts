import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    const unreadCount = notifications.filter(n => !n.read).length

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error("GET /api/notifications error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, markAllRead } = body

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      })
      return NextResponse.json({ success: true, message: "All notifications marked as read" })
    }

    if (id) {
      const updated = await prisma.notification.update({
        where: { id },
        data: { read: true },
      })
      return NextResponse.json({ success: true, notification: updated })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("POST /api/notifications error:", error)
    return NextResponse.json({ success: false, error: "Failed to update notification" }, { status: 500 })
  }
}
