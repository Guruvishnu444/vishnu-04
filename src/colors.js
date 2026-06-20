// Shared color tokens — import this object pattern inline in each component via useTheme()
// Dark mode:
//   bg: #0D1117, card: #161B22, textPrimary: #E6EDF2, textSecondary: #8B949E, accent: #58A6FF
// Light mode:
//   bg: #F8F9FA, card: #FFFFFF, textPrimary: #1F2328, textSecondary: #57606A, accent: #0969DA
export const getColors = (dark) => ({
  bg: dark ? '#0D1117' : '#F8F9FA',
  card: dark ? '#161B22' : '#FFFFFF',
  textPrimary: dark ? '#E6EDF2' : '#1F2328',
  textSecondary: dark ? '#8B949E' : '#57606A',
  accent: dark ? '#58A6FF' : '#0969DA',
  cardBorder: dark ? 'rgba(88,166,255,0.15)' : 'rgba(9,105,218,0.15)',
  accentSoft: dark ? 'rgba(88,166,255,0.12)' : 'rgba(9,105,218,0.10)',
})
