import React, { useState, useEffect } from 'react'
import Hero from '../components/UI/Hero'
import MediaRow from '../components/UI/MediaRow'
import { tmdbApi } from '../services/tmdb'

const Home = () => {
  const [heroItems, setHeroItems] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingTV, setTrendingTV] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingResponse,
          trendingMoviesResponse,
          trendingTVResponse,
          popularMoviesResponse,
          popularTVResponse,
          topRatedMoviesResponse
        ] = await Promise.all([
          tmdbApi.getTrending('all', 'day'),
          tmdbApi.getTrending('movie', 'day'),
          tmdbApi.getTrending('tv', 'day'),
          tmdbApi.getPopularMovies(),
          tmdbApi.getPopularTVShows(),
          tmdbApi.getTopRatedMovies()
        ])

        setHeroItems(trendingResponse.results?.slice(0, 5) || [])
        setTrendingMovies(trendingMoviesResponse.results || [])
        setTrendingTV(trendingTVResponse.results || [])
        setPopularMovies(popularMoviesResponse.results || [])
        setPopularTV(popularTVResponse.results || [])
        setTopRatedMovies(topRatedMoviesResponse.results || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <Hero items={heroItems} />
      
      {/* Content Rows */}
      <div className="space-y-8 pb-20 lg:pb-8">
        <MediaRow 
          title="Trending Movies" 
          items={trendingMovies} 
          type="movie"
          className="mt-8"
        />
        
        <MediaRow 
          title="Trending TV Shows" 
          items={trendingTV} 
          type="tv"
        />
        
        <MediaRow 
          title="Popular Movies" 
          items={popularMovies} 
          type="movie"
        />
        
        <MediaRow 
          title="Popular TV Shows" 
          items={popularTV} 
          type="tv"
        />
        
        <MediaRow 
          title="Top Rated Movies" 
          items={topRatedMovies} 
          type="movie"
        />
      </div>
    </div>
  )
}

export default Home