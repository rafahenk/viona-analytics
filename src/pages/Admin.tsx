import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, Users2, Shield, ActivitySquare, ShieldAlert, Users } from 'lucide-react'
import { OrganizationsTab } from '@/components/admin/OrganizationsTab'
import { UsersTab } from '@/components/admin/UsersTab'
import { PlansTab } from '@/components/admin/PlansTab'
import { LogsTab } from '@/components/admin/LogsTab'
import { TenantOperatorsTab } from '@/components/admin/TenantOperatorsTab'
import { useProfile } from '@/hooks/use-profile'
import { useAuth } from '@/hooks/use-auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Admin() {
  const { profile, loading: profileLoading } = useProfile()
  const { loading: authLoading } = useAuth()

  const loading = profileLoading || authLoading

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-3 min-h-[400px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p>Carregando painel administrativo...</p>
      </div>
    )
  }

  // Permite acesso se o usuário for explicitamente "admin" ou "super_admin" no perfil
  const isGestor = profile && (profile.role === 'admin' || profile.is_super_admin)

  if (!isGestor) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8 border-destructive/30">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="text-lg">Acesso Restrito</AlertTitle>
        <AlertDescription className="text-base mt-2">
          Esta área é exclusiva para gestores da plataforma. Como usuário com acesso restrito, você
          tem acesso apenas às áreas operacionais e de monitoramento.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          {profile?.is_super_admin
            ? 'Gestão global de clientes, usuários, planos e auditoria da plataforma.'
            : 'Gestão de acesso e usuários do sistema na sua organização.'}
        </p>
      </div>

      <Tabs defaultValue={profile?.is_super_admin ? 'tenants' : 'operators'} className="w-full">
        <TabsList
          className={`inline-flex w-full sm:w-auto bg-muted/50 p-1 flex-wrap h-auto min-h-10 ${profile?.is_super_admin ? 'justify-start' : 'justify-center'}`}
        >
          {profile?.is_super_admin && (
            <>
              <TabsTrigger value="tenants" className="flex-1 sm:flex-none">
                <Building2 className="h-4 w-4 mr-2 hidden sm:block" /> Clientes
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1 sm:flex-none">
                <Users2 className="h-4 w-4 mr-2 hidden sm:block" /> Usuários Globais
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex-1 sm:flex-none">
                <Shield className="h-4 w-4 mr-2 hidden sm:block" /> Planos
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex-1 sm:flex-none">
                <ActivitySquare className="h-4 w-4 mr-2 hidden sm:block" /> Auditoria
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="operators" className="flex-1 sm:flex-none">
            <Users className="h-4 w-4 mr-2 hidden sm:block" /> Usuários da Conta
          </TabsTrigger>
        </TabsList>

        {profile?.is_super_admin && (
          <>
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
          </>
        )}

        <TabsContent value="operators" className="mt-6 animate-slide-up">
          <TenantOperatorsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
