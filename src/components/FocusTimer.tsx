'use client'

import { useState, useEffect, useRef } from 'react'
import { PlayIcon, Setting07Icon, PauseIcon, StopIcon, ReloadIcon, ArrowExpand01Icon, ArrowShrink01Icon } from 'hugeicons-react'
import { useMusic } from '@/context/MusicContext'
import MiniPlayer from './MiniPlayer'

export default function FocusTimer() {
  const { isPlaying } = useMusic()
  const [elapsedTime, setElapsedTime] = useState(0) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [timerMode, setTimerMode] = useState<'flow' | 'pomodoro'>('flow')
  const [pomoMode, setPomoMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus')
  const [sessionCount, setSessionCount] = useState(1)
  const [pomoTime, setPomoTime] = useState(25 * 60) // initial dummy, will be set by useEffect
  const [focusDuration, setFocusDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [currentPalette, setCurrentPalette] = useState('default')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedPalette = localStorage.getItem('palette') || 'default'
    setCurrentPalette(savedPalette)
    document.documentElement.setAttribute('data-palette', savedPalette)

    const savedFocus = localStorage.getItem('focusDuration')
    const savedShort = localStorage.getItem('shortBreakDuration')
    const savedLong = localStorage.getItem('longBreakDuration')
    
    const focus = savedFocus ? parseInt(savedFocus) : 25
    const short = savedShort ? parseInt(savedShort) : 5
    const long = savedLong ? parseInt(savedLong) : 15
    
    setFocusDuration(focus)
    setShortBreakDuration(short)
    setLongBreakDuration(long)

    // Set initial pomo time based on focus duration
    setPomoTime(focus * 60)
  }, [])

  const handlePaletteChange = (palette: string) => {
    setCurrentPalette(palette)
    localStorage.setItem('palette', palette)
    document.documentElement.setAttribute('data-palette', palette)
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isFullScreen) {
        setShowControls(true)
        return
      }
      // If mouse is in the bottom 20% of the screen
      if (e.clientY > window.innerHeight * 0.8) {
        setShowControls(true)
      } else {
        setShowControls(false)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isFullScreen])

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
            // Timer Finished
            setIsRunning(false)
            handlePhaseComplete()
          }
        }
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, timerMode, pomoTime])

  const handlePhaseComplete = () => {
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
  }

  const switchPomoMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setPomoMode(mode)
    setIsRunning(false)
    setIsPaused(false)
    if (mode === 'focus') setPomoTime(focusDuration * 60)
    else if (mode === 'shortBreak') setPomoTime(shortBreakDuration * 60)
    else if (mode === 'longBreak') setPomoTime(longBreakDuration * 60)
  }

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full relative bg-white dark:bg-black transition-all duration-1000">
      {/* Pomodoro Tabs */}
      {timerMode === 'pomodoro' && (
        <div className={`mt-8 flex gap-4 z-10 transition-all duration-500 ${isFullScreen && !showControls ? 'opacity-0 -translate-y-10' : 'opacity-100'}`}>
          {[
            { id: 'focus', label: 'Focus' },
            { id: 'shortBreak', label: 'Short Break' },
            { id: 'longBreak', label: 'Long Break' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchPomoMode(tab.id as any)}
              className={`group relative px-6 py-2 font-black uppercase tracking-tight border-4 border-black dark:border-white rounded-xl transition-all ${
                pomoMode === tab.id
                  ? 'bg-black dark:bg-white text-white dark:text-black translate-x-[-1px] translate-y-[-1px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                  : 'bg-white dark:bg-black text-black dark:text-white hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Timer Display - Occupies available space to center itself */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
        <span className={`font-sans font-bold tracking-tight leading-none text-black dark:text-white select-none transition-all duration-500 ${isFullScreen ? 'text-[24vw]' : 'text-[16rem]'}`}>
          {formatTime(timerMode === 'flow' ? elapsedTime : pomoTime)}
        </span>
        
        {timerMode === 'pomodoro' && (
          <div className={`mt-4 text-2xl font-black uppercase tracking-widest text-black/40 dark:text-white/40 transition-all duration-500 ${isFullScreen && !showControls ? 'opacity-0 scale-95' : 'opacity-100'}`}>
            Session #{sessionCount}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center z-[6000]" onClick={() => setShowSettings(false)}>
          <div 
            className="bg-white dark:bg-black border-4 border-black dark:border-white rounded-xl p-6 max-w-md w-full mx-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]" 
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-black mb-6 text-black dark:text-white uppercase tracking-tight text-center">Settings</h2>
            
            <div className="mb-4 space-y-3">
              <label className="block text-base font-black uppercase tracking-wide text-black dark:text-white text-center">
                Timer Mode
              </label>
              <div className="flex gap-4 p-1.5 border-4 border-black dark:border-white rounded-xl bg-zinc-50 dark:bg-zinc-900">
                <button
                  onClick={() => { setTimerMode('flow'); setIsRunning(false); }}
                  className={`flex-1 py-3 font-black uppercase tracking-tight rounded-lg transition-all ${
                    timerMode === 'flow'
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                      : 'text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  Flow
                </button>
                <button
                  onClick={() => { setTimerMode('pomodoro'); setIsRunning(false); }}
                  className={`flex-1 py-3 font-black uppercase tracking-tight rounded-lg transition-all ${
                    timerMode === 'pomodoro'
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                      : 'text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  Pomodoro
                </button>
              </div>
            </div>

            <div className="mb-4 p-3 border-4 border-black dark:border-white rounded-xl bg-zinc-50 dark:bg-zinc-900">
              <p className="text-[10px] font-bold text-center text-zinc-600 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
                {timerMode === 'flow' 
                  ? 'Focus timer is currently set to run indefinitely.'
                  : 'Structured sessions with focus and break intervals.'}
              </p>
            </div>

            {timerMode === 'pomodoro' && (
              <div className="mb-4 p-4 border-4 border-black dark:border-white rounded-xl bg-zinc-50 dark:bg-zinc-900">
                <label className="block text-sm font-black uppercase tracking-wide mb-4 text-black dark:text-white text-center">
                  Durations (Mins)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Focus', value: focusDuration, setter: setFocusDuration, key: 'focusDuration' },
                    { label: 'Short', value: shortBreakDuration, setter: setShortBreakDuration, key: 'shortBreakDuration' },
                    { label: 'Long', value: longBreakDuration, setter: setLongBreakDuration, key: 'longBreakDuration' },
                  ].map((d) => (
                    <div key={d.key} className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-black uppercase text-zinc-500 dark:text-zinc-400 text-center">{d.label}</span>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={d.value}
                        onChange={(e) => {
                          const val = Math.min(99, Math.max(1, parseInt(e.target.value) || 1));
                          d.setter(val);
                          localStorage.setItem(d.key, val.toString());
                          // If we are currently in this mode and not running, update the timer
                          if (!isRunning && pomoMode === (d.label.toLowerCase() === 'short' ? 'shortBreak' : d.label.toLowerCase() === 'long' ? 'longBreak' : 'focus')) {
                            setPomoTime(val * 60);
                          }
                        }}
                        className="w-full bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white font-black text-center py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-black uppercase tracking-wide mb-3 text-black dark:text-white text-center">
                Color Palette
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'default', name: 'Default', colors: ['#FFFFFF', '#000000'] },
                  { id: 'option1', name: 'Soft Slate', colors: ['#F8FAFC', '#1E293B'] },
                  { id: 'option2', name: 'Warm', colors: ['#F5F5F0', '#262626'] },
                  { id: 'option3', name: 'Nordic', colors: ['#EDF2F4', '#2B2D42'] },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePaletteChange(p.id)}
                    className={`p-2 border-2 border-black dark:border-white rounded-xl flex flex-col items-center gap-2 transition-all ${
                      currentPalette === p.id 
                      ? 'bg-blue-200 dark:bg-blue-800 translate-x-[2px] translate-y-[2px] shadow-none' 
                      : 'bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.colors[0] }} />
                      <div className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.colors[1] }} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{p.name}</span>
                  </button>
                ))}
              </div>
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

      {/* Buttons - Fixed at bottom in fullscreen, standard layout otherwise */}
      <div 
        className={`${isFullScreen ? 'absolute bottom-32' : 'pb-32'} flex space-x-6 items-center z-10 transition-all duration-500 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
        }`}
      >
        {!isRunning && !isPaused ? (
          <>
            <button
              onClick={startTimer}
              className="group relative px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              title="Start"
            >
              <PlayIcon size={24} className="text-black dark:text-white fill-current" />
              <span>Start</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="group relative px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              title="Settings"
            >
              <Setting07Icon size={24} className="text-black dark:text-white" />
              <span>Settings</span>
            </button>
            <button
              onClick={toggleFullScreen}
              className="group relative p-3 bg-white dark:bg-black text-black dark:text-white border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? <ArrowShrink01Icon size={24} /> : <ArrowExpand01Icon size={24} />}
            </button>
          </>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={resumeTimer}
                className="group relative px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                title="Resume"
              >
                <PlayIcon size={24} className="text-black dark:text-white fill-current" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="group relative px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                title="Pause"
              >
                <PauseIcon size={24} className="text-black dark:text-white fill-current" />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={stopTimer}
              className="group relative px-5 py-3 bg-red-500 text-white font-black text-xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              title="Stop"
            >
              <StopIcon size={24} className="text-white fill-current" />
              <span>Stop</span>
            </button>
            <button
              onClick={resetTimer}
              className="group relative px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              title="Reset"
            >
              <ReloadIcon size={24} className="text-black dark:text-white" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="group relative px-5 py-3 bg-white dark:bg-black text-black dark:text-white font-black text-xl uppercase tracking-wider border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              title="Settings"
            >
              <Setting07Icon size={24} className="text-black dark:text-white" />
              <span>Settings</span>
            </button>
            <button
              onClick={toggleFullScreen}
              className="group relative p-3 bg-white dark:bg-black text-black dark:text-white border-4 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? <ArrowShrink01Icon size={24} /> : <ArrowExpand01Icon size={24} />}
            </button>
          </>
        )}
      </div>

      {/* Mini Player for Fullscreen */}
      {isFullScreen && isPlaying && (
        <div className="fixed top-8 right-8 z-50">
          <MiniPlayer />
        </div>
      )}
    </div>
  )
}