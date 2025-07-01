import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'

const MediaRow = ({ title, items, type, className = '' }) => {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    const container = scrollRef.current
    if (container) {
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!items || items.length === 0) return null

  return (
    <div className={`relative ${className}`}>
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-6">
        {title}
      </h2>
      
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r-lg transition-colors hidden md:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l-lg transition-colors hidden md:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Items container */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-4"
      >
        {items.map((item) => (
          <div key={`${item.id}-${type}`} className="flex-none w-32 md:w-48">
            <MediaCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MediaRow