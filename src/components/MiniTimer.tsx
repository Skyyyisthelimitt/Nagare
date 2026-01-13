'use client'

import { useTimer } from '@/context/TimerContext'
import { IconClock } from '@tabler/icons-react'

export default function MiniTimer({ activeTab }: { activeTab: string }) {
  const { isRunning, elapsedTime, pomoTime, timerMode } = useTimer()

  if (!isRunning || activeTab === 'focus') return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center bg-white dark:bg-black px-4 h-14 rounded-xl gap-3 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] pointer-events-auto">
      <div className="flex items-center justify-center">
        <IconClock className="w-6 h-6 text-black dark:text-white" strokeWidth={2.5} />
      </div>
      <span className="font-black text-xl tabular-nums text-black dark:text-white leading-none">
        {formatTime(timerMode === 'flow' ? elapsedTime : pomoTime)}
      </span>
    </div>
  )
}
