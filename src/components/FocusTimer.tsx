'use client'

import { useState, useEffect } from 'react'

export default function FocusTimer() {
  const [duration, setDuration] = useState(25) // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    setTimeLeft(duration * 60)
  }, [duration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      // Play notification sound or show alert
      alert('Focus session complete!')
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, timeLeft])

  const startTimer = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(duration * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-black dark:text-white"
          min="1"
          max="60"
        />
      </div>

      <div className="mb-8 text-center">
        <span className="text-[10rem] font-mono font-bold">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex space-x-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="bg-blue-600 dark:bg-blue-500 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black px-6 py-2 rounded font-semibold transition-colors text-white"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 px-6 py-2 rounded font-semibold transition-colors text-white"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2 rounded font-semibold transition-colors text-white"
        >
          Reset
        </button>
      </div>
    </div>
  )
}