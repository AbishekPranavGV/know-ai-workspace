"use client"

import { useState, useEffect } from "react"
import { Plus, CheckSquare, Circle, Clock, CheckCircle2, XCircle, AlertCircle, Trash2, Calendar, Flag, LayoutGrid, List } from "lucide-react"

type Status = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED"
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: string
}

const MOCK_TASKS: Task[] = [
  { id: "1", title: "Review PRD and architecture plan", description: "Go through the master plan document and validate all decisions", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-11-21" },
  { id: "2", title: "Set up PostgreSQL database", description: "Install and configure local PostgreSQL instance for development", status: "TODO", priority: "URGENT", dueDate: "2026-11-22" },
  { id: "3", title: "Design auth module flow", description: "Create flowcharts for login, register, MFA and password reset", status: "DONE", priority: "HIGH", dueDate: "2026-11-20" },
  { id: "4", title: "Write Prisma schema", description: "Define all database models and relationships", status: "DONE", priority: "MEDIUM", dueDate: "2026-11-20" },
  { id: "5", title: "Configure Google OAuth", description: "Set up Google Cloud project and OAuth credentials", status: "TODO", priority: "HIGH", dueDate: "2026-11-25" },
  { id: "6", title: "Build landing page UI", description: "Design and implement the marketing landing page", status: "IN_PROGRESS", priority: "MEDIUM", dueDate: "2026-11-23" },
  { id: "7", title: "Set up email sending", description: "Configure Resend for transactional emails", status: "TODO", priority: "MEDIUM", dueDate: "2026-11-26" },
  { id: "8", title: "Security event bus", description: "Implement the security event emitter and audit log writer", status: "TODO", priority: "HIGH", dueDate: "2026-11-27" },
  { id: "9", title: "Write test cases for auth", description: "Unit and integration tests for authentication module", status: "TODO", priority: "LOW", dueDate: "2026-11-30" },
  { id: "10", title: "Deploy MVP to Render", description: "Configure hosting, environment variables and CI/CD", status: "CANCELLED", priority: "LOW", dueDate: "2026-12-01" },
]

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  TODO:        { label: "To Do",       icon: <Circle className="w-4 h-4" />,      color: "text-gray-500",    bg: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
  IN_PROGRESS: { label: "In Progress", icon: <Clock className="w-4 h-4" />,       color: "text-blue-500",    bg: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  DONE:        { label: "Done",        icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-500",   bg: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  CANCELLED:   { label: "Cancelled",   icon: <XCircle className="w-4 h-4" />,      color: "text-red-400",     bg: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
}

const PRIORITY_CONFIG: Record<Priority, { color: string; dot: string }> = {
  LOW:    { color: "text-blue-500",                  dot: "bg-blue-500" },
  MEDIUM: { color: "text-yellow-600 dark:text-yellow-400", dot: "bg-yellow-500" },
  HIGH:   { color: "text-orange-500",                dot: "bg-orange-500" },
  URGENT: { color: "text-red-500",                   dot: "bg-red-500" },
}

const REFERENCE_DATE = "2026-11-24"

function isOverdue(due: string, status: Status) {
  return status !== "DONE" && status !== "CANCELLED" && Boolean(due && due < REFERENCE_DATE)
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [view, setView] = useState<"list" | "kanban">("list")
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL")
  const [filterPriority, setFilterPriority] = useState<Priority | "ALL">("ALL")
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "TODO" as Status, priority: "MEDIUM" as Priority, dueDate: "" })

  useEffect(() => {
    fetch("/api/tasks")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.tasks && d.tasks.length > 0) {
          const mapped: Task[] = d.tasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            status: t.status as Status,
            priority: t.priority as Priority,
            dueDate: t.dueDate || "",
          }))
          setTasks(mapped)
        }
      })
      .catch(() => {})
  }, [])

  const filtered = tasks.filter(t =>
    (filterStatus === "ALL" || t.status === filterStatus) &&
    (filterPriority === "ALL" || t.priority === filterPriority)
  )

  const toggleDone = async (id: string) => {
    const target = tasks.find(t => t.id === id)
    if (!target) return
    const nextStatus = target.status === "DONE" ? "TODO" : "DONE"

    setTasks(ts => ts.map(t => t.id === id ? { ...t, status: nextStatus } : t))

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
    } catch {}
  }

  const deleteTask = async (id: string) => {
    setTasks(ts => ts.filter(t => t.id !== id))
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    } catch {}
  }

  const addTask = async () => {
    if (!newTask.title.trim()) return
    let created: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
      const d = await res.json()
      if (d.success && d.task) {
        created = {
          id: d.task.id,
          title: d.task.title,
          description: d.task.description || "",
          status: d.task.status as Status,
          priority: d.task.priority as Priority,
          dueDate: d.task.dueDate || "",
        }
      }
    } catch {}

    setTasks(ts => [created, ...ts])
    setNewTask({ title: "", description: "", status: "TODO", priority: "MEDIUM", dueDate: "" })
    setShowModal(false)
  }

  const byStatus = (s: Status) => filtered.filter(t => t.status === s)

  const TaskCard = ({ task, compact = false }: { task: Task; compact?: boolean }) => (
    <div className={`group flex items-start gap-3 p-4 ${compact ? "" : "border-b border-gray-50 dark:border-gray-800 last:border-0"} ${isOverdue(task.dueDate, task.status) ? "border-l-2 border-l-red-400" : ""} hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}>
      <button onClick={() => toggleDone(task.id)} className={`mt-0.5 flex-shrink-0 ${STATUS_CONFIG[task.status].color}`}>
        {STATUS_CONFIG[task.status].icon}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${task.status === "DONE" ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
          {task.title}
        </p>
        {!compact && task.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${PRIORITY_CONFIG[task.priority].dot}`} />
            <span className={`text-xs font-semibold ${PRIORITY_CONFIG[task.priority].color}`}>{task.priority}</span>
          </div>
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs font-medium ${isOverdue(task.dueDate, task.status) ? "text-red-500" : "text-gray-400"}`}>
              <Calendar className="w-3 h-3" />
              {isOverdue(task.dueDate, task.status) ? "Overdue · " : ""}{task.dueDate}
            </div>
          )}
          {!compact && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_CONFIG[task.status].bg}`}>
              {STATUS_CONFIG[task.status].label}
            </span>
          )}
        </div>
      </div>
      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 mt-0.5 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex-shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Tasks</h1>
          <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold">{tasks.length}</span>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={() => setView("list")} className={`p-1.5 rounded transition-colors ${view === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setView("kanban")} className={`p-1.5 rounded transition-colors ${view === "kanban" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          {/* Filters */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as Status | "ALL")} className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-400">
            <option value="ALL">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as Priority | "ALL")} className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-400">
            <option value="ALL">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-colors">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* List View */}
      {view === "list" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {(["TODO","IN_PROGRESS","DONE","CANCELLED"] as Status[]).map(status => {
            const group = filtered.filter(t => t.status === status)
            if (group.length === 0) return null
            return (
              <div key={status}>
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <span className={STATUS_CONFIG[status].color}>{STATUS_CONFIG[status].icon}</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{STATUS_CONFIG[status].label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold">{group.length}</span>
                </div>
                {group.map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckSquare className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-3" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No tasks found</p>
            </div>
          )}
        </div>
      )}

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {(["TODO","IN_PROGRESS","DONE","CANCELLED"] as Status[]).map(status => (
            <div key={status} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className={`flex items-center gap-2 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800`}>
                <span className={STATUS_CONFIG[status].color}>{STATUS_CONFIG[status].icon}</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{STATUS_CONFIG[status].label}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold">{byStatus(status).length}</span>
              </div>
              <div className="p-3 space-y-2 min-h-32">
                {byStatus(status).map(task => (
                  <div key={task.id} className={`group relative p-3 rounded-xl border ${isOverdue(task.dueDate, task.status) ? "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20" : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"} hover:shadow-md transition-all cursor-pointer`}>
                    <div className="flex items-start gap-2">
                      <button onClick={() => toggleDone(task.id)} className={`mt-0.5 flex-shrink-0 ${STATUS_CONFIG[task.status].color}`}>
                        {STATUS_CONFIG[task.status].icon}
                      </button>
                      <p className={`text-sm font-semibold flex-1 ${task.status === "DONE" ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>{task.title}</p>
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_CONFIG[task.priority].dot}`} />
                      <span className={`text-xs font-semibold ${PRIORITY_CONFIG[task.priority].color}`}>{task.priority}</span>
                      {task.dueDate && <span className={`text-xs ${isOverdue(task.dueDate, task.status) ? "text-red-500 font-semibold" : "text-gray-400"}`}>{task.dueDate}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" /> New Task
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input
                  type="text" value={newTask.title} onChange={e => setNewTask(t => ({...t, title: e.target.value}))}
                  placeholder="Task title..."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={newTask.description} onChange={e => setNewTask(t => ({...t, description: e.target.value}))}
                  placeholder="Optional description..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm resize-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask(t => ({...t, priority: e.target.value as Priority}))} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select value={newTask.status} onChange={e => setNewTask(t => ({...t, status: e.target.value as Status}))} className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                <input
                  type="date" value={newTask.dueDate} onChange={e => setNewTask(t => ({...t, dueDate: e.target.value}))}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button onClick={addTask} disabled={!newTask.title.trim()} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold transition-colors">
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
