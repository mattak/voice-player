"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  FileAudio,
  Clock,
  Download,
  Settings,
  History,
  Info,
} from "lucide-react"

export default function VoiceTranscriptionApp() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(125) // 2:05 in seconds
  const [duration] = useState(300) // 5:00 in seconds
  const [hasFile, setHasFile] = useState(true) // Demo state
  const [volume, setVolume] = useState(80)

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
    { time: "2:45", text: "最後に、検索アルゴリズムを改良し、より正確な結果を提供します。" },
    { time: "3:02", text: "これらの改善により、ユーザー満足度が向上すると予想されます。" },
    { time: "3:18", text: "実装スケジュールとしては、まず最初にパフォーマンス最適化から着手します。" },
    { time: "3:35", text: "その後、UIデザインの改善を行い、最後に検索機能の強化を実施します。" },
    { time: "3:52", text: "全体のスケジュールとしては、約3ヶ月での完了を目指しています。" },
    { time: "4:10", text: "質問やコメントがあれば、お気軽にお聞かせください。" },
    { time: "4:25", text: "ご清聴ありがとうございました。" },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (currentTime / duration) * 100

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setHasFile(true)
    }
  }

  const handleTimeClick = (timeStr: string) => {
    // Convert time string like "1:05" to seconds
    const [mins, secs] = timeStr.split(":").map(Number)
    const newTime = mins * 60 + secs
    setCurrentTime(newTime)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileAudio className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Voice Transcriber</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <History className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload and Player */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  音声ファイル
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasFile ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                      音声ファイルをアップロード
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">m4a, mp3, wav ファイルに対応</p>
                    <div className="flex justify-center">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".m4a,.mp3,.wav"
                          onChange={handleFileChange}
                        />
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">ファイルを選択</Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <FileAudio className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">meeting_recording.m4a</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">5:00 • 2.3 MB</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      保存
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audio Player */}
            {hasFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Volume2 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    音声プレーヤー
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number.parseInt(e.target.value))}
                      className="flex-1 h-2 appearance-none bg-gray-200 dark:bg-gray-700 rounded-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Transcription */}
          <div className="lg:col-span-2">
            {hasFile && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    音声テキスト
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="timeline" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="timeline">タイムライン</TabsTrigger>
                      <TabsTrigger value="fulltext">全文</TabsTrigger>
                    </TabsList>
                    <TabsContent value="timeline">
                      <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                        <div className="space-y-4">
                          {transcriptionData.map((item, index) => (
                            <div
                              key={index}
                              className="flex space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg -m-2 cursor-pointer transition-colors"
                              onClick={() => handleTimeClick(item.time)}
                            >
                              <div className="flex-shrink-0">
                                <span className="inline-flex items-center justify-center w-12 h-6 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 rounded-full">
                                  {item.time}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{item.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="fulltext">
                      <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                        <div className="space-y-4">
                          {transcriptionData.map((item, index) => (
                            <p key={index} className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                              {item.text}
                            </p>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Voice Transcriber. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="link" size="sm" className="text-gray-500 dark:text-gray-400">
                プライバシーポリシー
              </Button>
              <Button variant="link" size="sm" className="text-gray-500 dark:text-gray-400">
                利用規約
              </Button>
              <Button variant="link" size="sm" className="text-gray-500 dark:text-gray-400">
                お問い合わせ
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
