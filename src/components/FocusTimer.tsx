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
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
          <div 
            className="bg-white dark:bg-black border-4 border-black dark:border-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]" 
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-4xl font-black mb-8 text-black dark:text-white uppercase tracking-tight text-center">Settings</h2>
            <div className="mb-8">
              <label className="block text-lg font-black uppercase tracking-wide mb-3 text-black dark:text-white">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-white dark:bg-black text-black dark:text-white border-4 border-black dark:border-white rounded-lg px-4 py-3 text-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
                min="1"
                max="60"
              />
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full group relative px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-black text-2xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-6 items-center">
        {!isRunning && !isPaused ? (
          <>
            <button
              onClick={startTimer}
              className="group relative px-8 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-2xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Start
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="group relative px-8 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-2xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              <IconSettings className="h-7 w-7" stroke={2.5} />
              Settings
            </button>
          </>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={resumeTimer}
                className="group relative px-8 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-2xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="group relative px-8 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-2xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              >
                Pause
              </button>
            )}
            <button
              onClick={stopTimer}
              className="group relative px-8 py-3 bg-red-500 text-white font-black text-2xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Stop
            </button>
            <button
              onClick={resetTimer}
              className="group relative px-8 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-2xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  )
}