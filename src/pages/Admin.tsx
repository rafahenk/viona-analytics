import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users2, Shield, ActivitySquare } from 'lucide-react'

export default function Admin() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administração do Sistema</h1>
        <p className="text-muted-foreground">
          Configurações globais e gerenciamento de multitenancy.
        </p>
      </div>

      <Tabs defaultValue="tenants" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/50 p-1">
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
            <ActivitySquare className="h-4 w-4 mr-2 hidden sm:block" /> Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="mt-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Gerenciamento de Clientes (Tenants)</CardTitle>
              <CardDescription>
                Visualize todas as organizações cadastradas na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg bg-muted/10 text-muted-foreground">
                Tabela de Clientes Mock (Super Admin Only)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Usuários da Organização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg bg-muted/10 text-muted-foreground">
                Gestão de Papéis e Permissões
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
