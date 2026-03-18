import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Hexagon, PlayCircle, ShieldCheck, Zap, TrendingUp } from 'lucide-react'
import { mockAnalytics } from '@/lib/mock-data'

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="container mx-auto py-6 px-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <Hexagon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl tracking-tight">
            CCTV<span className="text-primary">Net</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#solucoes" className="hover:text-primary transition-colors">
            Soluções
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
            <Link to="/dashboard">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Teste Grátis</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-6 text-primary bg-primary/10">
            Novo: Integração Hikvision Nativa
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 text-balance">
            Inteligência Artificial para suas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">
              Câmeras de Segurança
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Transforme qualquer câmera comum em um sensor inteligente. Pague apenas pelos analíticos
            que usar, como na Netflix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/dashboard">
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              <PlayCircle className="mr-2 h-5 w-5" /> Ver Demonstração
            </Button>
          </div>

          <div className="mt-20 w-full max-w-5xl rounded-xl border border-border bg-card/50 shadow-2xl overflow-hidden animate-slide-up relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10"></div>
            <img
              src="https://img.usecurling.com/p/1200/600?q=dashboard%20ui&color=blue"
              alt="Platform Dashboard"
              className="w-full h-auto object-cover opacity-80"
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section id="solucoes" className="bg-muted/30 py-24 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Por que escolher o CCTVNet?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Uma infraestrutura moderna que elimina a necessidade de servidores caros no local.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: 'Redução de Custos',
                  desc: 'Sem NVRs caros. Processe na borda ou na nuvem e pague apenas por câmera ativada.',
                },
                {
                  icon: ShieldCheck,
                  title: 'IA de Ponta',
                  desc: 'Modelos treinados para alta precisão em detecção de movimento, LPR e contagem de pessoas.',
                },
                {
                  icon: TrendingUp,
                  title: 'Escalabilidade Imediata',
                  desc: 'Adicione 1 ou 1000 câmeras em minutos. Ative analíticos com um único clique.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-card p-8 rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <section id="analiticos" className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Store de Analíticos</h2>
              <p className="text-muted-foreground max-w-xl">
                Mais de 12 módulos de IA disponíveis para ativação instantânea.
              </p>
            </div>
            <Button variant="link" className="text-primary mt-4 md:mt-0" asChild>
              <Link to="/analytics">
                Ver todos os módulos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockAnalytics.slice(0, 8).map((module) => (
              <div
                key={module.id}
                className="group relative rounded-lg border border-border bg-card p-6 overflow-hidden hover:bg-muted/50 transition-all cursor-pointer h-40 flex flex-col justify-between"
              >
                <module.icon className={`h-8 w-8 ${module.color}`} />
                <div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{module.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{module.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
