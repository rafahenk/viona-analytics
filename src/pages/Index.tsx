import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ArrowRight, Aperture, Check, Zap, Eye, Settings, CreditCard, X } from 'lucide-react'

export default function Index() {
  const [simCameras, setSimCameras] = useState(5)
  const [simAnalytic, setSimAnalytic] = useState('movimento')
  const [simEvents, setSimEvents] = useState(1000)

  const calcEstimatedCost = () => {
    if (simAnalytic === 'heatmap') return simCameras * 5
    if (simAnalytic === 'lpr') return simCameras * (simEvents * 0.1)
    return simCameras * (simEvents * 0.01)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      <header className="container mx-auto py-6 px-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <Aperture className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl tracking-tight">Viona</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#como-funciona" className="hover:text-primary transition-colors">
            Como Funciona
          </a>
          <a href="#simulador" className="hover:text-primary transition-colors">
            Simulador
          </a>
          <a href="#precos" className="hover:text-primary transition-colors">
            Preços
          </a>
        </nav>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Criar conta agora</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1 text-xs font-semibold mb-8 text-primary bg-primary/10 tracking-widest uppercase">
            Visão • Inteligência • Escalável
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mb-6 text-balance">
            Pague apenas pelo que usar em{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              analíticos de vídeo
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Sem contratos, sem licenças caras, sem complexidade. Transforme qualquer câmera de
            segurança em um sensor inteligente em minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="h-14 px-10 text-base w-full sm:w-auto shadow-lg shadow-primary/20"
              asChild
            >
              <Link to="/register">
                Começar teste grátis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* 3 Steps Section */}
        <section id="como-funciona" className="bg-muted/30 py-24 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Uma infraestrutura moderna e direta. Foque no seu resultado de segurança.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                    1
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" /> Conecte suas câmeras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Integração universal via RTSP ou nuvem. Sem necessidade de trocar seu hardware
                    atual.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                    2
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" /> Ative os analíticos desejados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Escolha no catálogo a inteligência artificial ideal. Ative ou desative com um
                    clique.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                    3
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Pague apenas pelos eventos
                    gerados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cobrança transparente. Se não houver atividade relevante, o custo daquele módulo
                    é zero.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Cost Simulator Section */}
        <section id="simulador" className="py-24 container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simulador de Custos</h2>
            <p className="text-muted-foreground">
              Veja na prática a vantagem do modelo Pay-per-use.
            </p>
          </div>
          <Card className="border-primary/20 shadow-2xl bg-card/50 p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Quantidade de Câmeras</Label>
                  <Input
                    type="number"
                    min="1"
                    value={simCameras}
                    onChange={(e) => setSimCameras(Number(e.target.value))}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Analítico</Label>
                  <Select value={simAnalytic} onValueChange={setSimAnalytic}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movimento">Movimento Inteligente</SelectItem>
                      <SelectItem value="lpr">LPR (Reconhecimento de Placas)</SelectItem>
                      <SelectItem value="heatmap">Mapa de Calor (Heatmap)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {simAnalytic !== 'heatmap' && (
                  <div className="space-y-2">
                    <Label>Eventos estimados/mês por câmera</Label>
                    <Input
                      type="number"
                      min="0"
                      value={simEvents}
                      onChange={(e) => setSimEvents(Number(e.target.value))}
                      className="bg-background"
                    />
                  </div>
                )}
              </div>
              <div className="bg-muted/30 p-8 rounded-2xl border border-border flex flex-col items-center justify-center text-center h-full">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Custo Mensal Estimado
                </p>
                <div className="text-5xl font-extrabold text-primary mb-4">
                  R$ {calcEstimatedCost().toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {simAnalytic === 'heatmap'
                    ? 'Cobrança mensal fixa por câmera'
                    : 'Baseado no volume de eventos gerados'}
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Pricing & Comparison Section */}
        <section id="precos" className="bg-muted/30 py-24 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tabela de Preços e Comparativo
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Valores Base</h3>
                <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Analítico</th>
                        <th className="text-left p-4 font-medium">Modelo</th>
                        <th className="text-right p-4 font-medium">Preço</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="p-4">Movimento</td>
                        <td className="p-4 text-muted-foreground">Por evento</td>
                        <td className="p-4 text-right font-medium">R$ 0,01</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-4">LPR</td>
                        <td className="p-4 text-muted-foreground">Por leitura</td>
                        <td className="p-4 text-right font-medium">R$ 0,10</td>
                      </tr>
                      <tr>
                        <td className="p-4">Heatmap</td>
                        <td className="p-4 text-muted-foreground">Mensal</td>
                        <td className="p-4 text-right font-medium">R$ 5/câmera</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Por que Pay-per-use?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                    <X className="h-6 w-6 text-red-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-500 mb-1">
                        Modelo Tradicional (Licença)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Custo fixo altíssimo, fidelidade, ociosidade de recursos e hardware
                        proprietário caro.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <Check className="h-6 w-6 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-emerald-500 mb-1">Pay-per-use (Viona)</h4>
                      <p className="text-sm text-muted-foreground">
                        Flexível. Use qualquer câmera. Desative quando quiser. Custo proporcional ao
                        valor entregue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Perguntas Frequentes</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Como é feita a cobrança?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                O faturamento é mensal, processado automaticamente no seu cartão de crédito. Você
                paga apenas o volume de eventos contabilizados no período ou a mensalidade fixa dos
                módulos que a possuem.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Posso cancelar a qualquer momento?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Sim. Não há contratos de fidelidade. Você pode desativar analíticos ou cancelar sua
                conta instantaneamente pelo painel de controle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Funciona com câmeras Hikvision ou Intelbras?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Sim. A plataforma Viona é agnóstica a hardware. Suportamos qualquer câmera IP que
                possua protocolo RTSP ou integração ONVIF/ISAPI.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Preciso de servidor local?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Não necessariamente. O processamento pesado ocorre na nossa nuvem. Você só precisa
                de uma conexão estável com a internet para enviar o fluxo de vídeo (ou snapshots).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="bg-primary/5 py-24 border-t border-primary/10 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para evoluir seu monitoramento?</h2>
          <Button size="lg" className="h-14 px-10 text-base" asChild>
            <Link to="/register">
              Criar conta agora <Zap className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>
      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/30">
        <p>© 2026 Viona Analytics. Visão • Inteligência • Escalável.</p>
      </footer>
    </div>
  )
}
