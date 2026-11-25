const path = require("path")
const { PrismaClient } = require("@prisma/client")
const { PrismaLibSql } = require("@prisma/adapter-libsql")
const bcrypt = require("bcryptjs")

const dbPath = "file:" + path.resolve(__dirname, "..", "dev.db").replace(/\\/g, "/")
const adapter = new PrismaLibSql({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding KNOW AKS database at", dbPath)

  // Clean existing data for idempotency
  await prisma.notification.deleteMany({})
  await prisma.auditLog.deleteMany({})
  await prisma.flashcard.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.channel.deleteMany({})
  await prisma.task.deleteMany({})
  await prisma.note.deleteMany({})
  await prisma.workspaceMembership.deleteMany({})
  await prisma.workspace.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.mFAConfig.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.user.deleteMany({})

  const passwordHash = await bcrypt.hash("Password123!", 10)

  // 1. Create Demo User
  const user = await prisma.user.create({
    data: {
      email: "alex@example.com",
      name: "Alex Kumar",
      passwordHash,
      emailVerified: true,
      avatarUrl: null,
    },
  })
  console.log("Created user:", user.email)

  // 2. Create Active Sessions
  await prisma.session.createMany({
    data: [
      {
        userId: user.id,
        sessionToken: "sess_desktop_active",
        deviceInfo: "Chrome on Windows 11",
        ipAddress: "103.52.44.12",
        location: "Mumbai, IN",
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        revoked: false,
      },
      {
        userId: user.id,
        sessionToken: "sess_mobile_active",
        deviceInfo: "Safari on iPhone 15",
        ipAddress: "103.52.44.12",
        location: "Mumbai, IN",
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        revoked: false,
      },
    ],
  })

  // 3. Create MFA Config
  await prisma.mFAConfig.create({
    data: {
      userId: user.id,
      secret: "JBSWY3DPEHPK3PXP",
      backupCodes: JSON.stringify(["ABCD-1234", "EFGH-5678", "IJKL-9012", "MNOP-3456"]),
      enabled: true,
    },
  })

  // 4. Create Workspaces
  const personalWs = await prisma.workspace.create({
    data: {
      name: "Alex's Personal Space",
      slug: "personal-space",
      ownerId: user.id,
    },
  })

  const studyWs = await prisma.workspace.create({
    data: {
      name: "CS101 Study Group",
      slug: "cs101-study-group",
      ownerId: user.id,
    },
  })

  await prisma.workspaceMembership.createMany({
    data: [
      { userId: user.id, workspaceId: personalWs.id, role: "OWNER" },
      { userId: user.id, workspaceId: studyWs.id, role: "OWNER" },
    ],
  })

  // 5. Create Notes
  await prisma.note.createMany({
    data: [
      {
        workspaceId: personalWs.id,
        authorId: user.id,
        title: "KNOW AKS Product Vision",
        content: "Build a universal digital productivity platform for everyone — students, professionals, freelancers, entrepreneurs, educators and teams. The product should unify notes, tasks, chat, learning tools and security under one workspace.",
        wordCount: 48,
        color: "bg-indigo-500",
      },
      {
        workspaceId: personalWs.id,
        authorId: user.id,
        title: "Meeting Notes — Q4 Planning",
        content: "Discussed roadmap priorities for Q4. MVP scope confirmed: auth, notes, tasks, security centre. Phase 2 will include shared workspaces and native chat. Timeline: 8–12 weeks for Phase 1.",
        wordCount: 36,
        color: "bg-purple-500",
      },
      {
        workspaceId: personalWs.id,
        authorId: user.id,
        title: "Research: Next.js Best Practices",
        content: "App Router is the recommended approach for new projects. Server Components render on the server by default. Use Client Components only where interactivity is needed. Caching is automatic with fetch.",
        wordCount: 41,
        color: "bg-blue-500",
      },
      {
        workspaceId: personalWs.id,
        authorId: user.id,
        title: "Database Schema Design",
        content: "PostgreSQL schema covering users, sessions, workspaces, workspace memberships, notes, tasks, channels, messages, audit logs and notifications. Audit logs must be append-only.",
        wordCount: 32,
        color: "bg-green-500",
      },
    ],
  })

  // 6. Create Tasks
  await prisma.task.createMany({
    data: [
      {
        workspaceId: personalWs.id,
        assigneeId: user.id,
        title: "Review PRD and architecture plan",
        description: "Go through the master plan document and validate all decisions",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: "2026-11-25",
        labels: JSON.stringify(["planning", "architecture"]),
      },
      {
        workspaceId: personalWs.id,
        assigneeId: user.id,
        title: "Verify database persistence and schema",
        description: "Verify SQLite/PostgreSQL schema integrity across all entities",
        status: "DONE",
        priority: "URGENT",
        dueDate: "2026-11-24",
        labels: JSON.stringify(["backend", "database"]),
      },
      {
        workspaceId: personalWs.id,
        assigneeId: user.id,
        title: "Build landing page & marketing shell",
        description: "Design and implement the marketing landing page and app shell",
        status: "DONE",
        priority: "MEDIUM",
        dueDate: "2026-11-24",
        labels: JSON.stringify(["frontend", "ui"]),
      },
      {
        workspaceId: personalWs.id,
        assigneeId: user.id,
        title: "Configure Google OAuth & Drive bridge",
        description: "Set up Google Cloud project and token encryption",
        status: "TODO",
        priority: "HIGH",
        dueDate: "2026-11-28",
        labels: JSON.stringify(["integrations"]),
      },
      {
        workspaceId: personalWs.id,
        assigneeId: user.id,
        title: "Flashcard spaced-repetition study mode",
        description: "Implement automated review intervals for active recall",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "2026-11-30",
        labels: JSON.stringify(["learning", "students"]),
      },
    ],
  })

  // 7. Create Channels & Chat Messages
  const generalChannel = await prisma.channel.create({
    data: {
      workspaceId: personalWs.id,
      name: "general",
      description: "General workspace discussions",
    },
  })

  const studyChannel = await prisma.channel.create({
    data: {
      workspaceId: studyWs.id,
      name: "study-group",
      description: "Course material, study sessions & notes sharing",
    },
  })

  await prisma.message.createMany({
    data: [
      {
        channelId: studyChannel.id,
        authorId: user.id,
        authorName: "Priya Patel",
        avatar: "PP",
        role: "Student",
        content: "Hey everyone! I just uploaded the summarized revision notes for the upcoming systems engineering quiz. Check it out!",
        attachment: JSON.stringify({ name: "Distributed_Systems_Summary.pdf", size: "2.4 MB", type: "pdf" }),
        reactions: JSON.stringify([{ emoji: "🔥", count: 4, userReacted: true }, { emoji: "❤️", count: 3 }]),
      },
      {
        channelId: studyChannel.id,
        authorId: user.id,
        authorName: "Sarah Chen",
        avatar: "SC",
        role: "Design Lead",
        content: "This is super helpful Priya! I've linked it to our shared workspace notes page as well.",
        reactions: JSON.stringify([{ emoji: "👍", count: 2 }]),
      },
      {
        channelId: generalChannel.id,
        authorId: user.id,
        authorName: "Alex Kumar",
        avatar: "AK",
        role: "You",
        content: "Welcome to KNOW AKS team chat! Native messaging with Google integration is running.",
        reactions: JSON.stringify([{ emoji: "🎉", count: 5, userReacted: true }]),
      },
    ],
  })

  // 8. Create Flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        userId: user.id,
        deck: "Computer Science",
        question: "What is the CAP Theorem in distributed data systems?",
        answer: "A distributed system can deliver at most two of three guarantees: Consistency, Availability, and Partition Tolerance.",
        hint: "Think about network nets and partition failures.",
        mastered: true,
      },
      {
        userId: user.id,
        deck: "Computer Science",
        question: "What is the difference between Symmetric and Asymmetric encryption?",
        answer: "Symmetric uses a single shared secret key for both encryption and decryption (e.g. AES-256). Asymmetric uses a public/private key pair (e.g. RSA, ECC).",
        hint: "Keys: shared single vs paired public/private.",
        mastered: false,
      },
      {
        userId: user.id,
        deck: "Productivity",
        question: "What is Parkinson's Law?",
        answer: "Work expands so as to fill the time available for its completion. Setting shorter focused timeboxes prevents procrastination.",
        hint: "Time allocation vs actual effort.",
        mastered: false,
      },
      {
        userId: user.id,
        deck: "Productivity",
        question: "What is the Pomodoro Technique?",
        answer: "A time management method using 25-minute intervals of focused work separated by 5-minute short breaks.",
        hint: "Named after the tomato kitchen timer.",
        mastered: true,
      },
      {
        userId: user.id,
        deck: "Security & DPDP",
        question: "What is Data Minimisation under modern privacy frameworks?",
        answer: "Collecting and processing only the personal data that is strictly necessary to fulfill the explicitly stated lawful purpose.",
        hint: "Collect only what is required.",
        mastered: false,
      },
    ],
  })

  // 9. Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: user.id,
        eventType: "SEC-001",
        outcome: "SUCCESS",
        deviceInfo: "Chrome on Windows 11",
        ipAddress: "103.52.44.12",
        location: "Mumbai, IN",
        securityClassification: "INFO",
        metadata: JSON.stringify({ method: "password_mfa" }),
      },
      {
        userId: user.id,
        eventType: "SEC-005",
        outcome: "SUCCESS",
        deviceInfo: "Chrome on Windows 11",
        ipAddress: "103.52.44.12",
        location: "Mumbai, IN",
        securityClassification: "INFO",
        metadata: JSON.stringify({ action: "mfa_enabled" }),
      },
      {
        userId: user.id,
        eventType: "SEC-002",
        outcome: "FAILED",
        deviceInfo: "Firefox on Linux",
        ipAddress: "198.51.100.4",
        location: "Unknown",
        securityClassification: "WARNING",
        metadata: JSON.stringify({ reason: "bad_credentials" }),
      },
    ],
  })

  // 10. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: "success",
        title: "Security Protected",
        body: "MFA enabled & no suspicious logins detected",
      },
      {
        userId: user.id,
        type: "info",
        title: "Team Chat Mention",
        body: "Priya shared Distributed_Systems_Summary.pdf in #study-group",
      },
      {
        userId: user.id,
        type: "info",
        title: "Welcome to KNOW AKS",
        body: "Universal workspace ready for your notes & tasks",
      },
    ],
  })

  console.log("Database seeded successfully with users, workspaces, notes, tasks, chat, flashcards, audit logs!")
}

main()
  .catch(e => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
