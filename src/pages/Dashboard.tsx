import { Link, useNavigate } from 'react-router-dom'
import { EventTimeline } from '@/components/dashboard/EventTimeline'
import { mockCameras } from '@/lib/mock-data'
import { Activity, Camera, Zap, DollarSign, Settings2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Câmeras Ativas</p>
              <p className="text-2xl font-bold">5/6</p>
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
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Eventos Gerados (24h)</p>
              <p className="text-2xl font-bold text-amber-500">1,432</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consumo Atual (R$)</p>
              <p className="text-2xl font-bold text-emerald-500">R$ 124,50</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Cameras List */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-semibold tracking-tight">Suas Câmeras</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/cameras">Gerenciar Cadastro</Link>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin space-y-3">
            {mockCameras.map((camera, i) => (
              <div
                key={camera.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 transition-colors animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-20 rounded overflow-hidden bg-muted shrink-0">
                    <img
                      src={camera.image}
                      alt={camera.name}
                      className="h-full w-full object-cover"
                    />
                    {!camera.status && <div className="absolute inset-0 bg-black/50" />}
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
                      {camera.location} • {camera.analytics.length} Analítico(s) Rodando
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
            ))}
          </div>
        </div>

        {/* Right Sidebar - Timeline */}
        <div className="w-[320px] shrink-0 hidden lg:block h-full">
          <EventTimeline />
        </div>
      </div>
    </div>
  )
}
