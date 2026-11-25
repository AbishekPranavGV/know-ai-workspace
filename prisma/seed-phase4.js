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

  // 1. Seed File Assets
  const existingFiles = await prisma.fileAsset.count()
  if (existingFiles === 0) {
    await prisma.fileAsset.createMany({
      data: [
        {
          workspaceId: workspace.id,
          userId: user.id,
          name: "Distributed_Systems_Summary.pdf",
          size: "2.4 MB",
          type: "pdf",
          url: "/files/Distributed_Systems_Summary.pdf",
          source: "LOCAL",
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          name: "KNOW_AKS_Architecture_Blueprint.docx",
          size: "1.8 MB",
          type: "doc",
          url: "https://docs.google.com/document/d/knowaks-demo",
          source: "GOOGLE_DRIVE",
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          name: "Algorithm_Complexity_CheatSheet.png",
          size: "850 KB",
          type: "image",
          url: "/files/Algorithm_Complexity_CheatSheet.png",
          source: "LOCAL",
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          name: "consensus_protocol_simulator.py",
          size: "42 KB",
          type: "code",
          url: "/files/consensus_protocol_simulator.py",
          source: "LOCAL",
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          name: "Semester_Study_Guides_Archive.zip",
          size: "14.2 MB",
          type: "archive",
          url: "https://drive.google.com/file/d/knowaks-archive",
          source: "GOOGLE_DRIVE",
        },
      ],
    })
    console.log("File assets seeded.")
  }

  // 2. Seed Integrations
  const existingIntegrations = await prisma.integration.count()
  if (existingIntegrations === 0) {
    await prisma.integration.createMany({
      data: [
        {
          workspaceId: workspace.id,
          userId: user.id,
          provider: "GOOGLE_DRIVE",
          name: "Google Drive File Sync",
          status: "CONNECTED",
          config: JSON.stringify({ autoSync: true, folder: "KNOW AKS Docs" }),
          lastSyncAt: new Date(),
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          provider: "GOOGLE_CALENDAR",
          name: "Google Calendar & Meet",
          status: "CONNECTED",
          config: JSON.stringify({ syncTasks: true, defaultMeet: true }),
          lastSyncAt: new Date(),
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          provider: "GITHUB",
          name: "GitHub Repository Sync",
          status: "CONNECTED",
          config: JSON.stringify({ repo: "know-aks/workspace", branch: "main" }),
          lastSyncAt: new Date(),
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          provider: "WEBHOOK",
          name: "Inbound Automation Webhook",
          status: "CONNECTED",
          config: JSON.stringify({ endpoint: "https://api.knowaks.com/v1/webhook/demo" }),
          lastSyncAt: new Date(),
        },
        {
          workspaceId: workspace.id,
          userId: user.id,
          provider: "SLACK",
          name: "Slack Channel Mirroring",
          status: "DISCONNECTED",
          config: JSON.stringify({ channel: "#general" }),
        },
      ],
    })
    console.log("Integrations seeded.")
  }

  // 3. Seed Workspace Members (Sarah Chen, Marcus Vance, Elena Rostova)
  const existingMembers = await prisma.workspaceMembership.count({
    where: { workspaceId: workspace.id },
  })
  if (existingMembers <= 1) {
    // Check if other users exist or create demo members
    const sarah = await prisma.user.upsert({
      where: { email: "sarah.chen@example.com" },
      update: {},
      create: {
        email: "sarah.chen@example.com",
        name: "Sarah Chen",
        avatarUrl: null,
      },
    })
    const marcus = await prisma.user.upsert({
      where: { email: "marcus.vance@example.com" },
      update: {},
      create: {
        email: "marcus.vance@example.com",
        name: "Marcus Vance",
        avatarUrl: null,
      },
    })
    const elena = await prisma.user.upsert({
      where: { email: "elena.rostova@example.com" },
      update: {},
      create: {
        email: "elena.rostova@example.com",
        name: "Elena Rostova",
        avatarUrl: null,
      },
    })

    await prisma.workspaceMembership.upsert({
      where: { userId_workspaceId: { userId: sarah.id, workspaceId: workspace.id } },
      update: {},
      create: { userId: sarah.id, workspaceId: workspace.id, role: "ADMIN" },
    })
    await prisma.workspaceMembership.upsert({
      where: { userId_workspaceId: { userId: marcus.id, workspaceId: workspace.id } },
      update: {},
      create: { userId: marcus.id, workspaceId: workspace.id, role: "MEMBER" },
    })
    await prisma.workspaceMembership.upsert({
      where: { userId_workspaceId: { userId: elena.id, workspaceId: workspace.id } },
      update: {},
      create: { userId: elena.id, workspaceId: workspace.id, role: "GUEST" },
    })
    console.log("Team members seeded.")
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
