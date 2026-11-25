"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  Plus, Search, FileText, Trash2, Clock, Hash,
  Columns, Eye, Edit3, Bold, Italic, Heading1, Heading2,
  List, CheckSquare, Code, Quote, Sparkles, Copy, Check, Share2
} from "lucide-react"

const NOTE_COLORS = [
  "bg-indigo-500", "bg-purple-500", "bg-blue-500",
  "bg-emerald-500", "bg-pink-500", "bg-amber-500",
  "bg-teal-500", "bg-rose-500"
]

const MOCK_NOTES = [
  {
    id: "1",
    title: "KNOW AKS Product Vision & Architecture",
    content: `# KNOW AKS — All-in-One Digital Workspace\n\nBuild a universal digital productivity platform for everyone — **students**, **professionals**, **freelancers**, **entrepreneurs**, and **teams**.\n\n### Core Pillars\n- **Productivity**: Notes, tasks, kanban, calendar, goal tracking\n- **Communication**: Native real-time chat & external webhooks\n- **Learning**: Knowledge base, flashcards, Pomodoro study timer\n- **Security**: DPDP Act 2023 compliant, MFA, audit logs\n\n> "Empower individuals and teams to learn, work, and collaborate within a single platform without paywalling essential features."\n\n\`\`\`typescript\ninterface Workspace {\n  id: string;\n  name: string;\n  tier: "Free" | "Pro" | "Team";\n  membersCount: number;\n}\n\`\`\`\n\n### Action Items\n- [x] Complete Phase 1 foundation & authentication\n- [x] Implement Phase 2 workspaces & native communication\n- [x] Deploy Phase 3 learning hub & security centre\n- [x] Release Phase 4 analytics, file storage & team RBAC`,
    date: "2026-11-25",
    wordCount: 112,
    color: "bg-indigo-500",
  },
  {
    id: "2",
    title: "Distributed Systems & Cloud Computing Summary",
    content: `# Distributed Systems: Consistency & Consensus\n\nStudy notes covering key theorems for system architecture.\n\n### The CAP Theorem\nIn any asynchronous network subjected to partitions, a distributed datastore can guarantee at most two out of three:\n1. **Consistency (C)**: Every read receives the most recent write or an error.\n2. **Availability (A)**: Every non-failing node returns a response.\n3. **Partition Tolerance (P)**: The system continues to operate despite arbitrary message loss.\n\n### Raft Consensus Protocol\n- Leader election with randomized timeouts (150ms - 300ms)\n- Log replication with monotonic term indexes\n- Safety invariant: leader never overwrites or truncates its log`,
    date: "2026-11-24",
    wordCount: 88,
    color: "bg-purple-500",
  },
  {
    id: "3",
    title: "Weekly Sprint Retrospective & Goals",
    content: `# Sprint Retrospective — Week 47\n\n### What Went Well\n- Zero-downtime database push with SQLite driver adapter\n- Smooth 60fps micro-animations across all dashboards\n- DPDP 2023 user data export endpoint verified\n\n### Key Metrics\n- **Task Completion Rate**: 94%\n- **Average Focus Velocity**: 4.8 hrs/day\n- **Security Audit Anomalies**: 0 detected`,
    date: "2026-11-23",
    wordCount: 52,
    color: "bg-emerald-500",
  },
]

type Note = {
  id: string
  title: string
  content: string
  date: string
  wordCount: number
  color: string
}

type ViewMode = "edit" | "split" | "preview"

// Enhanced Markdown Previewer
function MarkdownRenderer({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const lines = useMemo(() => content.split("\n"), [content])

  // Simple, resilient parser into structured tokens
  const elements = useMemo(() => {
    const rendered: React.ReactNode[] = []
    let inCodeBlock = false
    let codeBuffer: string[] = []
    let codeLang = ""
    let blockIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Code block start/end
      if (line.trim().startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLang = line.trim().slice(3).trim()
          codeBuffer = []
        } else {
          inCodeBlock = false
          const codeText = codeBuffer.join("\n")
          const currentIdx = blockIndex++
          rendered.push(
            <div key={`code-${i}`} className="my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-900 text-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-gray-800 text-xs text-gray-400">
                <span className="font-mono uppercase">{codeLang || "code"}</span>
                <button
                  onClick={() => copyCode(codeText, currentIdx)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copiedIndex === currentIdx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
                <code>{codeText}</code>
              </pre>
            </div>
          )
        }
        continue
      }

      if (inCodeBlock) {
        codeBuffer.push(line)
        continue
      }

      // Headings
      if (line.startsWith("# ")) {
        rendered.push(
          <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-6 mb-3 tracking-tight border-b border-gray-100 dark:border-gray-800 pb-2">
            {formatInline(line.slice(2))}
          </h1>
        )
        continue
      }
      if (line.startsWith("## ")) {
        rendered.push(
          <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-5 mb-2.5 tracking-tight">
            {formatInline(line.slice(3))}
          </h2>
        )
        continue
      }
      if (line.startsWith("### ")) {
        rendered.push(
          <h3 key={`h3-${i}`} className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mt-4 mb-2">
            {formatInline(line.slice(4))}
          </h3>
        )
        continue
      }

      // Blockquote
      if (line.startsWith("> ")) {
        rendered.push(
          <blockquote key={`quote-${i}`} className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2.5 rounded-r-xl italic text-gray-700 dark:text-gray-300 my-3 text-sm leading-relaxed">
            {formatInline(line.slice(2))}
          </blockquote>
        )
        continue
      }

      // Checkbox Task Item
      if (line.match(/^-\s*\[([ xX])\]\s+(.*)/)) {
        const match = line.match(/^-\s*\[([ xX])\]\s+(.*)/)!
        const checked = match[1].toLowerCase() === "x"
        const text = match[2]
        rendered.push(
          <div key={`check-${i}`} className="flex items-center gap-2.5 my-1.5 text-sm">
            <input
              type="checkbox"
              readOnly
              checked={checked}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className={checked ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}>
              {formatInline(text)}
            </span>
          </div>
        )
        continue
      }

      // Unordered List
      if (line.match(/^[\*\-]\s+(.*)/)) {
        const match = line.match(/^[\*\-]\s+(.*)/)!
        rendered.push(
          <li key={`li-${i}`} className="ml-5 list-disc text-sm text-gray-700 dark:text-gray-300 my-1 leading-relaxed">
            {formatInline(match[1])}
          </li>
        )
        continue
      }

      // Ordered List
      if (line.match(/^\d+\.\s+(.*)/)) {
        const match = line.match(/^\d+\.\s+(.*)/)!
        rendered.push(
          <li key={`oli-${i}`} className="ml-5 list-decimal text-sm text-gray-700 dark:text-gray-300 my-1 leading-relaxed">
            {formatInline(match[1])}
          </li>
        )
        continue
      }

      // Empty Line
      if (!line.trim()) {
        rendered.push(<div key={`sp-${i}`} className="h-3" />)
        continue
      }

      // Regular Paragraph
      rendered.push(
        <p key={`p-${i}`} className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed my-1">
          {formatInline(line)}
        </p>
      )
    }

    return rendered
  }, [lines, copiedIndex])

  return (
    <div className="prose prose-indigo dark:prose-invert max-w-none space-y-1">
      {elements.length > 0 ? elements : (
        <p className="text-gray-400 italic text-sm">Empty note content. Click edit to write.</p>
      )}
    </div>
  )
}

// Inline formatting helper for Bold, Italic, and Code
function formatInline(str: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remainder = str
  let keyIdx = 0

  while (remainder.length > 0) {
    // Check for inline code `code`
    const codeMatch = remainder.match(/^`([^`]+)`/)
    if (codeMatch) {
      parts.push(
        <code key={keyIdx++} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">
          {codeMatch[1]}
        </code>
      )
      remainder = remainder.slice(codeMatch[0].length)
      continue
    }

    // Check for bold **bold**
    const boldMatch = remainder.match(/^\*\*([^\*]+)\*\*/)
    if (boldMatch) {
      parts.push(
        <strong key={keyIdx++} className="font-bold text-gray-900 dark:text-white">
          {boldMatch[1]}
        </strong>
      )
      remainder = remainder.slice(boldMatch[0].length)
      continue
    }

    // Check for italic *italic*
    const italicMatch = remainder.match(/^\*([^\*]+)\*/)
    if (italicMatch) {
      parts.push(
        <em key={keyIdx++} className="italic">
          {italicMatch[1]}
        </em>
      )
      remainder = remainder.slice(italicMatch[0].length)
      continue
    }

    // Plain text up to next special char or end
    const nextSpecial = remainder.search(/[`\*]/)
    if (nextSpecial === -1) {
      parts.push(remainder)
      break
    } else if (nextSpecial === 0) {
      parts.push(remainder[0])
      remainder = remainder.slice(1)
    } else {
      parts.push(remainder.slice(0, nextSpecial))
      remainder = remainder.slice(nextSpecial)
    }
  }

  return parts
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES)
  const [selected, setSelected] = useState<Note | null>(null)
  const [search, setSearch] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [saved, setSaved] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("split")
  const [copiedShare, setCopiedShare] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.notes && data.notes.length > 0) {
          const mapped: Note[] = data.notes.map((n: any) => ({
            id: n.id,
            title: n.title,
            content: n.content || "",
            date: n.updatedAt ? new Date(n.updatedAt).toISOString().slice(0, 10) : "2026-11-25",
            wordCount: n.wordCount || 0,
            color: n.color || "bg-indigo-500",
          }))
          setNotes(mapped)
          if (!selected) {
            selectNote(mapped[0])
          }
        } else if (notes.length > 0 && !selected) {
          selectNote(notes[0])
        }
      })
      .catch(() => {
        if (notes.length > 0 && !selected) {
          selectNote(notes[0])
        }
      })
  }, [])

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  const selectNote = (note: Note) => {
    setSelected(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setSaved(true)
  }

  const persistNoteUpdate = (id: string, title: string, content: string) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    setSaved(false)

    saveTimeoutRef.current = setTimeout(async () => {
      const wc = content.trim().split(/\s+/).filter(Boolean).length
      setNotes(ns => ns.map(n => n.id === id ? { ...n, title, content, wordCount: wc } : n))

      try {
        await fetch(`/api/notes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        })
      } catch {}

      setSaved(true)
    }, 800)
  }

  const handleTitleChange = (v: string) => {
    setEditTitle(v)
    if (selected) persistNoteUpdate(selected.id, v, editContent)
  }

  const handleContentChange = (v: string) => {
    setEditContent(v)
    if (selected) persistNoteUpdate(selected.id, editTitle, v)
  }

  const insertSnippet = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return
    const el = textareaRef.current
    const start = el.selectionStart
    const end = el.selectionEnd
    const current = editContent
    const selectedText = current.substring(start, end)
    const replacement = prefix + (selectedText || "text") + suffix
    const updated = current.substring(0, start) + replacement + current.substring(end)
    handleContentChange(updated)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4))
    }, 50)
  }

  const createNote = async () => {
    const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]
    let newNote: Note = {
      id: `local-${Date.now()}`,
      title: "Untitled Note",
      content: "# Untitled Note\n\nStart writing notes with **Markdown** formatting...",
      date: new Date().toISOString().slice(0, 10),
      wordCount: 7,
      color,
    }

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newNote.title, content: newNote.content, color }),
      })
      const data = await res.json()
      if (data.success && data.note) {
        newNote = {
          id: data.note.id,
          title: data.note.title,
          content: data.note.content || "",
          date: new Date().toISOString().slice(0, 10),
          wordCount: data.note.wordCount || 7,
          color: data.note.color || color,
        }
      }
    } catch {}

    setNotes(ns => [newNote, ...ns])
    selectNote(newNote)
  }

  const deleteNote = async (id: string) => {
    setNotes(ns => ns.filter(n => n.id !== id))
    if (selected?.id === id) {
      const rem = notes.filter(n => n.id !== id)
      setSelected(rem[0] || null)
      if (rem[0]) {
        setEditTitle(rem[0].title)
        setEditContent(rem[0].content)
      }
    }

    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" })
    } catch {}
  }

  const handleShare = () => {
    if (!selected) return
    navigator.clipboard.writeText(`${window.location.origin}/notes?id=${selected.id}`)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 2000)
  }

  return (
    <div className="flex h-full animate-fade-in">
      {/* Notes list sidebar */}
      <div className={`flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${selected ? "hidden sm:flex w-72 lg:w-80 flex-shrink-0" : "flex-1"}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Notes Studio</span>
            </h1>
            <button
              onClick={createNote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> New Note
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes or tags..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/60">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-6">
              <FileText className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No notes found</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create your first note to start writing</p>
            </div>
          ) : (
            filtered.map(note => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className={`group relative flex flex-col p-4 cursor-pointer transition-all ${
                  selected?.id === note.id
                    ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-l-4 border-l-indigo-600"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-l-transparent"
                }`}
              >
                <div className={`w-8 h-1 ${note.color} rounded-full mb-2`} />
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-bold truncate flex-1 ${selected?.id === note.id ? "text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-white"}`}>
                    {note.title || "Untitled Note"}
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {note.content.replace(/[#*`>_-]/g, "").slice(0, 100) || "Empty note"}
                </p>
                <div className="flex items-center gap-3 mt-2.5 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {note.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" /> {note.wordCount} words
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor & Live Split View */}
      {selected ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
          {/* Top Control Toolbar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelected(null)}
                className="sm:hidden text-xs text-gray-500 hover:text-indigo-600 font-bold"
              >
                ← Notes
              </button>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${selected.color}`} />
                <span className="text-xs text-gray-400 font-medium">{selected.date}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                saved
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
              }`}>
                {saved ? "✓ Saved" : "Saving..."}
              </span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("edit")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "edit"
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
                }`}
                title="Editor only"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Edit</span>
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "split"
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
                }`}
                title="Split screen live preview"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Split</span>
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "preview"
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
                }`}
                title="Rendered preview only"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Preview</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>
              <button
                onClick={() => deleteNote(selected.id)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Formatting Toolbar (when edit or split) */}
          {viewMode !== "preview" && (
            <div className="flex items-center gap-1 px-4 sm:px-6 py-1.5 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40 overflow-x-auto text-xs">
              <button
                onClick={() => insertSnippet("**", "**")}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Bold (**text**)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertSnippet("*", "*")}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Italic (*text*)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
              <button
                onClick={() => insertSnippet("# ")}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors font-bold"
                title="Heading 1 (# )"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertSnippet("### ")}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors font-bold"
                title="Heading 3 (### )"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
              <button
                onClick={() => insertSnippet("- ")}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Bullet List (- )"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertSnippet("- [ ] ")}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Task Checkbox (- [ ] )"
              >
                <CheckSquare className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertSnippet("> ")}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Blockquote (> )"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertSnippet("```typescript\n", "\n```")}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Code Block (```)"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Title bar */}
          <div className="px-6 sm:px-10 py-4 border-b border-gray-100 dark:border-gray-800/60">
            <input
              type="text"
              value={editTitle}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Note title..."
              className="w-full text-2xl sm:text-3xl font-black text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 tracking-tight"
            />
          </div>

          {/* Body Area according to View Mode */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Pane */}
            {(viewMode === "edit" || viewMode === "split") && (
              <div className={`flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto ${
                viewMode === "split" ? "border-r border-gray-100 dark:border-gray-800/80" : ""
              }`}>
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={e => handleContentChange(e.target.value)}
                  placeholder="Start writing your thoughts, research, study notes in Markdown..."
                  className="w-full flex-1 text-sm sm:text-base text-gray-800 dark:text-gray-200 bg-transparent border-none outline-none resize-none font-mono leading-relaxed placeholder-gray-400"
                />
              </div>
            )}

            {/* Rendered Live Preview Pane */}
            {(viewMode === "preview" || viewMode === "split") && (
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/30">
                <MarkdownRenderer content={editContent} />
              </div>
            )}
          </div>

          {/* Editor stats footer */}
          <div className="px-6 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400 bg-white dark:bg-gray-950 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span>{editContent.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>·</span>
              <span>{editContent.length} characters</span>
              <span>·</span>
              <span>~{Math.max(1, Math.ceil(editContent.trim().split(/\s+/).filter(Boolean).length / 200))} min read</span>
            </div>
            <div className="flex items-center gap-1 text-indigo-500 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Live Markdown Studio</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No note selected</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Choose a note from the left list or create a new markdown note to start researching and writing.
            </p>
            <button
              onClick={createNote}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" /> New Note
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
