"use client"

import { useState, useEffect } from "react"
import {
  Zap, CheckCircle2, XCircle, RefreshCw, ExternalLink,
  Settings, Key, Link2, Bell, Shield, ArrowRight
} from "lucide-react"

interface IntegrationItem {
  id: string
  provider: string
  name: string
  status: "CONNECTED" | "DISCONNECTED" | "PENDING"
  config: Record<string, any>
  lastSyncAt?: string
}

const INTEGRATION_META: Record<string, { desc: string; iconBg: string; border: string }> = {
  GOOGLE_DRIVE: {
    desc: "Seamlessly access, preview, and embed documents from your Google Drive into workspace notes.",
    iconBg: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-800",
  },
  GOOGLE_CALENDAR: {
    desc: "Synchronize assignment deadlines and generate one-click Google Meet video rooms.",
    iconBg: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800",
  },
  GITHUB: {
    desc: "Track software engineering repository activity, commits, and pull requests in team channels.",
    iconBg: "bg-gray-800 dark:bg-gray-700",
    border: "border-gray-200 dark:border-gray-700",
  },
  WEBHOOK: {
    desc: "Inbound and outbound webhook triggers to pipe external events into your notification center.",
    iconBg: "bg-purple-600",
    border: "border-purple-200 dark:border-purple-800",
  },
  SLACK: {
    desc: "Mirror team discussions and announcements between Slack and native KNOW AKS channels.",
    iconBg: "bg-emerald-600",
    border: "border-emerald-200 dark:border-emerald-800",
  },
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/integrations")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.integrations) {
          setIntegrations(d.integrations)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (provider: string, currentStatus: string) => {
    const nextStatus = currentStatus === "CONNECTED" ? "DISCONNECTED" : "CONNECTED"
    setIntegrations(prev =>
      prev.map(i => i.provider === provider ? { ...i, status: nextStatus, lastSyncAt: new Date().toISOString() } : i)
    )

    try {
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, status: nextStatus }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const triggerSync = async (provider: string) => {
    setSyncing(provider)
    try {
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, status: "CONNECTED" }),
      })
      setTimeout(() => {
        setSyncing(null)
        setIntegrations(prev =>
          prev.map(i => i.provider === provider ? { ...i, lastSyncAt: new Date().toISOString() } : i)
        )
      }, 700)
    } catch {
      setSyncing(null)
    }
  }

  const connectedCount = integrations.filter(i => i.status === "CONNECTED").length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Integrations &amp; Connectors Hub
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Connect external services, Google Workspace, GitHub, and custom webhooks without expensive middleware.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{connectedCount} of {integrations.length} Connected</span>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map(item => {
          const meta = INTEGRATION_META[item.provider] || {
            desc: "Custom external workspace service connector.",
            iconBg: "bg-indigo-600",
            border: "border-gray-200 dark:border-gray-800",
          }
          const isConnected = item.status === "CONNECTED"

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-white dark:bg-gray-900 border ${meta.border} shadow-xs flex flex-col justify-between space-y-5 card-interactive`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${meta.iconBg} flex items-center justify-center text-white text-base font-bold shadow-xs`}>
                      {item.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                        <span className={`text-[11px] font-bold ${isConnected ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleStatus(item.provider, item.status)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                      isConnected ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                        isConnected ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {meta.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400">
                  Last sync: {item.lastSyncAt ? item.lastSyncAt.split("T")[0] : "Never"}
                </span>

                {isConnected && (
                  <button
                    onClick={() => triggerSync(item.provider)}
                    className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing === item.provider ? "animate-spin" : ""}`} />
                    <span>Sync Now</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
