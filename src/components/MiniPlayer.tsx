'use client'

import React, { useState } from 'react'
import { PlayIcon, PauseIcon, MusicNote01Icon, VolumeHighIcon, VolumeOffIcon, PreviousIcon, NextIcon } from 'hugeicons-react'
import { useMusic } from '@/context/MusicContext'

export default function MiniPlayer() {
  const { 
    playlist, 
    currentTrackIndex, 
    isPlaying, 
    togglePlay, 
    toggleMute, 
    isMuted,
    volume,
    setVolume,
    nextTrack,
    prevTrack
  } = useMusic()
  const [showVolume, setShowVolume] = useState(false)

  const currentTrack = playlist[currentTrackIndex]

  if (!currentTrack) return null

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white rounded-2xl p-2 px-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] animate-in slide-in-from-right-8 fade-in duration-500 pointer-events-auto">
      {currentTrack && (
        <>
          {/* Thumbnail */}
          <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800 border-2 border-black dark:border-white rounded-xl overflow-hidden flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            {currentTrack.thumbnail ? (
              <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MusicNote01Icon size={20} className="text-black dark:text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col min-w-0 max-w-[100px]">
            <div className="font-black truncate uppercase tracking-tighter text-black dark:text-white text-[10px] leading-tight">
              {currentTrack.title}
            </div>
            <div className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest truncate">
              {currentTrack.artist}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 border-l-2 border-black dark:border-white pl-3">
            {/* Previous */}
            <button
              onClick={prevTrack}
              className="w-8 h-8 bg-blue-100 dark:bg-blue-900 border-2 border-black dark:border-white rounded-lg flex items-center justify-center transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              <PreviousIcon size={16} className="text-black dark:text-white fill-current" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-orange-400 dark:bg-orange-600 text-white border-2 border-black dark:border-white rounded-xl flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              {isPlaying ? (
                <PauseIcon size={20} className="text-white fill-current" />
              ) : (
                <PlayIcon size={20} className="text-white fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextTrack}
              className="w-8 h-8 bg-blue-100 dark:bg-blue-900 border-2 border-black dark:border-white rounded-lg flex items-center justify-center transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              <NextIcon size={16} className="text-black dark:text-white fill-current" />
            </button>

            {/* Volume */}
            <div className="relative flex items-center ml-1">
              <button
                onClick={() => setShowVolume(!showVolume)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  toggleMute()
                }}
                className="w-8 h-8 bg-white dark:bg-black border-2 border-black dark:border-white rounded-lg flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
                title="Left click to toggle slider, Right click to mute"
              >
                {isMuted ? (
                  <VolumeOffIcon size={16} className="text-red-500" />
                ) : (
                  <VolumeHighIcon size={16} className="text-black dark:text-white" />
                )}
              </button>

              {showVolume && (
                <div className="absolute bottom-full right-0 mb-4 bg-white dark:bg-black border-4 border-black dark:border-white p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] w-24">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-4 appearance-none bg-blue-100 dark:bg-blue-900 border-2 border-black dark:border-white rounded-lg cursor-pointer accent-black dark:accent-white"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
