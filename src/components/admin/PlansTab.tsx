import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Info, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PlansTab() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true })

      if (error) {
        toast.error('Erro ao carregar planos')
      } else {
        setPlans(data || [])
      }
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
        Carregando planos...
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
        <Info className="h-6 w-6 mb-2 opacity-50" />
        Nenhum plano configurado.
      </div>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg">Planos de Assinatura</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Plano</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Limite de Câmeras</TableHead>
              <TableHead className="text-right">Valor Mensal (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => {
              const maxCameras = plan.features?.max_cameras || 0
              return (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="text-muted-foreground">{plan.description}</TableCell>
                  <TableCell>
                    {maxCameras === -1 ? (
                      <span className="flex items-center text-emerald-500 font-medium text-xs">
                        <Check className="h-3 w-3 mr-1" /> Ilimitado
                      </span>
                    ) : (
                      `${maxCameras} câmeras`
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    R$ {Number(plan.price).toFixed(2).replace('.', ',')}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
