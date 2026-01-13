'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type TimerMode = 'flow' | 'pomodoro'
type PomoMode = 'focus' | 'shortBreak' | 'longBreak'

interface TimerContextType {
  elapsedTime: number
  isRunning: boolean
  isPaused: boolean
  timerMode: TimerMode
  pomoMode: PomoMode
  sessionCount: number
  pomoTime: number
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  setTimerMode: (mode: TimerMode) => void
  setPomoMode: (mode: PomoMode) => void
  setFocusDuration: (duration: number) => void
  setShortBreakDuration: (duration: number) => void
  setLongBreakDuration: (duration: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  switchPomoMode: (mode: PomoMode) => void
  setIsRunning: (isRunning: boolean) => void
  setPomoTime: (pomoTime: number) => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timerMode, setTimerMode] = useState<TimerMode>('flow')
  const [pomoMode, setPomoMode] = useState<PomoMode>('focus')
  const [sessionCount, setSessionCount] = useState(1)
  const [focusDuration, setFocusDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [pomoTime, setPomoTime] = useState(25 * 60)

  // Load settings from localStorage
  useEffect(() => {
    const savedFocus = localStorage.getItem('focusDuration')
    const savedShort = localStorage.getItem('shortBreakDuration')
    const savedLong = localStorage.getItem('longBreakDuration')
    
    if (savedFocus) setFocusDuration(parseInt(savedFocus))
    if (savedShort) setShortBreakDuration(parseInt(savedShort))
    if (savedLong) setLongBreakDuration(parseInt(savedLong))
  }, [])

  // Update pomoTime when durations change if not running
  useEffect(() => {
    if (!isRunning) {
      if (pomoMode === 'focus') setPomoTime(focusDuration * 60)
      else if (pomoMode === 'shortBreak') setPomoTime(shortBreakDuration * 60)
      else if (pomoMode === 'longBreak') setPomoTime(longBreakDuration * 60)
    }
  }, [focusDuration, shortBreakDuration, longBreakDuration, pomoMode, isRunning])

  const switchPomoMode = useCallback((mode: PomoMode) => {
    setPomoMode(mode)
    setIsRunning(false)
    setIsPaused(false)
    if (mode === 'focus') setPomoTime(focusDuration * 60)
    else if (mode === 'shortBreak') setPomoTime(shortBreakDuration * 60)
    else if (mode === 'longBreak') setPomoTime(longBreakDuration * 60)
  }, [focusDuration, shortBreakDuration, longBreakDuration])

  const handlePhaseComplete = useCallback(() => {
    if (pomoMode === 'focus') {
      if (sessionCount % 4 === 0) {
        switchPomoMode('longBreak')
      } else {
        switchPomoMode('shortBreak')
      }
      setSessionCount(prev => prev + 1)
    } else {
      switchPomoMode('focus')
    }
  }, [pomoMode, sessionCount, switchPomoMode])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        if (timerMode === 'flow') {
          setElapsedTime((prev) => prev + 1)
        } else {
          if (pomoTime > 0) {
            setPomoTime((prev) => prev - 1)
          } else {
            setIsRunning(false)
            handlePhaseComplete()
          }
        }
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, timerMode, pomoTime, handlePhaseComplete])

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
    if (timerMode === 'flow') {
      setElapsedTime(0)
    } else {
      resetTimer()
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    if (timerMode === 'flow') {
      setElapsedTime(0)
    } else {
      if (pomoMode === 'focus') setPomoTime(focusDuration * 60)
      else if (pomoMode === 'shortBreak') setPomoTime(shortBreakDuration * 60)
      else if (pomoMode === 'longBreak') setPomoTime(longBreakDuration * 60)
    }
  }

  return (
    <TimerContext.Provider value={{
      elapsedTime,
      isRunning,
      isPaused,
      timerMode,
      pomoMode,
      sessionCount,
      pomoTime,
      focusDuration,
      shortBreakDuration,
      longBreakDuration,
      setTimerMode,
      setPomoMode,
      setFocusDuration,
      setShortBreakDuration,
      setLongBreakDuration,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      resetTimer,
      switchPomoMode,
      setIsRunning,
      setPomoTime
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}
