'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Zap, Shield, Code2 } from 'lucide-react'
import { useOnboardingStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Sandbox en minutos',
    description: 'Accede a un entorno de pruebas completo con credenciales API al instante.',
  },
  {
    icon: Code2,
    title: 'API surface idéntica a producción',
    description: 'Mismo diseño de API, mismos endpoints. Solo cambia el header de entorno.',
  },
  {
    icon: Shield,
    title: 'Datos de prueba pre-cargados',
    description: 'Cuentas, CLABEs y transacciones de prueba listas para usar desde el primer día.',
  },
]

const JOURNEY = [
  { step: '01', label: 'Registro', desc: 'Crea tu cuenta con correo corporativo en 2 minutos.' },
  { step: '02', label: 'Sandbox', desc: 'Explora SPEI y ejecuta tu primera transferencia de prueba.' },
  { step: '03', label: 'KYB', desc: 'Completa tu información empresarial en 3 pasos guiados.' },
  { step: '04', label: 'UAT', desc: 'Certifica tu integración con nuestro checklist técnico.' },
  { step: '05', label: 'Producción', desc: 'Firma tu contrato y recibe tus credenciales productivas.' },
]

export default function LandingPage() {
  const { currentPhase, email } = useOnboardingStore()
  const router = useRouter()

  useEffect(() => {
    if (email && currentPhase !== 'registro') {
      router.push(`/${currentPhase}`)
    }
  }, [email, currentPhase, router])

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center pt-12 pb-8 space-y-6">
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
          Self-service · Sandbox · UAT · Producción
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Integra Monato en días,{' '}
          <span className="text-blue-600">no en semanas</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Accede a un sandbox funcional de SPEI/IFPE, valida tu integración en UAT
          y activa producción — todo sin necesidad de un ciclo de ventas.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8">
            <Link href="/registro">
              Empezar gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-slate-500">Solo requiere correo corporativo</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 pt-4 text-sm text-slate-600">
          {[
            { value: '<30 min', label: 'tiempo a primera llamada API' },
            { value: '3 pasos', label: 'para completar KYB' },
            { value: '0 ventas', label: 'necesarias para probar' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          </div>
        ))}
      </section>

      {/* Journey */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          El journey completo, sin fricción
        </h2>
        <div className="grid sm:grid-cols-5 gap-4">
          {JOURNEY.map(({ step, label, desc }) => (
            <div key={step} className="text-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mx-auto">
                {step}
              </div>
              <div className="font-semibold text-slate-800 text-sm">{label}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 rounded-2xl p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">
          Empieza a integrar hoy
        </h2>
        <p className="text-blue-100 text-sm">
          Tu sandbox de SPEI estará listo en menos de 2 minutos.
        </p>
        <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-blue-50 gap-2">
          <Link href="/registro">
            Crear cuenta <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center justify-center gap-4 pt-2 text-blue-100 text-xs">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Sin tarjeta de crédito
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Sin ventas
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Acceso inmediato
          </span>
        </div>
      </section>
    </div>
  )
}
