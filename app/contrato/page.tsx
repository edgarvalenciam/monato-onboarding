'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  FileText, CheckCircle2, Loader2, Lock, Shield,
  ArrowRight, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CONTRACT_SECTIONS = [
  {
    title: '1. Objeto del Contrato',
    content:
      'El presente contrato tiene por objeto establecer los términos y condiciones bajo los cuales Monato Servicios Financieros S.A. de C.V. (en adelante "Monato") prestará los servicios de transferencias electrónicas de fondos SPEI y gestión de Cuenta IFPE al cliente (en adelante "El Cliente").',
  },
  {
    title: '2. Servicios Contratados',
    content:
      'Los servicios incluyen: (a) Acceso a la API de transferencias SPEI en entorno de producción, (b) Asignación de CLABE interbancaria institucional, (c) Recepción de webhooks en tiempo real por eventos de transferencia, (d) Panel de administración y logs de transacciones.',
  },
  {
    title: '3. Tarifas y Facturación',
    content:
      'Las tarifas aplicables serán las acordadas en la Orden de Servicio adjunta. Monato emitirá factura mensual por los servicios prestados. El Cliente se obliga a mantener el método de pago actualizado para evitar interrupciones del servicio.',
  },
  {
    title: '4. Obligaciones del Cliente',
    content:
      'El Cliente se compromete a: (a) Utilizar la API exclusivamente para los casos de uso declarados en el proceso KYB, (b) Mantener la confidencialidad de sus credenciales API, (c) Notificar a Monato cualquier uso no autorizado en un plazo no mayor a 24 horas, (d) Cumplir con la normativa vigente de la CNBV y Banxico.',
  },
  {
    title: '5. Protección de Datos',
    content:
      'Monato tratará los datos personales del Cliente conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP). Los datos serán utilizados exclusivamente para la prestación de los servicios contratados y no serán compartidos con terceros sin consentimiento previo.',
  },
  {
    title: '6. Vigencia y Terminación',
    content:
      'El presente contrato tendrá una vigencia de 12 meses contados a partir de la fecha de firma, renovándose automáticamente por períodos iguales. Cualquiera de las partes podrá dar por terminado el contrato con 30 días de anticipación mediante notificación escrita.',
  },
]

export default function ContratoPage() {
  const router = useRouter()
  const { email, companyName, kybData, contractSigned, signContract, setPhase } = useOnboardingStore()

  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [signing, setSigning] = useState(false)

  useEffect(() => {
    if (!email) { router.push('/registro'); return }
    if (contractSigned) { router.push('/produccion'); return }
    setPhase('contrato')
  }, [email, router, setPhase, contractSigned])

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 40) {
      setScrolledToBottom(true)
    }
  }

  async function handleSign() {
    if (!accepted) return
    setSigning(true)
    await new Promise((r) => setTimeout(r, 2000))
    signContract()
    router.push('/produccion')
  }

  if (!email) return null

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <Badge className="bg-slate-100 text-slate-700 border-slate-200">
          Paso final
        </Badge>
        <h1 className="text-2xl font-bold text-slate-900">Contrato de Servicio SPEI</h1>
        <p className="text-sm text-slate-600">
          Lee el contrato completo antes de firmar. Una vez firmado, activaremos tu entorno de producción.
        </p>
      </div>

      {/* Contract info */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Empresa', value: companyName },
          { label: 'Representante legal', value: kybData.nombreRepresentante || '—' },
          { label: 'RFC', value: kybData.rfc || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="font-semibold text-slate-900 mt-0.5 text-sm">{value}</div>
          </div>
        ))}
      </div>

      {/* Contract viewer */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-3 flex items-center gap-2 bg-slate-50">
          <FileText className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">
            Contrato_SPEI_Monato_{companyName.replace(/\s/g, '_')}.pdf
          </span>
          <Badge variant="outline" className="ml-auto text-xs">v1.0 — 2026</Badge>
        </div>

        <div
          className="h-80 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed"
          onScroll={handleScroll}
        >
          <div className="text-center space-y-1 pb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">
              CONTRATO DE PRESTACIÓN DE SERVICIOS SPEI / CUENTA IFPE
            </h2>
            <p className="text-slate-500 text-xs">
              Celebrado entre Monato Servicios Financieros S.A. de C.V. y {companyName}
            </p>
            <p className="text-slate-400 text-xs">Ciudad de México, {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {CONTRACT_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="font-semibold text-slate-900">{section.title}</h3>
              <p className="text-slate-600">{section.content}</p>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            — Fin del documento —
          </div>
        </div>

        {!scrolledToBottom && (
          <div className="border-t border-slate-200 px-6 py-2 bg-amber-50 flex items-center gap-2 text-xs text-amber-700">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Desplázate hasta el final para poder firmar el contrato.
          </div>
        )}
      </div>

      {/* Sign section */}
      <div className={cn(
        'bg-white rounded-xl border p-6 space-y-5 transition-opacity',
        !scrolledToBottom && 'opacity-50 pointer-events-none',
      )}>
        <div className="flex items-start gap-3">
          <Checkbox
            id="accept"
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
            disabled={!scrolledToBottom}
          />
          <Label htmlFor="accept" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
            He leído y acepto los términos y condiciones del contrato de prestación de servicios
            SPEI/IFPE con Monato Servicios Financieros S.A. de C.V. Entiendo que esta firma
            tiene validez legal bajo la legislación mexicana vigente.
          </Label>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
          <Shield className="h-4 w-4 text-slate-400 shrink-0" />
          <span>
            Firma electrónica con validez legal. Se enviará una copia al correo {email}.
          </span>
        </div>

        <Button
          onClick={handleSign}
          disabled={!accepted || signing}
          className={cn(
            'w-full gap-2',
            accepted && !signing
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-200 text-slate-400',
          )}
        >
          {signing ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Firmando contrato...</>
          ) : (
            <><Lock className="h-4 w-4" /> Firmar contrato y activar producción</>
          )}
        </Button>
      </div>
    </div>
  )
}
