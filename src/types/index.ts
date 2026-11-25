export type User = {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  emailVerified: boolean
  mfaEnabled: boolean
  createdAt: Date
}

export type Session = {
  id: string
  userId: string
  deviceInfo?: string | null
  ipAddress?: string | null
  lastActive: Date
  expiresAt: Date
  revoked: boolean
  current?: boolean
}

export type Note = {
  id: string
  title: string
  content: Record<string, unknown> // Tiptap JSON
  workspaceId: string
  authorId: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  wordCount?: number
}

export type Task = {
  id: string
  title: string
  description?: string | null
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  dueDate?: Date | null
  workspaceId: string
  assigneeId?: string | null
  createdAt: Date
  updatedAt: Date
}

export type Workspace = {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: Date
}

export type AuditLog = {
  id: string
  userId?: string | null
  eventType: string
  timestamp: Date
  resourceId?: string | null
  outcome: string
  sessionId?: string | null
  deviceInfo?: string | null
  securityClassification: string
  metadata?: Record<string, unknown> | null
}

export type Notification = {
  id: string
  userId: string
  type: string
  title: string
  body: string
  read: boolean
  createdAt: Date
  relatedResourceId?: string | null
}
