import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Aperture, AlertCircle, MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, resendConfirmation } = useAuth()
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [loginType, setLoginType] = useState<'gestor' | 'usuario'>('gestor')

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({ identifier: '', password: '' })

  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleInputChange = (field: 'identifier' | 'password', value: string) => {
    if (field === 'identifier') setIdentifier(value)
    if (field === 'password') setPassword(value)

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    setErrorMsg('')
    setNeedsConfirmation(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    let hasError = false
    const newErrors = { identifier: '', password: '' }

    if (!identifier.trim()) {
      newErrors.identifier = 'Campo obrigatório'
      hasError = true
    } else if (loginType === 'gestor' && !/\S+@\S+\.\S+/.test(identifier)) {
      newErrors.identifier = 'E-mail inválido'
      hasError = true
    }

    if (!password) {
      newErrors.password = 'Campo obrigatório'
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrorMsg('')
    setNeedsConfirmation(false)

    try {
      let finalIdentifier = identifier.trim()

      // Valida como usuário (adiciona sufixo interno se for o caso)
      if (loginType === 'usuario') {
        if (!finalIdentifier.includes('@')) {
          finalIdentifier = `${finalIdentifier.toLowerCase().replace(/[^a-z0-9_.-]/g, '')}@operator.viona.local`
        }
      }

      const { error } = await signIn(finalIdentifier, password)

      if (error) {
        if (
          error.message === 'Email not confirmed' ||
          (error as any).code === 'email_not_confirmed'
        ) {
          setNeedsConfirmation(true)
        } else {
          setErrorMsg('Credenciais incorretas ou acesso bloqueado.')
          setErrors({
            identifier: 'Verifique suas credenciais',
            password: 'Verifique suas credenciais',
          })
        }
        setLoading(false)
        return
      }

      navigate('/dashboard')
    } catch (error: any) {
      setErrorMsg('Ocorreu um erro inesperado ao tentar logar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!identifier || !resendConfirmation || loginType === 'usuario') return
    setResending(true)
    try {
      const { error } = await resendConfirmation(identifier)
      if (error) {
        toast.error('Erro ao reenviar', { description: error.message })
      } else {
        toast.success('E-mail enviado', { description: 'Verifique sua caixa de entrada e spam.' })
        setNeedsConfirmation(false)
      }
    } catch (err: any) {
      toast.error('Erro ao reenviar', { description: 'Tente novamente mais tarde.' })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Aperture className="h-10 w-10 text-primary" />
            <span className="font-bold text-3xl tracking-tight">Viona</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground">Entre na sua conta para continuar</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Selecione seu perfil de acesso para entrar no portal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-6 mb-6 py-2">
              <Label
                className={cn(
                  'cursor-pointer text-base transition-colors',
                  loginType === 'gestor'
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground font-medium hover:text-foreground',
                )}
                onClick={() => {
                  setLoginType('gestor')
                  setIdentifier('')
                  setErrors({ identifier: '', password: '' })
                  setErrorMsg('')
                }}
              >
                Gestor
              </Label>
              <Switch
                checked={loginType === 'usuario'}
                onCheckedChange={(checked) => {
                  setLoginType(checked ? 'usuario' : 'gestor')
                  setIdentifier('')
                  setErrors({ identifier: '', password: '' })
                  setErrorMsg('')
                }}
              />
              <Label
                className={cn(
                  'cursor-pointer text-base transition-colors',
                  loginType === 'usuario'
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground font-medium hover:text-foreground',
                )}
                onClick={() => {
                  setLoginType('usuario')
                  setIdentifier('')
                  setErrors({ identifier: '', password: '' })
                  setErrorMsg('')
                }}
              >
                Usuário
              </Label>
            </div>

            {needsConfirmation && loginType === 'gestor' && (
              <Alert className="mb-6 bg-amber-500/10 text-amber-500 border-amber-500/20">
                <AlertCircle className="h-4 w-4 !text-amber-500" />
                <AlertTitle>E-mail não confirmado</AlertTitle>
                <AlertDescription className="flex flex-col gap-3 mt-2 text-amber-500/90">
                  <p>
                    Por favor, verifique sua caixa de entrada ou spam para confirmar seu cadastro.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
                    onClick={handleResendConfirmation}
                    disabled={resending}
                  >
                    <MailCheck className="mr-2 h-4 w-4" />
                    {resending ? 'Reenviando...' : 'Reenviar e-mail de confirmação'}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {errorMsg && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="identifier" className={errors.identifier ? 'text-destructive' : ''}>
                  {loginType === 'gestor' ? 'Email Corporativo' : 'Nome de Usuário'}
                </Label>
                <Input
                  id="identifier"
                  type={loginType === 'gestor' ? 'email' : 'text'}
                  placeholder={loginType === 'gestor' ? 'gestor@empresa.com' : 'nomedeusuario'}
                  className={
                    errors.identifier ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                  value={identifier}
                  onChange={(e) => handleInputChange('identifier', e.target.value)}
                />
                {errors.identifier && (
                  <p className="text-xs font-medium text-destructive">{errors.identifier}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={errors.password ? 'text-destructive' : ''}>
                    Senha
                  </Label>
                  {loginType === 'gestor' && (
                    <a href="#" className="text-xs font-medium text-primary hover:underline">
                      Esqueceu a senha?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  className={
                    errors.password ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">{errors.password}</p>
                )}
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
        {loginType === 'gestor' && (
          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Criar conta agora
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
