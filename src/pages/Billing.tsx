import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { CreditCard, AlertTriangle, Zap, Download } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const chartData = [
  { day: '01', lpr: 1.2, mov: 0.5, intr: 0 },
  { day: '02', lpr: 1.5, mov: 0.6, intr: 0 },
  { day: '03', lpr: 1.8, mov: 0.55, intr: 0.05 },
  { day: '04', lpr: 1.1, mov: 0.4, intr: 0 },
  { day: '05', lpr: 2.1, mov: 0.8, intr: 0.1 },
  { day: '06', lpr: 1.9, mov: 0.7, intr: 0 },
  { day: 'Hoje', lpr: 0.8, mov: 0.3, intr: 0 },
]

export default function Billing() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faturamento e Consumo</h1>
        <p className="text-muted-foreground">
          Gerencie o uso de analíticos, estimativa de fatura e limites de gastos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estimated Invoice */}
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
              <span className="text-4xl font-extrabold text-primary">R$ 124,50</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="w-full">Pagar Antecipado</Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Chart */}
        <Card className="md:col-span-2 border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Evolução do Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                lpr: { label: 'LPR (Placas)', color: 'hsl(var(--chart-1))' },
                mov: { label: 'Movimento', color: 'hsl(var(--chart-2))' },
                intr: { label: 'Intrusão', color: 'hsl(var(--chart-5))' },
              }}
              className="h-[140px] w-full"
            >
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
                  <Bar dataKey="lpr" fill="var(--color-lpr)" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="mov" fill="var(--color-mov)" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="intr" fill="var(--color-intr)" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown by Camera */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Consumo por Câmera</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Câmera</TableHead>
                  <TableHead className="text-right">Custo Estimado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Estacionamento G1</TableCell>
                  <TableCell className="text-right">R$ 54,20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Portão Principal</TableCell>
                  <TableCell className="text-right">R$ 42,10</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Recepção Leste</TableCell>
                  <TableCell className="text-right">R$ 28,20</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Breakdown by Analytic */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Consumo por Analítico</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  <TableHead className="text-right">Custo Estimado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">LPR (Placas)</TableCell>
                  <TableCell className="text-right">R$ 82,40</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Heatmap (Mensal)</TableCell>
                  <TableCell className="text-right">R$ 20,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Movimento Inteligente</TableCell>
                  <TableCell className="text-right">R$ 22,10</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Alert Configuration */}
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
                  Email (admin@empresa.com.br)
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
