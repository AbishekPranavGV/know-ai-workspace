"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FileText, CheckSquare, Calendar, Target,
  MessageSquare, BookOpen, Shield, Settings, Zap, LogOut, Bell,
  Sun, Moon, Menu, X, ChevronDown, Search, User, Check, Plus, CheckCheck,
  BarChart3, Folder, Users, Cpu
} from "lucide-react"
import { useTheme } from "next-themes"
import { CommandPalette } from "@/components/command-palette"

const NAV = [
  { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
  { label: "Notes",        href: "/notes",        icon: FileText },
  { label: "Tasks",        href: "/tasks",        icon: CheckSquare },
  { label: "Calendar",     href: "/calendar",     icon: Calendar },
  { label: "Goals",        href: "/goals",        icon: Target },
  { label: "Analytics",    href: "/analytics",    icon: BarChart3 },
  { label: "Files",        href: "/files",        icon: Folder },
  { label: "Team",         href: "/team",         icon: Users },
  { label: "Integrations", href: "/integrations", icon: Cpu },
  { label: "Chat",         href: "/chat",         icon: MessageSquare },
  { label: "Learning",     href: "/learning",     icon: BookOpen },
  { label: "Security",     href: "/security",     icon: Shield },
  { label: "Settings",     href: "/settings",     icon: Settings },
]

const WORKSPACES = [
  { id: "personal", name: "Alex's Personal Space", type: "Personal", color: "from-indigo-500 to-purple-500" },
  { id: "study", name: "CS101 Study Group", type: "Student Team", color: "from-emerald-500 to-teal-500" },
  { id: "aks-core", name: "KNOW AKS Core Project", type: "Workspace", color: "from-blue-500 to-indigo-500" },
]

const MOCK_USER = { name: "Alex Kumar", email: "alex@example.com", initials: "AK" }

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
      <Moon className="w-4 h-4 block dark:hidden text-indigo-500" />
    </button>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [wsMenuOpen, setWsMenuOpen] = useState(false)
  const [activeWs, setActiveWs] = useState(WORKSPACES[0])
  const [cmdOpen, setCmdOpen] = useState(false)

  // Live Notifications
  const [notifications, setNotifications] = useState([
    { id: "1", title: "Security Protected", body: "MFA enabled & no suspicious logins detected", time: "2m ago", read: false },
    { id: "2", title: "Team Chat Mention", body: "Priya shared Distributed_Systems_Summary.pdf in #study-group", time: "1h ago", read: false },
    { id: "3", title: "Welcome to KNOW AKS", body: "Universal workspace ready for your notes & tasks", time: "Today", read: true },
  ])
  const [unreadCount, setUnreadCount] = useState(2)

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.notifications && d.notifications.length > 0) {
          setNotifications(d.notifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            time: "Recent",
            read: n.read,
          })))
          setUnreadCount(d.unreadCount ?? d.notifications.filter((n: any) => !n.read).length)
        }
      })
      .catch(() => {})
  }, [])

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      })
    } catch {}
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${mobile ? "" : "border-r border-gray-200 dark:border-gray-800"}`}>
      {/* Brand header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-800 gap-2.5 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-black text-lg text-gray-900 dark:text-white tracking-tight block leading-tight">
            KNOW AKS
          </span>
          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
            Digital Workspace
          </span>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800 relative flex-shrink-0">
        <button
          onClick={() => setWsMenuOpen(o => !o)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group text-left border border-gray-100 dark:border-gray-800"
        >
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${activeWs.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
            {activeWs.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{activeWs.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{activeWs.type}</p>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${wsMenuOpen ? "rotate-180" : ""}`} />
        </button>

        {wsMenuOpen && (
          <div className="absolute top-full left-3 right-3 mt-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Your Workspaces
            </div>
            {WORKSPACES.map(ws => (
              <button
                key={ws.id}
                onClick={() => { setActiveWs(ws); setWsMenuOpen(false) }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${ws.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {ws.name[0]}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 truncate">{ws.name}</span>
                </div>
                {activeWs.id === ws.id && <Check className="w-3.5 h-3.5 text-indigo-500" />}
              </button>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
              <button
                onClick={() => { setWsMenuOpen(false); setCmdOpen(true) }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          Workspace Modules
        </p>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
              <span className="flex-1">{label}</span>
              {label === "Security" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold">
                  Active
                </span>
              )}
              {label === "Chat" && (
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div
          onClick={() => setUserMenuOpen(o => !o)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm">
            {MOCK_USER.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{MOCK_USER.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{MOCK_USER.email}</p>
          </div>
          <LogOut className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
      {/* Global Command Palette */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 flex flex-col z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center gap-3 px-4 sm:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Interactive Search / Command Trigger */}
          <div className="flex-1 max-w-md">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-sm text-gray-500 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-left shadow-xs"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="truncate">Search notes, tasks, or commands...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-gray-400 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Topbar Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ThemeToggle />

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(o => !o); setUserMenuOpen(false); setWsMenuOpen(false) }}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Notifications</p>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                        {unreadCount} New
                      </span>
                    </div>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors ${
                        n.read ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? "bg-gray-300 dark:bg-gray-600" : "bg-indigo-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{n.body}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => { setUserMenuOpen(o => !o); setNotifOpen(false); setWsMenuOpen(false) }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {MOCK_USER.initials}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 py-1.5 animate-in fade-in">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{MOCK_USER.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{MOCK_USER.email}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-gray-400" /> Account Settings
                  </Link>
                  <Link
                    href="/security"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4 text-emerald-500" /> Security Centre
                  </Link>
                  <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                    <Link
                      href="/login"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
