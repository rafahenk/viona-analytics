import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, PlayCircle, StopCircle, Info } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { getAnalyticUI } from '@/lib/constants'
import { toast } from 'sonner'

export default function CameraAnalytics() {
  const { id: cameraId } = useParams()
  const [camera, setCamera] = useState<any>(null)
  const [catalog, setCatalog] = useState<any[]>([])
  const [activeIds, setActiveIds] = useState<string[]>([])

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    type: 'activate' | 'deactivate'
    analytic: any | null
  }>({ isOpen: false, type: 'activate', analytic: null })

  useEffect(() => {
    if (!cameraId) return
    const load = async () => {
      const [{ data: cam }, { data: cat }, { data: config }] = await Promise.all([
        supabase.from('cameras').select('*').eq('id', cameraId).single(),
        supabase.from('analytics_catalog').select('*').order('name'),
        supabase.from('camera_analytics_config').select('analytic_id').eq('camera_id', cameraId),
      ])
      setCamera(cam)
      setCatalog(cat || [])
      setActiveIds((config || []).map((c) => c.analytic_id))
    }
    load()
  }, [cameraId])

  const handleToggle = (analytic: any) => {
    const isActive = activeIds.includes(analytic.id)
    setDialogState({ isOpen: true, type: isActive ? 'deactivate' : 'activate', analytic })
  }

  const confirmToggle = async () => {
    const { type, analytic } = dialogState
    if (!analytic || !cameraId) return

    try {
      if (type === 'activate') {
        await supabase
          .from('camera_analytics_config')
          .insert({ camera_id: cameraId, analytic_id: analytic.id })
        setActiveIds((prev) => [...prev, analytic.id])
        toast.success(`${analytic.name} ativado com sucesso!`)
      } else {
        await supabase
          .from('camera_analytics_config')
          .delete()
          .match({ camera_id: cameraId, analytic_id: analytic.id })
        setActiveIds((prev) => prev.filter((aId) => aId !== analytic.id))
        toast.success(`${analytic.name} desativado.`)
      }
    } catch (err: any) {
      toast.error('Erro ao atualizar configuração', { description: err.message })
    } finally {
      setDialogState({ isOpen: false, type: 'activate', analytic: null })
    }
  }

  if (!camera)
    return <div className="p-8 text-center text-muted-foreground">Carregando câmera...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Store</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Gerenciando Câmera: <span className="font-semibold text-foreground">{camera.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {catalog.map((analytic) => {
          const isActive = activeIds.includes(analytic.id)
          const { icon: Icon, color } = getAnalyticUI(analytic.slug)

          return (
            <Card
              key={analytic.id}
              className={`flex flex-col h-full transition-all duration-300 ${isActive ? 'border-primary/50 shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)] bg-card' : 'border-border/40 bg-card/40 hover:border-border'}`}
            >
              <CardContent className="p-5 flex-1 relative">
                {isActive && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ativo
                  </div>
                )}

                <div
                  className={`mb-4 p-3 rounded-xl inline-flex ${isActive ? 'bg-primary/10' : 'bg-muted/50'} border border-border/50`}
                >
                  <Icon
                    className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                </div>

                <h3 className="font-semibold mb-1 text-base">{analytic.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{analytic.description}</p>

                <div className="mt-auto flex items-end gap-2">
                  <span className="font-mono font-medium text-lg">
                    R$ {Number(analytic.unit_price).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-muted-foreground pb-1">
                    {analytic.price_model === 'monthly' ? '/mês' : 'por evento'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="px-5 pb-5 pt-0">
                <Button
                  variant={isActive ? 'destructive' : 'default'}
                  className={`w-full ${isActive ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-none' : ''}`}
                  onClick={() => handleToggle(analytic)}
                >
                  {isActive ? (
                    <>
                      <StopCircle className="h-4 w-4 mr-2" /> Desativar
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" /> Ativar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog
        open={dialogState.isOpen}
        onOpenChange={(open) => !open && setDialogState((prev) => ({ ...prev, isOpen: false }))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === 'activate' ? 'Ativar Analítico' : 'Desativar Analítico'}
            </DialogTitle>
            <DialogDescription>
              {dialogState.analytic?.name} na câmera <strong>{camera.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {dialogState.type === 'activate' ? (
              <div className="space-y-4">
                <p className="text-sm">Deseja ativar este analítico nesta câmera?</p>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Modelo de Cobrança</span>
                  <span className="font-semibold text-lg">
                    R$ {Number(dialogState.analytic?.unit_price).toFixed(2).replace('.', ',')}{' '}
                    {dialogState.analytic?.price_model === 'monthly'
                      ? 'fixo por mês'
                      : 'por evento'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
                <Info className="h-5 w-5 text-destructive shrink-0" />
                <p className="text-sm text-destructive-foreground">
                  A cobrança será interrompida imediatamente. Você pagará apenas pelo uso acumulado
                  até este momento.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancelar
            </Button>
            <Button
              variant={dialogState.type === 'activate' ? 'default' : 'destructive'}
              onClick={confirmToggle}
            >
              {dialogState.type === 'activate' ? 'Confirmar Ativação' : 'Confirmar Desativação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
