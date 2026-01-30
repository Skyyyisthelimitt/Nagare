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

  /* Desktop Navigation Items */
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

  /* Mobile Navigation Items */
  const mobileNavItems = [
    { id: 'focus' as const, label: 'Focus', icon: IconClock },
    { id: 'task' as const, label: 'Task', icon: IconChecklist },
    { id: 'music' as const, label: 'Music', icon: IconMusic },
  ]

  return (
    <MusicProvider>
      <TaskProvider>
        <TimerProvider>
          {/* Main Container */}
          <div className="relative w-full min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors font-sans">
            
            {/* =====================================================================================
                DESKTOP LAYOUT (Hidden on Mobile)
                ===================================================================================== */}
            <div className="hidden md:block w-full h-screen relative">
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


            {/* =====================================================================================
                MOBILE LAYOUT (Visible only on Mobile)
                ===================================================================================== */}
            <div className="md:hidden flex flex-col h-[100dvh] overflow-hidden bg-white dark:bg-black">
              
              {/* Mobile Header */}
              <div className="flex-none flex items-center justify-between px-4 py-3 z-50 bg-white dark:bg-black shadow-sm">
                <div className="w-10 h-10 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rounded-lg flex items-center justify-center">
                  <span className="text-xl font-black text-black dark:text-white select-none">N</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="scale-90 origin-right">
                    <MiniTimer activeTab={activeTab} />
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile Content Area */}
              <div className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-48 ${activeTab === 'focus' ? 'p-0' : 'p-4'}`}>
                {activeTab === 'focus' && (
                  <FocusTimer />
                )}
                {activeTab === 'task' && (
                  <div className="pb-4">
                    <TaskTab />
                  </div>
                )}
                {activeTab === 'music' && (
                  <div className="pb-4">
                    <MusicTab />
                  </div>
                )}
              </div>

              {/* Fixed Bottom Layout: MiniPlayer + Floating Navigation Pill */}
              <div className="fixed bottom-6 inset-x-0 z-[60] flex flex-col items-center gap-4 pointer-events-none px-6">
                
                {/* MiniPlayer (Floats above Nav) */}
                {activeTab !== 'music' && (
                  <div className="pointer-events-auto w-full max-w-[320px] flex justify-center transform scale-95 shadow-xl">
                    <MiniPlayer />
                  </div>
                )}

                {/* Navigation Pill */}
                <div className="pointer-events-auto w-full max-w-[320px]">
                  <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-4 border-black dark:border-white rounded-2xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    {mobileNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                          activeTab === item.id
                            ? 'bg-black dark:bg-white text-white dark:text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]'
                            : 'text-gray-500 dark:text-gray-400 font-bold hover:text-black dark:hover:text-white'
                        }`}
                      >
                        <item.icon 
                          size={20} 
                          stroke={activeTab === item.id ? 2.5 : 2}
                        />
                        <span className="text-xs uppercase tracking-wider">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </TimerProvider>
      </TaskProvider>
    </MusicProvider>
  )
}