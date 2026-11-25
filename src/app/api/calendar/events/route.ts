import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const events = await prisma.calendarEvent.findMany({
      orderBy: { date: "asc" },
    })

    // Also fetch tasks that have due dates to display on the calendar seamlessly!
    const tasksWithDue = await prisma.task.findMany({
      where: {
        dueDate: { not: null },
      },
    })

    const taskEvents = tasksWithDue.map(t => ({
      id: `task-ev-${t.id}`,
      title: `Task: ${t.title}`,
      description: t.description,
      date: t.dueDate || "",
      time: "All Day",
      category: "Task",
      status: t.status,
      priority: t.priority,
      isTask: true,
      meetUrl: null,
    }))

    return NextResponse.json({
      success: true,
      events: [...events, ...taskEvents],
    })
  } catch (error) {
    console.error("GET /api/calendar/events error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch calendar events" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, date, time, category, meetUrl } = body

    if (!title || !date) {
      return NextResponse.json({ success: false, error: "Title and Date are required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst()
    const workspace = await prisma.workspace.findFirst()

    if (!user || !workspace) {
      return NextResponse.json({ success: false, error: "Workspace context missing" }, { status: 404 })
    }

    const created = await prisma.calendarEvent.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        title: title.trim(),
        description: description ? description.trim() : null,
        date: date.trim(),
        time: time ? time.trim() : "10:00 AM - 11:00 AM",
        category: category || "Study",
        meetUrl: meetUrl ? meetUrl.trim() : null,
      },
    })

    return NextResponse.json({ success: true, event: created })
  } catch (error) {
    console.error("POST /api/calendar/events error:", error)
    return NextResponse.json({ success: false, error: "Failed to create calendar event" }, { status: 500 })
  }
}
