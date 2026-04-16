'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2, Loader2, Upload, FileText,
  Building2, ClipboardList, ChevronRight, ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, label: 'Datos básicos', icon: Building2 },
  { id: 2, label: 'Documentos', icon: FileText },
  { id: 3, label: 'Datos operativos', icon: ClipboardList },
]

const DOCUMENTOS_REQUERIDOS = [
  { id: 'acta', label: 'Acta constitutiva', desc: 'Documento notariado de constitución de la empresa' },
  { id: 'ine', label: 'INE del representante legal', desc: 'Identificación vigente del firmante' },
  { id: 'domicilio', label: 'Comprobante de domicilio', desc: 'No mayor a 3 meses de antigüedad' },
]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const isDone = currentStep > step.id
        const isActive = currentStep === step.id
        const Icon = step.icon

        return (
          <div key={step.id} className="flex items-center gap-2">
            {i > 0 && (
              <div className={cn('h-px w-8', isDone ? 'bg-emerald-500' : 'bg-slate-200')} />
            )}
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors',
                isDone && 'bg-emerald-500 border-emerald-500',
                isActive && 'bg-blue-600 border-blue-600',
                !isDone && !isActive && 'bg-white border-slate-200',
              )}>
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ) : (
                  <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-slate-400')} />
                )}
              </div>
              <span className={cn(
                'text-xs font-medium hidden sm:block',
                isDone && 'text-emerald-600',
                isActive && 'text-blue-700',
                !isDone && !isActive && 'text-slate-400',
              )}>
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DocUploadItem({
  doc,
  uploaded,
  onUpload,
}: {
  doc: typeof DOCUMENTOS_REQUERIDOS[0]
  uploaded: boolean
  onUpload: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (uploaded) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    onUpload()
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border transition-colors',
        uploaded ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200',
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'h-9 w-9 rounded-lg flex items-center justify-center',
          uploaded ? 'bg-emerald-100' : 'bg-slate-100',
        )}>
          {uploaded ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <FileText className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-slate-900">{doc.label}</div>
          <div className="text-xs text-slate-500">{doc.desc}</div>
        </div>
      </div>
      <Button
        size="sm"
        variant={uploaded ? 'outline' : 'default'}
        className={cn(
          uploaded
            ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
            : 'bg-blue-600 hover:bg-blue-700 text-white',
        )}
        onClick={handleClick}
        disabled={loading || uploaded}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : uploaded ? (
          <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Subido</>
        ) : (
          <><Upload className="h-3.5 w-3.5 mr-1" /> Subir</>
        )}
      </Button>
    </div>
  )
}

export default function KybPasoPage() {
  const router = useRouter()
  const params = useParams()
  const paso = parseInt(params.paso as string) as 1 | 2 | 3

  const { email, kybData, kybStatus, updateKybData, setKybStep, setKybStatus, setPhase } = useOnboardingStore()

  const [uploadedDocs, setUploadedDocs] = useState<string[]>(kybData.documentos)
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    if (!email) { router.push('/registro'); return }
    setKybStep(paso)
    setPhase('kyb')
  }, [email, paso, router, setKybStep, setPhase])

  function handleUpload(docId: string) {
    const next = [...uploadedDocs, docId]
    setUploadedDocs(next)
    updateKybData({ documentos: next })
  }

  async function handlePaso2Next() {
    if (uploadedDocs.length < DOCUMENTOS_REQUERIDOS.length) return
    router.push('/onboarding/3')
  }

  async function handleSubmitKyb() {
    setReviewLoading(true)
    setKybStatus('in_review')
    await new Promise((r) => setTimeout(r, 2000))
    setKybStatus('approved')
    setReviewLoading(false)
    setPhase('uat')
    router.push('/uat')
  }

  if (!email) return null

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">KYB — Onboarding</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Información empresarial</h1>
            <p className="text-sm text-slate-600 mt-1">
              Completa en 3 pasos para iniciar tu certificación UAT
            </p>
          </div>
        </div>
        <StepIndicator currentStep={paso} />
        <Progress value={(paso / 3) * 100} className="h-1.5" />
      </div>

      {/* Paso 1: Datos básicos */}
      {paso === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 text-lg">Datos básicos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>RFC</Label>
              <Input
                placeholder="ABC123456XYZ"
                value={kybData.rfc}
                onChange={(e) => updateKybData({ rfc: e.target.value.toUpperCase() })}
                maxLength={13}
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Razón social</Label>
              <Input
                placeholder="Fintech S.A. de C.V."
                value={kybData.razonSocial}
                onChange={(e) => updateKybData({ razonSocial: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Nombre del representante legal</Label>
              <Input
                placeholder="María García López"
                value={kybData.nombreRepresentante}
                onChange={(e) => updateKybData({ nombreRepresentante: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => router.push('/onboarding/2')}
              disabled={!kybData.rfc || !kybData.razonSocial || !kybData.nombreRepresentante}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Paso 2: Documentos */}
      {paso === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-slate-900 text-lg">Documentos legales</h2>
            <p className="text-sm text-slate-500 mt-1">
              {uploadedDocs.length}/{DOCUMENTOS_REQUERIDOS.length} documentos subidos
            </p>
          </div>
          <div className="space-y-3">
            {DOCUMENTOS_REQUERIDOS.map((doc) => (
              <DocUploadItem
                key={doc.id}
                doc={doc}
                uploaded={uploadedDocs.includes(doc.id)}
                onUpload={() => handleUpload(doc.id)}
              />
            ))}
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => router.push('/onboarding/1')} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Atrás
            </Button>
            <Button
              onClick={handlePaso2Next}
              disabled={uploadedDocs.length < DOCUMENTOS_REQUERIDOS.length}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Paso 3: Datos operativos */}
      {paso === 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          {kybStatus === 'approved' ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">KYB Aprobado</h2>
              <p className="text-slate-600 text-sm">
                Tu información fue verificada. Ya puedes iniciar la certificación UAT.
              </p>
              <Button onClick={() => router.push('/uat')} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-2">
                Ir a certificación UAT <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : kybStatus === 'in_review' ? (
            <div className="text-center py-8 space-y-3">
              <Loader2 className="h-10 w-10 text-blue-500 mx-auto animate-spin" />
              <h2 className="text-xl font-bold text-slate-900">Verificando información...</h2>
              <p className="text-slate-500 text-sm">Esto toma solo unos segundos.</p>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-slate-900 text-lg">Datos operativos</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Volumen mensual estimado de transferencias</Label>
                  <Select
                    value={kybData.volumenMensual}
                    onValueChange={(v) => updateKybData({ volumenMensual: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rango" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lt_1m">Menos de $1M MXN</SelectItem>
                      <SelectItem value="1m_5m">$1M — $5M MXN</SelectItem>
                      <SelectItem value="5m_20m">$5M — $20M MXN</SelectItem>
                      <SelectItem value="gt_20m">Más de $20M MXN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Principales casos de uso de SPEI</Label>
                  <Textarea
                    placeholder="Ej. Pago a proveedores, dispersión de nómina, cobro a clientes..."
                    value={kybData.casosDeUso}
                    onChange={(e) => updateKybData({ casosDeUso: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => router.push('/onboarding/2')} className="gap-2">
                  <ChevronLeft className="h-4 w-4" /> Atrás
                </Button>
                <Button
                  onClick={handleSubmitKyb}
                  disabled={!kybData.volumenMensual || !kybData.casosDeUso || reviewLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  {reviewLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                  ) : (
                    <>Enviar para revisión <ChevronRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
