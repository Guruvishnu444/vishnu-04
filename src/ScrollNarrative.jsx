import { createContext, useContext, useEffect, useRef, useState } from 'react'

// ── Scroll Narrative ──────────────────────────────────────────
// One scroll listener. One source of truth. Every section AND the
// background read from this instead of running their own independent
// IntersectionObservers / scroll math. This is what makes the motion
// feel like one continuous story instead of five unrelated effects.
//
// `chapter` = which named section is currently "active" (0..N-1)
// `chapterProgress` = 0→1 progress through the *current* chapter
// `globalProgress` = 0→1 progress through the entire page

const ScrollNarrativeContext = createContext(null)

export const CHAPTERS = ['hero', 'about', 'journey', 'projects', 'contact']

export function ScrollNarrativeProvider({ children }) {
  const [chapter, setChapter] = useState(0)
  const [chapterProgress, setChapterProgress] = useState(0)
  const [globalProgress, setGlobalProgress] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const compute = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const gp = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0
      setGlobalProgress(gp)

      // Find which chapter's section is most centered in viewport
      const viewportCenter = scrollY + window.innerHeight * 0.4
      let activeIndex = 0
      let activeProgress = 0

      CHAPTERS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (!el) return
        const top = el.offsetTop
        const height = el.offsetHeight
        if (viewportCenter >= top) {
          activeIndex = i
          activeProgress = Math.min(1, Math.max(0, (viewportCenter - top) / height))
        }
      })

      setChapter(activeIndex)
      setChapterProgress(activeProgress)
      rafRef.current = null
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <ScrollNarrativeContext.Provider value={{ chapter, chapterProgress, globalProgress, chapterName: CHAPTERS[chapter] }}>
      {children}
    </ScrollNarrativeContext.Provider>
  )
}

export const useScrollNarrative = () => useContext(ScrollNarrativeContext)
