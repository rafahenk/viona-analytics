import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './layout/AppSidebar'
import { AppHeader } from './layout/AppHeader'
import { AppFooter } from './layout/AppFooter'
import { useAuth } from '@/hooks/use-auth'
import { Aperture } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  const { user, loading } = useAuth()

  const publicRoutes = ['/', '/login', '/register']
  const isPublicPage = publicRoutes.includes(location.pathname)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Aperture className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Iniciando plataforma...</p>
      </div>
    )
  }

  if (!user && !isPublicPage) {
    return <Navigate to="/login" replace />
  }

  if (user && isPublicPage && location.pathname !== '/') {
    return <Navigate to="/dashboard" replace />
  }

  if (isPublicPage && location.pathname === '/') {
    return <Outlet />
  }

  if (isPublicPage) {
    return <Outlet />
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex w-full flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto bg-muted/10">
            <div className="p-6 md:p-8 animate-fade-in mx-auto max-w-[1600px] w-full">
              <Outlet />
            </div>
          </main>
          <AppFooter />
        </div>
      </div>
    </SidebarProvider>
  )
}
