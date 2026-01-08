'use client'

import { useState } from 'react'
import MoodChat from './MoodChat'
import MusicPlayer from './MusicPlayer'

export default function MusicTab() {
  const [currentMood, setCurrentMood] = useState<string | null>(null)
  const [desiredMood, setDesiredMood] = useState<string | null>(null)

  const handleMoodDetected = (mood: string, desired: string) => {
    setCurrentMood(mood)
    setDesiredMood(desired)
  }

  return (
    <div className="flex h-full gap-4">
      {/* Left side: Mood Chat */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Mood Chat</h2>
        <div className="flex-1 min-h-0">
          <MoodChat onMoodDetected={handleMoodDetected} />
        </div>
      </div>

      {/* Right side: Music Player */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Music Player</h2>
        <div className="flex-1 min-h-0">
          <MusicPlayer mood={currentMood} desiredMood={desiredMood} />
        </div>
      </div>
    </div>
  )
}
