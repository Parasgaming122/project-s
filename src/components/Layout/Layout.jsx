import React from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNavigation from './MobileNavigation'
import { useApp } from '../../context/AppContext'

const Layout = ({ children }) => {
  const { isTV } = useApp()
  const location = useLocation()
  const isPlayerPage = location.pathname.startsWith('/watch')

  if (isPlayerPage) {
    return <div className="min-h-screen bg-dark-950">{children}</div>
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar for desktop and TV */}
      <div className={`${isTV ? 'tv-sidebar' : 'hidden lg:block'}`}>
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className={`flex-1 ${isTV ? 'ml-20' : 'lg:ml-64'}`}>
        {children}
      </div>
      
      {/* Mobile navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
    </div>
  )
}

export default Layout