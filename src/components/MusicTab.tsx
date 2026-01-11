'use client'

import { useState } from 'react'
import { Message01Icon, MusicNote01Icon } from 'hugeicons-react'
import MoodChat from './MoodChat'
import MusicPlayer from './MusicPlayer'
import { type MusicRequest } from '@/lib/geminiApi'
import { searchSongs, getTrendingSongs, searchByMood, searchByGenre, searchByArtist, type YTTrack } from '@/lib/youtubeMusicApi'
import { useMusic } from '@/context/MusicContext'


export default function MusicTab() {
  const { playlist, setPlaylist, isLoading, setIsLoading } = useMusic()
  const [isChatMinimized, setIsChatMinimized] = useState(false)

  const handleMusicRequest = async (request: MusicRequest) => {
    setIsLoading(true)
    try {
      let tracks: YTTrack[] = []

      // Handle different request types with priority
    switch (request.requestType) {
        case 'mood':
          // Priority: Mood-based search
          if (request.mood || request.desiredMood) {
            const targetMood = request.desiredMood || request.mood || 'neutral'
            tracks = await searchByMood(targetMood, request.genre)
          }
          break
        
        case 'trending':
          tracks = await getTrendingSongs(20)
          break
        
        case 'genre':
          if (request.genre) {
            tracks = await searchByGenre(request.genre)
          }
          break
        
        case 'artist':
          if (request.artist) {
            tracks = await searchByArtist(request.artist)
          }
          break
        
        case 'activity':
          // Activity-based search (workout, study, etc.)
          tracks = await searchSongs(request.searchQuery, 15)
          break
        
        case 'general':
        default:
          tracks = await searchSongs(request.searchQuery, 15)
          break
      }

      setPlaylist(tracks)
    } catch (error) {
      console.error('Error fetching music:', error)
      setPlaylist([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full gap-8 max-w-6xl mx-auto py-8">
      {/* Left side: Mood Chat (Collapsible) */}
      <div 
        className={`flex transition-all duration-500 ease-in-out ${
          isChatMinimized ? 'w-24' : 'flex-1 min-w-0'
        }`}
      >
        <div className="flex-1 min-h-0">
          <MoodChat 
            onMusicRequest={handleMusicRequest}
            isMinimized={isChatMinimized}
            onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
          />
        </div>
      </div>

      {/* Right side: Music Player */}
      <div 
        className={`flex flex-col transition-all duration-500 ease-in-out ${
          isChatMinimized ? 'flex-1 mx-auto max-w-5xl' : 'flex-1 min-w-0'
        }`}
      >
        <div className="flex-1 min-h-0">
          <MusicPlayer />
        </div>
      </div>
    </div>
  )
}
