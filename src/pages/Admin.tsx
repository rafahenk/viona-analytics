import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, Users2, Shield, ActivitySquare, ShieldAlert } from 'lucide-react'
import { OrganizationsTab } from '@/components/admin/OrganizationsTab'
import { UsersTab } from '@/components/admin/UsersTab'
import { PlansTab } from '@/components/admin/PlansTab'
import { LogsTab } from '@/components/admin/LogsTab'
import { useProfile } from '@/hooks/use-profile'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Admin() {
  const { profile, loading } = useProfile()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-3 min-h-[400px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p>Carregando painel administrativo...</p>
      </div>
    )
  }

  // Ensure only platform admins can see this screen
  if (!profile?.is_super_admin) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8 border-destructive/30">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="text-lg">Acesso Restrito</AlertTitle>
        <AlertDescription className="text-base mt-2">
          Esta área é exclusiva para administradores globais da plataforma Viona. Se você acha que
          isso é um erro, entre em contato com o suporte.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gestão global de clientes, usuários, planos e auditoria da plataforma.
        </p>
      </div>

      <Tabs defaultValue="tenants" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-4 bg-muted/50 p-1">
          <TabsTrigger value="tenants">
            <Building2 className="h-4 w-4 mr-2 hidden sm:block" /> Clientes
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users2 className="h-4 w-4 mr-2 hidden sm:block" /> Usuários
          </TabsTrigger>
          <TabsTrigger value="plans">
            <Shield className="h-4 w-4 mr-2 hidden sm:block" /> Planos
          </TabsTrigger>
          <TabsTrigger value="logs">
            <ActivitySquare className="h-4 w-4 mr-2 hidden sm:block" /> Auditoria
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="mt-6 animate-slide-up">
          <OrganizationsTab />
        </TabsContent>

        <TabsContent value="users" className="mt-6 animate-slide-up">
          <UsersTab />
        </TabsContent>

        <TabsContent value="plans" className="mt-6 animate-slide-up">
          <PlansTab />
        </TabsContent>

        <TabsContent value="logs" className="mt-6 animate-slide-up">
          <LogsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
