'use client'

import { useState } from 'react'
import { Clock, CheckSquare, Music } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'focus' | 'task' | 'music'>('focus')

  const navItems = [
    {
      name: "Focus",
      icon: <Clock className="h-4 w-4 text-black dark:text-white" />,
      onClick: () => setActiveTab('focus'),
      active: activeTab === 'focus',
    },
    {
      name: "Task",
      icon: <CheckSquare className="h-4 w-4 text-black dark:text-white" />,
      onClick: () => setActiveTab('task'),
      active: activeTab === 'task',
    },
    {
      name: "Music",
      icon: <Music className="h-4 w-4 text-black dark:text-white" />,
      onClick: () => setActiveTab('music'),
      active: activeTab === 'music',
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-in-200 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to Nagare
        </p>
      </div>
    </main>
  )
}