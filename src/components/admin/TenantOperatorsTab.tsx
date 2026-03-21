import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Info, Plus, Trash2, Key, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function TenantOperatorsTab() {
  const [operators, setOperators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ username: '', fullName: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profile?.organization_id) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .eq('role', 'operator')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Erro ao carregar operadores')
      } else {
        setOperators(data || [])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data, error } = await supabase.functions.invoke('manage-operators', {
        body: { username: form.username, fullName: form.fullName, password: form.password },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      toast.success('Operador criado com sucesso!')
      setOpen(false)
      setForm({ username: '', fullName: '', password: '' })
      loadData()
    } catch (err: any) {
      toast.error('Erro ao criar operador', { description: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Tem certeza que deseja remover este operador? O acesso dele será revogado imediatamente e os dados de login apagados.',
      )
    )
      return
    try {
      const { data, error } = await supabase.functions.invoke('manage-operators', {
        method: 'DELETE',
        body: { userId: id },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      toast.success('Operador removido com sucesso!')
      loadData()
    } catch (err: any) {
      toast.error('Erro ao remover operador', { description: err.message })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card p-4 rounded-lg border border-border/50 gap-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Controle de Acesso Operacional
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione membros da equipe que usarão a plataforma apenas para monitoramento (login via
            usuário e senha).
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Novo Operador
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Nome Completo</TableHead>
                <TableHead>Nome de Usuário (Login)</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                      Carregando operadores...
                    </div>
                  </TableCell>
                </TableRow>
              ) : operators.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground border-dashed"
                  >
                    <Info className="h-6 w-6 mb-2 opacity-50 mx-auto" />
                    Nenhum operador cadastrado na sua organização.
                  </TableCell>
                </TableRow>
              ) : (
                operators.map((operator) => (
                  <TableRow key={operator.id}>
                    <TableCell className="font-medium">{operator.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono lowercase">
                        <Key className="h-3 w-3 mr-1" />
                        {operator.username || 'operador'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(operator.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(operator.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Operador</DialogTitle>
            <DialogDescription>
              Crie um acesso restrito para um membro da equipe. O operador fará login usando o nome
              de usuário definido aqui.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário (Login)</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''),
                  })
                }
                required
                placeholder="Ex: joaosilva"
              />
              <p className="text-xs text-muted-foreground">
                Apenas letras minúsculas e números. Sem espaços.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Criar Operador'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
