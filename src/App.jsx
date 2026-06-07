import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import InteractiveBackground from './components/InteractiveBackground'
import Footer from './components/Footer'

const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))

function LoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-neon border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Interactive Framer Motion Background */}
      <InteractiveBackground />

      <Navbar />

      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(20, 27, 45, 0.95)',
            color: '#F8FAFC',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#38BDF8',
              secondary: '#0B0F19',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#0B0F19',
            },
          },
        }}
      />
    </div>
  )
}

export default App

