"use client"

import { useState, useEffect } from "react"
import {
  Target, CheckCircle2, Circle, Plus, Trash2, X, Flag,
  TrendingUp, Award, Clock, ArrowRight, Sparkles, Filter
} from "lucide-react"

interface KeyResult {
  id: string
  title: string
  completed: boolean
}

interface GoalItem {
  id: string
  title: string
  description?: string
  category: string
  targetDate?: string
  progress: number
  status: string
  keyResults: KeyResult[]
}

const CATEGORIES = ["All", "Academic", "Project", "Personal", "Career"]

const categoryBadge: Record<string, string> = {
  Academic: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Project:  "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  Personal: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Career:   "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "COMPLETED" | "ALL">("ACTIVE")
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // New Goal form
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newCategory, setNewCategory] = useState("Academic")
  const [newTargetDate, setNewTargetDate] = useState("")
  const [krInputs, setKrInputs] = useState<string[]>(["", ""])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/goals")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.goals) {
          setGoals(d.goals)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleToggleKeyResult = async (goalId: string, krId: string) => {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return

    const updatedKrs = goal.keyResults.map(kr =>
      kr.id === krId ? { ...kr, completed: !kr.completed } : kr
    )

    const completedCount = updatedKrs.filter(kr => kr.completed).length
    const calculatedProgress = updatedKrs.length > 0
      ? Math.round((completedCount / updatedKrs.length) * 100)
      : goal.progress

    const newStatus = calculatedProgress === 100 ? "COMPLETED" : "ACTIVE"

    setGoals(prev => prev.map(g =>
      g.id === goalId ? { ...g, keyResults: updatedKrs, progress: calculatedProgress, status: newStatus } : g
    ))

    try {
      await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyResults: updatedKrs,
          progress: calculatedProgress,
          status: newStatus,
        }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setSubmitting(true)
    const validKrs = krInputs
      .filter(t => t.trim().length > 0)
      .map((t, idx) => ({ id: `kr-${Date.now()}-${idx}`, title: t.trim(), completed: false }))

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim() || undefined,
          category: newCategory,
          targetDate: newTargetDate || undefined,
          keyResults: validKrs,
        }),
      })

      const data = await res.json()
      if (data.success && data.goal) {
        setGoals(prev => [data.goal, ...prev])
        setNewTitle("")
        setNewDesc("")
        setKrInputs(["", ""])
        setShowAddModal(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" })
    } catch (err) {
      console.error(err)
    }
  }

  const filteredGoals = goals.filter(g => {
    const matchCategory = selectedCategory === "All" || g.category === selectedCategory
    const matchStatus = statusFilter === "ALL" || g.status === statusFilter
    return matchCategory && matchStatus
  })

  const completedGoalsCount = goals.filter(g => g.status === "COMPLETED").length
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
    : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <Target className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Goals &amp; Milestones (OKRs)
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track academic goals, project deliverables, and personal study habits with quantifiable key results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> New Goal
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{goals.length}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Workspace Goals</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{completedGoalsCount}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Achieved Milestones</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{avgProgress}%</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Average Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200 dark:border-gray-800">
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

        <div className="flex items-center gap-2">
          {(["ACTIVE", "COMPLETED", "ALL"] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === st
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {st === "ALL" ? "All Status" : st === "ACTIVE" ? "In Progress" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGoals.map(goal => (
            <div
              key={goal.id}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-4 group hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryBadge[goal.category] || categoryBadge.Academic}`}>
                    {goal.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {goal.targetDate && (
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Target: {goal.targetDate}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {goal.title}
                </h3>

                {goal.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {goal.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className={goal.progress === 100 ? "text-emerald-500" : "text-indigo-600 dark:text-indigo-400"}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.progress === 100
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600"
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Key Results Checklist */}
              {goal.keyResults && goal.keyResults.length > 0 && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Key Results ({goal.keyResults.filter(k => k.completed).length}/{goal.keyResults.length})
                  </p>
                  <div className="space-y-1.5">
                    {goal.keyResults.map(kr => (
                      <div
                        key={kr.id}
                        onClick={() => handleToggleKeyResult(goal.id, kr.id)}
                        className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors text-xs select-none"
                      >
                        {kr.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`flex-1 leading-snug ${
                          kr.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300 font-medium"
                        }`}>
                          {kr.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
          <Target className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No goals match this filter</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Set ambitious study goals, semester targets, or project launch milestones.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
          >
            Create first goal
          </button>
        </div>
      )}

      {/* Modal for adding a new goal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Goal / OKR</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Master Operating Systems & Concurrency"
                  required
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Project">Project Deliverable</option>
                    <option value="Personal">Personal Habit</option>
                    <option value="Career">Career &amp; Interview</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={e => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Why this goal matters and what success looks like..."
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Key Results / Milestones
                </label>
                {krInputs.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={val}
                      onChange={e => {
                        const copy = [...krInputs]
                        copy[idx] = e.target.value
                        setKrInputs(copy)
                      }}
                      placeholder={`Key Result ${idx + 1} (e.g. Build simulation lab)`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setKrInputs(prev => [...prev, ""])}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 mt-1"
                >
                  <Plus className="w-3 h-3" /> Add another Key Result
                </button>
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
                  {submitting ? "Creating..." : "Save Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
