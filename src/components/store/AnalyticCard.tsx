import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { getAnalyticUI } from '@/lib/constants'

export function AnalyticCard({ analytic }: { analytic: any }) {
  const [open, setOpen] = useState(false)
  const { profile } = useProfile()
  const [cameras, setCameras] = useState<any[]>([])
  const [activeConfigs, setActiveConfigs] = useState<any[]>([])

  const { icon: Icon, color } = getAnalyticUI(analytic.slug)

  const loadData = async () => {
    if (!profile) return
    const [{ data: cams }, { data: active }] = await Promise.all([
      supabase.from('cameras').select('id, name, connection_url'),
      supabase.from('camera_analytics_config').select('*').eq('analytic_id', analytic.id),
    ])
    setCameras(cams || [])
    setActiveConfigs(active || [])
  }

  useEffect(() => {
    loadData()
  }, [profile, analytic.id])

  useEffect(() => {
    if (open) loadData()
  }, [open])

  const toggleCamera = async (camId: string, isChecked: boolean) => {
    if (isChecked) {
      const trial_ends_at = new Date()
      trial_ends_at.setDate(trial_ends_at.getDate() + (analytic.trial_duration_days || 7))

      await supabase.from('camera_analytics_config').insert({
        camera_id: camId,
        analytic_id: analytic.id,
        trial_started_at: new Date().toISOString(),
        trial_ends_at: trial_ends_at.toISOString(),
        trial_event_limit: analytic.trial_event_limit || 100,
        trial_events_used: 0,
      })
    } else {
      await supabase
        .from('camera_analytics_config')
        .delete()
        .match({ camera_id: camId, analytic_id: analytic.id })
    }
    loadData()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="flex flex-col h-full hover:border-primary/50 transition-colors bg-card/50">
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-lg bg-card border ${color.replace('text-', 'border-').replace('500', '500/20')} bg-gradient-to-br from-background to-muted`}
            >
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <Badge variant="secondary" className="font-mono text-sm">
              R$ {Number(analytic.unit_price).toFixed(2)}
              <span className="text-[10px] text-muted-foreground ml-1">
                {analytic.price_model === 'monthly' ? '/mês' : '/evt'}
              </span>
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2">{analytic.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">{analytic.description}</p>

          {activeConfigs.length > 0 && (
            <div className="mt-auto space-y-2 border-t border-border/50 pt-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3 w-3" /> Período de Teste
              </h4>
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                {activeConfigs.map((config) => {
                  const cam = cameras.find((c) => c.id === config.camera_id)
                  if (!cam) return null

                  const diff = config.trial_ends_at
                    ? new Date(config.trial_ends_at).getTime() - new Date().getTime()
                    : 0
                  const isExpired = diff <= 0
                  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
                  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24))

                  return (
                    <div
                      key={config.id}
                      className="flex flex-col gap-0.5 p-2 rounded bg-muted/40 border border-border/30 text-xs"
                    >
                      <span className="font-medium truncate">{cam.name}</span>
                      <div className="flex justify-between items-center text-muted-foreground text-[10px]">
                        {isExpired ? (
                          <span className="text-destructive font-semibold">Expirado</span>
                        ) : (
                          <span className="text-emerald-500 font-medium">
                            {days}d {hours}h restantes
                          </span>
                        )}
                        {analytic.price_model === 'per_event' && (
                          <span>
                            {config.trial_events_used || 0}/{config.trial_event_limit || 100} evts
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <DialogTrigger asChild>
            <Button className="w-full" variant={activeConfigs.length > 0 ? 'secondary' : 'outline'}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {activeConfigs.length > 0 ? 'Gerenciar Câmeras' : 'Ativar Módulo'}
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            Configurar {analytic.name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Selecione as câmeras onde deseja processar este analítico. O período de teste inicia na
            ativação.
          </p>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {cameras.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma câmera cadastrada.</p>
            )}
            {cameras.map((camera) => {
              const isActive = activeConfigs.some((a) => a.camera_id === camera.id)
              return (
                <div
                  key={camera.id}
                  className={`flex items-center space-x-3 p-3 rounded-md border transition-colors ${isActive ? 'border-primary/40 bg-primary/5' : 'border-border/50 bg-muted/20 hover:bg-muted/40'}`}
                >
                  <Checkbox
                    id={`cam-${camera.id}`}
                    checked={isActive}
                    onCheckedChange={(c) => toggleCamera(camera.id, !!c)}
                  />
                  <Label
                    htmlFor={`cam-${camera.id}`}
                    className="flex-1 flex flex-col cursor-pointer"
                  >
                    <span className="font-medium text-sm">{camera.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {camera.connection_url || 'Sem URL'}
                    </span>
                  </Label>
                  {isActive && (
                    <Badge className="text-[10px] h-5 bg-primary/20 text-primary hover:bg-primary/30 border-transparent">
                      Ativo
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex justify-end border-t border-border pt-4 mt-2">
          <Button onClick={() => setOpen(false)}>Concluir</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
