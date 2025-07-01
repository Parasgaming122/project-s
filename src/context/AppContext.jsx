import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  favorites: JSON.parse(localStorage.getItem('onstream_favorites') || '[]'),
  watchList: JSON.parse(localStorage.getItem('onstream_watchlist') || '[]'),
  watchHistory: JSON.parse(localStorage.getItem('onstream_history') || '[]'),
  currentFocus: null,
  isTV: false,
  user: null,
  theme: 'dark'
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_FAVORITES':
      const newFavorites = [...state.favorites, action.payload]
      localStorage.setItem('onstream_favorites', JSON.stringify(newFavorites))
      return { ...state, favorites: newFavorites }
    
    case 'REMOVE_FROM_FAVORITES':
      const filteredFavorites = state.favorites.filter(item => 
        !(item.id === action.payload.id && item.type === action.payload.type)
      )
      localStorage.setItem('onstream_favorites', JSON.stringify(filteredFavorites))
      return { ...state, favorites: filteredFavorites }
    
    case 'ADD_TO_WATCHLIST':
      const newWatchList = [...state.watchList, action.payload]
      localStorage.setItem('onstream_watchlist', JSON.stringify(newWatchList))
      return { ...state, watchList: newWatchList }
    
    case 'REMOVE_FROM_WATCHLIST':
      const filteredWatchList = state.watchList.filter(item => 
        !(item.id === action.payload.id && item.type === action.payload.type)
      )
      localStorage.setItem('onstream_watchlist', JSON.stringify(filteredWatchList))
      return { ...state, watchList: filteredWatchList }
    
    case 'ADD_TO_HISTORY':
      const newHistory = [action.payload, ...state.watchHistory.filter(item => 
        !(item.id === action.payload.id && item.type === action.payload.type)
      )].slice(0, 50)
      localStorage.setItem('onstream_history', JSON.stringify(newHistory))
      return { ...state, watchHistory: newHistory }
    
    case 'SET_FOCUS':
      return { ...state, currentFocus: action.payload }
    
    case 'SET_TV_MODE':
      return { ...state, isTV: action.payload }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    // Detect TV/Android TV
    const userAgent = navigator.userAgent.toLowerCase()
    const isAndroidTV = userAgent.includes('android') && userAgent.includes('tv')
    const isLargeScreen = window.innerWidth >= 1920 && window.innerHeight >= 1080
    
    if (isAndroidTV || isLargeScreen) {
      dispatch({ type: 'SET_TV_MODE', payload: true })
    }
  }, [])

  const addToFavorites = (item) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: item })
  }

  const removeFromFavorites = (item) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: item })
  }

  const addToWatchList = (item) => {
    dispatch({ type: 'ADD_TO_WATCHLIST', payload: item })
  }

  const removeFromWatchList = (item) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: item })
  }

  const addToHistory = (item) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: item })
  }

  const isFavorite = (id, type) => {
    return state.favorites.some(item => item.id === id && item.type === type)
  }

  const isInWatchList = (id, type) => {
    return state.watchList.some(item => item.id === id && item.type === type)
  }

  const value = {
    ...state,
    addToFavorites,
    removeFromFavorites,
    addToWatchList,
    removeFromWatchList,
    addToHistory,
    isFavorite,
    isInWatchList,
    dispatch
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}