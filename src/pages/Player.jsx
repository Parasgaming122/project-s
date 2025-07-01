import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { tmdbApi } from '../services/tmdb'
import { useApp } from '../context/AppContext'

const Player = () => {
  const { type, id, season, episode } = useParams()
  const navigate = useNavigate()
  const { addToHistory, isTV } = useApp()
  const [mediaDetails, setMediaDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedServer, setSelectedServer] = useState('superembed')
  const [showControls, setShowControls] = useState(true)
  const [currentSeason, setCurrentSeason] = useState(season ? parseInt(season) : 1)
  const [currentEpisode, setCurrentEpisode] = useState(episode ? parseInt(episode) : 1)

  const servers = [
    { id: 'superembed', name: 'Superembed', priority: 1 },
    { id: 'autoembed', name: 'Autoembed', priority: 2 },
    { id: 'vidsrc', name: 'Vidsrc', priority: 3 }
  ]

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true)
        const response = type === 'movie' 
          ? await tmdbApi.getMovieDetails(id)
          : await tmdbApi.getTVDetails(id)
        
        setMediaDetails(response)
        
        // Add to watch history
        const historyItem = {
          id: response.id,
          type,
          title: response.title || response.name,
          poster_path: response.poster_path,
          timestamp: Date.now(),
          ...(type === 'tv' && { season: currentSeason, episode: currentEpisode })
        }
        addToHistory(historyItem)
      } catch (error) {
        console.error('Error fetching media details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMediaDetails()
  }, [id, type, currentSeason, currentEpisode, addToHistory])

  useEffect(() => {
    let timeout
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowControls(false), 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [])

  // TV Remote Controls
  useEffect(() => {
    if (isTV) {
      const handleKeyDown = (event) => {
        switch (event.key) {
          case 'Escape':
          case 'Backspace':
            navigate(-1)
            break
          case 'ArrowLeft':
            if (type === 'tv' && currentEpisode > 1) {
              setCurrentEpisode(prev => prev - 1)
            }
            break
          case 'ArrowRight':
            if (type === 'tv') {
              setCurrentEpisode(prev => prev + 1)
            }
            break
          case 'ArrowUp':
            if (type === 'tv' && currentSeason > 1) {
              setCurrentSeason(prev => prev - 1)
              setCurrentEpisode(1)
            }
            break
          case 'ArrowDown':
            if (type === 'tv') {
              setCurrentSeason(prev => prev + 1)
              setCurrentEpisode(1)
            }
            break
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isTV, type, currentSeason, currentEpisode, navigate])

  const getEmbedUrl = () => {
    const baseUrls = {
      superembed: 'https://multiembed.mov',
      autoembed: 'https://autoembed.co',
      vidsrc: 'https://vidsrc.xyz/embed'
    }

    if (type === 'movie') {
      switch (selectedServer) {
        case 'superembed':
          return `${baseUrls.superembed}/?video_id=${id}`
        case 'autoembed':
          return `${baseUrls.autoembed}/movie/imdb/${id}`
        case 'vidsrc':
          return `${baseUrls.vidsrc}/movie?imdb=${id}`
        default:
          return `${baseUrls.superembed}/?video_id=${id}`
      }
    } else {
      switch (selectedServer) {
        case 'superembed':
          return `${baseUrls.superembed}/?video_id=${id}&s=${currentSeason}&e=${currentEpisode}`
        case 'autoembed':
          return `${baseUrls.autoembed}/tv/imdb/${id}-${currentSeason}-${currentEpisode}`
        case 'vidsrc':
          return `${baseUrls.vidsrc}/tv?imdb=${id}&season=${currentSeason}&episode=${currentEpisode}`
        default:
          return `${baseUrls.superembed}/?video_id=${id}&s=${currentSeason}&e=${currentEpisode}`
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading player...</div>
      </div>
    )
  }

  const title = mediaDetails?.title || mediaDetails?.name || 'Unknown'

  return (
    <div className="min-h-screen bg-black relative">
      {/* Video Player */}
      <div className="relative w-full h-screen">
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />

        {/* Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white hover:text-accent-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="hidden md:inline">Back</span>
            </button>

            <div className="text-white text-center">
              <h1 className="text-lg md:text-xl font-semibold">
                {title}
                {type === 'tv' && ` - S${currentSeason}E${currentEpisode}`}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Server Selection */}
              <select
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                className="bg-black/50 text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-accent-500"
              >
                {servers.map((server) => (
                  <option key={server.id} value={server.id}>
                    {server.name}
                  </option>
                ))}
              </select>

              <button className="text-white hover:text-accent-400 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* TV Show Episode Controls */}
          {type === 'tv' && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 pointer-events-auto">
              <button
                onClick={() => currentEpisode > 1 && setCurrentEpisode(prev => prev - 1)}
                disabled={currentEpisode <= 1}
                className="flex items-center space-x-2 bg-black/50 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/70 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
                <span className="hidden md:inline">Previous</span>
              </button>

              <div className="flex items-center space-x-2 bg-black/50 text-white px-4 py-2 rounded">
                <span>S{currentSeason}E{currentEpisode}</span>
              </div>

              <button
                onClick={() => setCurrentEpisode(prev => prev + 1)}
                className="flex items-center space-x-2 bg-black/50 text-white px-4 py-2 rounded hover:bg-black/70 transition-colors"
              >
                <span className="hidden md:inline">Next</span>
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Season/Episode Selectors for TV */}
          {type === 'tv' && mediaDetails?.seasons && (
            <div className="absolute bottom-4 right-4 flex space-x-2 pointer-events-auto">
              <select
                value={currentSeason}
                onChange={(e) => {
                  setCurrentSeason(parseInt(e.target.value))
                  setCurrentEpisode(1)
                }}
                className="bg-black/50 text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-accent-500"
              >
                {mediaDetails.seasons.filter(s => s.season_number > 0).map((season) => (
                  <option key={season.id} value={season.season_number}>
                    Season {season.season_number}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={currentEpisode}
                onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 1)}
                className="bg-black/50 text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-accent-500 w-20"
                placeholder="Ep"
              />
            </div>
          )}
        </div>
      </div>

      {/* TV Instructions */}
      {isTV && (
        <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded text-sm">
          <p>TV Controls:</p>
          <p>← → Navigate episodes</p>
          <p>↑ ↓ Navigate seasons</p>
          <p>Back/Escape: Exit player</p>
        </div>
      )}
    </div>
  )
}

export default Player