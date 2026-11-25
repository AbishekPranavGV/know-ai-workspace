import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const channelName = searchParams.get("channel") || "general"

    // Find channel by name or fallback to first
    let channel = await prisma.channel.findFirst({
      where: { name: channelName },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!channel) {
      channel = await prisma.channel.findFirst({
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      })
    }

    const messages = channel ? channel.messages.map(m => ({
      id: m.id,
      author: m.authorName,
      avatar: m.avatar,
      role: m.role || "Member",
      content: m.content,
      time: new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "numeric", hour12: true }).format(m.createdAt),
      attachment: m.attachment ? JSON.parse(m.attachment) : undefined,
      reactions: m.reactions ? JSON.parse(m.reactions) : [],
    })) : []

    return NextResponse.json({ success: true, messages })
  } catch (error) {
    console.error("GET /api/chat/messages error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { channelName = "general", content, authorName = "Alex Kumar", avatar = "AK", role = "You" } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: "Message content is required" }, { status: 400 })
    }

    let channel = await prisma.channel.findFirst({
      where: { name: channelName },
    })

    if (!channel) {
      const ws = await prisma.workspace.findFirst()
      if (ws) {
        channel = await prisma.channel.create({
          data: {
            workspaceId: ws.id,
            name: channelName,
          },
        })
      }
    }

    const user = await prisma.user.findFirst()

    if (!channel || !user) {
      return NextResponse.json({ success: false, error: "Channel or User missing" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        channelId: channel.id,
        authorId: user.id,
        authorName,
        avatar,
        role,
        content: content.trim(),
        reactions: "[]",
      },
    })

    const formatted = {
      id: message.id,
      author: message.authorName,
      avatar: message.avatar,
      role: message.role || "Member",
      content: message.content,
      time: "Just now",
      reactions: [],
    }

    return NextResponse.json({ success: true, message: formatted })
  } catch (error) {
    console.error("POST /api/chat/messages error:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
