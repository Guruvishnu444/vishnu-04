import { useEffect, useCallback } from 'react'

export function useCursorGlow() {
  const handleMouseMove = useCallback((e) => {
    const cursor = document.getElementById('cursor-glow')
    if (!cursor) return

    // Lerp smoothing
    const currentX = parseFloat(cursor.dataset.x || e.clientX)
    const currentY = parseFloat(cursor.dataset.y || e.clientY)
    
    const targetX = e.clientX
    const targetY = e.clientY
    
    const smoothX = currentX + (targetX - currentX) * 0.15
    const smoothY = currentY + (targetY - currentY) * 0.15
    
    cursor.style.left = `${smoothX}px`
    cursor.style.top = `${smoothY}px`
    cursor.dataset.x = smoothX
    cursor.dataset.y = smoothY
  }, [])

  useEffect(() => {
    let animationId
    const cursor = document.getElementById('cursor-glow')
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    animate()
    
    // Hide cursor glow on touch devices
    if ('ontouchstart' in window) {
      if (cursor) cursor.style.display = 'none'
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [handleMouseMove])
}

export default useCursorGlow
