export const APP_NAME = "KNOW AKS"
export const APP_DESCRIPTION = "Your All-in-One Digital Workspace"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"] as const
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const
export const WORKSPACE_ROLES = ["OWNER", "ADMIN", "MEMBER", "GUEST"] as const

export const PRIORITY_COLORS = {
  LOW: "text-blue-500",
  MEDIUM: "text-yellow-500",
  HIGH: "text-orange-500",
  URGENT: "text-red-500",
} as const

export const STATUS_COLORS = {
  TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
} as const

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Notes", href: "/notes", icon: "FileText" },
  { label: "Tasks", href: "/tasks", icon: "CheckSquare" },
  { label: "Security", href: "/security", icon: "Shield" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const
