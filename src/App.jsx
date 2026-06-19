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
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full animate-spin border-2 border-t-transparent" style={{ borderColor: '#00F0FF', borderTopColor: 'transparent' }} />
    </div>
  )
}

function AppInner() {
  const { dark } = useTheme()

  if (is404) {
    return <NotFound />
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: dark ? '#000000' : '#F8F9FA',
        color: dark ? '#00F0FF' : '#0A1A3A',
      }}
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
          background: dark ? 'rgba(0,0,0,0.95)' : 'rgba(248,249,250,0.95)',
          color: dark ? '#00F0FF' : '#0A1A3A',
          backdropFilter: 'blur(10px)',
          border: dark ? '1px solid rgba(0,240,255,0.2)' : '1px solid rgba(10,26,58,0.15)',
        },
        success: { iconTheme: { primary: '#00F0FF', secondary: dark ? '#000' : '#fff' } },
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
