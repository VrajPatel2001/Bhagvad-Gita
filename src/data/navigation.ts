export type NavigationItem = {
  label: string
  path: string
  description?: string
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Overview',
    path: '/',
    description: 'Return to the command center for the latest mission briefs.',
  },
  {
    label: 'Codex',
    path: '/codex',
    description: 'Study the core mechanics and lore behind the world.',
  },
]
