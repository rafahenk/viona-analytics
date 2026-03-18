import { mockEvents } from '@/lib/mock-data'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AlertTriangle, Info, AlertCircle } from 'lucide-react'

export function EventTimeline() {
  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card className="h-full flex flex-col border-border/50 bg-card/50">
      <CardHeader className="px-4 py-3 border-b border-border/50">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Eventos em Tempo Real</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        <div className="flex flex-col">
          {mockEvents.map((event, i) => (
            <div
              key={event.id}
              className={`p-4 border-b border-border/50 hover:bg-muted/30 transition-colors animate-slide-up`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-background rounded-full p-1 border shadow-sm">
                  {getIcon(event.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium leading-none truncate pr-2 text-foreground">
                      {event.type}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap tabular-nums">
                      {event.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <span className="truncate">{event.camera}</span>
                  </p>
                  {event.image && (
                    <div className="rounded-md overflow-hidden border border-border mt-1">
                      <img
                        src={event.image}
                        alt="Event snapshot"
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
