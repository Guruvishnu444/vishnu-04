import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, useTheme } from './ThemeContext'
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
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${dark ? 'border-orange-400' : 'border-violet-500'}`} />
    </div>
  )
}

function AppInner() {
  const { dark } = useTheme()

  if (is404) {
    return <NotFound />
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: dark ? '#000000' : '#00f0ff' }}>
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
          background: dark ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)',
          color: dark ? '#f5f5f5' : '#1a1a1a',
          backdropFilter: 'blur(10px)',
          border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        },
        success: { iconTheme: { primary: dark ? '#f97316' : '#8b5cf6', secondary: dark ? '#000' : '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: dark ? '#000' : '#fff' } },
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
