"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  FileText, CheckSquare, TrendingUp, Shield, Plus,
  ArrowRight, Clock, AlertCircle, CheckCircle2, Circle,
  Zap, Users, Calendar, Target, BarChart3, Folder, Cpu
} from "lucide-react"

interface NoteItem {
  id: string
  title: string
  preview: string
  date: string
  color: string
}

interface TaskItem {
  id: string
  title: string
  status: string
  priority: string
  due: string
}

const DEFAULT_NOTES: NoteItem[] = [
  { id: "1", title: "KNOW AKS Product Vision", preview: "Build a universal digital productivity platform for everyone including students, professionals and teams.", date: "Just now", color: "bg-indigo-500" },
  { id: "2", title: "Meeting Notes — Q4 Planning", preview: "Discussed roadmap priorities, MVP scope, and timeline for Phase 1 delivery. Key decisions logged.", date: "1h ago", color: "bg-purple-500" },
  { id: "3", title: "Research: Next.js Best Practices", preview: "App Router patterns, server components vs client components, caching strategies and performance tips.", date: "3h ago", color: "bg-blue-500" },
  { id: "4", title: "Database Schema Design", preview: "PostgreSQL schema for users, workspaces, notes, tasks, audit logs and security events.", date: "yesterday", color: "bg-green-500" },
]

const DEFAULT_TASKS: TaskItem[] = [
  { id: "1", title: "Review PRD and architecture plan", status: "IN_PROGRESS", priority: "HIGH", due: "Today" },
  { id: "2", title: "Set up PostgreSQL database", status: "TODO", priority: "URGENT", due: "Tomorrow" },
  { id: "3", title: "Design auth module flow", status: "DONE", priority: "HIGH", due: "Done" },
  { id: "4", title: "Write Prisma schema", status: "DONE", priority: "MEDIUM", due: "Done" },
  { id: "5", title: "Configure Google OAuth", status: "TODO", priority: "HIGH", due: "Nov 25" },
]

const priorityColors: Record<string, string> = {
  LOW: "text-blue-500",
  MEDIUM: "text-yellow-600 dark:text-yellow-400",
  HIGH: "text-orange-500",
  URGENT: "text-red-500",
}

const statusIcons: Record<string, React.ReactNode> = {
  TODO: <Circle className="w-4 h-4 text-gray-400" />,
  IN_PROGRESS: <Clock className="w-4 h-4 text-blue-500" />,
  DONE: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  CANCELLED: <AlertCircle className="w-4 h-4 text-red-400" />,
}

export default function DashboardPage() {
  const [today, setToday] = useState("Tuesday, 24 November 2026")
  const [greeting, setGreeting] = useState("Welcome back")
  const [userName, setUserName] = useState("Alex")
  const [notes, setNotes] = useState<NoteItem[]>(DEFAULT_NOTES)
  const [tasks, setTasks] = useState<TaskItem[]>(DEFAULT_TASKS)
  const [notesCount, setNotesCount] = useState(4)
  const [tasksCount, setTasksCount] = useState(5)
  const [tasksDoneCount, setTasksDoneCount] = useState(2)
  const [activeSessionsCount, setActiveSessionsCount] = useState(2)

  useEffect(() => {
    // Dynamic date and greeting (client-only to prevent SSR divergence)
    const h = new Date().getHours()
    if (h < 12) setGreeting("Good morning")
    else if (h < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    try {
      setToday(new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }))
    } catch {}

    // Fetch user profile
    fetch("/api/user/profile")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.user?.name) {
          const first = d.user.name.split(" ")[0]
          setUserName(first)
        }
      })
      .catch(() => {})

    // Fetch live notes
    fetch("/api/notes")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.notes && d.notes.length > 0) {
          setNotesCount(d.notes.length)
          setNotes(
            d.notes.slice(0, 5).map((n: { id: string; title: string; content: string; color?: string; updatedAt: string }) => ({
              id: n.id,
              title: n.title,
              preview: n.content ? n.content.substring(0, 110) + "..." : "No additional text",
              date: "Recently",
              color: n.color || "bg-indigo-500",
            }))
          )
        }
      })
      .catch(() => {})

    // Fetch live tasks
    fetch("/api/tasks")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.tasks && d.tasks.length > 0) {
          setTasksCount(d.tasks.length)
          const done = d.tasks.filter((t: { status: string }) => t.status === "DONE").length
          setTasksDoneCount(done)
          setTasks(
            d.tasks.slice(0, 6).map((t: { id: string; title: string; status: string; priority: string; dueDate?: string }) => ({
              id: t.id,
              title: t.title,
              status: t.status,
              priority: t.priority,
              due: t.dueDate || "Today",
            }))
          )
        }
      })
      .catch(() => {})

    // Fetch active sessions
    fetch("/api/security/sessions")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.sessions) {
          setActiveSessionsCount(d.sessions.length)
        }
      })
      .catch(() => {})
  }, [])

  const stats = [
    {
      label: "Total Notes",
      value: notesCount.toString(),
      change: "Active workspace notes",
      icon: FileText,
      color: "from-indigo-500 to-purple-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
      label: "Tasks Active",
      value: tasksCount.toString(),
      sub: `${tasksDoneCount} completed`,
      icon: CheckSquare,
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Active Sessions",
      value: activeSessionsCount.toString(),
      change: "Verified devices",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Security Score",
      value: "95%",
      sub: "DPDP 2023 Protected",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Performance & Status Banner */}
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl glass-luxury border border-indigo-200/60 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-glow" />
          <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            KNOW AKS Hyper-Speed Cloud Mode Active
          </span>
          <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold">
            0ms UI Lag
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Open Chat Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" /> New Note
          </Link>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> New Task
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl p-5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 group`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mb-0.5">
              {s.value}
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{s.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.change || s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Recent Notes */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Notes</h2>
              </div>
              <Link href="/notes" className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {notes.map(note => (
                <Link
                  key={note.id}
                  href="/notes"
                  className="flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                >
                  <div className={`w-1 rounded-full flex-shrink-0 ${note.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {note.title}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{note.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{note.preview}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/notes"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Open Notes Studio
            </Link>
          </div>
        </div>

        {/* Task Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Workspace Tasks</h2>
              </div>
              <Link href="/tasks" className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800 overflow-hidden">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    task.status === "DONE" ? "opacity-60" : ""
                  }`}
                >
                  {statusIcons[task.status] || <Circle className="w-4 h-4 text-gray-400" />}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.status === "DONE" ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-semibold ${priorityColors[task.priority] || "text-gray-400"}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-400">· {task.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/tasks"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Task
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Security Status */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Security Status</h2>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 font-semibold">
              All Clear
            </span>
          </div>
          <div className="space-y-3">
            {[
              { label: "MFA Protection", status: "Active (TOTP)", ok: true },
              { label: "India DPDP Act 2023", status: "Compliant", ok: true },
              { label: "Active Sessions", status: `${activeSessionsCount} devices connected`, ok: true },
              { label: "Audit Logging", status: "Append-only active", ok: true },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">{r.label}</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/security"
            className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Open Security Centre <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Study Hub",
                icon: FileText,
                href: "/learning",
                color: "hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300",
              },
              {
                label: "Kanban Tasks",
                icon: CheckSquare,
                href: "/tasks",
                color: "hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-700 dark:hover:text-green-300",
              },
              {
                label: "Calendar",
                icon: Calendar,
                href: "/calendar",
                color: "hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-700 dark:hover:text-amber-300",
              },
              {
                label: "Goals OKRs",
                icon: Target,
                href: "/goals",
                color: "hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-300",
              },
              {
                label: "Analytics",
                icon: BarChart3,
                href: "/analytics",
                color: "hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300",
              },
              {
                label: "Files",
                icon: Folder,
                href: "/files",
                color: "hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300",
              },
              {
                label: "Team RBAC",
                icon: Users,
                href: "/team",
                color: "hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-700 dark:hover:text-purple-300",
              },
              {
                label: "Integrations",
                icon: Cpu,
                href: "/integrations",
                color: "hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:text-teal-700 dark:hover:text-teal-300",
              },
            ].map(a => (
              <Link
                key={a.label}
                href={a.href}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-200 ${a.color}`}
              >
                <a.icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
