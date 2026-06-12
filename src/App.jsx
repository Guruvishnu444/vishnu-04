import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, useTheme } from './ThemeContext'
import Navbar from './components/Navbar'
import InteractiveBackground from './components/InteractiveBackground'
import Footer from './components/Footer'

const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Journey = lazy(() => import('./components/Journey'))
const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))

function LoadingFallback() {
  const theme = useTheme()
const dark = theme?.dark ?? true
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${dark ? 'border-sky-400' : 'border-sky-500'}`} />
    </div>
  )
}

function AppInner() {
  const { dark } = useTheme()
  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${dark ? 'bg-[#1a1a1a]' : 'bg-[#fffaf0]'}`}>
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
          background: dark ? 'rgba(30,30,30,0.95)' : 'rgba(255,250,240,0.95)',
          color: dark ? '#f5f5f5' : '#2b2b2b',
          backdropFilter: 'blur(10px)',
          border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        },
        success: { iconTheme: { primary: '#38BDF8', secondary: dark ? '#1a1a1a' : '#fffaf0' } },
        error: { iconTheme: { primary: '#EF4444', secondary: dark ? '#1a1a1a' : '#fffaf0' } },
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
