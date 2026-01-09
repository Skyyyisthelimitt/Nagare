'use client'

import { useState, useEffect } from 'react'
import { IconSettings } from '@tabler/icons-react'

export default function FocusTimer() {
  const [duration, setDuration] = useState(25) // minutes (kept for settings, not used for timer)
  const [elapsedTime, setElapsedTime] = useState(0) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused])

  const startTimer = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const resumeTimer = () => {
    setIsPaused(false)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setElapsedTime(0)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setElapsedTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {/* Timer Display - Centered and Bigger */}
      <div className="mb-12 text-center">
        <span className="text-[16rem] font-sans font-bold tracking-tight">{formatTime(elapsedTime)}</span>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-sans">Settings</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 font-sans">
                Duration (minutes):
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-black dark:text-white font-sans"
                min="1"
                max="60"
              />
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-6 py-2 rounded font-semibold transition-colors text-white font-sans"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-4 items-center">
        {!isRunning && !isPaused ? (
          <>
            <button
              onClick={startTimer}
              className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-6 py-2 rounded font-semibold transition-colors text-white font-sans"
            >
              Start
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2 rounded font-semibold transition-colors text-white font-sans flex items-center gap-2"
            >
              <IconSettings className="h-5 w-5" />
              Settings
            </button>
          </>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={resumeTimer}
                className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 px-6 py-2 rounded font-semibold transition-colors text-white font-sans"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 px-6 py-2 rounded font-semibold transition-colors text-white font-sans"
              >
                Pause
              </button>
            )}
            <button
              onClick={stopTimer}
              className="bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 px-6 py-2 rounded font-semibold transition-colors text-white font-sans"
            >
              Stop
            </button>
            <button
              onClick={resetTimer}
              className="bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2 rounded font-semibold transition-colors text-white font-sans"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  )
}