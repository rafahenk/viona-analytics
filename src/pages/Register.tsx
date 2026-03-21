import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Aperture, MailCheck } from 'lucide-react'
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)

  const isPasswordMismatch = form.password && form.confirm && form.password !== form.confirm

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!form.company.trim()) newErrors.company = 'Nome da empresa é obrigatório'
    if (!form.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório'
    if (!form.name.trim()) newErrors.name = 'Nome do responsável é obrigatório'
    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'E-mail inválido'
    }
    if (!form.password) newErrors.password = 'Senha é obrigatória'
    if (!form.confirm) {
      newErrors.confirm = 'Confirme sua senha'
    } else if (form.password !== form.confirm) {
      newErrors.confirm = 'As senhas não coincidem'
    }

    if (!termsAccepted) {
      toast.error('Você deve aceitar os termos e políticas de privacidade.')
      return
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors)
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

        if (authError.message?.toLowerCase().includes('already registered')) {
          setFormErrors((prev) => ({ ...prev, email: 'Este e-mail já está em uso' }))
          throw new Error('Este e-mail já está em uso')
        }

        throw authError
      }

      if (!authData?.user) throw new Error('Não foi possível criar o usuário.')

      // Check if the user already exists. Supabase returns a fake user with an empty identities array
      // if email enumeration protection is enabled. This prevents foreign key constraint violations
      // when attempting to insert into the profiles table with a fake user ID.
      if (authData.user.identities && authData.user.identities.length === 0) {
        setFormErrors((prev) => ({ ...prev, email: 'Este e-mail já está em uso' }))
        throw new Error('Este e-mail já está em uso')
      }

      createdUserId = authData.user.id

      // Generate IDs client-side to avoid SELECT returning 0 rows immediately after INSERT due to RLS
      const newOrgId = crypto.randomUUID()

      const { error: orgError } = await supabase.from('organizations').insert({
        id: newOrgId,
        name: form.company,
        cnpj: form.cnpj,
        status: 'trial',
        billing_email: form.email,
      })

      if (orgError) {
        if (orgError.code === '23505' && orgError.message.includes('organizations_cnpj_key')) {
          setFormErrors((prev) => ({ ...prev, cnpj: 'CNPJ já cadastrado no sistema' }))
          throw new Error('Este CNPJ já está cadastrado em nosso sistema.')
        }
        throw orgError
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: createdUserId,
        organization_id: newOrgId,
        full_name: form.name,
        role: 'admin',
      })

      if (profileError) throw profileError

      const newCamId = crypto.randomUUID()
      await supabase.from('cameras').insert({
        id: newCamId,
        organization_id: newOrgId,
        name: 'Câmera Principal (Exemplo)',
        status: 'online',
        connection_url: 'rtsp://demo',
        is_active: true,
      })

      toast.success('Conta criada com sucesso!', {
        description: 'Por favor, verifique sua caixa de entrada e confirme o e-mail para acessar.',
        icon: <MailCheck className="h-5 w-5 text-emerald-500" />,
        duration: 8000,
      })
      navigate('/login')
    } catch (error: any) {
      if (createdUserId) {
        await signOut()
      }

      let errorMsg = error.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.'

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
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className={formErrors.company ? 'text-destructive' : ''}>
                    Nome da Empresa
                  </Label>
                  <Input
                    id="company"
                    placeholder="Ex: Acme Corp"
                    className={
                      formErrors.company ? 'border-destructive focus-visible:ring-destructive' : ''
                    }
                    value={form.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                  {formErrors.company && (
                    <p className="text-xs font-medium text-destructive">{formErrors.company}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className={formErrors.cnpj ? 'text-destructive' : ''}>
                    CNPJ
                  </Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0001-00"
                    className={
                      formErrors.cnpj ? 'border-destructive focus-visible:ring-destructive' : ''
                    }
                    value={form.cnpj}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  />
                  {formErrors.cnpj && (
                    <p className="text-xs font-medium text-destructive">{formErrors.cnpj}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className={formErrors.name ? 'text-destructive' : ''}>
                  Nome do Responsável
                </Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  className={
                    formErrors.name ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                {formErrors.name && (
                  <p className="text-xs font-medium text-destructive">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className={formErrors.email ? 'text-destructive' : ''}>
                  Email Corporativo
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@empresa.com.br"
                  className={
                    formErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {formErrors.email && (
                  <p className="text-xs font-medium text-destructive">{formErrors.email}</p>
                )}
              </div>

              {isPasswordMismatch && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 mt-4 mb-2 font-medium">
                  As senhas informadas não coincidem. Verifique e tente novamente.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className={formErrors.password || isPasswordMismatch ? 'text-destructive' : ''}
                  >
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className={
                      formErrors.password || isPasswordMismatch
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                    value={form.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  {formErrors.password && (
                    <p className="text-xs font-medium text-destructive">{formErrors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm"
                    className={formErrors.confirm || isPasswordMismatch ? 'text-destructive' : ''}
                  >
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirm"
                    type="password"
                    className={
                      formErrors.confirm || isPasswordMismatch
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                    value={form.confirm}
                    onChange={(e) => handleInputChange('confirm', e.target.value)}
                  />
                  {formErrors.confirm && (
                    <p className="text-xs font-medium text-destructive">{formErrors.confirm}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
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
