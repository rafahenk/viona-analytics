import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Aperture, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export default function Register() {
  const navigate = useNavigate()
  const { signUp, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    company: '',
    cnpj: '',
    name: '',
    email: '',
    password: '',
    confirm: '',
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('As senhas não coincidem')
      return
    }

    setLoading(true)
    let createdUserId: string | null = null

    try {
      const { data: authData, error: authError } = await signUp(form.email, form.password, {
        data: { name: form.name },
      })

      if (authError) {
        const isRateLimit =
          authError.status === 429 ||
          (authError as any).code === 'over_email_send_rate_limit' ||
          (authError as any).code === 429 ||
          authError.message?.toLowerCase().includes('rate limit') ||
          authError.message?.toLowerCase().includes('too many requests') ||
          authError.message?.toLowerCase().includes('security purposes') ||
          authError.message?.toLowerCase().includes('after')

        if (isRateLimit) {
          toast.error('Limite de segurança atingido', {
            description:
              'Por favor, aguarde cerca de 1 minuto antes de tentar realizar um novo cadastro.',
          })
          setLoading(false)
          return
        }
        throw authError
      }

      if (!authData?.user) throw new Error('Não foi possível criar o usuário.')

      createdUserId = authData.user.id

      // Generate IDs client-side to avoid SELECT returning 0 rows immediately after INSERT due to RLS
      const newOrgId = crypto.randomUUID()

      const { error: orgError } = await supabase.from('organizations').insert({
        id: newOrgId,
        name: form.company,
        cnpj: form.cnpj,
        status: 'trial',
      })

      if (orgError) throw orgError

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        organization_id: newOrgId,
        full_name: form.name,
        role: 'admin',
      })

      if (profileError) throw profileError

      // Seed initial data for demo purposes
      const newCamId = crypto.randomUUID()
      const { error: camError } = await supabase.from('cameras').insert({
        id: newCamId,
        organization_id: newOrgId,
        name: 'Câmera Principal (Exemplo)',
        status: 'online',
        connection_url: 'rtsp://demo',
      })

      if (!camError) {
        const { data: catalog } = await supabase.from('analytics_catalog').select('*').limit(2)
        if (catalog && catalog.length > 0) {
          await supabase
            .from('camera_analytics_config')
            .insert([{ camera_id: newCamId, analytic_id: catalog[0].id }])
          await supabase.from('usage_logs').insert([
            {
              organization_id: newOrgId,
              camera_id: newCamId,
              analytic_id: catalog[0].id,
              amount: 5.5,
            },
          ])
          await supabase.from('events').insert([
            {
              camera_id: newCamId,
              analytic_id: catalog[0].id,
              thumbnail_url: 'https://img.usecurling.com/p/300/200?q=car',
            },
          ])
        }
      }

      toast.success('Conta criada com sucesso!', {
        description: 'Período de teste gratuito ativado.',
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      })
      navigate('/dashboard')
    } catch (error: any) {
      // Abort session if database setup fails to prevent zombie accounts logged in
      if (createdUserId) {
        await signOut()
      }

      let errorMsg = error.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.'

      if (error.code === '23505' && error.message.includes('organizations_cnpj_key')) {
        errorMsg = 'Este CNPJ já está cadastrado em nosso sistema.'
      }

      toast.error('Erro ao criar conta', {
        description: errorMsg,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 p-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <Aperture className="h-10 w-10 text-primary" />
            <span className="font-bold text-3xl tracking-tight">Viona</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
          <p className="text-sm text-muted-foreground">
            Comece a usar analíticos de vídeo sob demanda hoje mesmo
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Cadastro de Empresa</CardTitle>
            <CardDescription>Preencha os dados para configurar seu portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Nome da Empresa</Label>
                  <Input
                    id="company"
                    placeholder="Ex: Acme Corp"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0001-00"
                    required
                    value={form.cnpj}
                    onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Responsável</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@empresa.com.br"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirmar Senha</Label>
                  <Input
                    id="confirm"
                    type="password"
                    required
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="terms" required />
                <Label
                  htmlFor="terms"
                  className="text-xs font-normal leading-relaxed text-muted-foreground"
                >
                  Aceito os termos e confirmo que li a Política de Privacidade (LGPD).
                </Label>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta agora'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
