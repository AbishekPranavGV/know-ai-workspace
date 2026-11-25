const { PrismaClient } = require("@prisma/client")
const { PrismaLibSql } = require("@prisma/adapter-libsql")
const path = require("path")

const dbPath = `file:${path.resolve(__dirname, "../dev.db")}`
const adapter = new PrismaLibSql({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  const user = await prisma.user.findFirst()
  const workspace = await prisma.workspace.findFirst()
  if (!user || !workspace) {
    console.log("No user or workspace found. Skipping.")
    return
  }

  // Seed Goals
  const existingGoals = await prisma.goal.count()
  if (existingGoals === 0) {
    await prisma.goal.createMany({
      data: [
        {
          workspaceId: workspace.id,
          userId: user.id,
          title: "Master Distributed Systems & Cloud Architecture",
          description: "Cover consensus algorithms, partition tolerance, and microservices patterns for the semester.",
          category: "Academic",
          targetDate: "2026-12-15",
          progress: 68,
          status: "ACTIVE",
          keyResults: JSON.stringify([
            { id: "kr1", title: "Complete CAP Theorem and Consensus study notes", completed: true },
            { id: "kr2", title: "Build and benchmark SQLite LibSQL local adapter", completed: true },
            { id: "kr3", title: "Score 90%+ on Systems Engineering mock test", completed: false },
          ]),
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          title: "Deliver KNOW AKS All-in-One Workspace v2.0",
          description: "Unify productivity, native communication, active recall learning, and DPDP Act security.",
          category: "Project",
          targetDate: "2026-11-30",
          progress: 85,
          status: "ACTIVE",
          keyResults: JSON.stringify([
            { id: "kr4", title: "Implement Next.js 16 App Router modular shell", completed: true },
            { id: "kr5", title: "Integrate SuperMemo SM-2 spaced repetition engine", completed: true },
            { id: "kr6", title: "Build DPDP Act 2023 one-click data portability export", completed: true },
          ]),
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          title: "Complete 50 Deep Focus Pomodoro Cycles",
          description: "Establish uninterrupted study sprints with zero distraction and deliberate recall.",
          category: "Personal",
          targetDate: "2026-12-05",
          progress: 44,
          status: "ACTIVE",
          keyResults: JSON.stringify([
            { id: "kr7", title: "Log 20 Pomodoro focus sessions", completed: true },
            { id: "kr8", title: "Review 100 active recall flashcards with SM-2", completed: false },
          ]),
        },
      ],
    })
    console.log("Goals seeded successfully.")
  }

  // Seed Calendar Events
  const existingEvents = await prisma.calendarEvent.count()
  if (existingEvents === 0) {
    const todayStr = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
    const in3Days = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]

    await prisma.calendarEvent.createMany({
      data: [
        {
          workspaceId: workspace.id,
          userId: user.id,
          title: "Distributed Systems Architecture Review",
          description: "Deep dive into consistency models and partition resilience.",
          date: todayStr,
          time: "02:00 PM - 03:30 PM",
          category: "Study",
          meetUrl: "https://meet.google.com/aks-know-demo",
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          title: "KNOW AKS Product Roadmap Sync",
          description: "Review Phase 2/3 upgrade milestones and DPDP Act security compliance.",
          date: todayStr,
          time: "05:00 PM - 06:00 PM",
          category: "Meeting",
          meetUrl: "https://meet.google.com/aks-team-sync",
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          title: "Database Final Exam Revision Sprint",
          description: "Group problem set solving with mock SQL queries.",
          date: tomorrow,
          time: "10:00 AM - 12:30 PM",
          category: "Study",
          meetUrl: "https://meet.google.com/aks-study-sprint",
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          title: "Weekly Workspace Retrospective & Goal Check-in",
          description: "Align progress on OKRs and adjust review intervals.",
          date: in3Days,
          time: "04:00 PM - 05:00 PM",
          category: "Meeting",
          meetUrl: "https://meet.google.com/aks-weekly-retro",
        },
      ],
    })
    console.log("Calendar events seeded successfully.")
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
