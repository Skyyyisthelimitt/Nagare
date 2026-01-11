import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
// IMPORTANT: Replace with your actual API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
const genAI = new GoogleGenerativeAI(API_KEY)

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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a music mood assistant. Analyze this user message and extract music preferences.

User message: "${userMessage}"

PRIORITY ORDER:
1. MOOD (most important) - detect current emotional state
2. DESIRED_MOOD - what mood they want to achieve
3. GENRE - music genre preference
4. ARTIST - specific artist request
5. ACTIVITY - what they're doing (study, workout, sleep, etc.)

Respond in this EXACT JSON format:
{
  "mood": "current mood if detected (sad/happy/anxious/calm/energetic/angry/focused/tired) or null",
  "desiredMood": "target mood they want or null",
  "genre": "genre if mentioned (rnb/pop/rock/hiphop/lofi/jazz/etc) or null",
  "artist": "artist name if mentioned or null",
  "activity": "activity if mentioned (study/workout/sleep/party/etc) or null",
  "requestType": "mood/genre/trending/artist/activity/general",
  "searchQuery": "optimized YouTube Music search query",
  "botResponse": "friendly response acknowledging their request (max 2 sentences)"
}

Examples:
- "I feel sad" → mood: "sad", requestType: "mood", botResponse: "I understand you're feeling sad. Let me find some music to help you."
- "Play some RnB" → genre: "rnb", requestType: "genre", botResponse: "On it! Loading some smooth RnB tracks for you."
- "I'm anxious, need calm music" → mood: "anxious", desiredMood: "calm", requestType: "mood"
- "Top 50 trending" → requestType: "trending", searchQuery: "top hits 2024"
- "Workout music" → activity: "workout", requestType: "activity"

Only return valid JSON, nothing else.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Clean response and parse JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid AI response format')
    }
    
    const parsed = JSON.parse(jsonMatch[0]) as MusicRequest
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
