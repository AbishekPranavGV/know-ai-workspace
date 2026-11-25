import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const flashcards = await prisma.flashcard.findMany({
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ success: true, flashcards })
  } catch (error) {
    console.error("GET /api/learning/flashcards error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch flashcards" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, grade, mastered, question, answer, deck, hint } = body

    // 1. Spaced Repetition (SuperMemo SM-2) review grade
    if (id && grade !== undefined) {
      const card = await prisma.flashcard.findUnique({ where: { id } })
      if (!card) {
        return NextResponse.json({ success: false, error: "Card not found" }, { status: 404 })
      }

      let rep = card.repetition || 0
      let interval = card.interval || 1
      let ef = card.easeFactor || 2.5

      // Grade: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
      if (grade === 1) {
        rep = 0
        interval = 1
        ef = Math.max(1.3, ef - 0.2)
      } else if (grade === 2) {
        interval = Math.max(1, Math.round(interval * 1.2))
        ef = Math.max(1.3, ef - 0.15)
      } else if (grade === 3) {
        if (rep === 0) interval = 1
        else if (rep === 1) interval = 4
        else interval = Math.round(interval * ef)
        rep += 1
      } else if (grade === 4) {
        if (rep === 0) interval = 2
        else if (rep === 1) interval = 6
        else interval = Math.round(interval * ef * 1.3)
        ef = Math.min(3.0, ef + 0.15)
        rep += 1
      }

      const nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000)
      const isMastered = rep >= 2 && grade >= 3

      const updated = await prisma.flashcard.update({
        where: { id },
        data: {
          repetition: rep,
          interval,
          easeFactor: ef,
          nextReview,
          mastered: isMastered,
        },
      })

      return NextResponse.json({
        success: true,
        flashcard: updated,
        sm2: {
          intervalDays: interval,
          nextReview: nextReview.toISOString(),
          repetition: rep,
          easeFactor: ef.toFixed(2),
        },
      })
    }

    // 2. Simple toggle mastery
    if (id && mastered !== undefined) {
      const updated = await prisma.flashcard.update({
        where: { id },
        data: { mastered },
      })
      return NextResponse.json({ success: true, flashcard: updated })
    }

    // 3. Create new flashcard
    if (!question || !answer) {
      return NextResponse.json({ success: false, error: "Question and answer are required" }, { status: 400 })
    }

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const created = await prisma.flashcard.create({
      data: {
        userId: user.id,
        deck: deck || "General",
        question: question.trim(),
        answer: answer.trim(),
        hint: hint ? hint.trim() : null,
        mastered: false,
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
      },
    })

    return NextResponse.json({ success: true, flashcard: created })
  } catch (error) {
    console.error("POST /api/learning/flashcards error:", error)
    return NextResponse.json({ success: false, error: "Failed to process flashcard request" }, { status: 500 })
  }
}
