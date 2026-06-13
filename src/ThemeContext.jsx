import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({ dark: true, toggle: () => {} }) // ✅ "toggle" not "toggleTheme"

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
    <ThemeContext.Provider value={{ dark, toggle }}> {/* ✅ consistent */}
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)