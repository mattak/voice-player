"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock } from "lucide-react"

interface TranscriptionItem {
  time: string
  text: string
}

interface TranscriptionTimelineProps {
  data: TranscriptionItem[]
  onTimeClick: (time: string) => void
  currentTime: number
}

export function TranscriptionTimeline({ data, onTimeClick, currentTime }: TranscriptionTimelineProps) {
  // Convert time string like "1:05" to seconds
  const timeToSeconds = (timeStr: string): number => {
    const [mins, secs] = timeStr.split(":").map(Number)
    return mins * 60 + secs
  }

  // Check if this item is currently playing
  const isCurrentItem = (item: TranscriptionItem): boolean => {
    const itemSeconds = timeToSeconds(item.time)
    const nextItemSeconds = data[data.indexOf(item) + 1]
      ? timeToSeconds(data[data.indexOf(item) + 1].time)
      : Number.POSITIVE_INFINITY

    return currentTime >= itemSeconds && currentTime < nextItemSeconds
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="font-medium text-gray-900 dark:text-gray-100">音声テキスト</h3>
      </div>

      <ScrollArea className="h-[calc(100vh-350px)] pr-4">
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className={`flex space-x-3 group p-2 rounded-lg -m-2 cursor-pointer transition-colors ${
                isCurrentItem(item)
                  ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 pl-3 -ml-5"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => onTimeClick(item.time)}
            >
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center justify-center w-12 h-6 text-xs font-medium rounded-full ${
                    isCurrentItem(item)
                      ? "text-white bg-purple-600 dark:bg-purple-500"
                      : "text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900"
                  }`}
                >
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
    </div>
  )
}
