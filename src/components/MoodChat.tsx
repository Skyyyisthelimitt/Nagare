'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface MoodChatProps {
  onMoodDetected: (mood: string, desiredMood: string) => void
}

// Simple keyword matching for mood detection
const moodKeywords: Record<string, string[]> = {
  sad: ['sad', 'depressed', 'down', 'unhappy', 'melancholy', 'blue', 'gloomy'],
  happy: ['happy', 'joyful', 'cheerful', 'upbeat', 'excited', 'elated', 'glad'],
  anxious: ['anxious', 'worried', 'stressed', 'nervous', 'tense', 'overwhelmed'],
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen'],
  energetic: ['energetic', 'pumped', 'motivated', 'active', 'vibrant', 'lively'],
  tired: ['tired', 'exhausted', 'drained', 'fatigued', 'sleepy', 'weary'],
  angry: ['angry', 'frustrated', 'irritated', 'mad', 'annoyed', 'upset'],
  focused: ['focused', 'concentrated', 'productive', 'determined', 'driven'],
}

const detectMood = (text: string): { currentMood: string | null; desiredMood: string | null } => {
  const lowerText = text.toLowerCase()
  let currentMood: string | null = null
  let desiredMood: string | null = null

  // Check for "I feel X" or "I'm X" patterns
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        // Check if it's a desired mood (want, need, looking for)
        if (lowerText.includes('want') || lowerText.includes('need') || lowerText.includes('looking for')) {
          desiredMood = mood
        } else {
          currentMood = mood
        }
      }
    }
  }

  // Also check for explicit patterns like "I feel sad and want happy music"
  const wantMatch = lowerText.match(/want\s+(\w+)/)
  const needMatch = lowerText.match(/need\s+(\w+)/)
  const lookingForMatch = lowerText.match(/looking\s+for\s+(\w+)/)

  if (wantMatch || needMatch || lookingForMatch) {
    const desiredKeyword = (wantMatch?.[1] || needMatch?.[1] || lookingForMatch?.[1])?.toLowerCase()
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.includes(desiredKeyword || '')) {
        desiredMood = mood
      }
    }
  }

  return { currentMood, desiredMood }
}

export default function MoodChat({ onMoodDetected }: MoodChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hey! How are you feeling today? 😊" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const { currentMood, desiredMood } = detectMood(input)
      
      let response = ''
      if (desiredMood) {
        response = `Got it! Let me find some ${desiredMood} music for you. 🎵`
        onMoodDetected(currentMood || 'neutral', desiredMood)
      } else if (currentMood) {
        response = `I understand you're feeling ${currentMood}. What kind of music would help you right now?`
      } else {
        response = "I'm here to help you find the perfect music! Try telling me how you feel or what you need. For example: 'I feel sad and want happy music' 😊"
      }

      setMessages(prev => [...prev, { role: 'assistant', text: response }])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
