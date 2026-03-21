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
import { ActivitySquare, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/hooks/use-profile'

export function TenantLogsTab() {
  const { profile } = useProfile()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.organization_id) return

    const loadData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, profiles(full_name)')
        .contains('details', { organization_id: profile.organization_id })
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        toast.error('Erro ao carregar logs')
      } else {
        setLogs(data || [])
      }
      setLoading(false)
    }

    loadData()
  }, [profile])

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

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ActivitySquare className="h-5 w-5 text-primary" /> Logs de Atividade
        </CardTitle>
        <CardDescription>
          Registro de eventos administrativos (login, criação de usuários, alterações em câmeras e
          analíticos).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-12 flex justify-center text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
            Carregando registros...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
            <Info className="h-6 w-6 mb-2 opacity-50" />
            Nenhum evento registrado ainda.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data / Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação Realizada</TableHead>
                <TableHead>Entidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="text-sm">
                  <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                    {formatDate(log.created_at)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.profiles?.full_name || 'Sistema / Removido'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal bg-card">
                      {log.action}
                    </Badge>
                    {log.details?.target_name && (
                      <span className="ml-2 text-muted-foreground text-xs">
                        ({log.details.target_name})
                      </span>
                    )}
                    {log.details?.target_username && (
                      <span className="ml-2 text-muted-foreground text-xs">
                        ({log.details.target_username})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="uppercase text-[10px] tracking-wider font-semibold text-muted-foreground">
                    {log.entity_type === 'auth' ? 'Segurança' : log.entity_type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
