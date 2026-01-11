// Client-side YouTube Music API that calls our Next.js API route

export interface YTTrack {
  id: string
  title: string
  artist: string
  videoId: string
  thumbnail: string
  duration?: string
  album?: string
}

// Search for songs via our API route
export async function searchSongs(query: string, limit: number = 10): Promise<YTTrack[]> {
  try {
    console.log('Searching for:', query)
    
    const response = await fetch(`/api/music/search?q=${encodeURIComponent(query)}&limit=${limit}`)
    const data = await response.json()
    
    console.log('API Response:', data)
    
    if (data.tracks && Array.isArray(data.tracks)) {
      return data.tracks
    }
    
    // Fallback to hardcoded tracks if API fails
    console.warn('API returned no tracks, using fallback')
    return generateFallbackTracks(query, limit)
  } catch (error) {
    console.error('Search error:', error)
    return generateFallbackTracks(query, limit)
  }
}

// Fallback hardcoded tracks
function generateFallbackTracks(query: string, limit: number): YTTrack[] {
  const lowerQuery = query.toLowerCase()
  
  const allFallbackTracks: YTTrack[] = [
    // Sad music
    { id: '1', title: 'Someone Like You', artist: 'Adele', videoId: 'hLQl3WQQoQ0', thumbnail: 'https://img.youtube.com/vi/hLQl3WQQoQ0/mqdefault.jpg' },
    { id: '2', title: 'The Night We Met', artist: 'Lord Huron', videoId: 'KtlgYxa6BMU', thumbnail: 'https://img.youtube.com/vi/KtlgYxa6BMU/mqdefault.jpg' },
    { id: '3', title: 'Fix You', artist: 'Coldplay', videoId: 'k4V3Mo61fJM', thumbnail: 'https://img.youtube.com/vi/k4V3Mo61fJM/mqdefault.jpg' },
    
    // Happy music
    { id: '4', title: 'Happy', artist: 'Pharrell Williams', videoId: 'ZbZSe6N_BXs', thumbnail: 'https://img.youtube.com/vi/ZbZSe6N_BXs/mqdefault.jpg' },
    { id: '5', title: "Don't Stop Me Now", artist: 'Queen', videoId: 'HgzGwKwLmgM', thumbnail: 'https://img.youtube.com/vi/HgzGwKwLmgM/mqdefault.jpg' },
    { id: '6', title: "Can't Stop the Feeling!", artist: 'Justin Timberlake', videoId: 'ru0K8uYEZWw', thumbnail: 'https://img.youtube.com/vi/ru0K8uYEZWw/mqdefault.jpg' },
    
    // Calm/Relaxing
    { id: '7', title: 'Weightless', artist: 'Marconi Union', videoId: 'UfcAVejslrU', thumbnail: 'https://img.youtube.com/vi/UfcAVejslrU/mqdefault.jpg' },
    { id: '8', title: 'Breathe', artist: 'Télépopmusik', videoId: 'vyut3GyQtn0', thumbnail: 'https://img.youtube.com/vi/vyut3GyQtn0/mqdefault.jpg' },
    
    // Energetic/Workout
    { id: '9', title: 'Eye of the Tiger', artist: 'Survivor', videoId: 'btPJPFnesV4', thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/mqdefault.jpg' },
    { id: '10', title: 'Stronger', artist: 'Kanye West', videoId: 'PsO6ZnUZ0Ts', thumbnail: 'https://img.youtube.com/vi/PsO6ZnUZ0Ts/mqdefault.jpg' },
    
    // Focus/Study (Lofi)
    { id: '11', title: 'Lofi Hip Hop Radio', artist: 'ChilledCow', videoId: 'jfKfPfyJRdk', thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg' },
    { id: '12', title: 'Deep Focus', artist: 'Spotify', videoId: '5qap5aO4i9A', thumbnail: 'https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg' },
    
    // RnB
    { id: '13', title: 'Best Part', artist: 'Daniel Caesar ft. H.E.R.', videoId: 'evilNOD_fSo', thumbnail: 'https://img.youtube.com/vi/evilNOD_fSo/mqdefault.jpg' },
    { id: '14', title: 'Location', artist: 'Khalid', videoId: 'SfOYAqCEPNg', thumbnail: 'https://img.youtube.com/vi/SfOYAqCEPNg/mqdefault.jpg' },
    
    // Trending/Pop
    { id: '15', title: 'Blinding Lights', artist: 'The Weeknd', videoId: 'fHI8X4OXluQ', thumbnail: 'https://img.youtube.com/vi/fHI8X4OXluQ/mqdefault.jpg' },
    { id: '16', title: 'Anti-Hero', artist: 'Taylor Swift', videoId: 'b1kbLwvqugk', thumbnail: 'https://img.youtube.com/vi/b1kbLwvqugk/mqdefault.jpg' },
  ]
  
  // Filter based on query keywords  
  let filtered = allFallbackTracks
  
  if (lowerQuery.includes('sad') || lowerQuery.includes('emotional')) {
    filtered = allFallbackTracks.slice(0, 3)
  } else if (lowerQuery.includes('happy') || lowerQuery.includes('upbeat') || lowerQuery.includes('feel good')) {
    filtered = allFallbackTracks.slice(3, 6)
  } else if (lowerQuery.includes('calm') || lowerQuery.includes('relax') || lowerQuery.includes('peaceful') || lowerQuery.includes('anxious')) {
    filtered = allFallbackTracks.slice(6, 8)
  } else if (lowerQuery.includes('energetic') || lowerQuery.includes('workout') || lowerQuery.includes('pump')) {
    filtered = allFallbackTracks.slice(8, 10)
  } else if (lowerQuery.includes('focus') || lowerQuery.includes('study') || lowerQuery.includes('lofi')) {
    filtered = allFallbackTracks.slice(10, 12)
  } else if (lowerQuery.includes('rnb') || lowerQuery.includes('r&b')) {
    filtered = allFallbackTracks.slice(12, 14)
  } else if (lowerQuery.includes('trending') || lowerQuery.includes('popular') || lowerQuery.includes('top') || lowerQuery.includes('hits')) {
    filtered = allFallbackTracks.slice(14, 16)
  }
  
  return filtered.slice(0, limit)
}

// Get trending songs
export async function getTrendingSongs(limit: number = 20): Promise<YTTrack[]> {
  return searchSongs('top hits 2024 trending songs', limit)
}

// Search by mood
export async function searchByMood(mood: string, genre?: string): Promise<YTTrack[]> {
  const moodQueries: Record<string, string> = {
    happy: 'happy upbeat feel good music',
    sad: 'sad emotional music',
    calm: 'calm relaxing peaceful music',
    energetic: 'energetic pump up music',
    anxious: 'calming soothing music',
    angry: 'intense music',
    focused: 'focus study lofi music',
    tired: 'relaxing sleep music',
  }
  
  let query = moodQueries[mood.toLowerCase()] || `${mood} music`
  if (genre) {
    query += ` ${genre}`
  }
  
  return searchSongs(query, 15)
}

// Search by genre
export async function searchByGenre(genre: string): Promise<YTTrack[]> {
  return searchSongs(`${genre} music playlist songs`, 15)
}

// Search by artist
export async function searchByArtist(artist: string): Promise<YTTrack[]> {
  return searchSongs(`${artist} songs music`, 12)
}

