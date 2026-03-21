import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Shield, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AccessControlTab() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Controle de Acesso (RBAC)
        </CardTitle>
        <CardDescription>
          Gerenciamento avançado de perfis e permissões da plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/50 rounded-lg bg-muted/10">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <LockKeyhole className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            A seção de controle de acesso detalhado (Roles and Permissions) está sendo trabalhada
            pela nossa equipe e estará disponível em breve.
          </p>
          <Button variant="outline" disabled>
            Aguarde Novidades
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
