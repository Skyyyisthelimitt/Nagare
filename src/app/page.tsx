'use client'

import { useState } from 'react'
import { FloatingNav } from '@/components/ui/floating-navbar'
import FocusTimer from '@/components/FocusTimer'
import MusicTab from '@/components/MusicTab'
import TaskTab from '@/components/TaskTab'
import ThemeToggle from '@/components/ThemeToggle'
import { IconClock, IconMusic, IconChecklist } from '@tabler/icons-react'

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
    <div className="relative w-full min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <FloatingNav navItems={navItems} />
      
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-10 right-10 z-[5001]">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="p-6 pt-28 h-screen overflow-auto">
        {activeTab === 'focus' && <FocusTimer />}
        {activeTab === 'task' && <TaskTab />}
        {activeTab === 'music' && <MusicTab />}
      </div>
    </div>
  )
}