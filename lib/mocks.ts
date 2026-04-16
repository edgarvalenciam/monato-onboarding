export type UatCaseStatus = 'pending' | 'running' | 'pass' | 'fail'
export type UatCaseType = 'auto' | 'manual'

export interface UatCase {
  id: string
  title: string
  description: string
  type: UatCaseType
  status: UatCaseStatus
  endpoint?: string
  expectedResult?: string
}

export const UAT_CASES_SPEI: UatCase[] = [
  {
    id: 'spei-001',
    title: 'Transferencia SPEI < $1,000 MXN',
    description: 'Enviar transferencia por monto menor al límite de revisión automática.',
    type: 'auto',
    status: 'pending',
    endpoint: 'POST /v1/transfers/spei',
    expectedResult: '{ "status": "completed", "tracking_code": "MONA..." }',
  },
  {
    id: 'spei-002',
    title: 'Transferencia SPEI con CLABE válida',
    description: 'Validación de dígito verificador de CLABE de 18 dígitos.',
    type: 'auto',
    status: 'pending',
    endpoint: 'POST /v1/transfers/spei',
    expectedResult: '{ "status": "completed" }',
  },
  {
    id: 'spei-003',
    title: 'Respuesta de error con CLABE inválida',
    description: 'El sistema debe rechazar una CLABE con dígito verificador incorrecto.',
    type: 'auto',
    status: 'pending',
    endpoint: 'POST /v1/transfers/spei',
    expectedResult: '{ "error": "invalid_clabe", "code": 422 }',
  },
  {
    id: 'spei-004',
    title: 'Transferencia SPEI > $50,000 MXN',
    description: 'Transferencias de alto valor requieren validación manual por Compliance.',
    type: 'manual',
    status: 'pending',
    endpoint: 'POST /v1/transfers/spei',
    expectedResult: '{ "status": "pending_review" }',
  },
  {
    id: 'spei-005',
    title: 'Webhook transfer.completed recibido',
    description: 'Confirmar que tu endpoint recibe el evento webhook al completar la transferencia.',
    type: 'manual',
    status: 'pending',
    endpoint: 'Webhook: transfer.completed',
    expectedResult: 'HTTP 200 desde tu endpoint',
  },
]

export const WEBHOOK_EVENTS = [
  { event: 'onboarding.stage_updated', description: 'El estado del onboarding cambió' },
  { event: 'onboarding.kyb_approved', description: 'KYB aprobado por Compliance' },
  { event: 'onboarding.uat_certified', description: 'Certificación UAT completada' },
  { event: 'onboarding.production_activated', description: 'Producción activada' },
]

export const SPEI_PLAYGROUND_RESPONSE_OK = {
  id: 'trf_sandbox_9f3c2e1a',
  object: 'transfer',
  status: 'completed',
  amount: 0,
  currency: 'MXN',
  destination_clabe: '',
  destination_name: '',
  tracking_code: 'MONA20260415001',
  environment: 'sandbox',
  created_at: new Date().toISOString(),
}

export const SPEI_PLAYGROUND_RESPONSE_ERROR = {
  error: {
    code: 'invalid_clabe',
    message: 'La CLABE proporcionada no tiene un dígito verificador válido.',
    status: 422,
  },
}

export function generateApiKey(prefix: 'pk' | 'sk', env: 'sandbox' | 'production'): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const segment = () =>
    Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${prefix}_${env}_mon_${segment()}${segment()}`
}
