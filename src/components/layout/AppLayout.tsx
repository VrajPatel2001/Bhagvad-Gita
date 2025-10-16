import { Outlet } from 'react-router-dom'

import AppFooter from '@/components/layout/AppFooter'
import AppHeader from '@/components/layout/AppHeader'

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="container flex-1 py-12">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
