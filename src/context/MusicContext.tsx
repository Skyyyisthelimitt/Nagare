'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { type YTTrack } from '@/lib/youtubeMusicApi'

interface MusicContextType {
  playlist: YTTrack[]
  setPlaylist: (tracks: YTTrack[]) => void
  currentTrackIndex: number
  setCurrentTrackIndex: (index: number) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  volume: number
  setVolume: (volume: number) => void
  isMuted: boolean
  setIsMuted: (isMuted: boolean) => void
  currentTime: number
  duration: number
  playerReady: boolean
  playCurrentTrack: () => void
  pauseCurrentTrack: () => void
  togglePlay: () => void
  nextTrack: () => void
  prevTrack: () => void
  toggleMute: () => void
  seekTo: (time: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<YTTrack[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const youtubePlayerRef = useRef<any>(null)
  const playlistRef = useRef<YTTrack[]>([])
  const currentTrackIndexRef = useRef(0)

  // Sync refs for event handlers
  useEffect(() => {
    playlistRef.current = playlist
  }, [playlist])

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex
  }, [currentTrackIndex])

  // YouTube API Initialization
  useEffect(() => {
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

  // Player Instance Creation
  useEffect(() => {
    if (playerReady && window.YT && window.YT.Player && !youtubePlayerRef.current) {
      youtubePlayerRef.current = new window.YT.Player('global-youtube-player', {
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
            youtubePlayerRef.current.setVolume(volume)
          },
          onStateChange: (event: any) => {
            if (event.data === 0 && playlistRef.current.length > 0) {
              const nextIndex = (currentTrackIndexRef.current + 1) % playlistRef.current.length
              setCurrentTrackIndex(nextIndex)
              setIsPlaying(false)
              setTimeout(() => {
                const nextTrack = playlistRef.current[nextIndex]
                if (youtubePlayerRef.current && nextTrack) {
                  youtubePlayerRef.current.loadVideoById(nextTrack.videoId)
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

  // Progress Tracking
  useEffect(() => {
    let interval: any
    if (isPlaying && youtubePlayerRef.current) {
      interval = setInterval(() => {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.getCurrentTime === 'function') {
          setCurrentTime(youtubePlayerRef.current.getCurrentTime())
          setDuration(youtubePlayerRef.current.getDuration())
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Sync Volume
  useEffect(() => {
    if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === 'function') {
      youtubePlayerRef.current.setVolume(isMuted ? 0 : volume)
    }
  }, [volume, isMuted, playerReady])

  // Control Actions
  const playCurrentTrack = () => {
    const track = playlist[currentTrackIndex]
    if (youtubePlayerRef.current && track) {
      youtubePlayerRef.current.loadVideoById(track.videoId)
      youtubePlayerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  const pauseCurrentTrack = () => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.pauseVideo()
      setIsPlaying(false)
    }
  }

  const togglePlay = () => {
    if (isPlaying) pauseCurrentTrack()
    else {
      if (youtubePlayerRef.current && youtubePlayerRef.current.getPlayerState() === 2) {
        youtubePlayerRef.current.playVideo()
        setIsPlaying(true)
      } else {
        playCurrentTrack()
      }
    }
  }

  const nextTrack = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length
      setCurrentTrackIndex(nextIndex)
      setIsPlaying(false)
      setTimeout(() => {
        if (youtubePlayerRef.current && playlist[nextIndex]) {
          youtubePlayerRef.current.loadVideoById(playlist[nextIndex].videoId)
          youtubePlayerRef.current.playVideo()
          setIsPlaying(true)
        }
      }, 100)
    }
  }

  const prevTrack = () => {
    if (playlist.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length
      setCurrentTrackIndex(prevIndex)
      setIsPlaying(false)
      setTimeout(() => {
        if (youtubePlayerRef.current && playlist[prevIndex]) {
          youtubePlayerRef.current.loadVideoById(playlist[prevIndex].videoId)
          youtubePlayerRef.current.playVideo()
          setIsPlaying(true)
        }
      }, 100)
    }
  }

  const toggleMute = () => {
    if (youtubePlayerRef.current) {
      if (isMuted) {
        youtubePlayerRef.current.setVolume(volume || 50)
        setIsMuted(false)
      } else {
        youtubePlayerRef.current.setVolume(0)
        setIsMuted(true)
      }
    }
  }

  const seekTo = (time: number) => {
    setCurrentTime(time)
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.seekTo(time, true)
    }
  }

  return (
    <MusicContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentTrackIndex,
        setCurrentTrackIndex,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        currentTime,
        duration,
        playerReady,
        playCurrentTrack,
        pauseCurrentTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        toggleMute,
        seekTo,
        isLoading,
        setIsLoading
      }}
    >
      {children}
      <div id="global-youtube-player" className="hidden"></div>
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
