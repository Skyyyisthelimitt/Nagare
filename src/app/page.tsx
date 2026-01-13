'use client'

import { useState } from 'react'
import { FloatingNav } from '@/components/ui/floating-navbar'
import FocusTimer from '@/components/FocusTimer'
import MusicTab from '@/components/MusicTab'
import TaskTab from '@/components/TaskTab'
import ThemeToggle from '@/components/ThemeToggle'
import MiniPlayer from '@/components/MiniPlayer'
import MiniTimer from '@/components/MiniTimer'
import { IconClock, IconMusic, IconChecklist } from '@tabler/icons-react'
import { MusicProvider } from '@/context/MusicContext'
import { TaskProvider } from '@/context/TaskContext'
import { TimerProvider } from '@/context/TimerContext'


export default function Home() {
  const [activeTab, setActiveTab] = useState<'focus' | 'task' | 'music'>('focus')

  const navItems = [
    {
      name: "Focus",
      icon: <IconClock className="w-full h-full" />,
      onClick: () => setActiveTab('focus'),
      active: activeTab === 'focus',
    },
    {
      name: "Task",
      icon: <IconChecklist className="w-full h-full" />,
      onClick: () => setActiveTab('task'),
      active: activeTab === 'task',
    },
    {
      name: "Music",
      icon: <IconMusic className="w-full h-full" />,
      onClick: () => setActiveTab('music'),
      active: activeTab === 'music',
    },
  ]

  return (
    <MusicProvider>
      <TaskProvider>
        <TimerProvider>
          <div className="relative w-full min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
          <FloatingNav navItems={navItems} />

          {/* Header Container - Aligns Logo and Theme Toggle */}
          <div className="fixed top-8 inset-x-0 z-[5001] flex items-center justify-between px-10 pointer-events-none">
            {/* Logo */}
            <div className="pointer-events-auto">
              <div className="w-14 h-14 bg-white dark:bg-black border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-xl flex items-center justify-center">
                <span className="text-3xl font-black text-black dark:text-white select-none">N</span>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-4 pointer-events-auto">
              <MiniTimer activeTab={activeTab} />
              <ThemeToggle />
            </div>
          </div>

          {/* Floating MiniPlayer - Bottom Right */}
          {activeTab !== 'music' && (
            <div className="fixed bottom-10 right-8 z-[5001] pointer-events-none">
              <MiniPlayer />
            </div>
          )}

          {/* Attribution Badge - Bottom Left */}
          <div className="fixed bottom-10 left-8 z-[5001] pointer-events-auto">
            <a 
              href="https://www.tiktok.com/@skyweb3dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-white dark:bg-black border-4 border-black dark:border-white px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_2px_rgba(255,255,255,1)] transition-all duration-200"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                © 2026 NAGARE — MADE BY <span className="text-blue-600 dark:text-blue-400 group-hover:underline">SKYWEB3DEV</span>
              </span>
            </a>
          </div>

          {/* Content */}
          <div className="p-6 pt-28 h-screen overflow-auto">
            {activeTab === 'focus' && <FocusTimer />}
            {activeTab === 'task' && <TaskTab />}
            {activeTab === 'music' && <MusicTab />}
          </div>
        </div>
      </TimerProvider>
    </TaskProvider>
    </MusicProvider>
  )
}