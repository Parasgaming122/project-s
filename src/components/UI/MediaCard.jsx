import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Play, Plus, Heart } from 'lucide-react'
import { getPosterUrl } from '../../services/tmdb'
import { useApp } from '../../context/AppContext'

const MediaCard = ({ item, type, className = '' }) => {
  const { addToFavorites, removeFromFavorites, addToWatchList, isFavorite, isInWatchList } = useApp()
  
  const mediaType = type || item.media_type || (item.title ? 'movie' : 'tv')
  const title = item.title || item.name
  const releaseDate = item.release_date || item.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : ''
  
  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const mediaItem = {
      id: item.id,
      type: mediaType,
      title,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: releaseDate
    }
    
    if (isFavorite(item.id, mediaType)) {
      removeFromFavorites(mediaItem)
    } else {
      addToFavorites(mediaItem)
    }
  }
  
  const handleWatchListClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const mediaItem = {
      id: item.id,
      type: mediaType,
      title,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: releaseDate
    }
    
    if (isInWatchList(item.id, mediaType)) {
      // Remove from watchlist logic would go here
    } else {
      addToWatchList(mediaItem)
    }
  }

  return (
    <div className={`group relative card-hover ${className}`}>
      <Link to={`/${mediaType}/${item.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-dark-800">
          <img
            src={getPosterUrl(item.poster_path)}
            alt={title}
            className="w-full h-auto aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-2">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Play className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleWatchListClick}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleFavoriteClick}
                className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                  isFavorite(item.id, mediaType) 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite(item.id, mediaType) ? 'text-white fill-current' : 'text-white'}`} />
              </button>
            </div>
          </div>
          
          {/* Rating */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-white font-medium">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="mt-3 space-y-1">
          <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-accent-400 transition-colors">
            {title}
          </h3>
          {year && (
            <p className="text-dark-400 text-xs">{year}</p>
          )}
        </div>
      </Link>
    </div>
  )
}

export default MediaCard