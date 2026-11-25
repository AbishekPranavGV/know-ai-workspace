import path from "path"
import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const dbPath =
    process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")
      ? process.env.DATABASE_URL
      : "file:" + path.resolve(process.cwd(), "dev.db").replace(/\\/g, "/")

  const adapter = new PrismaLibSql({ url: dbPath })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
