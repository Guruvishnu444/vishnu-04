import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useTheme } from '../ThemeContext'

// ── Skill data with proficiency + tooltip ──────────────────────────────────
const skillTabs = {
  Frontend: [
    { name: 'HTML5',      level: 'Expert',        use: 'Daily Use',     tip: 'Semantic HTML, accessibility, SEO structure' },
    { name: 'CSS3',       level: 'Expert',        use: 'Daily Use',     tip: 'Flexbox, Grid, animations, responsive design' },
    { name: 'JavaScript', level: 'Intermediate',  use: 'Daily Use',     tip: 'ES6+, DOM, async/await, fetch API' },
    { name: 'React',      level: 'Intermediate',  use: 'Daily Use',     tip: 'Hooks, context, Framer Motion, Vite' },
    { name: 'Tailwind',   level: 'Intermediate',  use: 'Daily Use',     tip: 'Utility-first CSS, responsive design tokens' },
  ],
  Backend: [
    { name: 'Python',     level: 'Intermediate',  use: 'Regular',       tip: 'Scripting, data processing, Flask basics' },
    { name: 'Java',       level: 'Intermediate',  use: 'Academic',      tip: 'OOP, data structures, algorithms' },
    { name: 'C',          level: 'Beginner',      use: 'Academic',      tip: 'Pointers, memory management, low-level logic' },
    { name: 'C++',        level: 'Beginner',      use: 'Academic',      tip: 'OOP, STL, competitive programming' },
    { name: 'MySQL',      level: 'Beginner',      use: 'Learning',      tip: 'Queries, joins, relational DB design' },
  ],
  Tools: [
    { name: 'Git',        level: 'Intermediate',  use: 'Daily Use',     tip: 'Version control, branching, GitHub workflows' },
    { name: 'VS Code',    level: 'Expert',        use: 'Daily Use',     tip: 'Extensions, debugging, workspace config' },
    { name: 'Vite',       level: 'Intermediate',  use: 'Regular',       tip: 'Fast bundler, HMR, React project scaffolding' },
    { name: 'Vercel',     level: 'Beginner',      use: 'Regular',       tip: 'CI/CD deployment, environment variables' },
    { name: 'Figma',      level: 'Beginner',      use: 'Learning',      tip: 'UI wireframing, component design basics' },
  ],
}

const levelColors = {
  Expert:       { dark: 'text-green-400 bg-green-400/15',       light: 'text-green-600 bg-green-500/10' },
  Intermediate: { dark: 'text-orange-400 bg-orange-400/15',     light: 'text-violet-600 bg-violet-400/10' },
  Beginner:     { dark: 'text-red-400 bg-red-400/15',           light: 'text-pink-500 bg-pink-400/10' },
}
const useColors = {
  'Daily Use': { dark: 'text-sky-400 bg-sky-400/10',     light: 'text-blue-500 bg-blue-400/10' },
  'Regular':   { dark: 'text-purple-400 bg-purple-400/10', light: 'text-purple-500 bg-purple-400/10' },
  'Academic':  { dark: 'text-yellow-400 bg-yellow-400/10', light: 'text-yellow-600 bg-yellow-400/10' },
  'Learning':  { dark: 'text-gray-400 bg-gray-400/10',    light: 'text-gray-500 bg-gray-400/10' },
}

// SVG icon glyphs — monochrome minimal
const icons = {
  HTML5:      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>,
  CSS3:       <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>,
  JavaScript: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>,
  React:      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.150-1.315.283-2.015.386.24-.375.48-.762.705-1.158.225-.39.435-.782.634-1.176zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/></svg>,
  Tailwind:   <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>,
  Python:     <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.28-.01h.1l.21.03.28.07.32.12.35.18.36.26.36.36.35.46.32.59.28.73.21.88.14 1.05.05 1.23-.06 1.22-.16 1.04-.24.87-.32.71-.36.57-.4.44-.42.33-.42.24-.4.16-.36.1-.32.05-.28.01"/></svg>,
  Java:       <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639"/></svg>,
  C:          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M16.5 2c-1.67 0-3.26.4-4.68 1.12L12 3.2l.18-.08A10.45 10.45 0 0 1 16.5 2M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m0 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5m0 2A6.5 6.5 0 0 0 5.5 12a6.5 6.5 0 0 0 6.5 6.5 6.5 6.5 0 0 0 5.5-3.03l-1.31-.75A5 5 0 0 1 12 17a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 4.19 2.28l1.31-.75A6.5 6.5 0 0 0 12 5.5z"/></svg>,
  'C++':      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.109-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z"/></svg>,
  MySQL:      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.274.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.7-2.743-2.1-2.743-.657 0-1.172.22-1.546.663-.376.443-.564 1.06-.564 1.852 0 .818.188 1.418.564 1.8.374.383.9.575 1.58.575.364 0 .718-.075 1.06-.225l1.216.775-.097-.694zm-1.854-1.056c-.38 0-.68-.133-.898-.4-.218-.267-.327-.675-.327-1.226 0-.602.114-1.047.344-1.335.23-.288.524-.432.882-.432.367 0 .658.136.876.406.218.27.324.68.324 1.227 0 .55-.1.964-.3 1.24-.2.276-.48.414-.9.52h-.002z"/></svg>,
  Git:        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>,
  'VS Code':  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 20.06V3.939a1.5 1.5 0 00-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>,
  Vite:       <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M21.16 4.84l-9-4.5a.6.6 0 00-.32 0l-9 4.5A.6.6 0 002.5 5.4v.6L12 20.5l9.5-14.5v-.6a.6.6 0 00-.34-.56zM12 17.94L4.06 6h15.88L12 17.94z"/></svg>,
  Vercel:     <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>,
  Figma:      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 00-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.39 4.49zm-.098-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019z"/></svg>,
}

// Tilt card component
function TiltCard({ children, className }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8])
  const springRotX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={cardRef}
      style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}>
      {children}
    </motion.div>
  )
}

// Tooltip
function Tooltip({ text, dark, children }) {
  const [show, setShow] = useState(false)
  const bg = dark ? 'bg-[#1a1a1a] border-white/10 text-[#f5f5f5]' : 'bg-white border-black/10 text-[#1a1a1a]'
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-44 text-xs text-center px-3 py-2 rounded-xl border shadow-xl ${bg}`}>
            {text}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${dark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-black/10'}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Marquee skill strip
function SkillMarquee({ skills, dark, speed = 30 }) {
  const iconColor = dark ? 'text-orange-400/70' : 'text-violet-500/70'
  const doubled = [...skills, ...skills]
  return (
    <div className="overflow-hidden relative">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 w-max"
      >
        {doubled.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 opacity-60 ${iconColor}`}>
            {icons[s.name] || <span className="w-7 h-7" />}
            <span className={`text-xs font-medium whitespace-nowrap ${dark ? 'text-[#f5f5f5]/50' : 'text-[#1a1a1a]/50'}`}>{s.name}</span>
          </div>
        ))}
      </motion.div>
      {/* fade edges */}
      <div className={`absolute inset-y-0 left-0 w-12 ${dark ? 'bg-gradient-to-r from-black' : 'bg-gradient-to-r from-white'} to-transparent z-10`} />
      <div className={`absolute inset-y-0 right-0 w-12 ${dark ? 'bg-gradient-to-l from-black' : 'bg-gradient-to-l from-white'} to-transparent z-10`} />
    </div>
  )
}

// Main About component
function About() {
  const { dark } = useTheme()
  const [activeTab, setActiveTab] = useState('Frontend')

  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/60' : 'text-[#1a1a1a]/60'
  const glass = dark
    ? 'bg-white/[0.04] border-white/[0.08] backdrop-blur-xl'
    : 'bg-black/[0.03] border-black/[0.07] backdrop-blur-xl'
  const glassHover = dark ? 'hover:border-orange-500/30' : 'hover:border-violet-400/30'
  const headingGrad = dark ? 'from-red-500 via-orange-400 to-red-400' : 'from-blue-400 via-pink-400 to-violet-500'
  const badgeBg = dark ? 'bg-red-500/10 text-red-400' : 'bg-blue-400/10 text-blue-500'
  const tabActive = dark
    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
    : 'bg-gradient-to-r from-blue-400 via-pink-400 to-violet-500 text-white shadow-lg'
  const tabInactive = dark
    ? 'text-[#f5f5f5]/50 hover:text-[#f5f5f5]/80 hover:bg-white/5'
    : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]/80 hover:bg-black/5'
  const iconColor = dark ? 'text-orange-400' : 'text-violet-500'

  const currentSkills = skillTabs[activeTab]
  const allSkills = Object.values(skillTabs).flat()

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6" aria-label="About section">
      <div className="max-w-6xl mx-auto">

        {/* ── Bento Grid top ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">

          {/* Large bio card — col span 3 */}
          <TiltCard className={`lg:col-span-3 border rounded-3xl p-7 sm:p-9 ${glass} ${glassHover} transition-all`}>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 ${badgeBg}`}>
              About Me
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black mb-5 leading-tight ${textColor}`}>
              Turning Ideas Into{' '}
              <span className={`bg-gradient-to-r ${headingGrad} bg-clip-text text-transparent`}>
                Digital Reality
              </span>
            </h2>
            <div className={`space-y-3 leading-relaxed text-sm sm:text-base ${mutedText}`}>
              <p>Hi! I'm <strong className={textColor}>Guruvishnu S</strong>, a BSc IT student and passionate Full Stack Developer with a strong foundation in modern web technologies.</p>
              <p>Open to internships and freelance opportunities. I love turning complex problems into elegant, user-friendly solutions.</p>
            </div>
          </TiltCard>

          {/* Stat cards — col span 2, 2 rows */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              { val: '83.8%', label: '12th Grade', sub: 'Kongu Vellalar' },
              { val: '2024',  label: 'BSc IT Start', sub: 'KPRCAS' },
              { val: '15+',   label: 'Technologies', sub: 'Frontend & Backend' },
              { val: '✓',     label: 'Open to Work', sub: 'Internships' },
            ].map((s, i) => (
              <TiltCard key={i}
                className={`border rounded-2xl p-4 sm:p-5 flex flex-col justify-between ${glass} ${glassHover} transition-all`}>
                <p className={`text-2xl sm:text-3xl font-black ${iconColor}`}>{s.val}</p>
                <div>
                  <p className={`text-sm font-bold ${textColor}`}>{s.label}</p>
                  <p className={`text-xs mt-0.5 ${mutedText}`}>{s.sub}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </motion.div>

        {/* ── Marquee strip ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className={`border rounded-2xl py-4 mb-6 overflow-hidden ${glass}`}>
          <SkillMarquee skills={allSkills} dark={dark} speed={35} />
        </motion.div>

        {/* ── Skills Dashboard ──────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>

          {/* Section title */}
          <div className="mb-8 mt-4">
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tight mb-1 ${textColor}`}>
              Technical{' '}
              <span className={`bg-gradient-to-r ${headingGrad} bg-clip-text text-transparent`}>Skills</span>
            </h3>
            <p className={`text-sm ${mutedText}`}>Hover a card to see details. Click a tab to filter by category.</p>
          </div>

          {/* Tabs */}
          <div className={`inline-flex gap-1 p-1 rounded-2xl mb-8 border ${glass}`}>
            {Object.keys(skillTabs).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab ? tabActive : tabInactive}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Asymmetric bento skill grid */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {currentSkills.map((skill, i) => {
                const lc = levelColors[skill.level]?.[dark ? 'dark' : 'light'] || ''
                const uc = useColors[skill.use]?.[dark ? 'dark' : 'light'] || ''
                // first card wider on desktop
                const wide = i === 0 ? 'sm:col-span-1 lg:col-span-2' : ''
                return (
                  <Tooltip key={skill.name} text={skill.tip} dark={dark}>
                    <TiltCard className={`border rounded-2xl p-5 flex flex-col gap-3 cursor-default
                      transition-all duration-200 ${glass} ${glassHover} ${wide}`}>
                      <div className={`${iconColor} self-start`}>
                        {icons[skill.name] || <span className="w-7 h-7 block" />}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${textColor}`}>{skill.name}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${lc}`}>
                            {skill.level}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${uc}`}>
                            {skill.use}
                          </span>
                        </div>
                      </div>
                    </TiltCard>
                  </Tooltip>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default About
