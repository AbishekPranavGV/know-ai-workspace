"use client"

import { useState, useEffect, useRef } from "react"
import {
  MessageSquare, Hash, Users, Plus, Send, Paperclip, Smile,
  Search, Video, CheckCheck, FileText, Pin, Sparkles,
  ThumbsUp, Heart, Flame, Copy, Check, X, Shield, Phone,
  Info, ExternalLink, Calendar, Code, ChevronRight
} from "lucide-react"

interface Message {
  id: string
  author: string
  avatar: string
  role?: string
  content: string
  time: string
  pinned?: boolean
  attachment?: { name: string; size: string; type: string }
  meetInvite?: { title: string; link: string; time: string }
  reactions: { emoji: string; count: number; userReacted?: boolean }[]
}

interface Channel {
  id: string
  name: string
  desc: string
  unread: number
  isPrivate?: boolean
}

const INITIAL_CHANNELS: Channel[] = [
  { id: "general", name: "general", desc: "General workspace discussions & product updates", unread: 0 },
  { id: "study-group", name: "study-group", desc: "Course materials, exams prep & note sharing", unread: 3 },
  { id: "project-aks", name: "project-aks", desc: "KNOW AKS development, roadmap & architecture", unread: 1 },
  { id: "announcements", name: "announcements", desc: "Official releases, deadlines & maintenance", unread: 0 },
]

const DIRECT_MESSAGES = [
  { id: "sarah", name: "Sarah Chen", role: "Design Lead", status: "online", avatar: "SC", color: "from-pink-500 to-rose-500" },
  { id: "priya", name: "Priya Patel", role: "Student / Researcher", status: "online", avatar: "PP", color: "from-emerald-500 to-teal-500" },
  { id: "marcus", name: "Marcus Vance", role: "Backend Architect", status: "away", avatar: "MV", color: "from-blue-500 to-indigo-500" },
  { id: "elena", name: "Elena Rostova", role: "Security Auditor", status: "offline", avatar: "ER", color: "from-purple-500 to-violet-500" },
]

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "study-group": [
    {
      id: "m1",
      author: "Priya Patel",
      avatar: "PP",
      role: "Student",
      content: "Hey everyone! I just synthesized the summarized revision notes for tomorrow's systems engineering session. Please check it out!",
      time: "10:14 AM",
      attachment: { name: "Distributed_Systems_Summary.pdf", size: "2.4 MB", type: "pdf" },
      reactions: [
        { emoji: "🔥", count: 5, userReacted: true },
        { emoji: "❤️", count: 4 },
        { emoji: "🚀", count: 2 },
      ],
    },
    {
      id: "m2",
      author: "Sarah Chen",
      avatar: "SC",
      role: "Design Lead",
      content: "This is super comprehensive Priya! I've linked it to our shared workspace notes page as well.",
      time: "10:18 AM",
      reactions: [{ emoji: "👍", count: 3 }],
    },
    {
      id: "m3",
      author: "Marcus Vance",
      avatar: "MV",
      role: "Engineer",
      content: "Are we hosting a mock review session on Google Meet tonight at 7 PM IST? I can walk through Raft consensus and Byzantine fault tolerance.",
      time: "10:25 AM",
      pinned: true,
      meetInvite: {
        title: "Systems Architecture Mock Review",
        link: "https://meet.google.com/aks-sync-room",
        time: "Tonight · 7:00 PM IST",
      },
      reactions: [{ emoji: "🚀", count: 6, userReacted: true }],
    },
  ],
  general: [
    {
      id: "m4",
      author: "Alex Kumar",
      avatar: "AK",
      role: "You",
      content: "Welcome to KNOW AKS team chat! Native real-time channels with Google Workspace and DPDP 2023 encryption are fully operational.",
      time: "09:00 AM",
      pinned: true,
      reactions: [{ emoji: "🎉", count: 7, userReacted: true }],
    },
    {
      id: "m5",
      author: "Sarah Chen",
      avatar: "SC",
      role: "Design Lead",
      content: "The new UI is running with 60fps micro-animations and luminous dark theme. Tested on Windows, macOS, and mobile!",
      time: "09:30 AM",
      reactions: [{ emoji: "✨", count: 4, userReacted: true }],
    },
  ],
  "project-aks": [
    {
      id: "m6",
      author: "Elena Rostova",
      avatar: "ER",
      role: "Security Auditor",
      content: "All security telemetry and audit trails have passed DPDP Act 2023 verification. No credential leakage in data export bundles.",
      time: "11:00 AM",
      reactions: [{ emoji: "🛡️", count: 4, userReacted: true }],
    },
  ],
}

export default function ChatPage() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS)
  const [activeTab, setActiveTab] = useState<"channels" | "dms">("channels")
  const [activeTarget, setActiveTarget] = useState("study-group")
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showMemberDrawer, setShowMemberDrawer] = useState(false)
  const [showNewChannelModal, setShowNewChannelModal] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelDesc, setNewChannelDesc] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeTarget])

  useEffect(() => {
    if (activeTab === "channels") {
      fetch(`/api/chat/messages?channel=${activeTarget}`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.messages && d.messages.length > 0) {
            setMessages(prev => ({
              ...prev,
              [activeTarget]: d.messages,
            }))
          }
        })
        .catch(() => {})
    }
  }, [activeTarget, activeTab])

  // Simulated peer typing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true)
      const hideTimer = setTimeout(() => setIsTyping(false), 3500)
      return () => clearTimeout(hideTimer)
    }, 8000)
    return () => clearTimeout(timer)
  }, [activeTarget])

  const activeMessages = messages[activeTarget] || []
  const activeChannel = channels.find(c => c.id === activeTarget)
  const activeDM = DIRECT_MESSAGES.find(d => d.id === activeTarget)

  const handleSend = async (contentToSend?: string) => {
    const text = (contentToSend || inputText).trim()
    if (!text) return
    setInputText("")

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      author: "Alex Kumar",
      avatar: "AK",
      role: "You",
      content: text,
      time: "Just now",
      reactions: [],
    }

    setMessages(prev => ({
      ...prev,
      [activeTarget]: [...(prev[activeTarget] || []), newMsg],
    }))

    if (activeTab === "channels") {
      try {
        const res = await fetch("/api/chat/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelName: activeTarget,
            content: text,
          }),
        })
        const d = await res.json()
        if (d.success && d.message) {
          setMessages(prev => ({
            ...prev,
            [activeTarget]: prev[activeTarget].map(m => m.id === newMsg.id ? d.message : m),
          }))
        }
      } catch {}
    }
  }

  const handleStartMeet = () => {
    const meetId = `aks-meet-${Math.random().toString(36).substring(2, 7)}`
    const meetUrl = `https://meet.google.com/${meetId}`

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      author: "Alex Kumar",
      avatar: "AK",
      role: "You",
      content: "I started a live Google Meet conference room for this discussion. Click below to join!",
      time: "Just now",
      meetInvite: {
        title: "Live Workspace Huddle & Review",
        link: meetUrl,
        time: "Happening Now · Open to All Members",
      },
      reactions: [{ emoji: "🚀", count: 1, userReacted: true }],
    }

    setMessages(prev => ({
      ...prev,
      [activeTarget]: [...(prev[activeTarget] || []), newMsg],
    }))
  }

  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages(prev => {
      const currentList = prev[activeTarget] || []
      const updated = currentList.map(msg => {
        if (msg.id !== msgId) return msg

        const existingReaction = msg.reactions.find(r => r.emoji === emoji)
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji
                ? {
                    ...r,
                    count: r.userReacted ? r.count - 1 : r.count + 1,
                    userReacted: !r.userReacted,
                  }
                : r
            ).filter(r => r.count > 0),
          }
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, userReacted: true }],
          }
        }
      })

      return { ...prev, [activeTarget]: updated }
    })
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelName.trim()) return

    const slug = newChannelName.toLowerCase().replace(/\s+/g, "-")
    const newChan: Channel = {
      id: slug,
      name: slug,
      desc: newChannelDesc.trim() || "Workspace channel",
      unread: 0,
    }

    setChannels(prev => [...prev, newChan])
    setActiveTab("channels")
    setActiveTarget(slug)
    setNewChannelName("")
    setNewChannelDesc("")
    setShowNewChannelModal(false)

    // Seed welcome message
    setMessages(prev => ({
      ...prev,
      [slug]: [
        {
          id: `msg-${Date.now()}`,
          author: "Alex Kumar",
          avatar: "AK",
          role: "You",
          content: `Created channel #${slug}. Start the conversation!`,
          time: "Just now",
          reactions: [{ emoji: "🎉", count: 1, userReacted: true }],
        },
      ],
    }))
  }

  return (
    <div className="flex h-full bg-[#fcfdfe] dark:bg-[#07090e] overflow-hidden select-text animate-fade-in">
      {/* ── Chat Sidebar (Channels & DMs) ── */}
      <div className="w-64 sm:w-72 border-r border-gray-200/70 dark:border-white/10 flex flex-col flex-shrink-0 bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">Team Chat</h1>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
                <span>Encrypted · Live</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewChannelModal(true)}
            className="p-1.5 rounded-xl text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
            title="Create Channel"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-3 pt-3 pb-2">
          <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl text-xs font-bold">
            <button
              onClick={() => { setActiveTab("channels"); setActiveTarget("study-group") }}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "channels"
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Channels
            </button>
            <button
              onClick={() => { setActiveTab("dms"); setActiveTarget("sarah") }}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "dms"
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Direct Messages
            </button>
          </div>
        </div>

        {/* Channel or DM List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
          {activeTab === "channels" ? (
            channels.map(ch => {
              const active = activeTarget === ch.id
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveTarget(ch.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-200/50 dark:border-indigo-500/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Hash className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`} />
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {ch.unread > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-indigo-600 text-white shadow-xs">
                      {ch.unread}
                    </span>
                  )}
                </button>
              )
            })
          ) : (
            DIRECT_MESSAGES.map(dm => {
              const active = activeTarget === dm.id
              return (
                <button
                  key={dm.id}
                  onClick={() => setActiveTarget(dm.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-200/50 dark:border-indigo-500/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${dm.color} flex items-center justify-center text-white text-[11px] font-bold shadow-xs`}>
                      {dm.avatar}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 ${
                        dm.status === "online" ? "bg-emerald-500" : dm.status === "away" ? "bg-amber-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left truncate">
                    <div className="text-gray-900 dark:text-gray-100 truncate font-bold text-xs">{dm.name}</div>
                    <div className="text-[10px] text-gray-400 truncate">{dm.role}</div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Integration Card */}
        <div className="p-3 m-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/50 dark:border-indigo-500/20 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Workspace Synced</span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            Launch instant Google Meet huddles &amp; share files directly in any thread.
          </p>
        </div>
      </div>

      {/* ── Active Conversation Stream ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fafbfc] dark:bg-[#07090e]">
        {/* Header */}
        <div className="h-16 px-6 border-b border-gray-200/70 dark:border-white/10 flex items-center justify-between flex-shrink-0 bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {activeChannel ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  #
                </div>
                <div>
                  <h2 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                    {activeChannel.name}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-md">{activeChannel.desc}</p>
                </div>
              </div>
            ) : activeDM ? (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeDM.color} flex items-center justify-center text-white text-xs font-bold shadow-xs`}>
                  {activeDM.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{activeDM.name}</h2>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold capitalize flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{activeDM.status} · {activeDM.role}</span>
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartMeet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/40 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all shadow-xs active:scale-95"
              title="Generate Google Meet Link"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Meet Call</span>
            </button>

            <button
              onClick={() => setShowMemberDrawer(o => !o)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Channel Info"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeMessages.map(msg => (
            <div key={msg.id} className="flex items-start gap-3.5 group relative hover:bg-gray-50/60 dark:hover:bg-white/[0.02] p-2 -mx-2 rounded-2xl transition-all">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs mt-0.5">
                {msg.avatar}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">{msg.author}</span>
                  {msg.role && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                      {msg.role}
                    </span>
                  )}
                  {msg.pinned && (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className="text-[11px] text-gray-400 ml-auto sm:ml-0">{msg.time}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* PDF/File Attachment Card */}
                {msg.attachment && (
                  <div className="mt-3 inline-flex items-center gap-3 p-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/80 shadow-xs hover:border-indigo-400 transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">
                        {msg.attachment.name}
                      </div>
                      <div className="text-[10px] text-gray-400">{msg.attachment.size} · PDF Vault Asset</div>
                    </div>
                  </div>
                )}

                {/* Google Meet Invite Card */}
                {msg.meetInvite && (
                  <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 dark:border-indigo-500/30 shadow-xs max-w-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                          <Video className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {msg.meetInvite.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                        Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">{msg.meetInvite.time}</p>
                    <a
                      href={msg.meetInvite.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      <span>Join Google Meet</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Reactions & Hover Actions */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {msg.reactions.map(r => (
                    <button
                      key={r.emoji}
                      onClick={() => toggleReaction(msg.id, r.emoji)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                        r.userReacted
                          ? "bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-xs scale-105"
                          : "bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span>{r.count}</span>
                    </button>
                  ))}

                  {/* Floating Action Bar on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-1.5 py-0.5 shadow-sm">
                    {["👍", "❤️", "🔥", "🚀", "💡"].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(msg.id, emoji)}
                        className="p-1 hover:scale-125 transition-transform text-xs"
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                    <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-1" />
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-400 italic py-1 animate-fade-in">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              </span>
              <span>Priya Patel is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Box & Quick Command Chips ── */}
        <div className="p-4 border-t border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-[#0c1017]/80 backdrop-blur-xl">
          {/* Quick Command Chips */}
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto text-[11px]">
            <span className="text-gray-400 font-bold uppercase tracking-wider mr-1">Quick:</span>
            <button
              onClick={handleStartMeet}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1"
            >
              <Video className="w-3 h-3" />
              <span>/meet</span>
            </button>
            <button
              onClick={() => handleSend("📌 Action Item: Finalize Phase 4 deliverables & exam review.")}
              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <Pin className="w-3 h-3 text-amber-500" />
              <span>/action-item</span>
            </button>
            <button
              onClick={() => handleSend("📚 Review session scheduled for systems architecture tonight!")}
              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <Calendar className="w-3 h-3 text-emerald-500" />
              <span>/study-event</span>
            </button>
          </div>

          <form onSubmit={e => { e.preventDefault(); handleSend() }}>
            <div className="rounded-2xl border-2 border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900 p-2.5 focus-within:border-indigo-500 transition-all shadow-sm">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={`Message ${activeChannel ? `#${activeChannel.name}` : activeDM ? activeDM.name : ""} (Enter to send, Shift+Enter for newline)...`}
                rows={2}
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none"
              />

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 px-2">
                <div className="flex items-center gap-1 text-gray-400">
                  <button
                    type="button"
                    onClick={() => handleSend("Attached: system-diagram.png")}
                    className="p-1.5 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Attach File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputText(prev => prev + " 🎉 ")}
                    className="p-1.5 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Channel Info Drawer (Right Sidebar) ── */}
      {showMemberDrawer && (
        <div className="w-72 border-l border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-xl p-5 flex flex-col justify-between animate-slide-right flex-shrink-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Channel Details</span>
              </h3>
              <button
                onClick={() => setShowMemberDrawer(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-xs mb-4">
              <p className="font-bold text-gray-900 dark:text-white mb-0.5">#{activeChannel?.name || "thread"}</p>
              <p className="text-gray-500 text-[11px] leading-relaxed">{activeChannel?.desc}</p>
            </div>

            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Active Members (4)</h4>
            <div className="space-y-2">
              {DIRECT_MESSAGES.map(m => (
                <div key={m.id} className="flex items-center gap-2.5 text-xs">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {m.avatar}
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{m.name}</span>
                  <span className={`w-2 h-2 rounded-full ml-auto ${m.status === "online" ? "bg-emerald-500" : "bg-gray-400"}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400">
            <span className="flex items-center gap-1 font-semibold text-indigo-500">
              <Shield className="w-3.5 h-3.5" /> DPDP 2023 End-to-End Logged
            </span>
          </div>
        </div>
      )}

      {/* ── New Channel Modal ── */}
      {showNewChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNewChannelModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl z-10 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Hash className="w-5 h-5 text-indigo-500" />
                <span>Create Channel</span>
              </h3>
              <button
                onClick={() => setShowNewChannelModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Channel Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">#</span>
                  <input
                    type="text"
                    required
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    placeholder="e.g. distributed-systems"
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newChannelDesc}
                  onChange={e => setNewChannelDesc(e.target.value)}
                  placeholder="What is this channel about?"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChannelModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
