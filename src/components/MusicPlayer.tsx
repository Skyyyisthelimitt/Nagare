'use client'

import { useState, useEffect, useRef } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  videoId: string
  mood: string
}

interface MusicPlayerProps {
  mood: string | null
  desiredMood: string | null
}

// Curated playlist mapping moods to YouTube video IDs
// In production, you'd fetch these from YouTube API based on search queries
const moodPlaylists: Record<string, Track[]> = {
  happy: [
    { id: '1', title: 'Happy - Pharrell Williams', artist: 'Pharrell Williams', videoId: 'ZbZSe6N_BXs', mood: 'happy' },
    { id: '2', title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', videoId: 'ru0K8uYEZWw', mood: 'happy' },
    { id: '3', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', videoId: 'iPUmE-tne5U', mood: 'happy' },
  ],
  sad: [
    { id: '4', title: 'Someone Like You', artist: 'Adele', videoId: 'hLQl3WQQoQ0', mood: 'sad' },
    { id: '5', title: 'Fix You', artist: 'Coldplay', videoId: 'k4V3Mo61fJM', mood: 'sad' },
  ],
  calm: [
    { id: '6', title: 'Weightless', artist: 'Marconi Union', videoId: 'UfcAVejslrU', mood: 'calm' },
    { id: '7', title: 'Strawberry Swing', artist: 'Coldplay', videoId: 'h3pJZ6J8Jj4', mood: 'calm' },
  ],
  energetic: [
    { id: '8', title: 'Eye of the Tiger', artist: 'Survivor', videoId: 'btPJPFnesV4', mood: 'energetic' },
    { id: '9', title: 'Stronger', artist: 'Kanye West', videoId: 'PsO6ZnUZ0Ts', mood: 'energetic' },
  ],
  focused: [
    { id: '10', title: 'Lofi Hip Hop', artist: 'ChilledCow', videoId: 'jfKfPfyJRdk', mood: 'focused' },
    { id: '11', title: 'Deep Focus', artist: 'Brain.fm', videoId: '5qap5aO4i9A', mood: 'focused' },
  ],
  anxious: [
    { id: '12', title: 'Weightless', artist: 'Marconi Union', videoId: 'UfcAVejslrU', mood: 'anxious' },
    { id: '13', title: 'Meditation Music', artist: 'Relaxing Music', videoId: '1ZYbU82GVz4', mood: 'anxious' },
  ],
}

export default function MusicPlayer({ mood, desiredMood }: MusicPlayerProps) {
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const youtubePlayerRef = useRef<any>(null)
  const playlistRef = useRef<Track[]>([])
  const currentTrackIndexRef = useRef(0)

  // Keep refs in sync with state
  useEffect(() => {
    playlistRef.current = playlist
  }, [playlist])

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex
  }, [currentTrackIndex])

  // Initialize YouTube IFrame API
  useEffect(() => {
    // Load YouTube IFrame API script
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        setPlayerReady(true)
      }
    } else if (window.YT.Player) {
      setPlayerReady(true)
    }
  }, [])

  // Initialize YouTube player when ready
  useEffect(() => {
    if (playerReady && window.YT && window.YT.Player && !youtubePlayerRef.current) {
      // @ts-ignore
      youtubePlayerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            console.log('YouTube player ready')
          },
          onStateChange: (event: any) => {
            // Auto-play next track when current ends
            if (event.data === 0 && playlistRef.current.length > 0) {
              const nextIndex = (currentTrackIndexRef.current + 1) % playlistRef.current.length
              setCurrentTrackIndex(nextIndex)
              setIsPlaying(false)
              setTimeout(() => {
                if (youtubePlayerRef.current && playlistRef.current[nextIndex]) {
                  youtubePlayerRef.current.loadVideoById(playlistRef.current[nextIndex].videoId)
                  youtubePlayerRef.current.playVideo()
                  setIsPlaying(true)
                }
              }, 100)
            }
          },
        },
      })
    }
  }, [playerReady])

  // Generate playlist when mood is detected
  useEffect(() => {
    if (desiredMood && moodPlaylists[desiredMood]) {
      setPlaylist(moodPlaylists[desiredMood])
      setCurrentTrackIndex(0)
      setIsPlaying(false)
    }
  }, [desiredMood, mood])

  // Play current track
  const playCurrentTrack = () => {
    if (youtubePlayerRef.current && playlist[currentTrackIndex]) {
      youtubePlayerRef.current.loadVideoById(playlist[currentTrackIndex].videoId)
      youtubePlayerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  // Pause current track
  const pauseCurrentTrack = () => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.pauseVideo()
      setIsPlaying(false)
    }
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseCurrentTrack()
    } else {
      playCurrentTrack()
    }
  }

  const handleNext = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length
      setCurrentTrackIndex(nextIndex)
      setIsPlaying(false)
      // Auto-play next track
      setTimeout(() => {
        if (youtubePlayerRef.current) {
          youtubePlayerRef.current.loadVideoById(playlist[nextIndex].videoId)
          youtubePlayerRef.current.playVideo()
          setIsPlaying(true)
        }
      }, 100)
    }
  }

  const handlePrevious = () => {
    if (playlist.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length
      setCurrentTrackIndex(prevIndex)
      setIsPlaying(false)
      setTimeout(() => {
        if (youtubePlayerRef.current) {
          youtubePlayerRef.current.loadVideoById(playlist[prevIndex].videoId)
          youtubePlayerRef.current.playVideo()
          setIsPlaying(true)
        }
      }, 100)
    }
  }

  const currentTrack = playlist[currentTrackIndex]

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Hidden YouTube player */}
      <div id="youtube-player" className="hidden"></div>

      {/* Playlist Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 mb-4">
        {playlist.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="text-lg">No playlist yet</p>
            <p className="text-sm mt-2">Tell me how you're feeling to get started! 🎵</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              {desiredMood ? `${desiredMood.charAt(0).toUpperCase() + desiredMood.slice(1)} Playlist` : 'Your Playlist'}
            </h3>
            {playlist.map((track, idx) => (
              <div
                key={track.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  idx === currentTrackIndex
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
                onClick={() => {
                  setCurrentTrackIndex(idx)
                  setIsPlaying(false)
                  setTimeout(() => playCurrentTrack(), 100)
                }}
              >
                <div className="font-medium">{track.title}</div>
                <div className="text-sm opacity-75">{track.artist}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Player Controls */}
      {currentTrack && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="mb-3">
            <div className="font-semibold text-gray-900 dark:text-gray-100">{currentTrack.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{currentTrack.artist}</div>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePrevious}
              disabled={playlist.length === 0}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>
            <button
              onClick={handlePlayPause}
              disabled={playlist.length === 0}
              className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={handleNext}
              disabled={playlist.length === 0}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0011 6v2.798l-5.445-3.63z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
