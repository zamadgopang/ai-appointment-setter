'use client'

import * as React from 'react'
import { UploadIcon, FileTextIcon, TrashIcon, Loader2Icon, AlertCircleIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type KnowledgeFile = {
  id: string
  name: string
  uploadedAt: string
  size: string
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export function KnowledgeBaseCard() {
  const [files, setFiles] = React.useState<KnowledgeFile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [dragActive, setDragActive] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Load existing files from the API on mount
  React.useEffect(() => {
    async function loadFiles() {
      try {
        const res = await fetch('/api/knowledge')
        if (!res.ok) throw new Error('Failed to load documents')
        const data = await res.json()
        setFiles(
          (data.documents ?? []).map(
            (doc: { id: string; file_name: string; file_size: number | null; created_at: string }) => ({
              id: doc.id,
              name: doc.file_name,
              uploadedAt: new Date(doc.created_at).toLocaleDateString(),
              size: doc.file_size ? formatFileSize(doc.file_size) : '—',
            })
          )
        )
      } catch {
        setErrorMessage('Could not load existing documents.')
      } finally {
        setIsLoading(false)
      }
    }
    loadFiles()
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const processFiles = async (fileList: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)
    setErrorMessage(null)

    const newFiles: KnowledgeFile[] = []
    const errors: string[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]

      // Validate file size before reading
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`"${file.name}" exceeds 5 MB limit.`)
        setUploadProgress(((i + 1) / fileList.length) * 100)
        continue
      }

      // Only read text-based files (txt, md)
      const lowerName = file.name.toLowerCase()
      if (!lowerName.endsWith('.txt') && !lowerName.endsWith('.md')) {
        errors.push(`"${file.name}" is not a supported format (.txt or .md).`)
        setUploadProgress(((i + 1) / fileList.length) * 100)
        continue
      }

      try {
        const content = await file.text()

        const response = await fetch('/api/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            content,
            fileSize: file.size,
            fileType: file.type || 'text/plain',
          }),
        })

        if (response.ok) {
          const data = await response.json()
          newFiles.push({
            id: data.document?.id ?? crypto.randomUUID(),
            name: file.name,
            uploadedAt: new Date().toLocaleDateString(),
            size: formatFileSize(file.size),
          })
        } else {
          const errData = await response.json().catch(() => ({}))
          errors.push(`"${file.name}": ${errData.error ?? 'Upload failed.'}`)
        }
      } catch {
        errors.push(`"${file.name}": Unexpected error during upload.`)
      }

      setUploadProgress(((i + 1) / fileList.length) * 100)
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles])
    }
    if (errors.length > 0) {
      setErrorMessage(errors.join(' '))
    }

    setIsUploading(false)
    setUploadProgress(0)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files)
      // Reset so the same file can be re-selected
      e.target.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        setErrorMessage(errData.error ?? 'Failed to delete document.')
        return
      }
      setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch {
      setErrorMessage('Failed to delete document. Please try again.')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>
          Upload plain-text documents to train your AI agent. Supported formats: .txt, .md (max 5 MB each)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircleIcon className="size-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
            <button
              className="ml-auto shrink-0 opacity-70 hover:opacity-100"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Zone */}
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".txt,.md"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <UploadIcon className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground">
                .txt and .md files only · Maximum 5 MB per file
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Select Files'
              )}
            </Button>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-muted-foreground text-center">
              Uploading and processing files…
            </p>
          </div>
        )}

        {/* Uploaded Files */}
        {isLoading ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <Loader2Icon className="mr-2 size-4 animate-spin" />
            Loading documents…
          </div>
        ) : files.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Documents ({files.length})</h4>
            <div className="divide-y divide-border rounded-lg border">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <FileTextIcon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.size} · Uploaded {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(file.id)}
                  >
                    <TrashIcon className="size-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-2">
            No documents uploaded yet. Upload .txt or .md files to get started.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
