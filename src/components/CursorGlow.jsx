import { useCursorGlow } from '../hooks/useCursorGlow'

function CursorGlow() {
  useCursorGlow()
  
  return <div id="cursor-glow" aria-hidden="true" />
}

export default CursorGlow
