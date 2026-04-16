'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { SPEI_PLAYGROUND_RESPONSE_OK, SPEI_PLAYGROUND_RESPONSE_ERROR } from '@/lib/mocks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Copy, Check, Eye, EyeOff, ArrowRight, Zap,
  Webhook, Terminal, PlayCircle, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react'

function ApiKeyCard({ label, value, env }: { label: string; value: string; env: 'sandbox' | 'production' }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const displayValue = visible ? value : value.slice(0, 20) + '••••••••••••'

  return (
    <div className="bg-slate-900 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">{label}</span>
        <Badge className={env === 'sandbox' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}>
          {env}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-sm text-green-400 font-mono flex-1 break-all">{displayValue}</code>
        <button onClick={() => setVisible(!visible)} className="text-slate-400 hover:text-white transition-colors shrink-0">
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button onClick={copy} className="text-slate-400 hover:text-white transition-colors shrink-0">
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

type PlaygroundStatus = 'idle' | 'loading' | 'success' | 'error'

function validateClabe(clabe: string): boolean {
  if (clabe.length !== 18 || !/^\d+$/.test(clabe)) return false
  const w = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7]
  const sum = w.reduce((acc, wi, i) => acc + (wi * parseInt(clabe[i])) % 10, 0)
  const dv = (10 - (sum % 10)) % 10
  return dv === parseInt(clabe[17])
}

export default function SandboxPage() {
  const router = useRouter()
  const { email, companyName, stagingPublicKey, stagingSecretKey, intentDeclared, declareIntent, setPhase } = useOnboardingStore()

  const [form, setForm] = useState({ clabe: '646180157000000004', destinatario: 'Empresa Demo SA', monto: '500' })
  const [status, setStatus] = useState<PlaygroundStatus>('idle')
  const [response, setResponse] = useState<object | null>(null)
  const [webhookReceived, setWebhookReceived] = useState(false)
  const [showWebhookLog, setShowWebhookLog] = useState(false)

  useEffect(() => {
    if (!email) router.push('/registro')
    else setPhase('sandbox')
  }, [email, router, setPhase])

  async function runPlayground() {
    setStatus('loading')
    setResponse(null)
    setWebhookReceived(false)
    await new Promise((r) => setTimeout(r, 1200))

    const clabeValid = validateClabe(form.clabe)
    if (!clabeValid) {
      setStatus('error')
      setResponse(SPEI_PLAYGROUND_RESPONSE_ERROR)
      return
    }

    const res = {
      ...SPEI_PLAYGROUND_RESPONSE_OK,
      amount: parseFloat(form.monto),
      destination_clabe: form.clabe,
      destination_name: form.destinatario,
    }
    setStatus('success')
    setResponse(res)

    setTimeout(() => {
      setWebhookReceived(true)
      setShowWebhookLog(true)
    }, 800)
  }

  function handleDeclareIntent() {
    declareIntent()
    setPhase('kyb')
    router.push('/onboarding/paso-1')
  }

  if (!email) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Entorno Sandbox</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard · {companyName}</h1>
          <p className="text-sm text-slate-600 mt-1">
            Explora el producto SPEI con datos de prueba. Nada aquí afecta producción.
          </p>
        </div>
        {!intentDeclared && (
          <Button
            onClick={handleDeclareIntent}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shrink-0"
          >
            Quiero contratar SPEI <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Product Card + API Keys */}
        <div className="space-y-6">
          {/* Product Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">SPEI / Cuenta IFPE</h2>
                <p className="text-xs text-slate-500">Transferencias interbancarias en tiempo real</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              {[
                'Transferencias SPEI en tiempo real',
                'Recepción de pagos con CLABE propia',
                'Webhooks por evento de transferencia',
                'Logs de transacción en tiempo real',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              {intentDeclared ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 w-full justify-center py-1">
                  Intención declarada — KYB en progreso
                </Badge>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={handleDeclareIntent}
                >
                  Quiero contratar este producto
                </Button>
              )}
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Credenciales API</h3>
            </div>
            <div className="space-y-3">
              <ApiKeyCard label="Public Key" value={stagingPublicKey} env="sandbox" />
              <ApiKeyCard label="Secret Key" value={stagingSecretKey} env="sandbox" />
            </div>
            <p className="text-xs text-slate-500">
              Usa el header <code className="bg-slate-100 px-1 rounded">X-Monato-Environment: sandbox</code>
            </p>
          </div>

          {/* Webhook log */}
          {showWebhookLog && (
            <div className="bg-slate-900 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Webhook className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-400 font-mono">Webhook recibido</span>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <pre className="text-xs text-green-400 font-mono overflow-x-auto">{JSON.stringify({
                event: 'transfer.completed',
                environment: 'sandbox',
                data: { id: 'trf_sandbox_9f3c2e1a', status: 'completed' },
                timestamp: new Date().toISOString(),
              }, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Right: Playground */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">API Playground — Transferencia SPEI</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>CLABE destino (18 dígitos)</Label>
              <Input
                value={form.clabe}
                onChange={(e) => setForm((f) => ({ ...f, clabe: e.target.value }))}
                className="font-mono"
                maxLength={18}
              />
              <p className="text-xs text-slate-500">La CLABE pre-cargada es válida para pruebas</p>
            </div>
            <div className="space-y-1.5">
              <Label>Nombre del destinatario</Label>
              <Input
                value={form.destinatario}
                onChange={(e) => setForm((f) => ({ ...f, destinatario: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Monto (MXN)</Label>
              <Input
                type="number"
                value={form.monto}
                onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))}
              />
            </div>
          </div>

          {/* Request Preview */}
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-2 font-mono">POST /v1/transfers/spei</div>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">{JSON.stringify({
              amount: parseFloat(form.monto) || 0,
              currency: 'MXN',
              destination_clabe: form.clabe,
              destination_name: form.destinatario,
              concept: 'Pago de prueba sandbox',
            }, null, 2)}</pre>
          </div>

          <Button
            onClick={runPlayground}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Enviando transferencia...</>
            ) : (
              <><PlayCircle className="h-4 w-4" /> Enviar transferencia de prueba</>
            )}
          </Button>

          {/* Response */}
          {response && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {status === 'success' ? (
                  <><CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700">200 OK — Transferencia completada</span></>
                ) : (
                  <><AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">422 — CLABE inválida</span></>
                )}
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-xs font-mono overflow-x-auto"
                  style={{ color: status === 'success' ? '#4ade80' : '#f87171' }}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
              {webhookReceived && status === 'success' && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Webhook className="h-3.5 w-3.5 text-emerald-500" />
                  Webhook <code>transfer.completed</code> disparado
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      {!intentDeclared && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">¿Listo para contratar SPEI?</h3>
            <p className="text-sm text-blue-700 mt-0.5">
              Inicia tu KYB en 3 pasos y activa producción en menos de 2 semanas.
            </p>
          </div>
          <Button
            onClick={handleDeclareIntent}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shrink-0"
          >
            Empezar onboarding <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
