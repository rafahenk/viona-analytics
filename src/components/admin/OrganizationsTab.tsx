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
import { Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function OrganizationsTab() {
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('organizations')
      .select('*, plans(name)')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar clientes')
    } else {
      setOrgs(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ status })
        .eq('id', id)

      if (updateError) throw updateError

      await supabase.from('audit_logs').insert({
        action: 'Atualizou Status do Cliente',
        entity_type: 'organization',
        entity_id: id,
        details: { status },
      })

      toast.success('Status atualizado com sucesso')
      loadData()
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
        Carregando clientes...
      </div>
    )
  }

  if (orgs.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
        <Info className="h-6 w-6 mb-2 opacity-50" />
        Nenhum cliente cadastrado na plataforma.
      </div>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg">Clientes (Organizações)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Plano Atual</TableHead>
              <TableHead>Status da Conta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgs.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {org.cnpj || 'Não informado'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {org.plans?.name || 'Sem plano'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={org.status}
                    onValueChange={(val) => handleStatusChange(org.id, val)}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="trial">Trial (Teste)</SelectItem>
                      <SelectItem value="past_due">Inadimplente</SelectItem>
                      <SelectItem value="canceled">Cancelado</SelectItem>
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
