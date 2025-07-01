import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Film, Tv, Search, Heart } from 'lucide-react'

const MobileNavigation = () => {
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Film, label: 'Movies', path: '/movies' },
    { icon: Tv, label: 'TV Shows', path: '/tv' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur-lg border-t border-dark-700 z-50">
      <nav className="flex justify-around items-center py-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-accent-500'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default MobileNavigation