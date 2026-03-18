import { CameraCard } from '@/components/dashboard/CameraCard'
import { EventTimeline } from '@/components/dashboard/EventTimeline'
import { StatsCharts } from '@/components/dashboard/StatsCharts'
import { mockCameras } from '@/lib/mock-data'
import { Activity, ShieldAlert, Video } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Câmeras Ativas</p>
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
              <p className="text-sm text-muted-foreground">Analíticos Rodando</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg text-destructive">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alertas Críticos</p>
              <p className="text-2xl font-bold text-destructive">3</p>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-1">
          <StatsCharts />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Cameras Grid */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-semibold tracking-tight">Monitoramento Principal</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4 scrollbar-thin">
            {mockCameras.map((camera, i) => (
              <div
                key={camera.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CameraCard camera={camera} />
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
