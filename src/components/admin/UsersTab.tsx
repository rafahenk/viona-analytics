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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Info, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*, organizations(name)')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar usuários')
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const { error: updateError } = await supabase.from('profiles').update({ role }).eq('id', id)

      if (updateError) throw updateError

      await supabase.from('audit_logs').insert({
        action: 'Atualizou Nível de Acesso',
        entity_type: 'profile',
        entity_id: id,
        details: { role },
      })

      toast.success('Nível de acesso atualizado com sucesso')
      loadData()
    } catch (error) {
      toast.error('Erro ao atualizar permissões')
    }
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
        Carregando usuários...
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
        <Info className="h-6 w-6 mb-2 opacity-50" />
        Nenhum usuário encontrado.
      </div>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg">Usuários Globais</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Organização</TableHead>
              <TableHead>Administrador do Sistema?</TableHead>
              <TableHead>Nível de Acesso na Org.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || 'Usuário'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.organizations?.name || 'Sem organização'}
                </TableCell>
                <TableCell>
                  {user.is_super_admin ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-transparent">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Sim (Super Admin)
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">Não</span>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role || 'viewer'}
                    onValueChange={(val) => handleRoleChange(user.id, val)}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="operator">Operador</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
