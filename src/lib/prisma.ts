import fs from "fs"
import path from "path"
import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL
  }

  // If deployed in Vercel / AWS Lambda serverless environment, copy dev.db to writable /tmp
  if (process.env.VERCEL) {
    const tmpDbPath = path.join("/tmp", "dev.db")
    const srcDbPath = path.resolve(process.cwd(), "dev.db")
    try {
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(srcDbPath)) {
        fs.copyFileSync(srcDbPath, tmpDbPath)
      }
      return `file:${tmpDbPath}`
    } catch (e) {
      console.warn("Could not copy dev.db to /tmp:", e)
    }
  }

  return "file:" + path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")
}

function createPrismaClient(): PrismaClient {
  const dbPath = getDatabaseUrl()
  const adapter = new PrismaLibSql({ url: dbPath })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
