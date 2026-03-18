import { Play, MoreVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockAnalytics } from '@/lib/mock-data'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface CameraCardProps {
  camera: any
}

export function CameraCard({ camera }: CameraCardProps) {
  const isOnline = camera.status === 'online'

  return (
    <Card className="overflow-hidden group border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-primary/5">
      <div className="relative aspect-video bg-muted">
        <img
          src={camera.image}
          alt={camera.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isOnline && 'grayscale opacity-50'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium border border-white/10">
          <span className="relative flex h-2 w-2">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-destructive'}`}
            ></span>
          </span>
          {isOnline ? 'Ao Vivo' : 'Offline'}
        </div>

        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 transform transition-transform hover:scale-110 shadow-lg">
            <Play className="h-6 w-6 fill-current" />
          </button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-base leading-tight">{camera.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{camera.location}</p>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {camera.analytics.length > 0 ? (
            camera.analytics.map((aId: string) => {
              const analytic = mockAnalytics.find((a) => a.id === aId)
              if (!analytic) return null
              const Icon = analytic.icon
              return (
                <Tooltip key={aId}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="bg-card hover:bg-muted cursor-help border-border/50 pl-1.5 pr-2 py-0.5 text-xs font-normal"
                    >
                      <Icon className={`h-3 w-3 mr-1 ${analytic.color}`} />
                      {analytic.name.split(' ')[0]}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{analytic.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })
          ) : (
            <span className="text-xs text-muted-foreground italic">Sem analíticos ativos</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
