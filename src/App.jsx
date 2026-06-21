import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, useTheme } from './ThemeContext'
import { ScrollNarrativeProvider } from './ScrollNarrative'
import { getColors } from './colors'
import Navbar from './components/Navbar'
import NarrativeBackground from './components/NarrativeBackground'
import Footer from './components/Footer'

const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Journey = lazy(() => import('./components/Journey'))
const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))

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

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: c.bg, color: c.textPrimary }}>
      <NarrativeBackground />
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
        style: { background: c.card, color: c.textPrimary, backdropFilter: 'blur(10px)', border: `1px solid ${c.cardBorder}` },
        success: { iconTheme: { primary: c.accent, secondary: c.card } },
        error: { iconTheme: { primary: c.danger, secondary: c.card } },
      }} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollNarrativeProvider>
        <AppInner />
      </ScrollNarrativeProvider>
    </ThemeProvider>
  )
}
