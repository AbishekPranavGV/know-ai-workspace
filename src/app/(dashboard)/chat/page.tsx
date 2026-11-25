"use client"

import { useState, useEffect } from "react"
import {
  MessageSquare, Hash, Users, Plus, Send, Paperclip, Smile,
  Search, Phone, Video, MoreVertical, CheckCheck, FileText,
  Pin, Sparkles, ThumbsUp, Heart, Flame
} from "lucide-react"

interface Message {
  id: string
  author: string
  avatar: string
  role?: string
  content: string
  time: string
  attachment?: { name: string; size: string; type: string }
  reactions: { emoji: string; count: number; userReacted?: boolean }[]
}

const CHANNELS = [
  { id: "general", name: "general", desc: "General workspace discussions", unread: 0 },
  { id: "study-group", name: "study-group", desc: "Course material, study sessions & notes sharing", unread: 3 },
  { id: "announcements", name: "announcements", desc: "Official updates and deadlines", unread: 0 },
  { id: "project-aks", name: "project-aks", desc: "KNOW AKS development and roadmap sync", unread: 1 },
]

const DIRECT_MESSAGES = [
  { id: "sarah", name: "Sarah Chen", role: "Design Lead", status: "online", avatar: "SC" },
  { id: "priya", name: "Priya Patel", role: "Student / Researcher", status: "online", avatar: "PP" },
  { id: "marcus", name: "Marcus Vance", role: "Backend Eng", status: "away", avatar: "MV" },
  { id: "elena", name: "Elena Rostova", role: "Contributor", status: "offline", avatar: "ER" },
]

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "study-group": [
    {
      id: "m1",
      author: "Priya Patel",
      avatar: "PP",
      role: "Student",
      content: "Hey everyone! I just uploaded the summarized revision notes for the upcoming systems engineering quiz. Check it out!",
      time: "10:14 AM",
      attachment: { name: "Distributed_Systems_Summary.pdf", size: "2.4 MB", type: "pdf" },
      reactions: [
        { emoji: "🔥", count: 4, userReacted: true },
        { emoji: "❤️", count: 3 },
      ],
    },
    {
      id: "m2",
      author: "Sarah Chen",
      avatar: "SC",
      role: "Design Lead",
      content: "This is super helpful Priya! I've linked it to our shared workspace notes page as well.",
      time: "10:18 AM",
      reactions: [{ emoji: "👍", count: 2 }],
    },
    {
      id: "m3",
      author: "Marcus Vance",
      avatar: "MV",
      role: "Engineer",
      content: "Are we hosting a mock review session on Google Meet tonight at 7 PM IST?",
      time: "10:25 AM",
      reactions: [{ emoji: "🚀", count: 3 }],
    },
  ],
  general: [
    {
      id: "m4",
      author: "Alex Kumar",
      avatar: "AK",
      role: "You",
      content: "Welcome to KNOW AKS team chat! Native messaging with Google integration is running.",
      time: "09:00 AM",
      reactions: [{ emoji: "🎉", count: 5, userReacted: true }],
    },
  ],
}

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<"channels" | "dms">("channels")
  const [activeTarget, setActiveTarget] = useState("study-group")
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState("")

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

  const activeMessages = messages[activeTarget] || []
  const activeChannel = CHANNELS.find(c => c.id === activeTarget)
  const activeDM = DIRECT_MESSAGES.find(d => d.id === activeTarget)

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return

    const text = inputText.trim()
    setInputText("")

    let newMsg: Message = {
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

  return (
    <div className="flex h-full bg-white dark:bg-gray-950">
      {/* Chat Navigation Sidebar */}
      <div className="w-64 sm:w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="font-bold text-gray-900 dark:text-white">Workspace Chat</h1>
          </div>
          <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-2 p-1 bg-gray-200/60 dark:bg-gray-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => { setActiveTab("channels"); setActiveTarget("study-group") }}
              className={`py-1.5 rounded-md transition-all ${
                activeTab === "channels"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Channels
            </button>
            <button
              onClick={() => { setActiveTab("dms"); setActiveTarget("sarah") }}
              className={`py-1.5 rounded-md transition-all ${
                activeTab === "dms"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Direct Messages
            </button>
          </div>
        </div>

        {/* Channel or DM list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeTab === "channels" ? (
            CHANNELS.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveTarget(ch.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTarget === ch.id
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{ch.name}</span>
                </div>
                {ch.unread > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                    {ch.unread}
                  </span>
                )}
              </button>
            ))
          ) : (
            DIRECT_MESSAGES.map(dm => (
              <button
                key={dm.id}
                onClick={() => setActiveTarget(dm.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTarget === dm.id
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {dm.avatar}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-white dark:ring-gray-900 ${
                      dm.status === "online" ? "bg-green-500" : dm.status === "away" ? "bg-amber-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1 text-left truncate">
                  <div className="text-gray-900 dark:text-gray-100 truncate">{dm.name}</div>
                  <div className="text-[11px] text-gray-400 truncate">{dm.role}</div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Integration notice */}
        <div className="p-3 m-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-300">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Google Workspace Sync
          </div>
          Google Meet & Drive links automatically preview and authenticate within KNOW AKS.
        </div>
      </div>

      {/* Main Chat Conversation View */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950">
        {/* Active chat header */}
        <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {activeChannel ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold">
                  #
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {activeChannel.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activeChannel.desc}</p>
                </div>
              </div>
            ) : activeDM ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {activeDM.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">{activeDM.name}</h2>
                  <p className="text-xs text-green-600 dark:text-green-400 capitalize">{activeDM.status}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              title="Start Google Meet Call"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Video className="w-3.5 h-3.5 text-indigo-500" /> Meet Call
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <MessageSquare className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-700" />
              <p className="text-sm font-semibold">No messages here yet</p>
              <p className="text-xs mt-1">Send a message to start the conversation!</p>
            </div>
          ) : (
            activeMessages.map(msg => (
              <div key={msg.id} className="flex items-start gap-4 group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  {msg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{msg.author}</span>
                    {msg.role && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {msg.role}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>

                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {/* Attachment card if any */}
                  {msg.attachment && (
                    <div className="mt-2.5 inline-flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 hover:border-indigo-300 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">
                          {msg.attachment.name}
                        </div>
                        <div className="text-[10px] text-gray-400">{msg.attachment.size}</div>
                      </div>
                    </div>
                  )}

                  {/* Reactions bar */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {msg.reactions.map(r => (
                      <button
                        key={r.emoji}
                        onClick={() => toggleReaction(msg.id, r.emoji)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all ${
                          r.userReacted
                            ? "bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-semibold"
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 border border-transparent"
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.count}</span>
                      </button>
                    ))}

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {["👍", "❤️", "🔥"].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(msg.id, emoji)}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 focus-within:border-indigo-500 transition-colors shadow-sm">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={`Message ${activeChannel ? `#${activeChannel.name}` : activeDM ? activeDM.name : ""}...`}
              rows={2}
              className="w-full bg-transparent px-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none"
            />
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60 px-2">
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all"
              >
                Send <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
