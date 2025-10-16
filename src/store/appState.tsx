import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ThemeMode = 'system' | 'light' | 'dark'

type AppState = {
  theme: ThemeMode
  cycleTheme: () => void
}

const AppStateContext = createContext<AppState | null>(null)

const themeOrder: ThemeMode[] = ['system', 'light', 'dark']

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>('system')

  const cycleTheme = () => {
    setTheme((current) => {
      const nextIndex = (themeOrder.indexOf(current) + 1) % themeOrder.length
      return themeOrder[nextIndex]
    })
  }

  const value = useMemo(() => ({ theme, cycleTheme }), [theme])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export const useAppState = () => {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used inside an AppStateProvider')
  }

  return context
}
