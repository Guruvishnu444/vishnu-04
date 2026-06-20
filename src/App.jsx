import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, useTheme } from './ThemeContext'
import { getColors } from './colors'
import Navbar from './components/Navbar'
import InteractiveBackground from './components/InteractiveBackground'
import Footer from './components/Footer'
import NotFound from './components/NotFound'

const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Journey = lazy(() => import('./components/Journey'))
const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))

const is404 = typeof window !== 'undefined' &&
  !['/', ''].includes(window.location.pathname) &&
  !window.location.pathname.startsWith('/#')

function LoadingFallback() {
  const { dark } = useTheme()
  const c = getColors(dark)
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full animate-spin border-2 border-t-transparent" style={{ borderColor: c.accent, borderTopColor: 'transparent' }} />
    </div>
  )
}

function AppInner() {
  const { dark } = useTheme()
  const c = getColors(dark)

  if (is404) {
    return <NotFound />
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: c.bg, color: c.textPrimary }}
    >
      <InteractiveBackground />
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}><Hero /></Suspense>
        <Suspense fallback={<LoadingFallback />}><About /></Suspense>
        <Suspense fallback={<LoadingFallback />}><Journey /></Suspense>
        <Suspense fallback={<LoadingFallback />}><Projects /></Suspense>
        <Suspense fallback={<LoadingFallback />}><Contact /></Suspense>
      </main>
      <Footer />
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: c.card,
          color: c.textPrimary,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${c.cardBorder}`,
        },
        success: { iconTheme: { primary: c.accent, secondary: c.card } },
        error: { iconTheme: { primary: '#f85149', secondary: c.card } },
      }} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}

export default App
