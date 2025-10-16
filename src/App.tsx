import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import router from '@/routes/router'
import { AppStateProvider, useAppState } from '@/store/appState'

const ThemeSynchronizer = () => {
  const { theme } = useAppState()

  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    if (theme === 'system') {
      root.removeAttribute('data-theme')
      body.removeAttribute('data-theme')
      return
    }

    root.setAttribute('data-theme', theme)
    body.setAttribute('data-theme', theme)
  }, [theme])

  return null
}

const App = () => {
  return (
    <AppStateProvider>
      <ThemeSynchronizer />
      <RouterProvider router={router} />
    </AppStateProvider>
  )
}

export default App
