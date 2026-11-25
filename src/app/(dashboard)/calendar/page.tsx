"use client"

import { useState, useEffect } from "react"
import {
  Calendar as CalendarIcon, Clock, Plus, Video, CheckCircle2,
  ChevronLeft, ChevronRight, Filter, ExternalLink, Trash2, X, AlertCircle
} from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  time?: string
  category: string
  meetUrl?: string
  isTask?: boolean
  status?: string
  priority?: string
}

const CATEGORIES = ["All", "Study", "Meeting", "Deadline", "Task"]

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Study:    { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  Meeting:  { bg: "bg-indigo-50 dark:bg-indigo-950/40",   text: "text-indigo-700 dark:text-indigo-300",   border: "border-indigo-200 dark:border-indigo-800" },
  Deadline: { bg: "bg-rose-50 dark:bg-rose-950/40",       text: "text-rose-700 dark:text-rose-300",       border: "border-rose-200 dark:border-rose-800" },
  Task:     { bg: "bg-blue-50 dark:bg-blue-950/40",       text: "text-blue-700 dark:text-blue-300",       border: "border-blue-200 dark:border-blue-800" },
  Personal: { bg: "bg-purple-50 dark:bg-purple-950/40",   text: "text-purple-700 dark:text-purple-300",   border: "border-purple-200 dark:border-purple-800" },
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // New Event Form State
  const [newTitle, setNewTitle] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("10:00 AM - 11:00 AM")
  const [newCategory, setNewCategory] = useState("Study")
  const [newDesc, setNewDesc] = useState("")
  const [includeMeet, setIncludeMeet] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Client-side date initialization to avoid SSR hydration divergence
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setNewDate(today)

    fetch("/api/calendar/events")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.events) {
          setEvents(d.events)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDate) return

    setSubmitting(true)
    const meetUrl = includeMeet ? `https://meet.google.com/aks-${Math.random().toString(36).substring(2, 7)}` : null

    try {
      const res = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim() || null,
          date: newDate,
          time: newTime,
          category: newCategory,
          meetUrl,
        }),
      })

      const data = await res.json()
      if (data.success && data.event) {
        setEvents(prev => [...prev, data.event])
        setNewTitle("")
        setNewDesc("")
        setShowAddModal(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    try {
      await fetch(`/api/calendar/events/${id}`, { method: "DELETE" })
    } catch (err) {
      console.error(err)
    }
  }

  const filteredEvents = events.filter(e => {
    if (selectedCategory === "All") return true
    return e.category === selectedCategory
  })

  // Group events by date
  const groupedEvents: Record<string, CalendarEvent[]> = {}
  filteredEvents.forEach(e => {
    const d = e.date || "Unscheduled"
    if (!groupedEvents[d]) groupedEvents[d] = []
    groupedEvents[d].push(e)
  })

  const sortedDates = Object.keys(groupedEvents).sort()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Calendar &amp; Google Meet Hub
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Unified study schedule, workspace task deadlines, and one-click Google Meet sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Schedule Event
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Main Schedule Timeline */}
      {sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map(dateStr => (
            <div key={dateStr} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg">
                  {dateStr}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedEvents[dateStr].map(ev => {
                  const style = categoryColors[ev.category] || categoryColors.Study
                  return (
                    <div
                      key={ev.id}
                      className={`p-5 rounded-2xl border ${style.border} ${style.bg} bg-opacity-40 flex flex-col justify-between shadow-xs transition-all hover:shadow-md group`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${style.text} bg-white dark:bg-gray-900 border ${style.border}`}>
                            {ev.category}
                          </span>
                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            title="Delete event"
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug">
                          {ev.title}
                        </h3>

                        {ev.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {ev.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 mt-3 border-t border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{ev.time || "Scheduled"}</span>
                        </div>

                        {ev.meetUrl && (
                          <a
                            href={ev.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            <Video className="w-3 h-3" /> Join Meet
                          </a>
                        )}

                        {ev.isTask && (
                          <span className="text-[10px] font-semibold text-gray-500 bg-white/70 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                            Status: {ev.status}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
          <CalendarIcon className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No scheduled events</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Plan your study sessions, group reviews, or link task deadlines directly to your calendar.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
          >
            Create first event
          </button>
        </div>
      )}

      {/* Modal for creating a new event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Schedule Event or Session</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Exam Review"
                  required
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Study">Study Session</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Time Window</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  placeholder="e.g. 02:00 PM - 03:30 PM"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Key topics, agenda, or materials to prepare..."
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="includeMeet"
                  checked={includeMeet}
                  onChange={e => setIncludeMeet(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="includeMeet" className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 cursor-pointer">
                  <Video className="w-3.5 h-3.5 text-indigo-500" />
                  Auto-generate Google Meet room link
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {submitting ? "Scheduling..." : "Confirm Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
