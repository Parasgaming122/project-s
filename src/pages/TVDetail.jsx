import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Play, Plus, Heart, Star, Calendar, Tv } from 'lucide-react'
import { tmdbApi, getBackdropUrl, getPosterUrl } from '../services/tmdb'
import { useApp } from '../context/AppContext'
import MediaRow from '../components/UI/MediaRow'

const TVDetail = () => {
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const { addToFavorites, removeFromFavorites, addToWatchList, isFavorite, isInWatchList } = useApp()

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true)
        const response = await tmdbApi.getTVDetails(id)
        setShow(response)
      } catch (error) {
        console.error('Error fetching TV show details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShow()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">TV show not found</div>
      </div>
    )
  }

  const handleFavoriteClick = () => {
    const showItem = {
      id: show.id,
      type: 'tv',
      title: show.name,
      poster_path: show.poster_path,
      vote_average: show.vote_average,
      release_date: show.first_air_date
    }
    
    if (isFavorite(show.id, 'tv')) {
      removeFromFavorites(showItem)
    } else {
      addToFavorites(showItem)
    }
  }

  const handleWatchListClick = () => {
    const showItem = {
      id: show.id,
      type: 'tv',
      title: show.name,
      poster_path: show.poster_path,
      vote_average: show.vote_average,
      release_date: show.first_air_date
    }
    
    addToWatchList(showItem)
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getBackdropUrl(show.backdrop_path, 'w1920')}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 md:px-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-end space-y-6 md:space-y-0 md:space-x-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={getPosterUrl(show.poster_path, 'w500')}
                  alt={show.name}
                  className="w-48 md:w-64 rounded-lg shadow-2xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  {show.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                  {show.vote_average > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">
                        {show.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {show.first_air_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-dark-400" />
                      <span className="text-dark-300">
                        {new Date(show.first_air_date).getFullYear()}
                      </span>
                    </div>
                  )}
                  {show.number_of_seasons && (
                    <div className="flex items-center space-x-1">
                      <Tv className="w-4 h-4 text-dark-400" />
                      <span className="text-dark-300">
                        {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {show.genres && show.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {show.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-dark-700/80 text-white text-sm rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {show.overview && (
                  <p className="text-dark-200 text-sm md:text-base max-w-3xl">
                    {show.overview}
                  </p>
                )}

                {/* Season Selection */}
                {show.seasons && show.seasons.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">Season:</span>
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(Number(e.target.value))}
                      className="bg-dark-700 text-white px-3 py-2 rounded-lg border border-dark-600 focus:border-accent-500 focus:outline-none"
                    >
                      {show.seasons.filter(season => season.season_number > 0).map((season) => (
                        <option key={season.id} value={season.season_number}>
                          Season {season.season_number}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to={`/watch/tv/${show.id}/${selectedSeason}/1`}
                    className="flex items-center justify-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Play S{selectedSeason}E1</span>
                  </Link>
                  
                  <button
                    onClick={handleWatchListClick}
                    className="flex items-center justify-center space-x-2 bg-dark-700/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-dark-600/80 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to List</span>
                  </button>
                  
                  <button
                    onClick={handleFavoriteClick}
                    className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      isFavorite(show.id, 'tv')
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-dark-700/80 backdrop-blur-sm text-white hover:bg-dark-600/80'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(show.id, 'tv') ? 'fill-current' : ''}`} />
                    <span>{isFavorite(show.id, 'tv') ? 'Remove' : 'Favorite'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Shows */}
      {show.similar && show.similar.results && show.similar.results.length > 0 && (
        <div className="pb-20 lg:pb-8">
          <MediaRow 
            title="Similar Shows" 
            items={show.similar.results} 
            type="tv"
            className="mt-8"
          />
        </div>
      )}
    </div>
  )
}

export default TVDetail