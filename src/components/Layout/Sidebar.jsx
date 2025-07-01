import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Film, 
  Tv, 
  Search, 
  Heart, 
  Bookmark, 
  Settings,
  Zap
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const Sidebar = () => {
  const location = useLocation()
  const { isTV } = useApp()

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Film, label: 'Movies', path: '/movies' },
    { icon: Tv, label: 'TV Shows', path: '/tv' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: Bookmark, label: 'Watch List', path: '/watchlist' },
  ]

  return (
    <div className={`${isTV ? 'w-20' : 'w-64'} h-screen bg-dark-900/95 backdrop-blur-lg border-r border-dark-700 fixed left-0 top-0 z-50`}>
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isTV && (
            <span className="text-xl font-bold text-white">OnStream</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-accent-500 text-white'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                  } ${isTV ? 'justify-center' : ''}`}
                >
                  <Icon className={`${isTV ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'text-white' : 'group-hover:text-accent-400'}`} />
                  {!isTV && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Settings */}
      {!isTV && (
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button className="flex items-center space-x-3 px-3 py-3 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-white transition-all duration-200 w-full">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar