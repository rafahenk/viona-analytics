import { mockEvents } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Calendar, Filter, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Events() {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registro de Eventos</h1>
          <p className="text-sm text-muted-foreground">
            Galeria de detecções e relatórios gerados pelos analíticos.
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <div className="flex gap-4 shrink-0 bg-card p-4 rounded-lg border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar tipo de evento..." className="pl-9 bg-background" />
        </div>
        <Button
          variant="outline"
          className="w-[200px] justify-start text-left font-normal text-muted-foreground"
        >
          <Calendar className="mr-2 h-4 w-4" /> Hoje
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockEvents.map((event, i) => (
            <Card
              key={event.id}
              className="overflow-hidden border-border/50 bg-card/50 hover:border-primary/30 transition-colors animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative aspect-video bg-black">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.type}
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sem imagem
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={event.severity === 'critical' ? 'destructive' : 'secondary'}
                    className="bg-black/60 backdrop-blur border-none"
                  >
                    {event.time}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{event.type}</h3>
                <p className="text-sm text-muted-foreground truncate">{event.camera}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary" className="w-full text-xs h-8">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {/* Duplicate events to fill grid for demo */}
          {mockEvents.map((event, i) => (
            <Card
              key={`${event.id}-dup`}
              className="overflow-hidden border-border/50 bg-card/50 hover:border-primary/30 transition-colors animate-slide-up"
              style={{ animationDelay: `${(i + 5) * 50}ms` }}
            >
              <div className="relative aspect-video bg-black">
                <img
                  src={event.image}
                  alt={event.type}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-black/60">
                    {event.time}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{event.type}</h3>
                <p className="text-sm text-muted-foreground truncate">{event.camera}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
