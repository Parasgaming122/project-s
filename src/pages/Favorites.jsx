import React from 'react'
import { Heart } from 'lucide-react'
import MediaCard from '../components/UI/MediaCard'
import { useApp } from '../context/AppContext'

const Favorites = () => {
  const { favorites } = useApp()

  return (
    <div className="min-h-screen bg-dark-950 pt-6 pb-20 lg:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            My Favorites
          </h1>
          <p className="text-dark-400">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your favorites
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {favorites.map((item) => (
              <MediaCard 
                key={`${item.id}-${item.type}`} 
                item={item} 
                type={item.type} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-dark-600 mb-4" />
            <p className="text-dark-400 text-lg mb-2">
              No favorites yet
            </p>
            <p className="text-dark-500">
              Add movies and TV shows to your favorites to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites