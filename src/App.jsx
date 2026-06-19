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

const is404 =
  typeof window !== 'undefined' &&
  !['/', ''].includes(window.location.pathname) &&
  !window.location.pathname.startsWith('/#')

function LoadingFallback() {
  const { dark } = useTheme()

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${
          dark ? 'border-neutral-300' : 'border-neutral-700'
        }`}
      />
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
      className="relative min-h-screen overflow-x-hidden text-white"
      style={{
        backgroundColor: dark ? '#000000' : '#0a0a0a',
      }}
    >
      <InteractiveBackground />

      <div className="relative z-10">
        <Navbar />

        <main className="relative z-10">
          <Suspense fallback={<LoadingFallback />}>
            <Hero />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <About />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <Journey />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <Projects />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <Contact />
          </Suspense>
        </main>

        <Footer />
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: dark ? 'rgba(10,10,10,0.92)' : 'rgba(20,20,20,0.92)',
            color: '#f5f5f5',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
          },
          success: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#111111',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#111111',
            },
          },
        }}
      />
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