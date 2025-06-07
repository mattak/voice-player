"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Play, Pause, SkipBack, SkipForward, Volume2, FileAudio, Clock, X } from "lucide-react"

interface TranscriptionItem {
  start: number
  end: number
  label: string
}

export default function VoicePlayer() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [transcriptionFile, setTranscriptionFile] = useState<File | null>(null)
  const [customTranscriptionData, setCustomTranscriptionData] = useState<TranscriptionItem[]>([])
  const [useCustomTranscription, setUseCustomTranscription] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jsonInputRef = useRef<HTMLInputElement>(null)

  // Sample transcription data (in real app, this would come from speech recognition)
  const [sampleTranscriptionData] = useState<{ time: string; text: string; seconds: number }[]>([
    { time: "0:00", text: "音声ファイルがアップロードされました。", seconds: 0 },
    { time: "0:05", text: "再生ボタンを押すと音声が開始されます。", seconds: 5 },
    { time: "0:10", text: "タイムライン上の時間をクリックすると、その位置にジャンプできます。", seconds: 10 },
    { time: "0:15", text: "音量調整も可能です。", seconds: 15 },
    { time: "0:20", text: "実際の音声認識機能を追加することで、自動的にテキスト化できます。", seconds: 20 },
  ])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("ファイル選択イベントが発生しました")
    const file = event.target.files?.[0]

    if (!file) {
      console.log("ファイルが選択されていません")
      return
    }

    console.log("選択されたファイル:", file.name, file.type, file.size)

    if (file.type.startsWith("audio/") || file.name.toLowerCase().match(/\.(mp3|m4a|wav|ogg)$/)) {
      console.log("有効な音声ファイルです")
      setIsLoading(true)
      setAudioFile(file)

      // Create object URL for the audio file
      const url = URL.createObjectURL(file)
      console.log("Object URL作成:", url)
      setAudioUrl(url)

      // Reset player state
      setCurrentTime(0)
      setIsPlaying(false)
      setIsLoading(false)
      console.log("ファイル読み込み完了")
    } else {
      console.error("無効なファイル形式:", file.type)
      alert(`無効なファイル形式です: ${file.type}\n音声ファイルを選択してください（mp3, m4a, wav, ogg など）`)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("ドラッグイベント:", e.type)

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
    console.log("ファイルドロップイベント")

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      console.log("ドロップされたファイル:", file.name, file.type)

      if (file.type.startsWith("audio/") || file.name.toLowerCase().match(/\.(mp3|m4a|wav|ogg)$/)) {
        setIsLoading(true)
        setAudioFile(file)
        const url = URL.createObjectURL(file)
        setAudioUrl(url)
        setCurrentTime(0)
        setIsPlaying(false)
        setIsLoading(false)
      } else {
        alert(`無効なファイル形式です: ${file.type}\n音声ファイルを選択してください`)
      }
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const handlePlaybackRateSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rate = Number.parseFloat(event.target.value)
    handlePlaybackRateChange(rate)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      audioRef.current.playbackRate = playbackRate
    }
  }

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const newTime = (clickX / rect.width) * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 10)
    }
  }

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 10)
    }
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseInt(event.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleTranscriptionUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("JSONファイル選択イベントが発生しました")
    const file = event.target.files?.[0]

    if (!file) {
      console.log("JSONファイルが選択されていません")
      return
    }

    console.log("選択されたJSONファイル:", file.name, file.type, file.size)

    if (file.type !== "application/json" && !file.name.toLowerCase().endsWith(".json")) {
      console.error("無効なファイル形式:", file.type)
      alert("JSONファイルを選択してください")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        console.log("JSONファイル読み込み開始")
        const jsonData = JSON.parse(e.target?.result as string)
        console.log("JSON解析完了:", jsonData)

        if (Array.isArray(jsonData) && jsonData.length > 0) {
          // Validate JSON structure
          const isValidFormat = jsonData.every(
            (item) => typeof item.start === "number" && typeof item.end === "number" && typeof item.label === "string",
          )

          if (isValidFormat) {
            setCustomTranscriptionData(jsonData)
            setTranscriptionFile(file)
            setUseCustomTranscription(true)
            console.log("JSONファイル読み込み完了:", jsonData.length, "項目")
          } else {
            console.error("JSONフォーマットエラー: start, end, labelフィールドが必要です")
            alert("JSONファイルの形式が正しくありません。start, end, labelフィールドが必要です。")
          }
        } else {
          console.error("JSONデータエラー: 配列ではないか空です")
          alert("有効なJSONデータが見つかりません")
        }
      } catch (error) {
        console.error("JSON解析エラー:", error)
        alert("JSONファイルの解析に失敗しました")
      }
    }

    reader.onerror = (error) => {
      console.error("ファイル読み込みエラー:", error)
      alert("ファイルの読み込みに失敗しました")
    }

    console.log("ファイル読み込み開始")
    reader.readAsText(file)
  }

  const removeTranscriptionFile = () => {
    setTranscriptionFile(null)
    setCustomTranscriptionData([])
    setUseCustomTranscription(false)
  }

  const formatTimeFromSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCurrentTranscriptionItem = () => {
    const data = useCustomTranscription ? customTranscriptionData : sampleTranscriptionData
    return data.find((item) => {
      if (useCustomTranscription) {
        return currentTime >= item.start && currentTime < item.end
      } else {
        return (
          currentTime >= item.seconds &&
          (data[data.indexOf(item) + 1] ? currentTime < data[data.indexOf(item) + 1].seconds : true)
        )
      }
    })
  }

  const handleTimeClick = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const removeFile = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioFile(null)
    setAudioUrl("")
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileAudio className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Voice Player</h1>
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
                {!audioFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                      音声ファイルをアップロード
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      ファイルをドラッグ&ドロップするか、下のボタンをクリック
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">対応形式: mp3, m4a, wav, ogg</p>
                    <div className="flex justify-center">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <input
                          ref={fileInputRef}
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="audio/*,.m4a,.mp3,.wav,.ogg,.aac,.flac"
                          onChange={handleFileUpload}
                          disabled={isLoading}
                          onClick={(e) => {
                            console.log("ファイル入力がクリックされました")
                            // Reset the input value to allow selecting the same file again
                            e.currentTarget.value = ""
                          }}
                        />
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={isLoading}
                          onClick={() => {
                            console.log("アップロードボタンがクリックされました")
                            fileInputRef.current?.click()
                          }}
                        >
                          {isLoading ? "読み込み中..." : "ファイルを選択"}
                        </Button>
                      </label>
                    </div>
                    {dragActive && (
                      <div className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                        ファイルをここにドロップしてください
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <FileAudio className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{audioFile.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {duration > 0 ? formatTime(duration) : "読み込み中..."} •{" "}
                          {(audioFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeFile}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* JSON Transcription Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileAudio className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  書き起こしJSON
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!transcriptionFile ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    <div className="w-10 h-10 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      書き起こしJSONファイル
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      start, end, labelフィールドを含むJSON
                    </p>
                    <div className="flex justify-center">
                      <label htmlFor="json-upload" className="cursor-pointer">
                        <input
                          ref={jsonInputRef}
                          id="json-upload"
                          name="json-upload"
                          type="file"
                          className="sr-only"
                          accept=".json,application/json"
                          onChange={handleTranscriptionUpload}
                          onClick={(e) => {
                            console.log("JSONファイル入力がクリックされました")
                            // Reset the input value to allow selecting the same file again
                            e.currentTarget.value = ""
                          }}
                        />
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            console.log("JSONアップロードボタンがクリックされました")
                            jsonInputRef.current?.click()
                          }}
                        >
                          JSONを選択
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <FileAudio className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {transcriptionFile.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {customTranscriptionData.length}項目 • {(transcriptionFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeTranscriptionFile}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audio Player */}
            {audioFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Volume2 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    音声プレーヤー
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Hidden Audio Element */}
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    preload="metadata"
                  />

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="h-2 bg-purple-600 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 dark:text-gray-300 flex flex-col items-center"
                      onClick={handleSkipBack}
                      disabled={!audioFile}
                    >
                      <SkipBack className="w-4 h-4" />
                      <span className="text-xs mt-1">-10s</span>
                    </Button>
                    <Button
                      size="icon"
                      className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
                      onClick={handlePlayPause}
                      disabled={!audioFile || duration === 0}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 dark:text-gray-300 flex flex-col items-center"
                      onClick={handleSkipForward}
                      disabled={!audioFile}
                    >
                      <SkipForward className="w-4 h-4" />
                      <span className="text-xs mt-1">+10s</span>
                    </Button>
                  </div>

                  {/* Additional Skip Controls */}
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = Math.max(0, currentTime - 5)
                        }
                      }}
                      disabled={!audioFile}
                    >
                      -5s
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = Math.max(0, currentTime - 30)
                        }
                      }}
                      disabled={!audioFile}
                    >
                      -30s
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = Math.min(duration, currentTime + 30)
                        }
                      }}
                      disabled={!audioFile}
                    >
                      +30s
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = Math.min(duration, currentTime + 5)
                        }
                      }}
                      disabled={!audioFile}
                    >
                      +5s
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
                      onChange={handleVolumeChange}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{volume}%</span>
                  </div>

                  {/* Playback Speed Control */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">再生速度</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{playbackRate}x</span>
                    </div>

                    {/* Speed Buttons */}
                    <div className="grid grid-cols-4 gap-1">
                      {[0.5, 1, 1.5, 2].map((rate) => (
                        <Button
                          key={rate}
                          variant={playbackRate === rate ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${
                            playbackRate === rate
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handlePlaybackRateChange(rate)}
                        >
                          {rate}x
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      {[3, 4, 8].map((rate) => (
                        <Button
                          key={rate}
                          variant={playbackRate === rate ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${
                            playbackRate === rate
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => handlePlaybackRateChange(rate)}
                        >
                          {rate}x
                        </Button>
                      ))}
                    </div>

                    {/* Speed Slider */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">0.5x</span>
                      <input
                        type="range"
                        min="0.5"
                        max="8"
                        step="0.1"
                        value={playbackRate}
                        onChange={handlePlaybackRateSliderChange}
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">8x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Transcription */}
          <div className="lg:col-span-2">
            {audioFile && (
              <Card className="h-[calc(100vh-120px)]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    音声テキスト{useCustomTranscription ? "" : "（サンプル）"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!useCustomTranscription && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>注意:</strong>{" "}
                        これはサンプルテキストです。書き起こしJSONファイルをアップロードすると、実際のデータが表示されます。
                      </p>
                    </div>
                  )}

                  <ScrollArea className="h-[calc(100vh-280px)] lg:h-[calc(100vh-260px)] pr-4">
                    <div className="space-y-4">
                      {(useCustomTranscription ? customTranscriptionData : sampleTranscriptionData).map(
                        (item, index) => {
                          const isCurrentItem = getCurrentTranscriptionItem() === item
                          const displayTime = useCustomTranscription ? formatTimeFromSeconds(item.start) : item.time
                          const displayText = useCustomTranscription ? item.label : item.text
                          const clickTime = useCustomTranscription ? item.start : (item as any).seconds

                          // 句点で文章を分割して改行表示
                          const formatTextWithLineBreaks = (text: string) => {
                            return text
                              .split("。")
                              .filter((sentence) => sentence.trim().length > 0)
                              .map((sentence, idx, array) => (
                                <span key={idx}>
                                  {sentence.trim()}
                                  {idx < array.length - 1 && "。"}
                                  {idx < array.length - 1 && <br />}
                                  {idx === array.length - 1 && text.endsWith("。") && "。"}
                                </span>
                              ))
                          }

                          return (
                            <div
                              key={index}
                              className={`flex space-x-3 group p-2 rounded-lg -m-2 cursor-pointer transition-colors ${
                                isCurrentItem
                                  ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 pl-3 -ml-5"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                              onClick={() => handleTimeClick(clickTime)}
                            >
                              <div className="flex-shrink-0">
                                <span
                                  className={`inline-flex items-center justify-center w-12 h-6 text-xs font-medium rounded-full ${
                                    isCurrentItem
                                      ? "text-white bg-purple-600 dark:bg-purple-500"
                                      : "text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900"
                                  }`}
                                >
                                  {displayTime}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                  {formatTextWithLineBreaks(displayText)}
                                </p>
                              </div>
                            </div>
                          )
                        },
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="container mx-auto px-4 mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          <p>デバッグ情報:</p>
          <p>音声ファイル: {audioFile?.name || "なし"}</p>
          <p>音声URL: {audioUrl ? "作成済み" : "なし"}</p>
          <p>
            再生時間: {formatTime(currentTime)} / {formatTime(duration)}
          </p>
          <p>再生中: {isPlaying ? "はい" : "いいえ"}</p>
          <p>書き起こしファイル: {transcriptionFile?.name || "なし"}</p>
          <p>書き起こしデータ: {customTranscriptionData.length}項目</p>
          <p>カスタム書き起こし使用: {useCustomTranscription ? "はい" : "いいえ"}</p>
          <p>再生速度: {playbackRate}x</p>
        </div>
      )}
    </div>
  )
}
