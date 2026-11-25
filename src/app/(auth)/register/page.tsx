"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: "", color: "" }
  if (pw.length < 6) return { score: 1, label: "Too short", color: "bg-red-500" }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" }
  if (score === 2) return { score: 2, label: "Fair", color: "bg-yellow-500" }
  if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500" }
  return { score: 4, label: "Strong", color: "bg-green-500" }
}

const perks = [
  "All productivity tools, free forever",
  "No credit card required",
  "Privacy-first — no tracking or ads",
  "Built for students and professionals",
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })

  const strength = getPasswordStrength(form.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    if (form.password !== form.confirm) {
      setErrorMsg("Passwords do not match")
      return
    }
    setLoading(true)
    setErrorMsg("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()

      if (data.success) {
        router.push("/dashboard")
      } else {
        setErrorMsg(data.error || "Registration failed")
      }
    } catch {
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"32px 32px"}} />
        <div className="absolute top-20 right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">KNOW AKS</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Your workspace.<br />Your rules.
          </h2>
          <p className="text-indigo-200 mb-8 leading-relaxed">
            Join thousands of students, professionals and teams who organise their world with KNOW AKS.
          </p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-white/90 font-medium">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">KNOW AKS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Create account</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 mb-6">
            <GoogleIcon />
            Sign up with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-950 px-3 text-gray-400 font-medium">or sign up with email</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full name</label>
              <input
                type="text" required value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))}
                placeholder="Alex Kumar"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.score >= 3 ? "text-green-600 dark:text-green-400" : strength.score >= 2 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm password</label>
              <input
                type="password" required value={form.confirm}
                onChange={e => setForm(f => ({...f, confirm: e.target.value}))}
                placeholder="Repeat your password"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-colors text-sm ${form.confirm && form.confirm !== form.password ? "border-red-400 focus:border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-indigo-500"}`}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                I agree to KNOW AKS{" "}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Privacy Policy</a>
              </span>
            </label>
            <button
              type="submit" disabled={loading || !agreed}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-indigo-500/30 transition-all duration-200"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
