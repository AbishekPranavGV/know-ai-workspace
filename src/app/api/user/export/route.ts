import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const user = await prisma.user.findFirst({
      include: {
        workspaceMemberships: {
          include: {
            workspace: true,
          },
        },
        notes: {
          where: { deletedAt: null },
        },
        tasks: true,
        goals: true,
        flashcards: true,
        messages: true,
        auditLogs: {
          take: 100,
          orderBy: { timestamp: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Sanitize export payload (R-22 mitigation)
    const sanitizedExport = {
      exportMetadata: {
        platform: "KNOW AKS — Universal Digital Workspace",
        exportStandard: "India DPDP Act 2023 Data Portability",
        generatedAt: new Date().toISOString(),
        version: "2.0",
      },
      userProfile: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      workspaces: user.workspaceMemberships.map(m => ({
        workspaceId: m.workspace.id,
        workspaceName: m.workspace.name,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
      notes: user.notes.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        wordCount: n.wordCount,
        color: n.color,
        pinned: n.pinned,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      })),
      tasks: user.tasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        labels: JSON.parse(t.labels || "[]"),
        createdAt: t.createdAt,
      })),
      goals: user.goals.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        category: g.category,
        progress: g.progress,
        status: g.status,
        keyResults: JSON.parse(g.keyResults || "[]"),
        createdAt: g.createdAt,
      })),
      studyFlashcards: user.flashcards.map(f => ({
        id: f.id,
        deck: f.deck,
        question: f.question,
        answer: f.answer,
        hint: f.hint,
        mastered: f.mastered,
        intervalDays: f.interval,
        nextReview: f.nextReview,
      })),
      messages: user.messages.map(m => ({
        id: m.id,
        content: m.content,
        createdAt: m.createdAt,
      })),
      auditActivity: user.auditLogs.map(l => ({
        eventType: l.eventType,
        timestamp: l.timestamp,
        outcome: l.outcome,
        deviceInfo: l.deviceInfo,
        securityClassification: l.securityClassification,
      })),
    }

    // Log the security event (SEC-010)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        eventType: "SEC-010",
        outcome: "SUCCESS",
        securityClassification: "INFO",
        metadata: JSON.stringify({ action: "dpdp_data_portability_export", recordCount: user.notes.length + user.tasks.length }),
      },
    })

    return new NextResponse(JSON.stringify(sanitizedExport, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="knowaks-data-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    console.error("GET /api/user/export error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate data export" }, { status: 500 })
  }
}
