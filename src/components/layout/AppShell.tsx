import { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { useAppState } from '../../state/AppStateContext';
import type { AppSection } from '../../state/AppStateContext';

const navigationItems: Array<{
  id: AppSection;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'home',
    label: 'Home',
    description: 'Dashboard of your Gita journey',
    icon: '🌅',
  },
  {
    id: 'reader',
    label: 'Reader',
    description: 'Study verses and commentary',
    icon: '📖',
  },
  {
    id: 'game',
    label: 'Game',
    description: 'Interactive learning challenges',
    icon: '🎮',
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, activeSection, setActiveSection } = useAppState();

  const handleNavigation = (section: AppSection) => {
    setActiveSection(section);

    if (section !== 'home' && typeof document !== 'undefined') {
      const mainElement = document.getElementById('main-content');
      mainElement?.focus();
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="top-nav">
        <div className="top-nav__brand" aria-label="Bhagavad Gita Companion">
          <span className="top-nav__glyph" aria-hidden="true">
            ॐ
          </span>
          <div>
            <Typography variant="label" weight="medium" className="top-nav__eyebrow">
              Bhagavad Gita Companion
            </Typography>
            <Typography variant="headline" as="p" weight="medium">
              Learning Journey
            </Typography>
          </div>
        </div>
        <div className="top-nav__meta" role="presentation">
          <div className="top-nav__affirmation">
            <Typography variant="eyebrow" className="top-nav__greeting">
              Namaste, {user.name}
            </Typography>
            <Typography variant="detail" className="top-nav__mantra">
              “{user.mantra}”
            </Typography>
          </div>
          <Button
            size="sm"
            variant="secondary"
            startIcon="⭐️"
            aria-label="View journey milestones"
          >
            {user.streak}-day streak
          </Button>
        </div>
      </header>

      <div className="app-shell__body">
        <nav className="side-nav" aria-label="Primary">
          <ul>
            {navigationItems.map((item) => {
              const isActive = item.id === activeSection;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={isActive ? 'side-nav__item side-nav__item--active' : 'side-nav__item'}
                    onClick={() => handleNavigation(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span aria-hidden="true" className="side-nav__icon">
                      {item.icon}
                    </span>
                    <span className="side-nav__text">
                      <Typography variant="label" weight="medium">
                        {item.label}
                      </Typography>
                      <Typography variant="detail">{item.description}</Typography>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main id="main-content" className="app-shell__main" tabIndex={-1}>
          {children}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Primary">
        <ul>
          {navigationItems.map((item) => {
            const isActive = item.id === activeSection;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={isActive ? 'mobile-nav__item mobile-nav__item--active' : 'mobile-nav__item'}
                  onClick={() => handleNavigation(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span aria-hidden="true" className="mobile-nav__icon">
                    {item.icon}
                  </span>
                  <span className="mobile-nav__label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
