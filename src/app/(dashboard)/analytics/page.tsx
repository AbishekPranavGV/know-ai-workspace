"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp, BarChart3, CheckSquare, FileText, Brain, Target,
  Flame, Clock, Award, Shield, ArrowUpRight, Sparkles, Calendar
} from "lucide-react"

interface AnalyticsData {
  totalNotes: number
  totalWords: number
  totalTasks: number
  completedTasks: number
  taskCompletionRate: number
  totalGoals: number
  completedGoals: number
  avgGoalProgress: number
  totalFlashcards: number
  masteredFlashcards: number
  masteryRate: number
  currentStudyStreak: number
  totalStudyMinutes: number
  securityEventsCount: number
  weekTrend: { day: string; tasksDone: number; studyMinutes: number; notesUpdated: number }[]
}

const DEFAULT_METRICS: AnalyticsData = {
  totalNotes: 4,
  totalWords: 157,
  totalTasks: 5,
  completedTasks: 2,
  taskCompletionRate: 40,
  totalGoals: 3,
  completedGoals: 1,
  avgGoalProgress: 65,
  totalFlashcards: 6,
  masteredFlashcards: 4,
  masteryRate: 67,
  currentStudyStreak: 7,
  totalStudyMinutes: 520,
  securityEventsCount: 12,
  weekTrend: [
    { day: "Mon", tasksDone: 4, studyMinutes: 75, notesUpdated: 2 },
    { day: "Tue", tasksDone: 6, studyMinutes: 90, notesUpdated: 4 },
    { day: "Wed", tasksDone: 3, studyMinutes: 50, notesUpdated: 1 },
    { day: "Thu", tasksDone: 7, studyMinutes: 120, notesUpdated: 3 },
    { day: "Fri", tasksDone: 5, studyMinutes: 80, notesUpdated: 2 },
    { day: "Sat", tasksDone: 2, studyMinutes: 45, notesUpdated: 1 },
    { day: "Sun", tasksDone: 4, studyMinutes: 60, notesUpdated: 2 },
  ],
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(DEFAULT_METRICS)
  const [activeMetric, setActiveMetric] = useState<"tasks" | "study">("study")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.metrics) {
          setData(d.metrics)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const maxVal = Math.max(
    ...data.weekTrend.map(w => (activeMetric === "study" ? w.studyMinutes : w.tasksDone * 20))
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Productivity &amp; Study Analytics
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time telemetry on task throughput, spaced recall mastery, and deep focus streaks.
          </p>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 font-bold text-sm shadow-xs">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <span>{data.currentStudyStreak} Day Study Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs card-interactive">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {data.taskCompletionRate}% done
            </span>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white mb-0.5">
            {data.completedTasks}/{data.totalTasks}
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tasks Velocity</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs card-interactive">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
              <Sparkles className="w-3.5 h-3.5" /> SM-2 Active
            </span>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white mb-0.5">
            {data.masteryRate}%
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Recall Mastery Rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs card-interactive">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-400">Pomodoro Sprints</span>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white mb-0.5">
            {Math.round(data.totalStudyMinutes / 60)}h {data.totalStudyMinutes % 60}m
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Deep Focus Logged</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs card-interactive">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {data.completedGoals} Achieved
            </span>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white mb-0.5">
            {data.avgGoalProgress}%
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Average OKR Progress</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Trend (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">7-Day Activity Velocity</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Comparative view of study minutes vs tasks resolved</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveMetric("study")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMetric === "study"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Study Minutes
              </button>
              <button
                onClick={() => setActiveMetric("tasks")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMetric === "tasks"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Tasks Completed
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2">
            {data.weekTrend.map((item, idx) => {
              const currentVal = activeMetric === "study" ? item.studyMinutes : item.tasksDone
              const heightPercent = maxVal > 0 ? Math.round((currentVal / (activeMetric === "study" ? maxVal : 10)) * 100) : 20
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[11px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {activeMetric === "study" ? `${item.studyMinutes}m` : `${item.tasksDone} tasks`}
                  </div>
                  <div className="w-full max-w-[48px] bg-gray-100 dark:bg-gray-800 rounded-xl h-48 flex items-end overflow-hidden p-1">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ${
                        activeMetric === "study"
                          ? "bg-gradient-to-t from-indigo-600 to-purple-500"
                          : "bg-gradient-to-t from-emerald-600 to-teal-400"
                      }`}
                      style={{ height: `${Math.max(12, Math.min(100, heightPercent))}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Study Habit Breakdown (1 col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Knowledge Distribution</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Content footprint across this workspace</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-indigo-700 dark:text-indigo-300">Notes &amp; Docs Created</span>
                <span className="text-gray-900 dark:text-white">{data.totalNotes} notes ({data.totalWords} words)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-indigo-100 dark:bg-indigo-950 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-emerald-700 dark:text-emerald-300">Flashcards Mastered</span>
                <span className="text-gray-900 dark:text-white">{data.masteredFlashcards}/{data.totalFlashcards} ({data.masteryRate}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.masteryRate}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/60">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-purple-700 dark:text-purple-300">Goal Target Completion</span>
                <span className="text-gray-900 dark:text-white">{data.avgGoalProgress}% average</span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${data.avgGoalProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Security Telemetry Events</span>
            <span className="font-bold text-gray-900 dark:text-white">{data.securityEventsCount} logs recorded</span>
          </div>
        </div>
      </div>
    </div>
  )
}
