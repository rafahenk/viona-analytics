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
import { toast } from 'sonner'
import { Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function LogsTab() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        toast.error('Erro ao carregar logs de auditoria')
      } else {
        setLogs(data || [])
      }
      setLoading(false)
    }

    loadData()
  }, [])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
        Carregando logs do sistema...
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
        <Info className="h-6 w-6 mb-2 opacity-50" />
        Nenhum registro de auditoria encontrado.
      </div>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg">Auditoria e Modificações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Usuário Responsável</TableHead>
              <TableHead>Ação Realizada</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>Detalhes (JSON)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-xs">
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(log.created_at)}
                </TableCell>
                <TableCell className="font-medium">
                  {log.profiles?.full_name || 'Sistema'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="uppercase text-[10px] tracking-wider font-semibold text-muted-foreground">
                  {log.entity_type}
                </TableCell>
                <TableCell className="font-mono text-[10px] text-muted-foreground truncate max-w-[200px]">
                  {JSON.stringify(log.details)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
