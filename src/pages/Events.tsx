import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Calendar, Filter, Download, Info, Ban } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/hooks/use-profile'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function Events() {
  const { profile, loading: profileLoading } = useProfile()
  const { toast } = useToast()
  const [events, setEvents] = useState<any[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let isMounted = true

    if (profileLoading) return

    if (!profile?.organization_id) {
      if (isMounted) setLoadingEvents(false)
      return
    }

    const fetchEvents = async () => {
      try {
        if (isMounted) setLoadingEvents(true)

        const { data, error } = await supabase
          .from('events')
          .select('*, cameras(name), analytics_catalog(name, slug)')
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Erro ao carregar eventos:', error.message)
          if (isMounted) setEvents([])
          return
        }

        if (isMounted) {
          setEvents(data || [])
        }
      } catch (err) {
        console.error('Erro inesperado na requisição de eventos:', err)
        if (isMounted) setEvents([])
      } finally {
        if (isMounted) {
          setLoadingEvents(false)
        }
      }
    }

    fetchEvents()

    return () => {
      isMounted = false
    }
  }, [profile, profileLoading])

  const toggleFalsePositive = async (event: any) => {
    try {
      const newValue = !event.is_false_positive
      const { error } = await supabase
        .from('events')
        .update({ is_false_positive: newValue } as any)
        .eq('id', event.id)

      if (error) throw error

      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, is_false_positive: newValue } : e)),
      )

      toast({
        title: newValue ? 'Marcado como falso positivo' : 'Marcação removida',
        description: 'O status do evento foi atualizado com sucesso.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar evento',
        description: err.message || 'Houve um problema ao atualizar o status.',
        variant: 'destructive',
      })
    }
  }

  const formatTime = (iso: string) => {
    if (!iso) return '--:--:--'
    try {
      return new Date(iso).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return '--:--:--'
    }
  }

  const filteredEvents = events.filter((event) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      event.analytics_catalog?.name?.toLowerCase().includes(searchLower) ||
      event.cameras?.name?.toLowerCase().includes(searchLower)
    )
  })

  const isLoading = profileLoading || loadingEvents

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
          <Input
            placeholder="Buscar tipo de evento ou câmera..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Carregando eventos...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
            <Info className="h-5 w-5 opacity-50" />
            Nenhum evento recebido.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map((event, i) => (
              <Card
                key={event.id}
                className={cn(
                  'overflow-hidden border-border/50 transition-colors animate-slide-up relative',
                  event.is_false_positive
                    ? 'bg-destructive/5 opacity-75 grayscale-[0.5]'
                    : 'bg-card/50 hover:border-primary/30',
                )}
                style={{ animationDelay: `${(i % 10) * 50}ms` }}
              >
                <div className="relative aspect-video bg-black">
                  {event.thumbnail_url ? (
                    <img
                      src={event.thumbnail_url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      Sem imagem
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur border-none">
                      {formatTime(event.created_at)}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant={event.is_false_positive ? 'destructive' : 'secondary'}
                      size="icon"
                      className="h-8 w-8 rounded-full bg-black/60 backdrop-blur border-none hover:bg-black/80 shadow-md"
                      onClick={() => toggleFalsePositive(event)}
                      title={
                        event.is_false_positive
                          ? 'Remover falso positivo'
                          : 'Marcar como falso positivo'
                      }
                    >
                      <Ban
                        className={cn(
                          'h-4 w-4',
                          event.is_false_positive ? 'text-white' : 'text-muted-foreground',
                        )}
                      />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3
                    className={cn(
                      'font-semibold truncate',
                      event.is_false_positive && 'line-through text-muted-foreground',
                    )}
                  >
                    {event.analytics_catalog?.name || 'Analítico Desconhecido'}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {event.cameras?.name || 'Câmera Desconhecida'}
                  </p>
                  {event.is_false_positive && (
                    <Badge
                      variant="destructive"
                      className="mt-2 text-[10px] uppercase h-5 bg-destructive/20 text-destructive border-transparent"
                    >
                      Falso Positivo
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
