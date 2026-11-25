"use client"

import { useState, useEffect } from "react"
import {
  BookOpen, Sparkles, Brain, CheckCircle2, RotateCw, Play,
  Pause, RotateCcw, Plus, Star, Award, Layers, Search, Flame,
  Check, ArrowRight, X
} from "lucide-react"

interface Flashcard {
  id: string
  deck: string
  question: string
  answer: string
  hint?: string
  mastered: boolean
  repetition?: number
  interval?: number
  easeFactor?: number
  nextReview?: string
}

const INITIAL_CARDS: Flashcard[] = [
  {
    id: "fc1",
    deck: "Computer Science",
    question: "What is the CAP Theorem in distributed data systems?",
    answer: "A distributed system can deliver at most two of three guarantees: Consistency, Availability, and Partition Tolerance.",
    hint: "Think about network nets and partition failures.",
    mastered: true,
  },
  {
    id: "fc2",
    deck: "Computer Science",
    question: "What is the difference between Symmetric and Asymmetric encryption?",
    answer: "Symmetric uses a single shared secret key for both encryption and decryption (e.g. AES-256). Asymmetric uses a public/private key pair (e.g. RSA, ECC).",
    hint: "Keys: shared single vs paired public/private.",
    mastered: false,
  },
  {
    id: "fc3",
    deck: "Productivity",
    question: "What is Parkinson's Law?",
    answer: "Work expands so as to fill the time available for its completion. Setting shorter focused timeboxes prevents procrastination.",
    hint: "Time allocation vs actual effort.",
    mastered: false,
  },
  {
    id: "fc4",
    deck: "Productivity",
    question: "What is the Pomodoro Technique?",
    answer: "A time management method using 25-minute intervals of focused work separated by 5-minute short breaks.",
    hint: "Named after the tomato kitchen timer.",
    mastered: true,
  },
  {
    id: "fc5",
    deck: "Security & DPDP",
    question: "What is Data Minimisation under modern privacy frameworks?",
    answer: "Collecting and processing only the personal data that is strictly necessary to fulfill the explicitly stated lawful purpose.",
    hint: "Collect only what is required.",
    mastered: false,
  },
]

const STUDY_GUIDES = [
  {
    title: "Operating Systems & Concurrency Fundamentals",
    category: "Computer Science",
    reads: "15 min read",
    updated: "Nov 2026",
    summary: "Threads, mutexes, semaphores, race conditions, deadlocks, and virtual memory paging explained with code examples.",
  },
  {
    title: "Mastering Antigravity & Next.js 16 Workspace Patterns",
    category: "Web Development",
    reads: "10 min read",
    updated: "Nov 2026",
    summary: "Complete guide to modular monolith architecture, React Server Components, and client state optimization.",
  },
  {
    title: "India DPDP Act 2023: Developer Compliance Checklist",
    category: "Security & Legal",
    reads: "8 min read",
    updated: "Nov 2026",
    summary: "Actionable requirements for consent notices, audit logs, data principal rights, and encryption best practices.",
  },
]

export default function LearningPage() {
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_CARDS)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeDeck, setActiveDeck] = useState<string>("All")

  // Modal for new card
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDeck, setNewDeck] = useState("Computer Science")
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [newHint, setNewHint] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pomodoro state
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60)
  const [pomoActive, setPomoActive] = useState(false)
  const [pomoCycle, setPomoCycle] = useState(1)

  // Fetch cards from API
  useEffect(() => {
    fetch("/api/learning/flashcards")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.flashcards && d.flashcards.length > 0) {
          setCards(d.flashcards)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (pomoActive && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds(s => s - 1)
      }, 1000)
    } else if (pomoSeconds === 0) {
      setPomoActive(false)
      setPomoCycle(c => c + 1)
      setPomoSeconds(25 * 60)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [pomoActive, pomoSeconds])

  const filteredCards = cards.filter(c => activeDeck === "All" || c.deck === activeDeck)
  const currentCard = filteredCards[currentIdx] || filteredCards[0]

  const nextCard = () => {
    setIsFlipped(false)
    setCurrentIdx(prev => (prev + 1) % (filteredCards.length || 1))
  }

  const prevCard = () => {
    setIsFlipped(false)
    setCurrentIdx(prev => (prev - 1 + (filteredCards.length || 1)) % (filteredCards.length || 1))
  }

  const toggleMastered = async (id: string) => {
    const card = cards.find(c => c.id === id)
    if (!card) return
    const newMastered = !card.mastered
    setCards(prev => prev.map(c => c.id === id ? { ...c, mastered: newMastered } : c))
    try {
      await fetch("/api/learning/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, mastered: newMastered }),
      })
    } catch {}
  }

  const gradeRecall = async (grade: number) => {
    if (!currentCard) return
    const id = currentCard.id
    try {
      const res = await fetch("/api/learning/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, grade }),
      })
      const data = await res.json()
      if (data.success && data.flashcard) {
        setCards(prev => prev.map(c => c.id === id ? { ...c, ...data.flashcard } : c))
      }
    } catch {}
    nextCard()
  }

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim() || !newAnswer.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/learning/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deck: newDeck.trim() || "General",
          question: newQuestion.trim(),
          answer: newAnswer.trim(),
          hint: newHint.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.success && data.flashcard) {
        setCards(prev => [...prev, data.flashcard])
        setNewQuestion("")
        setNewAnswer("")
        setNewHint("")
        setShowAddModal(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const masteredCount = cards.filter(c => c.mastered).length
  const decks = ["All", ...Array.from(new Set(cards.map(c => c.deck)))]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Learning &amp; Study Hub
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Free active recall flashcards, study guides, and focus tools for students and lifelong learners.
          </p>
        </div>

        {/* Learning Stats & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Award className="w-4 h-4" />
            <span>{masteredCount} / {cards.length} Concepts Mastered</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Add Flashcard
          </button>
        </div>
      </div>

      {/* Main Grid: Flashcards (Left) and Pomodoro + Quick Notes (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flashcards Section (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Flashcards Deck</h2>
            </div>

            {/* Deck filter */}
            <div className="flex items-center gap-1.5 text-xs font-medium overflow-x-auto pb-1 sm:pb-0">
              {decks.map(d => (
                <button
                  key={d}
                  onClick={() => { setActiveDeck(d); setCurrentIdx(0); setIsFlipped(false) }}
                  className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    activeDeck === d
                      ? "bg-indigo-600 text-white font-semibold"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard interactive component */}
          {currentCard ? (
            <div className="space-y-4">
              <div
                onClick={() => setIsFlipped(prev => !prev)}
                className={`relative min-h-[280px] sm:min-h-[320px] rounded-3xl p-8 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 shadow-xl border-2 ${
                  isFlipped
                    ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white border-indigo-500"
                    : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                {/* Card Top bar */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    isFlipped
                      ? "bg-white/20 text-indigo-200"
                      : "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300"
                  }`}>
                    {currentCard.deck}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click card to {isFlipped ? "view question" : "reveal answer"}</span>
                  </div>
                </div>

                {/* Card Center Content */}
                <div className="my-auto py-6">
                  {!isFlipped ? (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">
                        Question
                      </span>
                      <p className="text-xl sm:text-2xl font-bold leading-relaxed">
                        {currentCard.question}
                      </p>
                      {currentCard.hint && (
                        <p className="text-xs text-gray-400 mt-4 italic">
                          💡 Hint: {currentCard.hint}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2 block">
                        Answer
                      </span>
                      <p className="text-lg sm:text-xl font-medium leading-relaxed text-indigo-100">
                        {currentCard.answer}
                      </p>

                      {/* SuperMemo SM-2 Recall Grading */}
                      <div className="mt-6 pt-4 border-t border-indigo-700/60" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-2.5">
                          <span>Spaced Repetition Recall:</span>
                          <span className="bg-indigo-950/80 px-2 py-0.5 rounded-md">
                            Interval: {currentCard.interval || 1}d (Rep #{currentCard.repetition || 0})
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => gradeRecall(1)}
                            className="px-2 py-1.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Again (1d)
                          </button>
                          <button
                            onClick={() => gradeRecall(2)}
                            className="px-2 py-1.5 rounded-xl bg-orange-500/80 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Hard (2d)
                          </button>
                          <button
                            onClick={() => gradeRecall(3)}
                            className="px-2 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Good (4d)
                          </button>
                          <button
                            onClick={() => gradeRecall(4)}
                            className="px-2 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Easy (7d)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom bar */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/60 text-xs">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      toggleMastered(currentCard.id)
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                      currentCard.mastered
                        ? "bg-green-100 dark:bg-green-950/70 text-green-700 dark:text-green-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {currentCard.mastered ? "Mastered" : "Mark as Mastered"}
                  </button>

                  <span className="text-gray-400 font-medium">
                    Card {currentIdx + 1} / {filteredCards.length}
                  </span>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevCard}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {filteredCards.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentIdx
                          ? "w-6 bg-indigo-600"
                          : "w-1.5 bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextCard}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-md shadow-indigo-500/20"
                >
                  Next Card →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800">
              <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">No flashcards in this deck yet.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Add the first card
              </button>
            </div>
          )}
        </div>

        {/* Focus Timer & Productivity Tools (1 col) */}
        <div className="space-y-6">
          {/* Pomodoro Timer */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Pomodoro Focus Timer</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 font-semibold">
                Cycle #{pomoCycle}
              </span>
            </div>

            {/* Timer Display */}
            <div className="text-center py-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/40 dark:to-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="text-5xl font-black tracking-tight text-gray-900 dark:text-white font-mono">
                {formatTimer(pomoSeconds)}
              </span>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {pomoActive ? "Active Study Sprint" : "Paused / Ready to Focus"}
              </p>
            </div>

            {/* Timer Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPomoActive(p => !p)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                  pomoActive
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                }`}
              >
                {pomoActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {pomoActive ? "Pause Sprint" : "Start Sprint"}
              </button>

              <button
                onClick={() => {
                  setPomoActive(false)
                  setPomoSeconds(25 * 60)
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-gray-400" />
                Reset
              </button>
            </div>
          </div>

          {/* Student Study Tips */}
          <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-sm font-bold">Evidence-Based Learning</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              1. <strong>Recall First</strong>: Review flashcards without looking at answers to build neural retrieval paths.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              2. <strong>Timebox</strong>: Complete two 25-minute Pomodoro sessions before taking a 15-minute screen-free rest.
            </p>
          </div>
        </div>
      </div>

      {/* Curated Study Guides & Knowledge Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Curated Knowledge Guides
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STUDY_GUIDES.map((g, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold">
                    {g.category}
                  </span>
                  <span className="text-gray-400">{g.reads}</span>
                </div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  {g.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {g.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Read Knowledge Doc</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for adding a new card */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Flashcard</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Deck / Subject</label>
                <input
                  type="text"
                  value={newDeck}
                  onChange={e => setNewDeck(e.target.value)}
                  placeholder="e.g. Computer Science, Medicine, Law"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Question / Prompt</label>
                <textarea
                  rows={2}
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="What is the concept or question to test?"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Answer / Explanation</label>
                <textarea
                  rows={3}
                  value={newAnswer}
                  onChange={e => setNewAnswer(e.target.value)}
                  placeholder="The concise answer or core retrieval concept..."
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Optional Hint</label>
                <input
                  type="text"
                  value={newHint}
                  onChange={e => setNewHint(e.target.value)}
                  placeholder="e.g. Think about 3 key guarantees..."
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Flashcard"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
