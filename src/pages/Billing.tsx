import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { AlertTriangle, Zap, Info } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProfile } from '@/hooks/use-profile'
import { supabase } from '@/lib/supabase/client'

export default function Billing() {
  const { profile } = useProfile()
  const [totalCost, setTotalCost] = useState(0)
  const [cameraTotals, setCameraTotals] = useState<Record<string, number>>({})
  const [analyticTotals, setAnalyticTotals] = useState<Record<string, number>>({})
  const [chartData, setChartData] = useState<any[]>([])
  const [chartConfig, setChartConfig] = useState<ChartConfig>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.organization_id) return

    const fetchUsage = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('usage_logs')
        .select('amount, timestamp, cameras(name), analytics_catalog(name, slug)')
        .eq('organization_id', profile.organization_id)
        .order('timestamp', { ascending: true })

      if (error) {
        console.error('Error fetching usage:', error)
        setLoading(false)
        return
      }

      const usage = data || []
      let costSum = 0
      const cTotals: Record<string, number> = {}
      const aTotals: Record<string, number> = {}
      const dailyData: Record<string, any> = {}
      const uniqueAnalytics = new Map<string, string>()

      usage.forEach((log) => {
        const amt = Number(log.amount)
        costSum += amt

        const camName = log.cameras?.name || 'Desconhecida'
        cTotals[camName] = (cTotals[camName] || 0) + amt

        const anaName = log.analytics_catalog?.name || 'Desconhecido'
        aTotals[anaName] = (aTotals[anaName] || 0) + amt

        const date = new Date(log.timestamp)
        const day = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        const slug = log.analytics_catalog?.slug || 'outros'

        if (!dailyData[day]) dailyData[day] = { day }
        dailyData[day][slug] = (dailyData[day][slug] || 0) + amt
        uniqueAnalytics.set(slug, anaName)
      })

      const newChartData = Object.values(dailyData).sort((a, b) => a.day.localeCompare(b.day))
      const newChartConfig: ChartConfig = {}
      let colorIndex = 1

      uniqueAnalytics.forEach((name, slug) => {
        newChartConfig[slug] = { label: name, color: `hsl(var(--chart-${colorIndex}))` }
        colorIndex = colorIndex > 5 ? 1 : colorIndex + 1
      })

      setTotalCost(costSum)
      setCameraTotals(cTotals)
      setAnalyticTotals(aTotals)
      setChartData(newChartData)
      setChartConfig(newChartConfig)
      setLoading(false)
    }

    fetchUsage()
  }, [profile?.organization_id])

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faturamento e Consumo</h1>
        <p className="text-muted-foreground">
          Gerencie o uso de analíticos, estimativa de fatura e limites de gastos da sua conta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/30 bg-card shadow-[0_0_20px_-5px_rgba(59,130,246,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Zap className="h-32 w-32" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fatura Estimada (Mês Atual)</CardTitle>
            <CardDescription>Atualizado em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-extrabold text-primary">
                {loading ? '...' : `R$ ${totalCost.toFixed(2).replace('.', ',')}`}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="w-full">Pagar Antecipado</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Evolução do Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[140px] w-full flex items-center justify-center text-sm text-muted-foreground">
                Carregando dados...
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[140px] w-full flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
                <Info className="h-5 w-5 opacity-50" />
                Nenhum dado de consumo registrado no período.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `R$${val}`}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: 'hsl(var(--muted))' }}
                    />
                    {Object.keys(chartConfig).map((slug) => (
                      <Bar
                        key={slug}
                        dataKey={slug}
                        fill={`var(--color-${slug})`}
                        stackId="a"
                        radius={[2, 2, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Consumo por Câmera</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Câmera</TableHead>
                  <TableHead className="text-right">Custo Acumulado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : Object.entries(cameraTotals).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      Sem consumo
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(cameraTotals).map(([name, cost]) => (
                    <TableRow key={name}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell className="text-right">
                        R$ {cost.toFixed(2).replace('.', ',')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Consumo por Analítico</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  <TableHead className="text-right">Custo Acumulado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : Object.entries(analyticTotals).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      Sem consumo
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(analyticTotals).map(([name, cost]) => (
                    <TableRow key={name}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell className="text-right">
                        R$ {cost.toFixed(2).replace('.', ',')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Configuração de Alertas e Limites</CardTitle>
          </div>
          <CardDescription>
            Evite surpresas. Configure avisos automáticos de consumo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base">Notificação por Evento Crítico</Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas em tempo real ao detectar intrusões ou remoção de objetos.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="p-4 border border-border/50 rounded-lg bg-muted/20 space-y-4">
            <div className="space-y-0.5">
              <Label className="text-base">Limite de Custo Mensal (R$)</Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas quando a fatura estimada atingir este valor.
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <Input type="number" defaultValue={200} className="w-32 bg-background" />
              <Button variant="secondary">Salvar Limite</Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Canais de Notificação</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="email" defaultChecked />
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email (
                  {profile?.billing_email || profile?.organizations?.billing_email || 'cadastrado'})
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="whatsapp" />
                <label
                  htmlFor="whatsapp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  WhatsApp
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
