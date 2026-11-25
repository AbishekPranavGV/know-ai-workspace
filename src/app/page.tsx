"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Zap, MessageSquare, BookOpen, Users, Shield, Plug,
  CheckCircle2, ArrowRight, Star, FileText, CheckSquare,
  BarChart3, Lock, Globe, Laptop, Download, Sparkles,
  Columns, Target, Folder, Calendar, Cpu, Check, Play,
  ChevronRight, Terminal, ArrowUpRight
} from "lucide-react"

const MODULE_TABS = [
  {
    id: "notes",
    title: "Notes Studio",
    icon: FileText,
    badge: "Markdown Live Split",
    color: "from-indigo-500 to-purple-600",
    previewTitle: "Distributed Systems & Raft Consensus",
    previewContent: "# CAP Theorem & Distributed State\n- Consistency: Linearizable state replication\n- Availability: Low-latency consensus quorum\n- Partition Tolerance: Raft heartbeat election",
    stat: "1,240 words · 0ms latency",
  },
  {
    id: "tasks",
    title: "Tasks & Kanban",
    icon: CheckSquare,
    badge: "Interactive Flow",
    color: "from-purple-500 to-pink-600",
    previewTitle: "Sprint 48 · Production Release",
    previewContent: "✓ Deploy Vercel Production Build\n✓ Verify DPDP 2023 Export Audit Logs\n⏳ Seed SuperMemo SM-2 Flashcards\n○ Launch Desktop Software Executable",
    stat: "94% Sprint Completion Rate",
  },
  {
    id: "learning",
    title: "Study & Flashcards",
    icon: BookOpen,
    badge: "SuperMemo SM-2",
    color: "from-emerald-500 to-teal-600",
    previewTitle: "Algorithms: Master Theorem Analysis",
    previewContent: "Question: T(n) = 2T(n/2) + O(n)\nAnswer: O(n log n) by Case 2 of Master Theorem.\nRecall Stability Factor: 4.8 / 5.0",
    stat: "12 Cards Due · 25m Focus Timer",
  },
  {
    id: "analytics",
    title: "Analytics & Velocity",
    icon: BarChart3,
    badge: "Study Radar",
    color: "from-blue-500 to-cyan-600",
    previewTitle: "Weekly Velocity: 94.2% Efficiency",
    previewContent: "Mon: 5.2h Focus · Tue: 6.1h Focus · Wed: 5.8h Focus\nTop Subject: CS101 Distributed Systems (42%)\nAudit Logs: 0 Security Anomalies Detected",
    stat: "7-Day Streak · Top 5% Focus",
  },
  {
    id: "security",
    title: "Security & DPDP",
    icon: Shield,
    badge: "India DPDP 2023",
    color: "from-orange-500 to-red-600",
    previewTitle: "Zero Surveillance · Privacy First",
    previewContent: "✓ MFA TOTP Hardware Authenticator Active\n✓ Append-Only Audit Logging Active (30-day)\n✓ Encrypted Session Token Revocation\n✓ Sanitized JSON Data Portability Ready",
    stat: "Security Score: 95/100 · All Clear",
  },
]

const BENTO_FEATURES = [
  {
    icon: FileText,
    title: "Smart Notes & Markdown Studio",
    desc: "Split-screen Markdown editor with syntax-highlighted code blocks, copy actions, checkboxes, and instant cloud sync.",
    tag: "Productivity",
    gradient: "from-indigo-500/20 to-purple-500/10",
  },
  {
    icon: CheckSquare,
    title: "Multi-View Task Pipelines",
    desc: "Personal and team tasks with kanban drag-and-drop columns, urgency tags, due date reminders, and label filtering.",
    tag: "Workflow",
    gradient: "from-purple-500/20 to-pink-500/10",
  },
  {
    icon: BookOpen,
    title: "SuperMemo SM-2 Learning Engine",
    desc: "Scientific spaced repetition flashcards with custom recall ratings and Pomodoro study clocks built for students.",
    tag: "Education",
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: MessageSquare,
    title: "Native Team Channels & DMs",
    desc: "Real-time communication with channels, direct messaging, file sharing, PDF previews, and emoji feedback.",
    tag: "Collaboration",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Calendar,
    title: "Calendar & Instant Google Meet",
    desc: "Integrated schedule planner with 1-click Google Meet room generation for study groups and team standups.",
    tag: "Integration",
    gradient: "from-amber-500/20 to-yellow-500/10",
  },
  {
    icon: Shield,
    title: "DPDP Act 2023 Compliance",
    desc: "Transparent account security, active device revoker, TOTP MFA, append-only audit trail, and zero tracking.",
    tag: "Governance",
    gradient: "from-rose-500/20 to-orange-500/10",
  },
]

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(MODULE_TABS[0])

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#07090e] text-gray-900 dark:text-gray-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* ── Top Ambient Glow & Mesh ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 mesh-glow-indigo pointer-events-none -z-10" />
      <div className="fixed top-40 right-10 w-96 h-96 mesh-glow-cyan pointer-events-none -z-10 opacity-70" />

      {/* ── Navigation Header ── */}
      <header className="fixed top-0 inset-x-0 z-50 glass-luxury border-b border-gray-200/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none text-gray-900 dark:text-white">
                KNOW AKS
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mt-0.5">
                Universal Workspace
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Showcase</a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Modules</a>
            <a href="#desktop" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Desktop App</a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Security & DPDP</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-32 sm:pt-40 pb-20 px-4 sm:px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-8 shadow-xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
            <span>KNOW AKS 4.0 · Universal Digital Workspace</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Free Core Pillars</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-gray-900 dark:text-white">
            Where Ambition Meets{" "}
            <span className="gradient-text">Execution.</span>
            <br />
            <span className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-gray-200">
              One Workspace for Everyone.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Unify smart markdown notes, kanban pipelines, scientific flashcards, calendar schedules,
            team communication, and privacy-first security into a single cohesive, high-speed ecosystem.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <span>Launch Web Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#desktop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl glass-luxury text-gray-800 dark:text-gray-200 font-bold text-base hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
            >
              <Laptop className="w-5 h-5 text-indigo-500" />
              <span>Get Desktop Software</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> India DPDP 2023 Compliant</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Student Friendly</span>
          </div>
        </div>

        {/* ── Interactive Module Showcase ── */}
        <div id="showcase" className="max-w-5xl mx-auto mt-16 sm:mt-20">
          <div className="p-2 sm:p-3 rounded-3xl glass-luxury shadow-2xl border border-gray-200/80 dark:border-white/10">
            {/* Tab Bar */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto p-1.5 bg-gray-100/70 dark:bg-gray-900/60 rounded-2xl mb-4 border border-gray-200/40 dark:border-white/5">
              {MODULE_TABS.map((tab) => {
                const active = activeTab.id === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                      active
                        ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                    <span>{tab.title}</span>
                  </button>
                )
              })}
            </div>

            {/* Active Tab Interactive Display */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {activeTab.badge}
                    </span>
                    <span className="text-xs text-gray-400">· {activeTab.stat}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    {activeTab.previewTitle}
                  </h3>
                </div>
                <Link
                  href={`/${activeTab.id === "learning" ? "learning" : activeTab.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Open in Workspace</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-gray-50 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-800 font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                {activeTab.previewContent}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Bento Grid ── */}
      <section id="features" className="py-24 px-4 sm:px-6 border-t border-gray-200/50 dark:border-gray-800/80 bg-white/50 dark:bg-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              All 6 Pillars. Infinite Productivity.
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Designed from first principles to remove software fragmentation and eliminate monthly SaaS fees for essential capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENTO_FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="p-6 rounded-2xl glass-luxury border border-gray-200/70 dark:border-white/10 card-interactive flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 gap-1">
                  <span>Explore module</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Desktop Software Section ── */}
      <section id="desktop" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-transparent to-indigo-950/10">
        <div className="max-w-5xl mx-auto glass-luxury p-8 sm:p-12 rounded-3xl border border-indigo-200/80 dark:border-indigo-500/20 shadow-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-4">
                <Laptop className="w-3.5 h-3.5" />
                <span>Runs as Native Software</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                Install as a Desktop App on Windows, Mac, or Linux
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                KNOW AKS runs in full desktop software mode. Zero tabs, zero distractions,
                dedicated app icon on your taskbar, global shortcuts (<code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">⌘K</code>), and instant offline launch.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Instant PWA 1-click install in Chrome, Edge, and Safari</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Standalone borderless application window</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Native batch desktop launcher script included</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Open App to Install</span>
                </Link>
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span>App Preferences</span>
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 text-gray-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="font-mono text-gray-300 ml-2">know-aks-desktop</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-indigo-400">Software Mode</span>
              </div>
              <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-gray-300">
{`# 1. Install Desktop App via Chrome/Edge:
Click "Install KNOW AKS" icon in address bar

# 2. Or Launch Desktop Software via CLI:
./know-aks-desktop.bat

# 3. Features:
✓ Zero browser tabs or URL bars
✓ Hardware-accelerated smooth 60fps
✓ Persisted SQLite datastore
✓ Global shortcuts: ⌘K, G D, G N`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-4 sm:px-6 border-t border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
              K
            </div>
            <span className="font-bold text-gray-900 dark:text-white">KNOW AKS</span>
            <span>— Your All-in-One Digital Workspace</span>
          </div>
          <p>© 2026 KNOW AKS. India DPDP Act 2023 Compliant. Essential features free forever.</p>
        </div>
      </footer>
    </div>
  )
}
