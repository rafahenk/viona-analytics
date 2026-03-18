import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './layout/AppSidebar'
import { AppHeader } from './layout/AppHeader'
import { AppFooter } from './layout/AppFooter'

export default function Layout() {
  const location = useLocation()
  const publicRoutes = ['/', '/login', '/register']
  const isPublicPage = publicRoutes.includes(location.pathname)

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
