'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Focus Timer</h1>
      
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          min="1"
          max="60"
        />
      </div>

      <div className="relative mb-8">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="gray"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            stroke="#3b82f6"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.5 }}
            style={{
              strokeDasharray: `${2 * Math.PI * 90}`,
              strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded font-semibold"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  )
}