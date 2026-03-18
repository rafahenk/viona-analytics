import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CreditCard, Download, Receipt, Zap } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Billing() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faturamento e Assinatura</h1>
        <p className="text-muted-foreground">Gerencie seu plano, métodos de pagamento e faturas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Plano Atual: Pro</CardTitle>
            <CardDescription>
              Cobrança mensal com base no uso de câmeras e analíticos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-muted-foreground">Câmeras Base (R$ 29/cada)</span>
                <span>6 de 10</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-muted-foreground">Módulos Analíticos Ativos</span>
                <span>12 instâncias</span>
              </div>
            </div>
            <div className="pt-4 border-t border-border/50 flex justify-between items-end">
              <div>
                <p className="text-sm text-muted-foreground">Próxima fatura (Estimada)</p>
                <p className="text-3xl font-bold mt-1 text-primary">R$ 534,00</p>
              </div>
              <Button>
                <Zap className="h-4 w-4 mr-2" /> Fazer Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Método de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 rounded-lg border border-border bg-muted/20">
              <CreditCard className="h-6 w-6 mr-3 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expira 12/2028</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Atualizar Cartão
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Histórico de Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Nota Fiscal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {['Outubro 2026', 'Setembro 2026', 'Agosto 2026'].map((month, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{month}</TableCell>
                  <TableCell>R$ 489,00</TableCell>
                  <TableCell>
                    <span className="text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">
                      Pago
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="h-4 w-4 mr-2" /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
