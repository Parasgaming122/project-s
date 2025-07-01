const API_KEY = 'a2f888b27315e62e471b2d587048f32e'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const tmdbApi = {
  // Configuration
  getConfiguration: () => 
    fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`).then(res => res.json()),

  // Movies
  getPopularMovies: (page = 1) =>
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`).then(res => res.json()),
  
  getTopRatedMovies: (page = 1) =>
    fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`).then(res => res.json()),
  
  getNowPlayingMovies: (page = 1) =>
    fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`).then(res => res.json()),
  
  getUpcomingMovies: (page = 1) =>
    fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`).then(res => res.json()),
  
  getMovieDetails: (id) =>
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar,reviews`).then(res => res.json()),
  
  // TV Shows
  getPopularTVShows: (page = 1) =>
    fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`).then(res => res.json()),
  
  getTopRatedTVShows: (page = 1) =>
    fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=${page}`).then(res => res.json()),
  
  getOnTheAirTVShows: (page = 1) =>
    fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=${page}`).then(res => res.json()),
  
  getAiringTodayTVShows: (page = 1) =>
    fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}&page=${page}`).then(res => res.json()),
  
  getTVDetails: (id) =>
    fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar,reviews`).then(res => res.json()),
  
  getTVSeasonDetails: (id, seasonNumber) =>
    fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`).then(res => res.json()),
  
  // Search
  searchMulti: (query, page = 1) =>
    fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`).then(res => res.json()),
  
  searchMovies: (query, page = 1) =>
    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`).then(res => res.json()),
  
  searchTVShows: (query, page = 1) =>
    fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`).then(res => res.json()),
  
  // Trending
  getTrending: (mediaType = 'all', timeWindow = 'day') =>
    fetch(`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`).then(res => res.json()),
  
  // Genres
  getMovieGenres: () =>
    fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`).then(res => res.json()),
  
  getTVGenres: () =>
    fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`).then(res => res.json()),
  
  // Discover
  discoverMovies: (params = {}) => {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params
    })
    return fetch(`${BASE_URL}/discover/movie?${queryParams}`).then(res => res.json())
  },
  
  discoverTVShows: (params = {}) => {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params
    })
    return fetch(`${BASE_URL}/discover/tv?${queryParams}`).then(res => res.json())
  }
}

// Image URL helpers
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-image.jpg'
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return '/placeholder-backdrop.jpg'
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getPosterUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-poster.jpg'
  return `${IMAGE_BASE_URL}/${size}${path}`
}