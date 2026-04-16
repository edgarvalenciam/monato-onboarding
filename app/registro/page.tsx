'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { validateCorporateDomain } from '@/lib/domain-validator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const ROLES = [
  'CEO / Director General',
  'CTO / Director de Tecnología',
  'CFO / Director Financiero',
  'Director de Operaciones',
  'Gerente de Tecnología',
  'Desarrollador / Integrador',
  'Analista de Negocio',
  'Otro',
]

export default function RegistroPage() {
  const router = useRouter()
  const { register } = useOnboardingStore()

  const [form, setForm] = useState({
    userName: '',
    userRole: '',
    companyName: '',
    companyRfc: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [emailValid, setEmailValid] = useState<boolean | null>(null)

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setForm((f) => ({ ...f, email: val }))
    if (val.includes('@')) {
      const result = validateCorporateDomain(val)
      setEmailValid(result.valid)
      if (!result.valid) {
        setErrors((err) => ({ ...err, email: result.reason || 'Dominio no permitido' }))
      } else {
        setErrors((err) => { const { email: _, ...rest } = err; return rest })
      }
    } else {
      setEmailValid(null)
    }
  }

  function handleRfcChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setForm((f) => ({ ...f, companyRfc: val }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.userName.trim()) errs.userName = 'Ingresa tu nombre'
    if (!form.userRole) errs.userRole = 'Selecciona tu rol'
    if (!form.companyName.trim()) errs.companyName = 'Ingresa el nombre de tu empresa'
    if (!form.companyRfc.trim()) {
      errs.companyRfc = 'Ingresa el RFC de tu empresa'
    } else if (form.companyRfc.length < 12) {
      errs.companyRfc = 'El RFC debe tener al menos 12 caracteres'
    }
    if (!form.email.trim()) {
      errs.email = 'Ingresa tu correo corporativo'
    } else {
      const result = validateCorporateDomain(form.email)
      if (!result.valid) errs.email = result.reason || 'Dominio no permitido'
    }
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    register(form.email, form.companyName, form.companyRfc, form.userName, form.userRole)
    router.push('/sandbox')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 mx-auto">
            <span className="text-xl font-bold text-white">M</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Crea tu cuenta Monato</h1>
          <p className="text-sm text-slate-600">
            Accede a tu sandbox de SPEI en menos de 2 minutos
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombre + Rol */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="userName">Tu nombre</Label>
                <Input
                  id="userName"
                  placeholder="María García"
                  value={form.userName}
                  onChange={(e) => setForm((f) => ({ ...f, userName: e.target.value }))}
                  className={errors.userName ? 'border-red-400 focus-visible:ring-red-400' : ''}
                />
                {errors.userName && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.userName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Tu rol</Label>
                <Select
                  value={form.userRole}
                  onValueChange={(v) => {
                    setForm((f) => ({ ...f, userRole: v }))
                    setErrors((err) => { const { userRole: _, ...rest } = err; return rest })
                  }}
                >
                  <SelectTrigger className={errors.userRole ? 'border-red-400 focus:ring-red-400' : ''}>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userRole && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.userRole}
                  </p>
                )}
              </div>
            </div>

            {/* Empresa + RFC */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Empresa</Label>
                <Input
                  id="companyName"
                  placeholder="Fintech S.A. de C.V."
                  value={form.companyName}
                  onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                  className={errors.companyName ? 'border-red-400 focus-visible:ring-red-400' : ''}
                />
                {errors.companyName && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.companyName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyRfc">RFC de la empresa</Label>
                <Input
                  id="companyRfc"
                  placeholder="FIN123456ABC"
                  value={form.companyRfc}
                  onChange={handleRfcChange}
                  maxLength={13}
                  className={`font-mono uppercase ${errors.companyRfc ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                />
                {errors.companyRfc && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.companyRfc}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo corporativo</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="maria@tuempresa.com"
                  value={form.email}
                  onChange={handleEmailChange}
                  className={
                    errors.email
                      ? 'border-red-400 focus-visible:ring-red-400 pr-10'
                      : emailValid
                      ? 'border-emerald-400 focus-visible:ring-emerald-400 pr-10'
                      : 'pr-10'
                  }
                />
                {emailValid === true && (
                  <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-emerald-500" />
                )}
                {emailValid === false && (
                  <AlertCircle className="absolute right-3 top-2.5 h-4 w-4 text-red-500" />
                )}
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </p>
              )}
              <p className="text-xs text-slate-500">
                No aceptamos correos de Gmail, Hotmail ni Yahoo.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creando tu cuenta...</>
              ) : (
                'Crear cuenta y acceder al sandbox'
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-slate-500 mt-4">
            Al registrarte aceptas los Términos de Uso y la Política de Privacidad de Monato.
          </p>
        </div>
      </div>
    </div>
  )
}
