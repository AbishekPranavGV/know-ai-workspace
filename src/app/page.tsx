import Link from "next/link"
import {
  Zap, MessageSquare, BookOpen, Users, Shield, Plug,
  CheckCircle2, ArrowRight, Star, FileText, CheckSquare,
  BarChart3, Lock, Globe
} from "lucide-react"

const features = [
  { icon: FileText, title: "Smart Notes", desc: "Block-based rich-text editor. Capture ideas, meeting notes, and knowledge — all in one place.", color: "from-indigo-500 to-purple-600" },
  { icon: CheckSquare, title: "Task Management", desc: "Personal and team tasks with priorities, due dates, and kanban boards to keep you on track.", color: "from-purple-500 to-pink-600" },
  { icon: MessageSquare, title: "Team Chat", desc: "Direct messages and channels for seamless communication — no need for a separate app.", color: "from-blue-500 to-cyan-600" },
  { icon: BookOpen, title: "Learning Hub", desc: "Knowledge base, flashcards and study tools designed especially for students and educators.", color: "from-green-500 to-emerald-600" },
  { icon: Shield, title: "Privacy-First Security", desc: "End-to-end audit logs, MFA, session management, and transparent security monitoring.", color: "from-orange-500 to-red-600" },
  { icon: Plug, title: "Google Integration", desc: "Sync with Google Drive, Calendar, and Contacts. One workspace, all your tools connected.", color: "from-yellow-500 to-orange-600" },
]

const benefits = [
  { label: "Essential Features", know: "Free forever", others: "Paywalled" },
  { label: "Security Centre", know: "Built-in", others: "Add-on / None" },
  { label: "Student Tools", know: "Yes — purpose-built", others: "Generic" },
  { label: "Privacy", know: "No surveillance", others: "Varies" },
]

const stats = [
  { value: "10+", label: "Productivity Tools" },
  { value: "100%", label: "Free Core Features" },
  { value: "0", label: "Hidden Fees" },
  { value: "1", label: "Workspace for All" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">KNOW AKS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#why" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Why Us</a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Security</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
              Get Started Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-gray-950 dark:to-purple-950/30 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8">
            <Star className="w-3.5 h-3.5 fill-current" />
            All essential features — free forever
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
            Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              All-in-One
            </span>
            <br />Digital Workspace
          </h1>
          <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Notes, tasks, chat, learning tools, and security — unified in one beautiful platform.
            Built for students, professionals, and teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 w-full sm:w-auto justify-center">
              Sign In
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-400 dark:text-gray-500">No credit card required · No ads · No tracking</p>
        </div>

        {/* App preview mockup */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-indigo-500/10 overflow-hidden bg-white dark:bg-gray-900">
            <div className="h-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex h-64 sm:h-80">
              {/* Sidebar mock */}
              <div className="w-48 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-1 hidden sm:flex">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600" />
                  <div className="h-3 w-20 bg-gray-800 dark:bg-gray-200 rounded" />
                </div>
                {["Dashboard","Notes","Tasks","Chat","Learning","Security","Settings"].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${i === 0 ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium" : "text-gray-500"}`}>
                    <div className={`w-3.5 h-3.5 rounded ${i === 0 ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"}`} />
                    {item}
                  </div>
                ))}
              </div>
              {/* Content mock */}
              <div className="flex-1 p-4 sm:p-6">
                <div className="mb-4">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {["bg-indigo-50 dark:bg-indigo-950/30","bg-purple-50 dark:bg-purple-950/30","bg-green-50 dark:bg-green-950/30","bg-orange-50 dark:bg-orange-950/30"].map((c,i) => (
                    <div key={i} className={`${c} rounded-xl p-3`}>
                      <div className="h-6 w-8 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                    {[1,2,3].map(i => <div key={i} className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded mb-2" />)}
                  </div>
                  <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                    {[1,2,3].map(i => <div key={i} className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700" /><div className="h-3 flex-1 bg-gray-100 dark:bg-gray-800 rounded" /></div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Everything you need,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                nothing you don&apos;t
              </span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A thoughtfully integrated suite of tools that actually work together — not six disconnected apps.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group relative p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why KNOW AKS ── */}
      <section id="why" className="py-24 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">Why KNOW AKS?</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">The workspace that respects you — your data, your budget, your privacy.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Feature</div>
              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 text-center">KNOW AKS</div>
              <div className="text-sm font-semibold text-gray-400 text-center">Others</div>
            </div>
            {benefits.map((b, i) => (
              <div key={b.label} className={`grid grid-cols-3 px-6 py-4 border-b last:border-b-0 border-gray-100 dark:border-gray-800 ${i % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/30"}`}>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{b.label}</div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400 text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {b.know}
                </div>
                <div className="text-sm text-gray-400 text-center flex items-center justify-center">{b.others}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security highlight ── */}
      <section id="security" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 p-10 sm:p-16 text-white">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize:"40px 40px"}} />
            <div className="relative flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="text-white/80 font-semibold text-lg">Security First</span>
                </div>
                <h2 className="text-4xl font-black mb-4">Your data stays yours.</h2>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  Transparent audit logs, session management, MFA, and a dedicated Security Centre — all built in.
                  No hidden surveillance. No keystroke logging. No selling your data.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["MFA Protection","Audit Logs","Session Control","Privacy Controls","DPDP Compliant"].map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-sm font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 w-full lg:w-72">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 space-y-3">
                  {[
                    { label: "MFA Enabled", status: "Active", ok: true },
                    { label: "Last Login", status: "Just now", ok: true },
                    { label: "Active Sessions", status: "1 device", ok: true },
                    { label: "Security Alerts", status: "None", ok: true },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                      <span className="text-sm text-white/80">{r.label}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.ok ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300"}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            Create your free account in under 60 seconds. No credit card, no ads, no catch.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:-translate-y-0.5">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">KNOW AKS</span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © 2026 KNOW AKS. All rights reserved. Built with ❤️ for everyone.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
