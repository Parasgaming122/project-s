import React, { useState, useEffect } from 'react'
import MediaCard from '../components/UI/MediaCard'
import { tmdbApi } from '../services/tmdb'
import { ChevronDown } from 'lucide-react'

const TVShows = () => {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('popular')
  const [hasMore, setHasMore] = useState(true)

  const categories = [
    { value: 'popular', label: 'Popular' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'on_the_air', label: 'On The Air' },
    { value: 'airing_today', label: 'Airing Today' }
  ]

  const fetchShows = async (currentPage = 1, currentCategory = category, reset = false) => {
    try {
      setLoading(true)
      let response
      
      switch (currentCategory) {
        case 'top_rated':
          response = await tmdbApi.getTopRatedTVShows(currentPage)
          break
        case 'on_the_air':
          response = await tmdbApi.getOnTheAirTVShows(currentPage)
          break
        case 'airing_today':
          response = await tmdbApi.getAiringTodayTVShows(currentPage)
          break
        default:
          response = await tmdbApi.getPopularTVShows(currentPage)
      }

      if (reset) {
        setShows(response.results || [])
      } else {
        setShows(prev => [...prev, ...(response.results || [])])
      }
      
      setHasMore(currentPage < response.total_pages)
    } catch (error) {
      console.error('Error fetching TV shows:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShows(1, category, true)
    setPage(1)
  }, [category])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchShows(nextPage, category, false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-6 pb-20 lg:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-0">
            TV Shows
          </h1>
          
          {/* Category Filter */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-dark-800 text-white px-4 py-2 pr-8 rounded-lg border border-dark-700 focus:border-accent-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
          </div>
        </div>

        {/* TV Shows Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {shows.map((show) => (
            <MediaCard key={show.id} item={show} type="tv" />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-accent-500 hover:bg-accent-600 disabled:bg-dark-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TVShows