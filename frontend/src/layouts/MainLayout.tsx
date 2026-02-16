import { Outlet } from 'react-router-dom'
import { Header, Footer } from '@/components/layout'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
