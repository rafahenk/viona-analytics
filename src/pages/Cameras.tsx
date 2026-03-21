import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AddCameraDialog } from '@/components/cameras/AddCameraDialog'
import { Input } from '@/components/ui/input'
import { Search, Filter, Settings2, Trash2, Camera as CamIcon } from 'lucide-react'
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
import { supabase } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { toast } from 'sonner'

export default function Cameras() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const [cameras, setCameras] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadCameras = async () => {
    if (!profile?.organization_id) return
    const { data } = await supabase
      .from('cameras')
      .select('*, camera_analytics_config(id)')
      .order('created_at', { ascending: false })

    setCameras(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadCameras()
  }, [profile])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta câmera?')) return
    await supabase.from('cameras').delete().eq('id', id)
    toast.success('Câmera removida com sucesso.')
    loadCameras()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Câmeras</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre e gerencie os fluxos de vídeo da sua organização.
          </p>
        </div>
        <AddCameraDialog onSuccess={loadCameras} />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou URL..." className="pl-9 bg-card" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Snapshot</TableHead>
              <TableHead>Nome & Detalhes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Analíticos Ativos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : cameras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma câmera cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              cameras.map((camera) => (
                <TableRow key={camera.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="h-10 w-16 rounded overflow-hidden bg-muted flex items-center justify-center relative border border-border/50">
                      <CamIcon className="h-4 w-4 text-muted-foreground" />
                      {camera.status !== 'online' && (
                        <div className="absolute inset-0 bg-black/50" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{camera.name}</div>
                    <div
                      className="text-xs text-muted-foreground truncate max-w-[200px]"
                      title={camera.connection_url}
                    >
                      {camera.connection_url || 'Sem URL de conexão'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={camera.status === 'online' ? 'default' : 'destructive'}
                      className="bg-opacity-10 font-normal"
                    >
                      {camera.status === 'online' ? (
                        <span className="text-emerald-500 font-semibold">Online</span>
                      ) : (
                        <span>Offline</span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {camera.camera_analytics_config?.length || 0} Módulos
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/cameras/${camera.id}/analytics`)}
                      >
                        <Settings2 className="h-4 w-4 mr-2" /> Analíticos
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(camera.id)}
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
      </div>
    </div>
  )
}
