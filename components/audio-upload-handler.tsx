"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface AudioUploadHandlerProps {
  onFileUpload: (file: File) => void
}

export function AudioUploadHandler({ onFileUpload }: AudioUploadHandlerProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.includes("audio")) {
        onFileUpload(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-gray-300 dark:border-gray-600"
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
        <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">音声ファイルをアップロード</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        ファイルをドラッグ&ドロップするか、ブラウズしてください
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">対応形式: m4a, mp3, wav</p>
      <div className="flex justify-center">
        <label htmlFor="file-upload" className="cursor-pointer">
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".m4a,.mp3,.wav,audio/*"
            onChange={handleFileChange}
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">ファイルを選択</Button>
        </label>
      </div>
    </div>
  )
}
