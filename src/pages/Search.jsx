import React, { useState, useEffect, useCallback } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import MediaCard from '../components/UI/MediaCard'
import { tmdbApi } from '../services/tmdb'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const searchContent = useCallback(async (searchQuery, currentPage = 1, reset = false) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      const response = await tmdbApi.searchMulti(searchQuery, currentPage)
      
      if (reset) {
        setResults(response.results || [])
      } else {
        setResults(prev => [...prev, ...(response.results || [])])
      }
      
      setHasMore(currentPage < response.total_pages)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchContent(query, 1, true)
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, searchContent])

  const loadMore = () => {
    if (!loading && hasMore && query) {
      const nextPage = page + 1
      setPage(nextPage)
      searchContent(query, nextPage, false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setPage(1)
    setHasMore(false)
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-6 pb-20 lg:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Search
          </h1>
          
          {/* Search Input */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-dark-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, TV shows..."
              className="block w-full pl-10 pr-10 py-3 border border-dark-700 rounded-lg bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-dark-400 hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {query && (
          <>
            {loading && results.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-white">Searching...</div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-dark-300">
                    Found {results.length} results for "{query}"
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {results.map((item) => (
                    <MediaCard 
                      key={`${item.id}-${item.media_type}`} 
                      item={item} 
                      type={item.media_type} 
                    />
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
              </>
            ) : !loading && (
              <div className="text-center py-12">
                <p className="text-dark-400 text-lg">
                  No results found for "{query}"
                </p>
                <p className="text-dark-500 mt-2">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto h-12 w-12 text-dark-600 mb-4" />
            <p className="text-dark-400 text-lg">
              Start typing to search for movies and TV shows
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search