import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Video,
  Store,
  BellRing,
  CreditCard,
  Settings,
  LogOut,
  Aperture,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const mainItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Eventos & Relatórios', icon: BellRing, path: '/events' },
  ]

  const financeItems = [{ title: 'Faturamento', icon: CreditCard, path: '/billing' }]

  const configItems = [
    { title: 'Câmeras', icon: Video, path: '/cameras' },
    { title: 'Administrativo', icon: Settings, path: '/admin' },
  ]

  return (
    <Sidebar variant="inset" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 py-4 px-4 flex flex-row items-center gap-2">
        <Aperture className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl tracking-tight truncate">Viona</span>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <div className="px-3 mb-6">
          <Link
            to="/analytics"
            className="group relative flex items-center p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
          >
            <div className="flex-1 flex flex-col">
              <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center gap-2">
                <Store className="h-4 w-4 text-indigo-500" /> Analytics Store
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 font-medium">
                Catálogo de Inteligência
              </span>
            </div>
            <div className="h-7 w-7 rounded-full bg-background/80 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
              <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
            </div>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith(item.path)}
                  className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link to={item.path} className="flex items-center gap-3 py-2">
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
            Financeiro
          </SidebarGroupLabel>
          <SidebarMenu>
            {financeItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith(item.path)}
                  className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link to={item.path} className="flex items-center gap-3 py-2">
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
            Configurações
          </SidebarGroupLabel>
          <SidebarMenu>
            {configItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith(item.path)}
                  className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link to={item.path} className="flex items-center gap-3 py-2">
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
