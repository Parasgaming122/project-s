import { useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'

export const useTVNavigation = (focusableElements = []) => {
  const { isTV, currentFocus, dispatch } = useApp()

  const setFocus = useCallback((index) => {
    dispatch({ type: 'SET_FOCUS', payload: index })
  }, [dispatch])

  const handleKeyDown = useCallback((event) => {
    if (!isTV) return

    const { key } = event
    const currentIndex = currentFocus || 0
    const maxIndex = focusableElements.length - 1

    switch (key) {
      case 'ArrowUp':
        event.preventDefault()
        setFocus(Math.max(0, currentIndex - 1))
        break
      case 'ArrowDown':
        event.preventDefault()
        setFocus(Math.min(maxIndex, currentIndex + 1))
        break
      case 'ArrowLeft':
        event.preventDefault()
        // Handle horizontal navigation based on grid layout
        break
      case 'ArrowRight':
        event.preventDefault()
        // Handle horizontal navigation based on grid layout
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (focusableElements[currentIndex]) {
          focusableElements[currentIndex].click()
        }
        break
      case 'Escape':
      case 'Backspace':
        event.preventDefault()
        window.history.back()
        break
    }
  }, [isTV, currentFocus, focusableElements, setFocus])

  useEffect(() => {
    if (isTV) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isTV, handleKeyDown])

  useEffect(() => {
    if (isTV && focusableElements.length > 0) {
      // Apply focus styling
      focusableElements.forEach((element, index) => {
        if (element) {
          if (index === currentFocus) {
            element.classList.add('tv-focused')
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          } else {
            element.classList.remove('tv-focused')
          }
        }
      })
    }
  }, [isTV, currentFocus, focusableElements])

  return {
    isTV,
    currentFocus,
    setFocus,
    handleKeyDown
  }
}