import { useState } from 'react'
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
import { mockCameras } from '@/lib/mock-data'
import { ShoppingCart } from 'lucide-react'

export function AnalyticCard({ analytic }: { analytic: any }) {
  const [open, setOpen] = useState(false)
  const Icon = analytic.icon

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="flex flex-col h-full hover:border-primary/50 transition-colors bg-card/50">
        <CardContent className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-lg bg-card border ${analytic.color.replace('text-', 'border-').replace('500', '500/20')} bg-gradient-to-br from-background to-muted`}
            >
              <Icon className={`h-6 w-6 ${analytic.color}`} />
            </div>
            <Badge variant="secondary" className="font-mono text-sm">
              R$ {analytic.price.toFixed(2)}
              <span className="text-[10px] text-muted-foreground ml-1">/mês</span>
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2">{analytic.name}</h3>
          <p className="text-sm text-muted-foreground">{analytic.desc}</p>
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
            <Icon className={`h-5 w-5 ${analytic.color}`} />
            Configurar {analytic.name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Selecione as câmeras onde deseja processar este analítico. O valor será adicionado à sua
            fatura mensal.
          </p>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {mockCameras.map((camera) => {
              const isActive = camera.analytics.includes(analytic.id)
              return (
                <div
                  key={camera.id}
                  className="flex items-center space-x-3 p-3 rounded-md border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <Checkbox id={`cam-${camera.id}`} defaultChecked={isActive} />
                  <Label
                    htmlFor={`cam-${camera.id}`}
                    className="flex-1 flex flex-col cursor-pointer"
                  >
                    <span className="font-medium text-sm">{camera.name}</span>
                    <span className="text-xs text-muted-foreground">{camera.location}</span>
                  </Label>
                  {isActive && (
                    <Badge className="text-[10px] h-5 bg-primary/20 text-primary hover:bg-primary/30">
                      Ativo
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Impacto Mensal Estimado</span>
            <span className="font-bold text-lg text-primary">
              + R$ {(analytic.price * 2).toFixed(2)}
            </span>
          </div>
          <Button onClick={() => setOpen(false)}>Confirmar Ativação</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
