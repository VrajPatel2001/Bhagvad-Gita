import { type ReactElement } from 'react'

import { render, screen } from '@testing-library/react'

import { AppStateProvider } from '@/store/appState'
import HomePage from './HomePage'

const renderWithProviders = (ui: ReactElement) => {
  return render(<AppStateProvider>{ui}</AppStateProvider>)
}

describe('HomePage', () => {
  it('renders the hero section', () => {
    renderWithProviders(<HomePage />)

    expect(screen.getByText(/mission control/i)).toBeInTheDocument()
    expect(screen.getByText(/assemble your dream arcade experience/i)).toBeInTheDocument()
  })
})
