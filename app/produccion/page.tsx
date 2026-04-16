'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2, Copy, Check, Eye, EyeOff,
  ExternalLink, Zap, ArrowRight
} from 'lucide-react'
import { useState } from 'react'

function ProductionKey({ label, value }: { label: string; value: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-slate-900 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">{label}</span>
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
          production
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <code className="text-sm text-emerald-400 font-mono flex-1 break-all">
          {visible ? value : value.slice(0, 22) + '••••••••••••••••'}
        </code>
        <button
          onClick={() => setVisible(!visible)}
          className="text-slate-400 hover:text-white transition-colors shrink-0"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          onClick={copy}
          className="text-slate-400 hover:text-white transition-colors shrink-0"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

const JOURNEY_SUMMARY = [
  { label: 'Sandbox explorado', desc: 'API Playground SPEI ejecutado' },
  { label: 'Intención declarada', desc: 'Producto SPEI seleccionado' },
  { label: 'KYB completado', desc: '3 pasos · 3 documentos · Datos operativos' },
  { label: 'UAT certificado', desc: '5/5 casos de prueba aprobados' },
  { label: 'Contrato firmado', desc: 'Firma electrónica con validez legal' },
]

export default function ProduccionPage() {
  const router = useRouter()
  const { email, companyName, productionPublicKey, productionSecretKey, contractSigned } = useOnboardingStore()
  useEffect(() => {
    if (!email) router.push('/registro')
    if (!contractSigned) router.push('/contrato')
  }, [email, contractSigned, router])

  if (!email || !productionPublicKey || !productionSecretKey) return null

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Success header */}
      <div className="text-center space-y-4 pt-4">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        </div>
        <div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-3">
            Producción activa
          </Badge>
          <h1 className="text-3xl font-bold text-slate-900">
            ¡Bienvenido a producción, {companyName}!
          </h1>
          <p className="text-slate-600 mt-2">
            Tu integración SPEI está activa. Tus credenciales de producción ya están disponibles.
          </p>
        </div>
      </div>

      {/* Production Keys */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Credenciales de Producción</h2>
          <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
            Guárdalas de forma segura
          </Badge>
        </div>
        <div className="space-y-3">
          <ProductionKey label="Public Key" value={productionPublicKey} />
          <ProductionKey label="Secret Key" value={productionSecretKey} />
        </div>
        <p className="text-xs text-slate-500">
          Usa el header <code className="bg-slate-100 px-1 rounded font-mono">X-Monato-Environment: production</code>{' '}
          en todas tus llamadas. La Secret Key no se volverá a mostrar — guárdala ahora.
        </p>
      </div>

      {/* Code snippet */}
      <div className="bg-slate-900 rounded-2xl p-6 space-y-3">
        <div className="text-xs text-slate-400 font-mono">Tu primera llamada SPEI en producción</div>
        <pre className="text-sm font-mono text-green-400 overflow-x-auto">{`curl -X POST https://api.monato.mx/v1/transfers/spei \\
  -H "Authorization: Bearer ${productionSecretKey.slice(0, 26)}..." \\
  -H "X-Monato-Environment: production" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "MXN",
    "destination_clabe": "646180157000000004",
    "destination_name": "Empresa Destino SA",
    "concept": "Pago de servicios"
  }'`}</pre>
      </div>

      {/* Journey summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Resumen del onboarding</h2>
        <div className="space-y-3">
          {JOURNEY_SUMMARY.map(({ label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-sm font-medium text-slate-900">{label}</span>
                <span className="text-xs text-slate-500 ml-2">{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-slate-100 text-sm text-slate-500 flex items-center gap-2">
          <span>Correo de confirmación enviado a</span>
          <code className="font-mono text-slate-700">{email}</code>
        </div>
      </div>

      {/* Next steps */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2">
          <h3 className="font-semibold text-blue-900 text-sm">Documentación de API</h3>
          <p className="text-xs text-blue-700">
            Consulta los endpoints de SPEI, manejo de errores y guías de integración.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100 gap-1"
          >
            Ver docs <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
          <h3 className="font-semibold text-slate-900 text-sm">Soporte técnico</h3>
          <p className="text-xs text-slate-600">
            ¿Dudas en producción? Tu account manager ya tiene el contexto de tu onboarding.
          </p>
          <Button size="sm" variant="outline" className="gap-1">
            Contactar soporte <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="pb-8" />
    </div>
  )
}
