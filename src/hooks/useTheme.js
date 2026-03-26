import { useEffect, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'theme'

function applyThemeClass(theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEY, 'light')

  useEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  const api = useMemo(() => {
    return {
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    }
  }, [theme, setTheme])

  return api
}

