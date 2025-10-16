export const theme = {
  colors: {
    background: 'rgb(var(--color-background) / 1)',
    surface: 'rgb(var(--color-surface) / 1)',
    foreground: 'rgb(var(--color-foreground) / 1)',
    primary: 'rgb(var(--color-primary) / 1)',
    accent: 'rgb(var(--color-accent) / 1)',
    muted: 'rgb(var(--color-muted) / 1)',
    border: 'rgb(var(--color-border) / 1)',
  },
  fonts: {
    sans: 'var(--font-sans)',
    display: '"Press Start 2P", cursive',
  },
}

export type Theme = typeof theme
