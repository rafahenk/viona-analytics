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
import { ShoppingCart } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import { getAnalyticUI } from '@/lib/constants'

export function AnalyticCard({ analytic }: { analytic: any }) {
  const [open, setOpen] = useState(false)
  const { profile } = useProfile()
  const [cameras, setCameras] = useState<any[]>([])
  const [activeCamIds, setActiveCamIds] = useState<string[]>([])

  const { icon: Icon, color } = getAnalyticUI(analytic.slug)

  useEffect(() => {
    if (!profile || !open) return
    const load = async () => {
      const [{ data: cams }, { data: active }] = await Promise.all([
        supabase.from('cameras').select('id, name, connection_url'),
        supabase.from('camera_analytics_config').select('camera_id').eq('analytic_id', analytic.id),
      ])
      setCameras(cams || [])
      setActiveCamIds((active || []).map((a) => a.camera_id))
    }
    load()
  }, [profile, open, analytic.id])

  const toggleCamera = async (camId: string, isChecked: boolean) => {
    if (isChecked) {
      await supabase
        .from('camera_analytics_config')
        .insert({ camera_id: camId, analytic_id: analytic.id })
      setActiveCamIds((prev) => [...prev, camId])
    } else {
      await supabase
        .from('camera_analytics_config')
        .delete()
        .match({ camera_id: camId, analytic_id: analytic.id })
      setActiveCamIds((prev) => prev.filter((id) => id !== camId))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="flex flex-col h-full hover:border-primary/50 transition-colors bg-card/50">
        <CardContent className="p-6 flex-1">
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
          <p className="text-sm text-muted-foreground">{analytic.description}</p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" /> Ativar Módulo
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
            Selecione as câmeras onde deseja processar este analítico. O valor será adicionado à sua
            fatura.
          </p>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {cameras.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma câmera cadastrada.</p>
            )}
            {cameras.map((camera) => {
              const isActive = activeCamIds.includes(camera.id)
              return (
                <div
                  key={camera.id}
                  className="flex items-center space-x-3 p-3 rounded-md border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
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
                      {camera.connection_url}
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
