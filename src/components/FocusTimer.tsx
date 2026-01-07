'use client'

import { useState, useEffect } from 'react'

export default function FocusTimer() {
  const [duration, setDuration] = useState(25) // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setTimeLeft(duration * 60)
  }, [duration])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <div className="absolute top-4 left-4">
        <h2 className="text-2xl font-bold">Nagare</h2>
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative transition-colors"
        >
          <div
            className={`w-5 h-5 bg-white dark:bg-gray-800 rounded-full absolute top-0.5 transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          ></div>
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8">Focus Timer</h1>
      
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Duration (minutes):</label>
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
        <span className="text-[12rem] font-sans font-bold">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex space-x-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-6 py-2 rounded font-semibold transition-colors text-white"
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