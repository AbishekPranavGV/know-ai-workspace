"use client"

import { useState, useEffect } from "react"
import {
  FolderKanban, FileText, Upload, Plus, Trash2, ExternalLink,
  Search, HardDrive, Download, CheckCircle2, X, FileCode,
  Image as ImageIcon, Archive, File
} from "lucide-react"

interface FileAsset {
  id: string
  name: string
  size: string
  type: string
  url?: string
  source: string
  createdAt: string
}

const TYPE_FILTERS = ["All", "pdf", "doc", "image", "code", "archive"]

function getFileIcon(type: string) {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-500" />
    case "doc":
      return <FileText className="w-5 h-5 text-blue-500" />
    case "image":
      return <ImageIcon className="w-5 h-5 text-emerald-500" />
    case "code":
      return <FileCode className="w-5 h-5 text-purple-500" />
    case "archive":
      return <Archive className="w-5 h-5 text-amber-500" />
    default:
      return <File className="w-5 h-5 text-gray-500" />
  }
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileAsset[]>([])
  const [selectedType, setSelectedType] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadSource, setUploadSource] = useState<"LOCAL" | "GOOGLE_DRIVE">("LOCAL")
  const [newFileName, setNewFileName] = useState("")
  const [newFileSize, setNewFileSize] = useState("1.8 MB")
  const [newFileType, setNewFileType] = useState("pdf")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/files")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.files) {
          setFiles(d.files)
        }
      })
      .catch(console.error)
  }, [])

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFileName.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFileName.trim(),
          size: newFileSize,
          type: newFileType,
          source: uploadSource,
          url: uploadSource === "GOOGLE_DRIVE" ? `https://drive.google.com/file/${Math.random().toString(36).substring(7)}` : `/files/${newFileName.trim()}`,
        }),
      })

      const data = await res.json()
      if (data.success && data.file) {
        setFiles(prev => [data.file, ...prev])
        setNewFileName("")
        setShowUploadModal(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteFile = async (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    try {
      await fetch(`/api/files/${id}`, { method: "DELETE" })
    } catch (err) {
      console.error(err)
    }
  }

  const filteredFiles = files.filter(f => {
    const matchType = selectedType === "All" || f.type.toLowerCase() === selectedType.toLowerCase()
    const matchQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchType && matchQuery
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              File &amp; Document Storage Hub
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Local workspace assets, revision study materials, and Google Drive synchronized files.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Storage Gauge Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white border border-indigo-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <HardDrive className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <p className="text-base font-bold">19.3 MB Used of 15.0 GB Free Workspace Storage</p>
            <p className="text-xs text-indigo-200">Zero cloud storage charges · Connect Google Drive for unlimited external files</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-xl">
            0.13% Quota Used
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {TYPE_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedType === t
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {t === "All" ? "All Files" : `${t.toUpperCase()}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search documents by name..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* File Assets Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between card-interactive group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {file.type} · {file.size}
                      </span>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {file.source === "GOOGLE_DRIVE" ? "Google Drive Sync" : "Local Workspace"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate" title={file.name}>
                  {file.name}
                </h3>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-400 text-[11px]">
                  {file.createdAt ? file.createdAt.split("T")[0] : "Recently"}
                </span>

                {file.url && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Open Asset</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
          <FolderKanban className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No matching files found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Upload revision PDFs, study blueprints, or link documents from your Google Drive.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
          >
            Upload first document
          </button>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Store or Link Asset</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFile} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Source</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadSource("LOCAL")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      uploadSource === "LOCAL"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    Local Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadSource("GOOGLE_DRIVE")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      uploadSource === "GOOGLE_DRIVE"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    Google Drive Link
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Document Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  placeholder="e.g. Distributed_Systems_Revision.pdf"
                  required
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">File Type</label>
                  <select
                    value={newFileType}
                    onChange={e => setNewFileType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="doc">Word / Doc</option>
                    <option value="image">Image Asset</option>
                    <option value="code">Source Code</option>
                    <option value="archive">ZIP Archive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Estimated Size</label>
                  <input
                    type="text"
                    value={newFileSize}
                    onChange={e => setNewFileSize(e.target.value)}
                    placeholder="e.g. 2.4 MB"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save to Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
