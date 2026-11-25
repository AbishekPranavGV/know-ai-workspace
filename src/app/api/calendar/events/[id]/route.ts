import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (id.startsWith("task-ev-")) {
      const realTaskId = id.replace("task-ev-", "")
      await prisma.task.update({
        where: { id: realTaskId },
        data: { dueDate: null },
      })
      return NextResponse.json({ success: true, removedDueDateId: realTaskId })
    }

    await prisma.calendarEvent.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error("DELETE /api/calendar/events/[id] error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete calendar event" }, { status: 500 })
  }
}
