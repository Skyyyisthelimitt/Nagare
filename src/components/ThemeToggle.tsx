'use client'

import { useEffect, useState } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check if dark mode is set
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  useEffect(() => {
    // Load theme preference from localStorage on mount
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center w-16 h-8 rounded-full border-2 transition-all focus:outline-none ${
        isDark ? 'bg-white border-white' : 'bg-black border-black'
      }`}
    >
      {/* Knob with icon */}
      <span
        className={`absolute h-6 w-6 bg-gray-600 rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-1' : 'translate-x-9'
        }`}
      >
        {isDark ? (
          <IconMoon className="h-4 w-4 text-white" />
        ) : (
          <IconSun className="h-4 w-4 text-yellow-400" />
        )}
      </span>
    </button>
  )
}
