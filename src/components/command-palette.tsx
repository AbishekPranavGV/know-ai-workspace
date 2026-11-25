"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  LayoutDashboard, FileText, CheckSquare, MessageSquare, BookOpen,
  Shield, Settings, Moon, Sun, Plus, Search, X, Zap, ArrowRight,
  Sparkles, Check, Calendar, Target, BarChart3, Folder, Users, Cpu
} from "lucide-react"

interface CommandItem {
  id: string
  title: string
  category: "Navigation" | "Actions" | "Preferences"
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      title: "Go to Dashboard",
      category: "Navigation",
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-500" />,
      shortcut: "G D",
      action: () => { router.push("/dashboard"); onOpenChange(false) },
    },
    {
      id: "nav-notes",
      title: "Go to Notes Studio",
      category: "Navigation",
      icon: <FileText className="w-4 h-4 text-purple-500" />,
      shortcut: "G N",
      action: () => { router.push("/notes"); onOpenChange(false) },
    },
    {
      id: "nav-tasks",
      title: "Go to Tasks & Kanban",
      category: "Navigation",
      icon: <CheckSquare className="w-4 h-4 text-green-500" />,
      shortcut: "G T",
      action: () => { router.push("/tasks"); onOpenChange(false) },
    },
    {
      id: "nav-calendar",
      title: "Go to Calendar & Meet",
      category: "Navigation",
      icon: <Calendar className="w-4 h-4 text-amber-500" />,
      shortcut: "G E",
      action: () => { router.push("/calendar"); onOpenChange(false) },
    },
    {
      id: "nav-goals",
      title: "Go to Goals & OKRs",
      category: "Navigation",
      icon: <Target className="w-4 h-4 text-rose-500" />,
      shortcut: "G O",
      action: () => { router.push("/goals"); onOpenChange(false) },
    },
    {
      id: "nav-analytics",
      title: "Go to Analytics & Velocity",
      category: "Navigation",
      icon: <BarChart3 className="w-4 h-4 text-indigo-500" />,
      shortcut: "G A",
      action: () => { router.push("/analytics"); onOpenChange(false) },
    },
    {
      id: "nav-files",
      title: "Go to Files & Storage",
      category: "Navigation",
      icon: <Folder className="w-4 h-4 text-blue-500" />,
      shortcut: "G F",
      action: () => { router.push("/files"); onOpenChange(false) },
    },
    {
      id: "nav-team",
      title: "Go to Team & RBAC Members",
      category: "Navigation",
      icon: <Users className="w-4 h-4 text-purple-500" />,
      shortcut: "G M",
      action: () => { router.push("/team"); onOpenChange(false) },
    },
    {
      id: "nav-integrations",
      title: "Go to Integrations Hub",
      category: "Navigation",
      icon: <Cpu className="w-4 h-4 text-teal-500" />,
      shortcut: "G I",
      action: () => { router.push("/integrations"); onOpenChange(false) },
    },
    {
      id: "nav-chat",
      title: "Go to Team Chat",
      category: "Navigation",
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
      shortcut: "G C",
      action: () => { router.push("/chat"); onOpenChange(false) },
    },
    {
      id: "nav-learning",
      title: "Go to Learning & Study Hub",
      category: "Navigation",
      icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
      shortcut: "G L",
      action: () => { router.push("/learning"); onOpenChange(false) },
    },
    {
      id: "nav-security",
      title: "Go to Security Centre",
      category: "Navigation",
      icon: <Shield className="w-4 h-4 text-orange-500" />,
      shortcut: "G S",
      action: () => { router.push("/security"); onOpenChange(false) },
    },
    {
      id: "nav-settings",
      title: "Go to Settings",
      category: "Navigation",
      icon: <Settings className="w-4 h-4 text-gray-500" />,
      shortcut: "G ,",
      action: () => { router.push("/settings"); onOpenChange(false) },
    },
    // Actions
    {
      id: "act-new-note",
      title: "Create New Note",
      category: "Actions",
      icon: <Plus className="w-4 h-4 text-indigo-500" />,
      shortcut: "N",
      action: () => { router.push("/notes"); onOpenChange(false) },
    },
    {
      id: "act-new-task",
      title: "Create New Task",
      category: "Actions",
      icon: <Plus className="w-4 h-4 text-green-500" />,
      shortcut: "T",
      action: () => { router.push("/tasks"); onOpenChange(false) },
    },
    {
      id: "act-study-mode",
      title: "Start Pomodoro Study Session",
      category: "Actions",
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      action: () => { router.push("/learning"); onOpenChange(false) },
    },
    {
      id: "act-new-goal",
      title: "Create New Goal / OKR",
      category: "Actions",
      icon: <Target className="w-4 h-4 text-rose-500" />,
      action: () => { router.push("/goals"); onOpenChange(false) },
    },
    {
      id: "act-new-event",
      title: "Schedule Calendar Event & Meet",
      category: "Actions",
      icon: <Calendar className="w-4 h-4 text-amber-500" />,
      action: () => { router.push("/calendar"); onOpenChange(false) },
    },
    {
      id: "act-upload-file",
      title: "Upload & Manage Files",
      category: "Actions",
      icon: <Folder className="w-4 h-4 text-blue-500" />,
      action: () => { router.push("/files"); onOpenChange(false) },
    },
    {
      id: "act-invite-member",
      title: "Invite Team Member (RBAC)",
      category: "Actions",
      icon: <Users className="w-4 h-4 text-purple-500" />,
      action: () => { router.push("/team"); onOpenChange(false) },
    },
    {
      id: "act-connect-integration",
      title: "Connect Google / Webhook Integration",
      category: "Actions",
      icon: <Cpu className="w-4 h-4 text-teal-500" />,
      action: () => { router.push("/integrations"); onOpenChange(false) },
    },
    {
      id: "act-export-data",
      title: "Download DPDP 2023 Data Archive",
      category: "Actions",
      icon: <Shield className="w-4 h-4 text-emerald-500" />,
      action: () => { window.open("/api/user/export", "_blank"); onOpenChange(false) },
    },
    // Preferences
    {
      id: "pref-theme-toggle",
      title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      category: "Preferences",
      icon: theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      action: () => { setTheme(theme === "dark" ? "light" : "dark"); onOpenChange(false) },
    },
  ]

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (!open) return

      if (e.key === "Escape") {
        e.preventDefault()
        onOpenChange(false)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1))
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault()
        filtered[selectedIndex].action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filtered, selectedIndex, onOpenChange])

  if (!open) return null

  // Group by category
  const categories = Array.from(new Set(filtered.map(i => i.category)))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-10 transition-all animate-in zoom-in-95">
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-gray-50 dark:divide-gray-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            categories.map(cat => {
              const catItems = filtered.filter(i => i.category === cat)
              return (
                <div key={cat} className="py-1.5 first:pt-0 last:pb-0">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {cat}
                  </div>
                  <div className="space-y-0.5">
                    {catItems.map(item => {
                      const itemIndex = filtered.indexOf(item)
                      const isSelected = itemIndex === selectedIndex
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-colors ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              {item.icon}
                            </div>
                            <span>{item.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.shortcut && (
                              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                {item.shortcut}
                              </kbd>
                            )}
                            {isSelected && <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
            <Zap className="w-3 h-3" /> KNOW AKS Command
          </div>
        </div>
      </div>
    </div>
  )
}
