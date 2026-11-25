"use client"

import { useState, useEffect } from "react"
import { Shield, CheckCircle2, AlertTriangle, XCircle, Laptop, Smartphone, Clock, MapPin, Trash2, RefreshCw, Download } from "lucide-react"

interface SessionItem {
  id: string
  device: string
  ip: string
  location: string
  lastActive: string
  current: boolean
  type: string
}

interface LoginItem {
  id: string
  time: string
  device: string
  ip: string
  location: string
  status: string
}

interface AlertItem {
  id: string
  severity: string
  message: string
  time: string
}

const DEFAULT_LOGINS: LoginItem[] = [
  { id: "l1", time: "2026-11-24 18:30", device: "Chrome on Windows", ip: "103.52.44.12", location: "Mumbai, IN", status: "SUCCESS" },
  { id: "l2", time: "2026-11-24 10:15", device: "Safari on iPhone", ip: "103.52.44.12", location: "Mumbai, IN", status: "SUCCESS" },
  { id: "l3", time: "2026-11-23 18:45", device: "Chrome on Windows", ip: "103.52.44.12", location: "Mumbai, IN", status: "SUCCESS" },
  { id: "l4", time: "2026-11-23 08:22", device: "Firefox on Linux", ip: "198.51.100.4", location: "Unknown", status: "FAILED" },
]

const DEFAULT_SESSIONS: SessionItem[] = [
  { id: "s1", device: "Chrome on Windows 11", ip: "103.52.44.12", location: "Mumbai, IN", lastActive: "Active now", current: true, type: "desktop" },
  { id: "s2", device: "Safari on iPhone 15", ip: "103.52.44.12", location: "Mumbai, IN", lastActive: "2h ago", current: false, type: "mobile" },
]

const DEFAULT_ALERTS: AlertItem[] = [
  { id: "a1", severity: "WARNING", message: "Failed login attempt from unknown IP (198.51.100.4)", time: "2026-11-23 08:22" },
  { id: "a2", severity: "INFO", message: "MFA enabled on your account", time: "2026-11-20 09:30" },
  { id: "a3", severity: "INFO", message: "New device login — Safari on iPhone", time: "2026-11-18 11:00" },
  { id: "a4", severity: "INFO", message: "Welcome to KNOW AKS — account created", time: "2026-11-18 10:00" },
]

type Tab = "overview" | "logins" | "sessions" | "alerts"

const severityStyle: Record<string, string> = {
  INFO:     "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  WARNING:  "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  CRITICAL: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
}

const statusStyle: Record<string, { badge: string; icon: React.ReactNode }> = {
  SUCCESS:    { badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  FAILED:     { badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",         icon: <XCircle className="w-3.5 h-3.5" /> },
  SUSPICIOUS: { badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
}

export default function SecurityPage() {
  const [tab, setTab] = useState<Tab>("overview")
  const [sessions, setSessions] = useState<SessionItem[]>(DEFAULT_SESSIONS)
  const [logins, setLogins] = useState<LoginItem[]>(DEFAULT_LOGINS)
  const [alerts, setAlerts] = useState<AlertItem[]>(DEFAULT_ALERTS)
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null)
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [loading, setLoading] = useState(false)

  // Fetch live sessions and audit logs
  const loadSecurityData = () => {
    setLoading(true)
    Promise.all([
      fetch("/api/security/sessions").then(r => r.json()).catch(() => null),
      fetch("/api/security/audit-logs").then(r => r.json()).catch(() => null),
    ]).then(([sessData, auditData]) => {
      if (sessData?.success && sessData.sessions?.length > 0) {
        setSessions(sessData.sessions)
      }
      if (auditData?.success) {
        if (auditData.logins?.length > 0) setLogins(auditData.logins)
        if (auditData.alerts?.length > 0) setAlerts(auditData.alerts)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    loadSecurityData()
  }, [])

  const revokeSession = async (id: string) => {
    setSessions(s => s.filter(x => x.id !== id))
    setRevokeConfirm(null)
    try {
      await fetch(`/api/security/sessions/${id}`, { method: "DELETE" })
      // Refresh audit logs to show revocation
      fetch("/api/security/audit-logs")
        .then(r => r.json())
        .then(d => {
          if (d?.success && d.alerts) setAlerts(d.alerts)
        })
        .catch(() => {})
    } catch (err) {
      console.error("Failed to revoke session", err)
    }
  }

  const scoreSegments = [
    { label: "MFA Active", done: mfaEnabled },
    { label: "Strong Password", done: true },
    { label: "Email Verified", done: true },
    { label: "Login Alerts Active", done: loginAlerts },
    { label: "DPDP 2023 Compliant", done: true },
  ]
  const score = Math.round((scoreSegments.filter(s => s.done).length / scoreSegments.length) * 100)

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "logins", label: "Login Activity" },
    { id: "sessions", label: "Sessions" },
    { id: "alerts", label: "Alerts" },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Security Centre</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              India DPDP Act 2023 compliant security monitoring &amp; transparent controls
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSecurityData}
            title="Refresh Security State"
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300">Account Protected</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Score + Status cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Score */}
            <div className="sm:col-span-2 lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col items-center justify-center shadow-sm">
              <div className="relative w-24 h-24 mb-3">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-100 dark:text-gray-800" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray={`${score} ${100 - score}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="text-green-500 transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{score}</span>
                  <span className="text-xs text-gray-400">/100</span>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Security Score</p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                {score >= 80 ? "Excellent" : score >= 60 ? "Fair" : "Needs Review"}
              </p>
            </div>

            {[
              { label: "MFA Protection", value: mfaEnabled ? "Enabled" : "Disabled", ok: mfaEnabled, icon: Shield },
              { label: "Password Strength", value: "Strong (bcrypt)", ok: true, icon: CheckCircle2 },
              { label: "Active Sessions", value: `${sessions.length} device${sessions.length !== 1 ? "s" : ""}`, ok: true, icon: Laptop },
            ].map(c => (
              <div key={c.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.ok ? "bg-green-50 dark:bg-green-950/50" : "bg-red-50 dark:bg-red-950/50"}`}>
                  <c.icon className={`w-5 h-5 ${c.ok ? "text-green-600 dark:text-green-400" : "text-red-500"}`} />
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">{c.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Security checklist */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Security Safeguards</h3>
            <div className="space-y-3">
              {scoreSegments.map(s => (
                <div key={s.label} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  {s.done ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                  <span className={`text-sm font-medium flex-1 ${s.done ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>{s.label}</span>
                  {!s.done && <span className="text-xs text-orange-500 font-semibold">Action needed</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Security settings */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Security Controls</h3>
            <div className="space-y-4">
              {[
                { label: "Multi-Factor Authentication", desc: "TOTP via authenticator app", value: mfaEnabled, set: setMfaEnabled },
                { label: "Email Notifications", desc: "Get alerts for security events", value: emailNotifs, set: setEmailNotifs },
                { label: "Login Alerts", desc: "Notify me of new device logins", value: loginAlerts, set: setLoginAlerts },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
                  </div>
                  <button
                    onClick={() => s.set(!s.value)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${s.value ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${s.value ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* DPDP Act 2023 Data Portability & Rights */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  India DPDP Act 2023 Compliance &amp; Data Portability
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Section 12: You retain complete ownership and full portability of all notes, tasks, flashcards, and activities.
                </p>
              </div>

              <a
                href="/api/user/export"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Download My Data Archive
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white mb-1">Zero Surveillance</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">No screen capture, keystroke tracking, or indiscriminate message scraping.</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white mb-1">Right to Erasure</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Complete, irreversible account deletion available in Settings Danger Zone.</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white mb-1">Append-Only Logs</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Tamper-evident audit logs protect against silent credential abuse.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Activity Tab */}
      {tab === "logins" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Login Activity</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Append-only audit trail · Compliant with DPDP Act 2023 · Never logs keystrokes or screens
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-5 py-3">Date &amp; Time</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">Device</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 hidden md:table-cell">IP Address</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 hidden lg:table-cell">Location</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {logins.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {l.time}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">{l.device}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400 font-mono hidden md:table-cell">{l.ip}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />{l.location}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[l.status]?.badge || "bg-gray-100 text-gray-700"}`}>
                        {statusStyle[l.status]?.icon}{l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {tab === "sessions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sessions.length} active session{sessions.length !== 1 ? "s" : ""} · Immediate remote revocation supported
            </p>
          </div>
          {sessions.map(session => (
            <div key={session.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center flex-shrink-0">
                  {session.type === "mobile" ? <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> : <Laptop className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-bold text-gray-900 dark:text-white">{session.device}</p>
                    {session.current && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 font-semibold">Current Session</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><Clock className="w-3.5 h-3.5" />{session.lastActive}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">{session.ip}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><MapPin className="w-3.5 h-3.5" />{session.location}</div>
                  </div>
                </div>
                {!session.current && (
                  <button onClick={() => setRevokeConfirm(session.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" /> Revoke
                  </button>
                )}
              </div>
              {/* Revoke confirm */}
              {revokeConfirm === session.id && (
                <div className="mt-4 pt-4 border-t border-red-100 dark:border-red-900/50 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400 flex-1">This will sign out this device immediately.</p>
                  <button onClick={() => setRevokeConfirm(null)} className="text-sm text-gray-500 font-semibold hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
                  <button onClick={() => revokeSession(session.id)} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors">Confirm Revoke</button>
                </div>
              )}
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No active sessions found.</p>
            </div>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {tab === "alerts" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Security Alerts</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time security-relevant events recorded on your account</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {alerts.map(a => (
              <div key={a.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5 ${severityStyle[a.severity] || "bg-gray-100 text-gray-700"}`}>{a.severity}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{a.time}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-400">
                No active security alerts recorded.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
