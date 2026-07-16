export default defineNuxtPlugin(() => {
  if (process.client) {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = saved || (prefersDark ? 'dark' : 'light')
    if (initial === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }
})
