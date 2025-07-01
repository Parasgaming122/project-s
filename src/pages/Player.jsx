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
  const [imdbId, setImdbId] = useState(null)

  const servers = [
    { id: 'superembed', name: 'Superembed', priority: 1 },
    { id: 'superembed-vip', name: 'Superembed VIP', priority: 2 },
    { id: 'autoembed', name: 'Autoembed', priority: 3 },
    { id: 'vidsrc', name: 'Vidsrc', priority: 4 }
  ]

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true)
        const response = type === 'movie' 
          ? await tmdbApi.getMovieDetails(id)
          : await tmdbApi.getTVDetails(id)
        
        setMediaDetails(response)
        
        // Extract IMDB ID from external_ids
        if (response.external_ids && response.external_ids.imdb_id) {
          setImdbId(response.external_ids.imdb_id)
        } else {
          // Fallback: fetch external IDs separately
          const externalIds = type === 'movie' 
            ? await fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=a2f888b27315e62e471b2d587048f32e`)
            : await fetch(`https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=a2f888b27315e62e471b2d587048f32e`)
          
          const externalData = await externalIds.json()
          if (externalData.imdb_id) {
            setImdbId(externalData.imdb_id)
          } else {
            // Use TMDB ID as fallback
            setImdbId(id)
          }
        }
        
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
        // Use TMDB ID as fallback
        setImdbId(id)
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
    if (!imdbId) return ''

    // Clean IMDB ID (remove 'tt' prefix if present for some servers)
    const cleanImdbId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`
    const numericImdbId = imdbId.replace('tt', '')

    if (type === 'movie') {
      switch (selectedServer) {
        case 'superembed':
          return `https://multiembed.mov/?video_id=${cleanImdbId}`
        case 'superembed-vip':
          return `https://multiembed.mov/directstream.php?video_id=${cleanImdbId}`
        case 'autoembed':
          return `https://autoembed.co/movie/imdb/${cleanImdbId}`
        case 'vidsrc':
          return `https://vidsrc.xyz/embed/movie?imdb=${cleanImdbId}`
        default:
          return `https://multiembed.mov/?video_id=${cleanImdbId}`
      }
    } else {
      switch (selectedServer) {
        case 'superembed':
          return `https://multiembed.mov/?video_id=${cleanImdbId}&s=${currentSeason}&e=${currentEpisode}`
        case 'superembed-vip':
          return `https://multiembed.mov/directstream.php?video_id=${cleanImdbId}&s=${currentSeason}&e=${currentEpisode}`
        case 'autoembed':
          return `https://autoembed.co/tv/imdb/${cleanImdbId}-${currentSeason}-${currentEpisode}`
        case 'vidsrc':
          return `https://vidsrc.xyz/embed/tv?imdb=${cleanImdbId}&season=${currentSeason}&episode=${currentEpisode}`
        default:
          return `https://multiembed.mov/?video_id=${cleanImdbId}&s=${currentSeason}&e=${currentEpisode}`
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
        {imdbId ? (
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-800">
            <div className="text-center text-white">
              <h2 className="text-2xl mb-4">Unable to load player</h2>
              <p className="text-dark-400">IMDB ID not found for this content</p>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white hover:text-accent-400 transition-colors bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="hidden md:inline">Back</span>
            </button>

            <div className="text-white text-center">
              <h1 className="text-lg md:text-xl font-semibold">
                {title}
                {type === 'tv' && ` - S${currentSeason}E${currentEpisode}`}
              </h1>
              {imdbId && (
                <p className="text-sm text-dark-300 mt-1">IMDB: {imdbId}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Server Selection */}
              <select
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                className="bg-black/50 text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-accent-500 backdrop-blur-sm"
              >
                {servers.map((server) => (
                  <option key={server.id} value={server.id}>
                    {server.name}
                  </option>
                ))}
              </select>

              <button className="text-white hover:text-accent-400 transition-colors bg-black/50 p-2 rounded backdrop-blur-sm">
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
                className="flex items-center space-x-2 bg-black/50 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <SkipBack className="w-5 h-5" />
                <span className="hidden md:inline">Previous</span>
              </button>

              <div className="flex items-center space-x-2 bg-black/50 text-white px-4 py-2 rounded backdrop-blur-sm">
                <span>S{currentSeason}E{currentEpisode}</span>
              </div>

              <button
                onClick={() => setCurrentEpisode(prev => prev + 1)}
                className="flex items-center space-x-2 bg-black/50 text-white px-4 py-2 rounded hover:bg-black/70 transition-colors backdrop-blur-sm"
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
                className="bg-black/50 text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-accent-500 backdrop-blur-sm"
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
                className="bg-black/50 text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-accent-500 w-20 backdrop-blur-sm"
                placeholder="Ep"
              />
            </div>
          )}
        </div>
      </div>

      {/* TV Instructions */}
      {isTV && (
        <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded text-sm backdrop-blur-sm">
          <p className="font-semibold mb-2">TV Controls:</p>
          <p>← → Navigate episodes</p>
          <p>↑ ↓ Navigate seasons</p>
          <p>Back/Escape: Exit player</p>
        </div>
      )}

      {/* Server Info */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded text-sm backdrop-blur-sm">
        <p className="font-semibold">Current Server: {servers.find(s => s.id === selectedServer)?.name}</p>
        {selectedServer === 'superembed-vip' && (
          <p className="text-xs text-green-400 mt-1">VIP: Multi-quality, fast streaming</p>
        )}
      </div>
    </div>
  )
}

export default Player