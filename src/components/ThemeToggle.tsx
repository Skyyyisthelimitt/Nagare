'use client'

import { useEffect, useState } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  // Sync with global theme system

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme')
    const isDarkMode = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = (value: boolean) => {
    setIsDark(value)
    if (value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Prevent hydration mismatch by returning empty or basic placeholder until mounted
  // But for a toggle, it's better to render something. 
  // We'll render the structure but without the motion animations initially if needed, 
  // or just render as is; client component will hydrate.
  if (!mounted) {
    return (
        <div className="w-[92px] h-[52px] bg-white dark:bg-black border-4 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
    )
  }

  return (
    <div className="flex items-center bg-white dark:bg-black p-1 rounded-xl gap-1 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
      <button
        onClick={() => toggleTheme(false)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white"
        aria-label="Light Mode"
      >
        {!isDark && (
          <motion.div
            layoutId="theme-active"
            className="absolute inset-0 bg-black dark:bg-white rounded-lg"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center">
          <IconSun 
            className={`w-6 h-6 transition-colors duration-200 ${!isDark ? 'text-white dark:text-black' : 'text-neutral-400'}`} 
            strokeWidth={2.5}
          />
        </span>
      </button>

      <button
        onClick={() => toggleTheme(true)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white"
        aria-label="Dark Mode"
      >
        {isDark && (
          <motion.div
            layoutId="theme-active"
            className="absolute inset-0 bg-black dark:bg-white rounded-lg"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center">
          <IconMoon 
            className={`w-6 h-6 transition-colors duration-200 ${isDark ? 'text-white dark:text-black' : 'text-neutral-400'}`} 
            strokeWidth={2.5}
          />
        </span>
      </button>
    </div>
  )
}
