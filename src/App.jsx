import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import WatchList from './pages/WatchList'
import MovieDetail from './pages/MovieDetail'
import TVDetail from './pages/TVDetail'
import Player from './pages/Player'

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVShows />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TVDetail />} />
            <Route path="/watch/:type/:id" element={<Player />} />
            <Route path="/watch/:type/:id/:season/:episode" element={<Player />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App