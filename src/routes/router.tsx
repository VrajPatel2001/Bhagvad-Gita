import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

import AppLayout from '@/components/layout/AppLayout'
import CodexPage from '@/pages/codex/CodexPage'
import HomePage from '@/pages/home/HomePage'
import NotFoundPage from '@/pages/not-found/NotFoundPage'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="codex" element={<CodexPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
)

export default router
