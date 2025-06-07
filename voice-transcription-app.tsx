"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Play, Pause, SkipBack, SkipForward, Volume2, FileAudio, Clock, Download } from "lucide-react"

export default function Component() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(125) // 2:05 in seconds
  const [duration] = useState(300) // 5:00 in seconds
  const [hasFile, setHasFile] = useState(true) // Demo state

  // Sample transcription data
  const transcriptionData = [
    { time: "0:00", text: "こんにちは、今日は新しいプロジェクトについてお話しします。" },
    { time: "0:15", text: "このプロジェクトの目標は、ユーザーエクスペリエンスを向上させることです。" },
    { time: "0:32", text: "まず最初に、現在の課題について分析してみましょう。" },
    { time: "0:48", text: "ユーザーからのフィードバックを見ると、主に3つの問題があります。" },
    { time: "1:05", text: "一つ目は、アプリの起動時間が長いということです。" },
    { time: "1:22", text: "二つ目は、ナビゲーションが分かりにくいという声が多いです。" },
    { time: "1:38", text: "三つ目は、検索機能の精度が低いという指摘があります。" },
    { time: "1:55", text: "これらの問題を解決するために、以下の改善案を提案します。" },
    { time: "2:12", text: "まず、パフォーマンスの最適化を行い、起動時間を短縮します。" },
    { time: "2:28", text: "次に、UIデザインを見直し、より直感的なナビゲーションを実装します。" },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (currentTime / duration) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-lg font-semibold text-gray-900">Voice Transcriber</h1>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* File Upload Section */}
        {!hasFile ? (
          <Card className="border-2 border-dashed border-gray-300 bg-white">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">音声ファイルをアップロード</h3>
              <p className="text-sm text-gray-500 mb-4">m4a, mp3, wav ファイルに対応</p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">ファイルを選択</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Audio File Info */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileAudio className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">meeting_recording.m4a</h3>
                    <p className="text-sm text-gray-500">5:00 • 2.3 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Player */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transcription Timeline */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium text-gray-900">音声テキスト</h3>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {transcriptionData.map((item, index) => (
                      <div
                        key={index}
                        className="flex space-x-3 group hover:bg-gray-50 p-2 rounded-lg -m-2 cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center w-12 h-6 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                            {item.time}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
