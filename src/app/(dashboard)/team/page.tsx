"use client"

import { useState, useEffect } from "react"
import {
  Users, UserPlus, Shield, Check, Trash2, Mail,
  ChevronDown, X, CheckCircle2, Clock, Crown
} from "lucide-react"

interface Member {
  membershipId: string
  userId: string
  name: string
  email: string
  role: string
  joinedAt: string
  isOwner: boolean
}

const ROLES = ["ADMIN", "MEMBER", "GUEST"]

const roleBadge: Record<string, { bg: string; text: string; border: string }> = {
  OWNER:  { bg: "bg-amber-50 dark:bg-amber-950/40",   text: "text-amber-700 dark:text-amber-300",   border: "border-amber-200 dark:border-amber-800" },
  ADMIN:  { bg: "bg-indigo-50 dark:bg-indigo-950/40",  text: "text-indigo-700 dark:text-indigo-300",  border: "border-indigo-200 dark:border-indigo-800" },
  MEMBER: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  GUEST:  { bg: "bg-gray-100 dark:bg-gray-800",        text: "text-gray-600 dark:text-gray-400",       border: "border-gray-200 dark:border-gray-700" },
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [workspaceName, setWorkspaceName] = useState("Alex's Personal Space")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteName, setInviteName] = useState("")
  const [inviteRole, setInviteRole] = useState("MEMBER")
  const [submitting, setSubmitting] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/workspace/members")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.members) {
          setMembers(d.members)
          if (d.workspaceName) setWorkspaceName(d.workspaceName)
        }
      })
      .catch(console.error)
  }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/workspace/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || undefined,
          role: inviteRole,
        }),
      })

      const data = await res.json()
      if (data.success && data.member) {
        setMembers(prev => {
          const exists = prev.find(m => m.email === data.member.email)
          if (exists) {
            return prev.map(m => m.email === data.member.email ? data.member : m)
          }
          return [...prev, data.member]
        })
        setInviteEmail("")
        setInviteName("")
        setShowInviteModal(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateRole = async (membershipId: string, newRole: string) => {
    setRoleMenuOpen(null)
    setMembers(prev => prev.map(m => m.membershipId === membershipId ? { ...m, role: newRole } : m))
    try {
      await fetch(`/api/workspace/members/${membershipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveMember = async (membershipId: string) => {
    setMembers(prev => prev.filter(m => m.membershipId !== membershipId))
    try {
      await fetch(`/api/workspace/members/${membershipId}`, { method: "DELETE" })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Workspace Team &amp; Access Control (RBAC)
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage collaborators, assign role permissions, and maintain data isolation for {workspaceName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Invite Collaborator
          </button>
        </div>
      </div>

      {/* Permissions Guide Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        {[
          { role: "OWNER", desc: "Full administrative ownership, billing, and permanent workspace controls." },
          { role: "ADMIN", desc: "Manage members, channels, integrations, and workspace settings." },
          { role: "MEMBER", desc: "Create and edit notes, tasks, flashcards, and participate in chat." },
          { role: "GUEST", desc: "Read-only access to assigned notes and public study guides." },
        ].map(r => (
          <div key={r.role} className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleBadge[r.role].bg} ${roleBadge[r.role].text} ${roleBadge[r.role].border}`}>
              {r.role}
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed pt-1">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Workspace Members ({members.length})</h2>
          <span className="text-xs text-gray-400">All actions logged in Audit Trail</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {members.map(member => {
            const initials = member.name
              ? member.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
              : "U"
            const roleStyle = roleBadge[member.role] || roleBadge.MEMBER

            return (
              <div
                key={member.membershipId}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</p>
                      {member.isOwner && (
                        <span title="Workspace Owner">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto sm:ml-0">
                  {/* Role Selector */}
                  <div className="relative">
                    {member.isOwner ? (
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                        OWNER
                      </span>
                    ) : (
                      <div>
                        <button
                          onClick={() => setRoleMenuOpen(roleMenuOpen === member.membershipId ? null : member.membershipId)}
                          className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl border transition-all ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                        >
                          <span>{member.role}</span>
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>

                        {roleMenuOpen === member.membershipId && (
                          <div className="absolute right-0 top-full mt-1.5 w-36 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-30 animate-in fade-in">
                            {ROLES.map(r => (
                              <button
                                key={r}
                                onClick={() => handleUpdateRole(member.membershipId, r)}
                                className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between ${
                                  member.role === r ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                <span>{r}</span>
                                {member.role === r && <Check className="w-3 h-3" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!member.isOwner && (
                    <button
                      onClick={() => handleRemoveMember(member.membershipId)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Invite Collaborator</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="collaborator@example.com"
                  required
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name (Optional)</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Priya Patel"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Access Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="MEMBER">Member (Read &amp; Write Content)</option>
                  <option value="ADMIN">Admin (Manage Members &amp; Settings)</option>
                  <option value="GUEST">Guest (Read Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {submitting ? "Inviting..." : "Send Workspace Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
