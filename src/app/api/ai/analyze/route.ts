import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI on the server
// IMPORTANT: Use a secret environment variable (no NEXT_PUBLIC_ prefix)
const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: NextRequest) {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  try {
    const { userMessage } = await request.json()

    if (!userMessage) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
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
    
    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
    
  } catch (error: any) {
    console.error('Gemini AI error:', error)
    return NextResponse.json(
      { error: error.message || 'AI analysis failed' },
      { status: 500 }
    )
  }
}
