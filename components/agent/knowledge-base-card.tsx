'use client'

import * as React from 'react'
import { UploadIcon, FileTextIcon, TrashIcon, Loader2Icon } from 'lucide-react'
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

export function KnowledgeBaseCard() {
  const [files, setFiles] = React.useState<KnowledgeFile[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

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

    const newFiles: KnowledgeFile[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      
      // Read file content
      const content = await file.text()
      
      // Upload to API
      try {
        const response = await fetch('/api/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            content: content,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          newFiles.push({
            id: data.id || crypto.randomUUID(),
            name: file.name,
            uploadedAt: new Date().toLocaleDateString(),
            size: formatFileSize(file.size),
          })
        }
      } catch (error) {
        console.error('Failed to upload file:', error)
      }

      setUploadProgress(((i + 1) / fileList.length) * 100)
    }

    setFiles((prev) => [...prev, ...newFiles])
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
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/knowledge?id=${id}`, { method: 'DELETE' })
      setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch (error) {
      console.error('Failed to delete file:', error)
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
          Upload documents to train your AI agent. Supported formats: .txt, .md,
          .pdf, .docx
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
            accept=".txt,.md,.pdf,.docx"
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
                Maximum file size: 10MB
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
              Uploading and processing files...
            </p>
          </div>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Documents</h4>
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
                        {file.size} • Uploaded {file.uploadedAt}
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
        )}
      </CardContent>
    </Card>
  )
}
