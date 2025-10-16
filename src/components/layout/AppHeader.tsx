import { NavLink } from 'react-router-dom'

import { navigationItems } from '@/data/navigation'
import { useAppState } from '@/store/appState'

const AppHeader = () => {
  const { theme, cycleTheme } = useAppState()

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-surface/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <NavLink to="/" className="flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-xs uppercase text-primary">
            GG
          </span>
          Game Grid
        </NavLink>

        <nav className="flex items-center gap-2 text-sm font-medium text-muted">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 transition',
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'hover:bg-primary/10 hover:text-foreground',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={cycleTheme}
          className="hidden rounded-full border border-border/60 bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:-translate-y-px hover:bg-primary/10 hover:text-primary md:inline-flex"
        >
          {theme.toUpperCase()}
        </button>
      </div>
    </header>
  )
}

export default AppHeader
