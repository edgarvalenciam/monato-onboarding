'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2, Loader2, XCircle, Clock, PlayCircle,
  ArrowRight, ClipboardList, User, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UatCase } from '@/lib/mocks'

type CaseStatus = UatCase['status']

function CaseIcon({ status }: { status: CaseStatus }) {
  if (status === 'pass') return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
  if (status === 'fail') return <XCircle className="h-5 w-5 text-red-500" />
  if (status === 'running') return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
  return <Clock className="h-5 w-5 text-slate-300" />
}

function ChecklistItem({
  uatCase,
  onManualApprove,
}: {
  uatCase: UatCase
  onManualApprove: (id: string) => void
}) {
  return (
    <div className={cn(
      'rounded-xl border p-4 space-y-3 transition-colors',
      uatCase.status === 'pass' && 'bg-emerald-50 border-emerald-200',
      uatCase.status === 'fail' && 'bg-red-50 border-red-200',
      uatCase.status === 'running' && 'bg-blue-50 border-blue-200',
      uatCase.status === 'pending' && 'bg-white border-slate-200',
    )}>
      <div className="flex items-start gap-3">
        <CaseIcon status={uatCase.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-slate-900">{uatCase.title}</span>
            <Badge variant="outline" className={cn(
              'text-xs',
              uatCase.type === 'auto' ? 'border-blue-200 text-blue-700' : 'border-amber-200 text-amber-700',
            )}>
              {uatCase.type === 'auto' ? (
                <><Zap className="h-3 w-3 mr-1" />Auto</>
              ) : (
                <><User className="h-3 w-3 mr-1" />Manual</>
              )}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{uatCase.description}</p>
          {uatCase.endpoint && (
            <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded mt-1 inline-block font-mono">
              {uatCase.endpoint}
            </code>
          )}
        </div>
        {uatCase.type === 'manual' && uatCase.status === 'pending' && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-50"
            onClick={() => onManualApprove(uatCase.id)}
          >
            Marcar aprobado
          </Button>
        )}
      </div>
      {uatCase.status === 'pass' && uatCase.expectedResult && (
        <div className="ml-8">
          <div className="bg-slate-900 rounded-lg p-3">
            <pre className="text-xs text-green-400 font-mono">{uatCase.expectedResult}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UatPage() {
  const router = useRouter()
  const { email, uatCases, uatCertified, updateUatCase, certifyUat, setPhase } = useOnboardingStore()
  const [running, setRunning] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!email) { router.push('/registro'); return }
    setPhase('uat')
  }, [email, router, setPhase])

  const passed = uatCases.filter((c) => c.status === 'pass').length
  const total = uatCases.length
  const allPassed = passed === total

  async function runAutoCases() {
    setRunning(true)
    setStarted(true)
    const autoCases = uatCases.filter((c) => c.type === 'auto')

    for (const c of autoCases) {
      updateUatCase(c.id, 'running')
      await new Promise((r) => setTimeout(r, 900))
      updateUatCase(c.id, 'pass')
      await new Promise((r) => setTimeout(r, 200))
    }

    setRunning(false)
  }

  function handleManualApprove(id: string) {
    updateUatCase(id, 'pass')
  }

  function handleCertify() {
    certifyUat()
    router.push('/contrato')
  }

  if (!email) return null

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          Certificación UAT
        </Badge>
        <h1 className="text-2xl font-bold text-slate-900">Checklist técnico — SPEI</h1>
        <p className="text-sm text-slate-600">
          Completa los 5 casos de prueba para certificar tu integración y proceder al contrato.
        </p>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Progreso de certificación</span>
            <span className={cn('font-bold', allPassed ? 'text-emerald-600' : 'text-slate-900')}>
              {passed}/{total} casos
            </span>
          </div>
          <Progress value={(passed / total) * 100} className="h-2" />
          {allPassed && (
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Todos los casos aprobados
            </p>
          )}
        </div>
      </div>

      {/* Run Auto Tests */}
      {!started && (
        <Button
          onClick={runAutoCases}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
          disabled={running}
        >
          <PlayCircle className="h-4 w-4" /> Correr pruebas automáticas
        </Button>
      )}

      {running && (
        <div className="flex items-center gap-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Ejecutando suite de pruebas SPEI...</span>
        </div>
      )}

      {/* Checklist */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-slate-600" />
          <h2 className="font-semibold text-slate-900">Casos de prueba</h2>
        </div>
        {uatCases.map((c) => (
          <ChecklistItem key={c.id} uatCase={c} onManualApprove={handleManualApprove} />
        ))}
      </div>

      {/* Manual instruction */}
      {started && !allPassed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Casos manuales:</strong> Para aprobarlos, confirma que tu endpoint respondió
          correctamente y haz clic en "Marcar aprobado".
        </div>
      )}

      {/* Certify CTA */}
      {allPassed && !uatCertified && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <div>
            <h3 className="font-bold text-slate-900">Integración certificada</h3>
            <p className="text-sm text-slate-600 mt-1">
              Tu implementación de SPEI cumple todos los requisitos técnicos.
            </p>
          </div>
          <Button
            onClick={handleCertify}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            Proceder a firma de contrato <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uatCertified && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
            <CheckCircle2 className="h-5 w-5" /> UAT certificado
          </div>
          <Button
            size="sm"
            onClick={() => router.push('/contrato')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
          >
            Ir al contrato <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
