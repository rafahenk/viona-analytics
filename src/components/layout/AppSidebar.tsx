import { Link, useLocation } from 'react-router-dom'
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
  Hexagon,
} from 'lucide-react'

export function AppSidebar() {
  const location = useLocation()

  const navItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Câmeras', icon: Video, path: '/cameras' },
    { title: 'Analytics Store', icon: Store, path: '/analytics' },
    { title: 'Eventos & Relatórios', icon: BellRing, path: '/events' },
    { title: 'Faturamento', icon: CreditCard, path: '/billing' },
  ]

  const adminItems = [{ title: 'Administrativo', icon: Settings, path: '/admin' }]

  return (
    <Sidebar variant="inset" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 py-4 px-4 flex flex-row items-center gap-2">
        <Hexagon className="h-6 w-6 text-primary fill-primary/20" />
        <span className="font-bold text-lg tracking-tight truncate">
          CCTV<span className="text-primary">Net</span>
        </span>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
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
            {adminItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path}>
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
            <SidebarMenuButton asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/" className="flex items-center gap-3 py-2">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
