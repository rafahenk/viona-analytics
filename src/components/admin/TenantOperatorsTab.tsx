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
import { Info, Plus, Trash2, Key, ShieldCheck, Copy, RefreshCw } from 'lucide-react'
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
import { useProfile } from '@/hooks/use-profile'

const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let pass = ''
  for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
  return pass
}

export function TenantOperatorsTab() {
  const { profile } = useProfile()
  const [operators, setOperators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ username: '', fullName: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [createdCreds, setCreatedCreds] = useState<{
    username: string
    password?: string
    fullName: string
  } | null>(null)

  const loadData = async () => {
    if (!profile?.organization_id) return
    setLoading(true)
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
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [profile])

  useEffect(() => {
    if (open) {
      setForm((prev) => ({ ...prev, password: generateRandomPassword() }))
    }
  }, [open])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data, error } = await supabase.functions.invoke('manage-operators', {
        body: { username: form.username, fullName: form.fullName, password: form.password },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      await supabase.from('audit_logs').insert({
        action: 'Inclusão de usuário',
        entity_type: 'profile',
        user_id: profile?.id,
        details: { organization_id: profile?.organization_id, target_username: form.username },
      })

      setCreatedCreds({ username: form.username, password: form.password, fullName: form.fullName })
      setOpen(false)
      setForm({ username: '', fullName: '', password: '' })
      loadData()
    } catch (err: any) {
      toast.error('Erro ao criar operador', { description: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, username: string) => {
    if (!confirm('Tem certeza que deseja remover este operador?')) return
    try {
      const { data, error } = await supabase.functions.invoke('manage-operators', {
        method: 'DELETE',
        body: { userId: id },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      await supabase.from('audit_logs').insert({
        action: 'Exclusão de usuário',
        entity_type: 'profile',
        user_id: profile?.id,
        details: { organization_id: profile?.organization_id, target_username: username },
      })

      toast.success('Operador removido com sucesso!')
      loadData()
    } catch (err: any) {
      toast.error('Erro ao remover operador', { description: err.message })
    }
  }

  const handleResetPassword = async (opId: string, username: string, fullName: string) => {
    if (!confirm('Gerar uma nova senha aleatória para este operador?')) return
    try {
      const newPass = generateRandomPassword()
      const { data, error } = await supabase.functions.invoke('manage-operators', {
        method: 'PUT',
        body: { userId: opId, newPassword: newPass },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      await supabase.from('audit_logs').insert({
        action: 'Reset de senha de usuário',
        entity_type: 'profile',
        user_id: profile?.id,
        details: { organization_id: profile?.organization_id, target_username: username },
      })

      setCreatedCreds({ username, password: newPass, fullName })
    } catch (err: any) {
      toast.error('Erro ao resetar senha', { description: err.message })
    }
  }

  const copyCreds = () => {
    if (!createdCreds) return
    const text = `Olá ${createdCreds.fullName},\nSeu acesso foi configurado.\n\nUsuário: ${createdCreds.username}\nSenha: ${createdCreds.password}\n\nAcesse a plataforma para visualizar as câmeras.`
    navigator.clipboard.writeText(text)
    toast.success('Credenciais copiadas!', {
      description: 'Pronto para colar e enviar ao usuário.',
    })
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
            Adicione membros da equipe que usarão a plataforma apenas para monitoramento.
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleResetPassword(operator.id, operator.username, operator.full_name)
                          }
                          title="Resetar e gerar nova senha"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" /> Reset Senha
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(operator.id, operator.username)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              Crie um acesso restrito para um membro da equipe. A senha será gerada automaticamente.
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
              <Label htmlFor="password">Senha Gerada (Oculta)</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                readOnly
                className="bg-muted font-mono"
              />
              <p className="text-xs text-muted-foreground">
                A senha será exibida para cópia na próxima tela.
              </p>
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

      <Dialog open={!!createdCreds} onOpenChange={(v) => !v && setCreatedCreds(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Credenciais de Acesso</DialogTitle>
            <DialogDescription>
              As credenciais para <strong>{createdCreds?.fullName}</strong> estão prontas. Copie
              agora, pois a senha não será exibida novamente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50 space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Usuário:</span>
                <span className="font-bold">{createdCreds?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Senha:</span>
                <span className="font-bold">{createdCreds?.password}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatedCreds(null)}>
              Fechar
            </Button>
            <Button onClick={copyCreds}>
              <Copy className="h-4 w-4 mr-2" /> Copiar para Envio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
