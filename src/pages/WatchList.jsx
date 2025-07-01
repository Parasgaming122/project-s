import React from 'react'
import { Bookmark } from 'lucide-react'
import MediaCard from '../components/UI/MediaCard'
import { useApp } from '../context/AppContext'

const WatchList = () => {
  const { watchList } = useApp()

  return (
    <div className="min-h-screen bg-dark-950 pt-6 pb-20 lg:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            My Watch List
          </h1>
          <p className="text-dark-400">
            {watchList.length} {watchList.length === 1 ? 'item' : 'items'} in your watch list
          </p>
        </div>

        {/* Watch List Grid */}
        {watchList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {watchList.map((item) => (
              <MediaCard 
                key={`${item.id}-${item.type}`} 
                item={item} 
                type={item.type} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="mx-auto h-12 w-12 text-dark-600 mb-4" />
            <p className="text-dark-400 text-lg mb-2">
              Your watch list is empty
            </p>
            <p className="text-dark-500">
              Add movies and TV shows to your watch list to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WatchList