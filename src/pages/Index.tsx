import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Aperture, Check, Zap, Eye, Layers } from 'lucide-react'
import { mockAnalytics } from '@/lib/mock-data'

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <Aperture className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl tracking-tight">Viona</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#beneficios" className="hover:text-primary transition-colors">
            Benefícios
          </a>
          <a href="#analiticos" className="hover:text-primary transition-colors">
            Analíticos
          </a>
          <a href="#precos" className="hover:text-primary transition-colors">
            Preços
          </a>
        </nav>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/dashboard">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Testar Grátis</Link>
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
            Analíticos inteligentes para câmeras –{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              pague apenas pelo que usar
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            A "Netflix" do CFTV. Transforme qualquer câmera de segurança em um sensor inteligente
            com nossa plataforma CCTV as a Service. Assine, ative algoritmos sob demanda e escale
            sem limites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="h-14 px-10 text-base w-full sm:w-auto shadow-lg shadow-primary/20"
              asChild
            >
              <Link to="/dashboard">
                Testar Grátis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Overview Section */}
        <section id="beneficios" className="bg-muted/30 py-24 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Como funciona o modelo Pay-per-use
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Uma infraestrutura moderna que elimina servidores caros. Simples, direto e focado no
                seu resultado.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Eye,
                  title: 'Conecte suas Câmeras',
                  desc: 'Integração universal via RTSP ou nuvem. Sem necessidade de trocar seu hardware atual.',
                },
                {
                  icon: Layers,
                  title: 'Escolha os Analíticos',
                  desc: 'Catálogo com 12+ algoritmos de IA. Ative ou desative inteligência com um único clique.',
                },
                {
                  icon: Zap,
                  title: 'Pague pelo Uso',
                  desc: 'Cobrança transparente baseada apenas nas câmeras ativas e nos módulos em execução.',
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="bg-card/50 border-border/50 hover:border-primary/50 transition-all hover:-translate-y-1"
                >
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics Catalog Section */}
        <section id="analiticos" className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Catálogo de Analíticos de Vídeo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Inteligência artificial treinada para cenários reais. Escolha exatamente o que sua
              operação precisa hoje.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockAnalytics.map((module) => (
              <div
                key={module.id}
                className="group rounded-xl border border-border/50 bg-card/30 p-6 hover:bg-muted/50 hover:border-primary/40 transition-all flex flex-col h-full"
              >
                <div
                  className={`p-3 rounded-lg bg-card border border-border inline-flex w-min mb-4`}
                >
                  <module.icon className={`h-6 w-6 ${module.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{module.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {module.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precos" className="bg-muted/30 py-24 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Preços Simples e Escaláveis</h2>
              <p className="text-muted-foreground">
                Sem contratos complexos. Assine a base e adicione inteligência.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border/50 bg-card/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <Eye className="h-32 w-32" />
                </div>
                <CardHeader className="pb-8 border-b border-border/50">
                  <CardTitle className="text-2xl text-foreground">Plano Base</CardTitle>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold text-foreground">
                    R$ 29
                    <span className="ml-1 text-base font-medium text-muted-foreground">
                      /mês por câmera
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fundação essencial para o seu CFTV inteligente.
                  </p>
                </CardHeader>
                <CardContent className="pt-8">
                  <ul className="space-y-4">
                    {[
                      'Conexão de câmeras na nuvem',
                      'Gestão unificada de dispositivos',
                      'Dashboard de monitoramento em tempo real',
                      'Acesso ilimitado ao catálogo de analíticos',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="h-5 w-5 text-primary shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-primary bg-primary/5 relative overflow-hidden shadow-2xl shadow-primary/5">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Sob Demanda
                </div>
                <CardHeader className="pb-8 border-b border-primary/20">
                  <CardTitle className="text-2xl text-foreground">Add-ons Premium</CardTitle>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold text-primary">
                    Pay-per-use
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Valor adicional apenas pelos módulos ativados.
                  </p>
                </CardHeader>
                <CardContent className="pt-8 flex flex-col justify-between h-[calc(100%-11.5rem)]">
                  <ul className="space-y-4 mb-8">
                    {[
                      'LPR e Identificação Veicular',
                      'Mapas de Calor e Contagem',
                      'Detecção de EPI e Segurança',
                      'Faturamento transparente baseado no uso',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="h-5 w-5 text-primary shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full h-12 text-base" asChild>
                    <Link to="/dashboard">Ver Preços Detalhados</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/30">
        <p>© 2026 Viona Analytics. Visão • Inteligência • Escalável.</p>
      </footer>
    </div>
  )
}
