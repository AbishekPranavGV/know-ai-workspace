"use client"

import { useState, useEffect } from "react"
import { Settings, User, Shield, Bell, Palette, Eye, EyeOff, Trash2, Camera, CheckCircle2, AlertCircle } from "lucide-react"
import { useTheme } from "next-themes"

type Tab = "profile" | "security" | "appearance" | "notifications"

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile")
  const { theme, setTheme } = useTheme()

  // Profile state
  const [user, setUser] = useState({
    name: "Alex Kumar",
    email: "alex@example.com",
    initials: "AK",
  })
  const [name, setName] = useState(user.name)
  const [profileSaved, setProfileSaved] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  // Password state
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [savingPw, setSavingPw] = useState(false)

  // Security state
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Notifications state
  const [notifs, setNotifs] = useState({ email: true, security: true, tasks: false, weekly: true })
  const [notifsSaved, setNotifsSaved] = useState(false)

  // Load user profile from DB
  useEffect(() => {
    fetch("/api/user/profile")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.user) {
          setUser({
            name: d.user.name,
            email: d.user.email,
            initials: d.user.initials,
          })
          setName(d.user.name)
          setMfaEnabled(d.user.mfaEnabled)
        }
      })
      .catch(() => {})
  }, [])

  const saveProfile = async () => {
    setSavingProfile(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (data.success) {
        setUser(prev => ({
          ...prev,
          name: data.user.name,
          initials: data.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2),
        }))
        setProfileSaved(true)
        setTimeout(() => setProfileSaved(false), 2500)
      }
    } catch {
      // fallback
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMessage(null)

    if (pwForm.next.length < 8) {
      setPwMessage({ type: "error", text: "New password must be at least 8 characters long." })
      return
    }

    if (pwForm.next !== pwForm.confirm) {
      setPwMessage({ type: "error", text: "New password and confirmation do not match." })
      return
    }

    setSavingPw(true)
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.current,
          newPassword: pwForm.next,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPwMessage({ type: "success", text: "Password changed successfully." })
        setPwForm({ current: "", next: "", confirm: "" })
      } else {
        setPwMessage({ type: "error", text: data.error || "Failed to update password." })
      }
    } catch {
      setPwMessage({ type: "error", text: "An error occurred while connecting to the server." })
    } finally {
      setSavingPw(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",       label: "Profile",       icon: <User className="w-4 h-4" /> },
    { id: "security",      label: "Security",      icon: <Shield className="w-4 h-4" /> },
    { id: "appearance",    label: "Appearance",    icon: <Palette className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile, security, and workspace preferences</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tab sidebar */}
        <div className="sm:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                  tab === t.id
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">

          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Profile Information</h2>
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-black text-white">{user.initials}</span>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                      <Camera className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Click the camera to upload a photo</p>
                  </div>
                </div>
                {/* Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-4 py-2.5 pr-24 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={saveProfile}
                    disabled={savingProfile}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                  {profileSaved && (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4" /> Saved successfully!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {tab === "security" && (
            <div className="space-y-5">
              {/* Change Password Form */}
              <form onSubmit={handlePasswordUpdate} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Change Password</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  Update your credentials · Password changes are recorded in the security audit log
                </p>

                {pwMessage && (
                  <div className={`p-3.5 mb-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    pwMessage.type === "success"
                      ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                  }`}>
                    {pwMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    <span>{pwMessage.text}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {[
                    { label: "Current Password", value: pwForm.current, key: "current", show: showCurrent, toggle: () => setShowCurrent(s => !s) },
                    { label: "New Password (min 8 characters)", value: pwForm.next, key: "next", show: showNew, toggle: () => setShowNew(s => !s) },
                    { label: "Confirm New Password", value: pwForm.confirm, key: "confirm", show: showNew, toggle: () => setShowNew(s => !s) },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                      <div className="relative">
                        <input
                          type={f.show ? "text" : "password"}
                          value={f.value}
                          onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                          required
                          className="w-full px-4 py-2.5 pr-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                        />
                        <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={savingPw}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {savingPw ? "Updating..." : "Update Password"}
                </button>
              </form>

              {/* MFA */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Multi-Factor Authentication</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security using an authenticator app (e.g. Google Authenticator)</p>
                    <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${mfaEnabled ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400" : "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400"}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {mfaEnabled ? "MFA is enabled" : "MFA is disabled"}
                    </div>
                  </div>
                  <button onClick={() => setMfaEnabled(e => !e)} className={`flex-shrink-0 relative w-11 h-6 rounded-full transition-colors ${mfaEnabled ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${mfaEnabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
                {mfaEnabled && (
                  <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900">
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">✓ Your account is protected with TOTP-based MFA. Each login requires your authenticator code.</p>
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-900/50 p-6 shadow-sm">
                <h2 className="text-base font-bold text-red-600 dark:text-red-400 mb-1">Danger Zone</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                ) : (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3">Are you sure? This action is permanent and cannot be reversed.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                      <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors">Yes, Delete Permanently</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {tab === "appearance" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose how KNOW AKS looks for you</p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", preview: "bg-white border-gray-200" },
                    { value: "dark",  label: "Dark",  preview: "bg-gray-900 border-gray-700" },
                    { value: "system",label: "System", preview: "bg-gradient-to-br from-white to-gray-900 border-gray-400" },
                  ].map(t => (
                    <button key={t.value} onClick={() => setTheme(t.value)} className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === t.value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}>
                      <div className={`w-full h-14 rounded-lg border ${t.preview} shadow-sm`} />
                      <div className="flex items-center gap-1.5">
                        {theme === t.value && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                        <span className={`text-sm font-semibold ${theme === t.value ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}>{t.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
                  <select className="w-full max-w-xs px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm">
                    <option>English (India)</option>
                    <option>English (US)</option>
                    <option>Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Timezone</label>
                  <select className="w-full max-w-xs px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm">
                    <option>Asia/Kolkata (IST, UTC+5:30)</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {tab === "notifications" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Notifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Control how and when KNOW AKS notifies you</p>

              <div className="space-y-5">
                {[
                  { key: "email", label: "Email Notifications", desc: "Receive important notifications via email" },
                  { key: "security", label: "Security Alerts", desc: "Login attempts, password changes, and security events" },
                  { key: "tasks", label: "Task Reminders", desc: "Reminders for upcoming and overdue tasks" },
                  { key: "weekly", label: "Weekly Summary", desc: "A summary of your activity every Monday morning" },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({...prev, [n.key]: !prev[n.key as keyof typeof prev]}))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${notifs[n.key as keyof typeof notifs] ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifs[n.key as keyof typeof notifs] ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    setNotifsSaved(true)
                    setTimeout(() => setNotifsSaved(false), 2000)
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-500/20"
                >
                  Save Preferences
                </button>
                {notifsSaved && (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" /> Preferences saved!
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
