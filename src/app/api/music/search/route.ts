import { NextRequest, NextResponse } from 'next/server'
import YTMusic from 'ytmusic-api'

let ytmusic: YTMusic | null = null

async function initYouTubeMusic() {
  if (!ytmusic) {
    ytmusic = new YTMusic()
    await ytmusic.initialize()
  }
  return ytmusic
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  try {
    const api = await initYouTubeMusic()
    const results = await api.search(query)

    const tracks = results
      .filter((item: any) => item.type === 'SONG' || item.videoId)
      .slice(0, limit)
      .map((song: any) => ({
        id: `yt-${song.videoId}`,
        title: song.name || song.title || 'Unknown Title',
        artist: song.artist?.name || song.artists?.[0]?.name || 'Unknown Artist',
        videoId: song.videoId || '',
        thumbnail: song.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`,
        duration: song.duration || undefined,
        album: song.album?.name || undefined,
      }))

    return NextResponse.json({ tracks })
  } catch (error: any) {
    console.error('YouTube Music API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search music', tracks: [] },
      { status: 500 }
    )
  }
}
