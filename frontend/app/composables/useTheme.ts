export default function useTheme() {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (process.client) {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', newTheme)
    }
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    applyTheme(newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const initTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = saved || (prefersDark ? 'dark' : 'light')
      theme.value = initial
      applyTheme(initial)
    }
  }

  return { theme, setTheme, toggleTheme, initTheme }
}
