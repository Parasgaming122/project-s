import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Info, Star } from 'lucide-react'
import { getBackdropUrl } from '../../services/tmdb'

const Hero = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (items.length > 0) {
      setIsLoading(false)
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
      }, 8000)
      return () => clearInterval(interval)
    }
  }, [items.length])

  if (isLoading || items.length === 0) {
    return (
      <div className="relative h-[60vh] md:h-[80vh] bg-dark-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-dark-400">Loading...</div>
        </div>
      </div>
    )
  }

  const currentItem = items[currentIndex]
  const mediaType = currentItem.media_type || (currentItem.title ? 'movie' : 'tv')
  const title = currentItem.title || currentItem.name
  const overview = currentItem.overview

  return (
    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getBackdropUrl(currentItem.backdrop_path, 'w1920')}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="space-y-4 md:space-y-6">
            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {title}
            </h1>

            {/* Rating and Year */}
            <div className="flex items-center space-x-4 text-sm md:text-base">
              {currentItem.vote_average > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">
                    {currentItem.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
              {(currentItem.release_date || currentItem.first_air_date) && (
                <span className="text-dark-300">
                  {new Date(currentItem.release_date || currentItem.first_air_date).getFullYear()}
                </span>
              )}
              <span className="text-dark-300 capitalize">{mediaType}</span>
            </div>

            {/* Overview */}
            {overview && (
              <p className="text-dark-200 text-sm md:text-lg max-w-2xl line-clamp-3">
                {overview}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to={`/watch/${mediaType}/${currentItem.id}`}
                className="flex items-center justify-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Play Now</span>
              </Link>
              
              <Link
                to={`/${mediaType}/${currentItem.id}`}
                className="flex items-center justify-center space-x-2 bg-dark-700/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-dark-600/80 transition-colors"
              >
                <Info className="w-5 h-5" />
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero