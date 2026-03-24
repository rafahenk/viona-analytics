import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  Camera,
  Zap,
  DollarSign,
  Settings2,
  Camera as CamIcon,
  Info,
  Ban,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/hooks/use-profile'
import { supabase } from '@/lib/supabase/client'

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile, loading: profileLoading } = useProfile()

  const [stats, setStats] = useState({
    cameras: 0,
    analytics: 0,
    events: 0,
    cost: 0,
    falsePositives: 0,
  })
  const [cameras, setCameras] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (profileLoading) return

    if (!profile?.organization_id) {
      setLoadingData(false)
      return
    }

    const fetchStats = async () => {
      setLoadingData(true)
      try {
        const [{ data: cams }, { count: evCount }, { data: usage }, { count: fpCount }] =
          await Promise.all([
            supabase.from('cameras').select('*, camera_analytics_config(id)'),
            supabase.from('events').select('id', { count: 'exact' }),
            supabase.from('usage_logs').select('amount'),
            supabase.from('events').select('id', { count: 'exact' }).eq('is_false_positive', true),
          ])

        const activeCams = cams || []
        const totalAnalytics = activeCams.reduce(
          (acc, c) => acc + (c.camera_analytics_config?.length || 0),
          0,
        )
        const totalCost = (usage || []).reduce((acc, u) => acc + Number(u.amount), 0)

        setCameras(activeCams)
        setStats({
          cameras: activeCams.length,
          analytics: totalAnalytics,
          events: evCount || 0,
          cost: totalCost,
          falsePositives: fpCount || 0,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchStats()
  }, [profile, profileLoading])

  const isLoading = profileLoading || loadingData

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 shrink-0">
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Câmeras</p>
              <p className="text-2xl font-bold">{isLoading ? '-' : stats.cameras}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Analíticos Ativos</p>
              <p className="text-2xl font-bold">{isLoading ? '-' : stats.analytics}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Eventos Gerados</p>
              <p className="text-2xl font-bold text-amber-500">{isLoading ? '-' : stats.events}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg text-destructive">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Falsos Positivos</p>
              <p className="text-2xl font-bold text-destructive">
                {isLoading ? '-' : stats.falsePositives}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consumo (R$)</p>
              <p className="text-2xl font-bold text-emerald-500">
                {isLoading ? '-' : `R$ ${stats.cost.toFixed(2).replace('.', ',')}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-semibold tracking-tight">Suas Câmeras</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/cameras">Gerenciar Cadastro</Link>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin space-y-3">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Carregando câmeras...
              </div>
            ) : cameras.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-xl border-border/50 text-muted-foreground flex flex-col items-center gap-2">
                <Info className="h-5 w-5 opacity-50" />
                <p>Nenhuma câmera configurada ainda.</p>
                <Button variant="link" asChild className="mt-2">
                  <Link to="/cameras">Adicionar agora</Link>
                </Button>
              </div>
            ) : (
              cameras.map((camera, i) => (
                <div
                  key={camera.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-20 rounded overflow-hidden bg-muted shrink-0 flex items-center justify-center border border-border/50">
                      <CamIcon className="h-5 w-5 text-muted-foreground" />
                      {camera.status !== 'online' && (
                        <div className="absolute inset-0 bg-black/50" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{camera.name}</h3>
                        <Badge
                          variant={camera.status === 'online' ? 'default' : 'destructive'}
                          className="h-5 text-[10px] uppercase tracking-wider font-bold bg-opacity-20 border-transparent"
                        >
                          {camera.status === 'online' ? (
                            <span className="text-emerald-500">Online</span>
                          ) : (
                            <span>Offline</span>
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {camera.camera_analytics_config?.length || 0} Analítico(s) Rodando
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/cameras/${camera.id}/analytics`)}
                  >
                    <Settings2 className="mr-2 h-4 w-4" /> Configurar analíticos
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-[320px] shrink-0 hidden lg:block h-full">
          <Card className="h-full bg-card/50 border-border/50 flex flex-col">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold">Últimos Eventos</h3>
            </div>
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-4 text-center">
              Para ver eventos reais, acesse a guia de Registro de Eventos.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
