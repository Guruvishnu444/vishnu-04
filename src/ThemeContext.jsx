import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setDark(saved === 'dark')
  }, [])

  const toggle = () => {
    setDark(prev => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light')
      return !prev
    })
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) return { dark: true, toggle: () => {} }
  return context
}