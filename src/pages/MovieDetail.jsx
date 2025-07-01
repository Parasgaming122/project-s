import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Play, Plus, Heart, Star, Calendar, Clock } from 'lucide-react'
import { tmdbApi, getBackdropUrl, getPosterUrl } from '../services/tmdb'
import { useApp } from '../context/AppContext'
import MediaRow from '../components/UI/MediaRow'

const MovieDetail = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToFavorites, removeFromFavorites, addToWatchList, isFavorite, isInWatchList } = useApp()

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const response = await tmdbApi.getMovieDetails(id)
        setMovie(response)
      } catch (error) {
        console.error('Error fetching movie details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    )
  }

  const handleFavoriteClick = () => {
    const movieItem = {
      id: movie.id,
      type: 'movie',
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date
    }
    
    if (isFavorite(movie.id, 'movie')) {
      removeFromFavorites(movieItem)
    } else {
      addToFavorites(movieItem)
    }
  }

  const handleWatchListClick = () => {
    const movieItem = {
      id: movie.id,
      type: 'movie',
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date
    }
    
    addToWatchList(movieItem)
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getBackdropUrl(movie.backdrop_path, 'w1920')}
            alt={movie.title}
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
                  src={getPosterUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  className="w-48 md:w-64 rounded-lg shadow-2xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                  {movie.vote_average > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {movie.release_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-dark-400" />
                      <span className="text-dark-300">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    </div>
                  )}
                  {movie.runtime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-dark-400" />
                      <span className="text-dark-300">
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    </div>
                  )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-dark-700/80 text-white text-sm rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {movie.overview && (
                  <p className="text-dark-200 text-sm md:text-base max-w-3xl">
                    {movie.overview}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to={`/watch/movie/${movie.id}`}
                    className="flex items-center justify-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Play Now</span>
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
                      isFavorite(movie.id, 'movie')
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-dark-700/80 backdrop-blur-sm text-white hover:bg-dark-600/80'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(movie.id, 'movie') ? 'fill-current' : ''}`} />
                    <span>{isFavorite(movie.id, 'movie') ? 'Remove' : 'Favorite'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {movie.similar && movie.similar.results && movie.similar.results.length > 0 && (
        <div className="pb-20 lg:pb-8">
          <MediaRow 
            title="Similar Movies" 
            items={movie.similar.results} 
            type="movie"
            className="mt-8"
          />
        </div>
      )}
    </div>
  )
}

export default MovieDetail