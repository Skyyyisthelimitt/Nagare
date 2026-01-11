'use client'

import { useState, useRef, useEffect } from 'react'
import { SentIcon, Message01Icon } from 'hugeicons-react'
import { analyzeMusicRequest, type MusicRequest } from '@/lib/geminiApi'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface MoodChatProps {
  onMusicRequest: (request: MusicRequest) => void
  isMinimized: boolean
  onToggleMinimize: () => void
}

export default function MoodChat({ onMusicRequest, isMinimized, onToggleMinimize }: MoodChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hey! How are you feeling today? I can help you find music based on your mood, or search for genres, artists, trending songs, and more! 🎵" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    const userInput = input
    setInput('')
    setIsTyping(true)

    try {
      // Use AI to analyze the request
      const musicRequest = await analyzeMusicRequest(userInput)
      
      // Add bot response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: musicRequest.botResponse 
      }])
      
      // Notify parent component to fetch music
      onMusicRequest(musicRequest)
      
    } catch (error) {
      console.error('Error analyzing request:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Oops! I had trouble understanding that. Can you try again? 😅" 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Quick action buttons
  const quickActions = [
    { label: '😊 Happy Vibes', message: 'I want happy music' },
    { label: '😌 Chill Out', message: 'Play calm relaxing music' },
    { label: '🔥 Trending', message: 'Show me top trending songs' },
    { label: '💪 Workout', message: 'Energetic workout music' },
  ]

  const handleQuickAction = (message: string) => {
    setInput(message)
  }

  // If minimized, show vertical sidebar
  if (isMinimized) {
    return (
      <button
        onClick={onToggleMinimize}
        className="h-full w-full bg-blue-200 dark:bg-blue-800 border-4 border-black dark:border-white rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] flex flex-col items-center justify-center gap-4 py-8 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[14px_14px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] cursor-pointer group"
        title="Expand Mood Chat"
      >
        {/* Icon at top with styled container */}
        <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-blue-800 border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <Message01Icon size={24} className="text-black dark:text-white" />
        </div>
        
        {/* Vertical MOOD CHAT text */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl font-black text-black dark:text-white">M</span>
          <span className="text-3xl font-black text-black dark:text-white">O</span>
          <span className="text-3xl font-black text-black dark:text-white">O</span>
          <span className="text-3xl font-black text-black dark:text-white">D</span>
          <div className="h-3"></div>
          <span className="text-3xl font-black text-black dark:text-white">C</span>
          <span className="text-3xl font-black text-black dark:text-white">H</span>
          <span className="text-3xl font-black text-black dark:text-white">A</span>
          <span className="text-3xl font-black text-black dark:text-white">T</span>
        </div>
      </button>
    )
  }

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-black border-4 border-black dark:border-white rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
      {/* Header design like Task Tab */}
      <div className="bg-white dark:bg-black px-4 py-4 border-b-4 border-black dark:border-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-200 dark:bg-blue-800 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <Message01Icon size={28} className="text-black dark:text-white" />
          </div>
          <h3 className="font-black text-xl text-black dark:text-white uppercase tracking-tight">
            Mood Chat
          </h3>
        </div>
        <button
          onClick={onToggleMinimize}
          className="w-10 h-10 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 border-2 border-black dark:border-white rounded-lg transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
          title="Minimize Chat"
        >
          <svg 
            className="w-5 h-5 text-black dark:text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 border-2 border-black dark:border-white font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ${
                msg.role === 'user'
                  ? 'bg-blue-200 dark:bg-blue-900 text-black dark:text-white rounded-t-2xl rounded-bl-2xl'
                  : 'bg-white dark:bg-zinc-900 text-black dark:text-white rounded-t-2xl rounded-br-2xl'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Quick Action Buttons */}
        {messages.length === 1 && !isTyping && (
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.message)}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-white rounded-lg font-bold text-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white rounded-t-2xl rounded-br-2xl px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t-4 border-black dark:border-white p-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type anything... mood, genre, artist, trending..."
            className="flex-1 bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl px-4 py-3 text-black dark:text-white font-bold placeholder:text-zinc-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="group relative px-6 py-3 bg-blue-700 text-white font-black uppercase tracking-wider border-2 border-black dark:border-white rounded-xl transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[64px]"
          >
            <SentIcon size={24} className="text-white fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}
