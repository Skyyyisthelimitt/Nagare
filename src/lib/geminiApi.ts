export interface MusicRequest {
  mood?: string
  desiredMood?: string
  genre?: string
  artist?: string
  activity?: string
  requestType: 'mood' | 'genre' | 'trending' | 'artist' | 'activity' | 'general'
  searchQuery: string
  botResponse: string
}

// Analyze user message and extract music preferences
export async function analyzeMusicRequest(userMessage: string): Promise<MusicRequest> {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to analyze request')
    }

    const parsed = await response.json() as MusicRequest
    return parsed
    
  } catch (error) {
    console.error('Gemini AI error:', error)
    // Fallback to simple keyword matching
    return fallbackAnalysis(userMessage)
  }
}

// Fallback keyword matching if AI fails
function fallbackAnalysis(message: string): MusicRequest {
  const lowerMessage = message.toLowerCase()
  
  // Check for mood keywords
  const moodKeywords: Record<string, string> = {
    sad: 'sad|depressed|down|unhappy|melancholy',
    happy: 'happy|joyful|cheerful|upbeat|excited',
    anxious: 'anxious|worried|stressed|nervous|tense',
    calm: 'calm|peaceful|relaxed|serene|tranquil',
    energetic: 'energetic|pumped|motivated|active|hyped',
    tired: 'tired|exhausted|drained|sleepy|weary',
    angry: 'angry|frustrated|mad|annoyed|upset',
    focused: 'focused|concentrate|productive|study',
  }
  
  let detectedMood: string | undefined
  for (const [mood, pattern] of Object.entries(moodKeywords)) {
    if (new RegExp(pattern).test(lowerMessage)) {
      detectedMood = mood
      break
    }
  }
  
  // Check for trending request
  if (/trending|top\s*\d+|popular|hot|chart/i.test(lowerMessage)) {
    return {
      requestType: 'trending',
      searchQuery: 'top hits 2024',
      botResponse: "Here are the trending hits right now! 🔥"
    }
  }
  
  // Check for genre
  const genreMatch = lowerMessage.match(/\b(rnb|r&b|pop|rock|jazz|hiphop|hip hop|lofi|lo-fi|edm|country|metal)\b/i)
  const genre = genreMatch ? genreMatch[1].toLowerCase() : undefined
  
  if (detectedMood) {
    return {
      mood: detectedMood,
      genre,
      requestType: 'mood',
      searchQuery: genre ? `${detectedMood} ${genre} music` : `${detectedMood} music`,
      botResponse: `I understand you're feeling ${detectedMood}. ${genre ? `Loading some ${genre} tracks` : 'What kind of music would help you right now?'}`
    }
  }
  
  if (genre) {
    return {
      genre,
      requestType: 'genre',
      searchQuery: `${genre} music playlist`,
      botResponse: `Great choice! Loading ${genre.toUpperCase()} music for you. 🎵`
    }
  }
  
  return {
    requestType: 'general',
    searchQuery: message,
    botResponse: "Let me search for that! 🎵"
  }
}
