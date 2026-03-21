import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddCameraDialog } from '@/components/cameras/AddCameraDialog'
import { Input } from '@/components/ui/input'
import { Search, Filter, Settings2, Trash2, Camera as CamIcon, Info } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { toast } from 'sonner'

export default function Cameras() {
  const navigate = useNavigate()
  const { profile, loading: profileLoading } = useProfile()
  const [cameras, setCameras] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadCameras = async () => {
    if (!profile?.organization_id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cameras')
        .select('*, camera_analytics_config(id)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCameras(data || [])
    } catch (error: any) {
      console.error('Error fetching cameras:', error)
      toast.error('Erro ao carregar câmeras')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!profileLoading) {
      loadCameras()
    }
  }, [profile, profileLoading])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta câmera?')) return
    try {
      const { error } = await supabase.from('cameras').delete().eq('id', id)
      if (error) throw error
      toast.success('Câmera removida com sucesso.')
      loadCameras()
    } catch (error: any) {
      console.error('Error deleting camera:', error)
      toast.error('Erro ao remover câmera')
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cameras')
        .update({ is_active: currentStatus })
        .eq('id', id)
      if (error) throw error
      toast.success(currentStatus ? 'Câmera ativada com sucesso.' : 'Câmera inativada com sucesso.')
      setCameras(cameras.map((c) => (c.id === id ? { ...c, is_active: currentStatus } : c)))
    } catch (err: any) {
      toast.error('Erro ao atualizar status da câmera')
    }
  }

  const isLoading = loading || profileLoading
  const filteredCameras = cameras.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.connection_url && c.connection_url.toLowerCase().includes(search.toLowerCase())),
  )

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
          <Input
            placeholder="Buscar por nome ou URL..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <TableHead>Status Rede</TableHead>
              <TableHead>Ativação</TableHead>
              <TableHead>Analíticos Ativos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Carregando câmeras...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCameras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Info className="h-5 w-5 opacity-50" />
                    Nenhuma câmera encontrada.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCameras.map((camera) => (
                <TableRow key={camera.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div
                      className={`h-10 w-16 rounded overflow-hidden bg-muted flex items-center justify-center relative border ${camera.is_active !== false ? 'border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 'border-border/50'}`}
                    >
                      {camera.is_active !== false ? (
                        <img
                          src={`https://img.usecurling.com/p/100/60?q=cctv&seed=${camera.id}`}
                          className="w-full h-full object-cover"
                          alt="snapshot"
                        />
                      ) : (
                        <CamIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      {camera.status !== 'online' && (
                        <div className="absolute inset-0 bg-black/50" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{camera.name}</div>
                    <div
                      className="text-xs text-muted-foreground truncate max-w-[200px]"
                      title={camera.connection_url || ''}
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
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={camera.is_active !== false}
                        onCheckedChange={(checked) => handleToggleActive(camera.id, checked)}
                      />
                      <Badge
                        variant={camera.is_active !== false ? 'default' : 'secondary'}
                        className={`font-normal text-[10px] ${camera.is_active !== false ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-transparent' : ''}`}
                      >
                        {camera.is_active !== false ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
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
