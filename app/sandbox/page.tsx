'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Zap, Globe, RefreshCw, CreditCard, ArrowRight,
  Clock, CheckCircle2, Lock, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ProductStatus = 'available' | 'coming_soon'

interface Product {
  id: string
  icon: React.ElementType
  name: string
  tagline: string
  description: string
  features: string[]
  status: ProductStatus
  sandboxHref?: string
  color: string
  iconBg: string
}

const PRODUCTS: Product[] = [
  {
    id: 'spei',
    icon: Zap,
    name: 'SPEI / Cuenta IFPE',
    tagline: 'Transferencias interbancarias en tiempo real',
    description:
      'Envía y recibe pagos SPEI con tu propia CLABE institucional. API surface idéntica a producción, con datos de prueba pre-cargados.',
    features: [
      'Transferencias SPEI en tiempo real',
      'CLABE institucional propia',
      'Webhooks por evento',
      'Logs en tiempo real',
    ],
    status: 'available',
    sandboxHref: '/sandbox/spei',
    color: 'blue',
    iconBg: 'bg-blue-50',
  },
  {
    id: 'pago-servicios',
    icon: CreditCard,
    name: 'Pago de Servicios',
    tagline: 'Pago de CFE, Telmex, agua y más de 1,000 servicios',
    description:
      'Permite a tus usuarios pagar servicios públicos y privados directamente desde tu plataforma con una sola llamada a la API.',
    features: [
      '+1,000 convenios disponibles',
      'Confirmación en tiempo real',
      'Comprobante digital',
      'Conciliación automática',
    ],
    status: 'coming_soon',
    color: 'violet',
    iconBg: 'bg-violet-50',
  },
  {
    id: 'crossborder',
    icon: Globe,
    name: 'CrossBorder',
    tagline: 'Pagos internacionales en múltiples divisas',
    description:
      'Envía y recibe pagos en USD, EUR y más divisas con tipo de cambio competitivo y liquidación rápida.',
    features: [
      'USD, EUR y más divisas',
      'Tipo de cambio en tiempo real',
      'Liquidación en 1-2 días hábiles',
      'Cumplimiento regulatorio incluido',
    ],
    status: 'coming_soon',
    color: 'emerald',
    iconBg: 'bg-emerald-50',
  },
  {
    id: 'domiciliacion',
    icon: RefreshCw,
    name: 'Domiciliación',
    tagline: 'Cobros recurrentes automatizados',
    description:
      'Automatiza el cobro a tus clientes con domiciliación bancaria. Ideal para suscripciones, mensualidades y pagos recurrentes.',
    features: [
      'Mandatos digitales',
      'Reintentos automáticos',
      'Gestión de rechazos',
      'Panel de conciliación',
    ],
    status: 'coming_soon',
    color: 'orange',
    iconBg: 'bg-orange-50',
  },
  {
    id: 'creditos',
    icon: Lock,
    name: 'Créditos Estructurados',
    tagline: 'Productos de financiamiento para empresas',
    description:
      'Accede a líneas de crédito, factoraje y productos de financiamiento estructurado diseñados para las necesidades de tu empresa.',
    features: [
      'Líneas de crédito revolventes',
      'Factoraje de cuentas por cobrar',
      'Plazos flexibles',
      'Evaluación crediticia ágil',
    ],
    status: 'coming_soon',
    color: 'rose',
    iconBg: 'bg-rose-50',
  },
]

const COLOR_MAP: Record<string, { badge: string; btn: string; icon: string; border: string }> = {
  blue: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    icon: 'text-blue-600',
    border: 'border-blue-200 hover:border-blue-300 hover:shadow-blue-100',
  },
  violet: { badge: 'bg-violet-50 text-violet-700 border-violet-200', btn: '', icon: 'text-violet-500', border: 'border-slate-200' },
  emerald: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', btn: '', icon: 'text-emerald-600', border: 'border-slate-200' },
  orange: { badge: 'bg-orange-50 text-orange-700 border-orange-200', btn: '', icon: 'text-orange-500', border: 'border-slate-200' },
  rose: { badge: 'bg-rose-50 text-rose-700 border-rose-200', btn: '', icon: 'text-rose-500', border: 'border-slate-200' },
}

type SpeiState = 'available' | 'in_progress' | 'contracted'

function SpeiCard({
  product,
  speiState,
  onNavigate,
}: {
  product: Product
  speiState: SpeiState
  onNavigate: (href: string) => void
}) {
  const colors = COLOR_MAP[product.color]
  const Icon = product.icon

  const isContracted = speiState === 'contracted'
  const isInProgress = speiState === 'in_progress'

  function handleClick() {
    if (isContracted) { onNavigate('/produccion'); return }
    if (product.sandboxHref) onNavigate(product.sandboxHref)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border p-6 flex flex-col gap-4 transition-all cursor-pointer hover:shadow-lg',
        isContracted
          ? 'border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100 bg-gradient-to-br from-white to-emerald-50/30'
          : `${colors.border}`,
      )}
      onClick={handleClick}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', product.iconBg)}>
          <Icon className={cn('h-5 w-5', colors.icon)} />
        </div>
        {isContracted ? (
          <Badge className="text-xs shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
            <CheckCircle2 className="h-3 w-3" /> Contratado
          </Badge>
        ) : isInProgress ? (
          <Badge className="text-xs shrink-0 bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <Clock className="h-3 w-3" /> En proceso
          </Badge>
        ) : (
          <Badge className={cn('text-xs shrink-0', colors.badge)}>
            <div className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
            Disponible
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-slate-900">{product.name}</h3>
        <p className="text-xs text-slate-500 font-medium">{product.tagline}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Features */}
      <div className="space-y-1.5">
        {product.features.map((f) => (
          <div key={f} className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2
              className={cn('h-3.5 w-3.5 shrink-0', isContracted ? 'text-emerald-500' : 'text-emerald-400')}
            />
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      {isContracted ? (
        <Button className="w-full gap-2 mt-auto bg-emerald-600 hover:bg-emerald-700 text-white">
          Ver credenciales de producción <ExternalLink className="h-4 w-4" />
        </Button>
      ) : isInProgress ? (
        <Button className={cn('w-full gap-2 mt-auto', colors.btn)}>
          Continuar onboarding <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button className={cn('w-full gap-2 mt-auto', colors.btn)}>
          Explorar en Sandbox <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

function ComingSoonCard({ product }: { product: Product }) {
  const colors = COLOR_MAP[product.color]
  const Icon = product.icon

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 opacity-60">
      <div className="flex items-start justify-between gap-3">
        <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', product.iconBg)}>
          <Icon className={cn('h-5 w-5', colors.icon)} />
        </div>
        <Badge variant="outline" className="text-xs text-slate-400 border-slate-200 shrink-0 gap-1">
          <Clock className="h-3 w-3" /> Próximamente
        </Badge>
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-slate-900">{product.name}</h3>
        <p className="text-xs text-slate-500 font-medium">{product.tagline}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
      </div>
      <div className="space-y-1.5">
        {product.features.map((f) => (
          <div key={f} className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-slate-300" />
            {f}
          </div>
        ))}
      </div>
      <Button variant="outline" disabled className="w-full gap-2 mt-auto text-slate-400 border-slate-200">
        <Clock className="h-4 w-4" /> Próximamente
      </Button>
    </div>
  )
}

export default function SandboxDashboard() {
  const router = useRouter()
  const { email, companyName, contractSigned, intentDeclared, setPhase } = useOnboardingStore()

  useEffect(() => {
    if (!email) router.push('/registro')
    // Si ya están en producción, no pisar la fase
    else if (!contractSigned) setPhase('sandbox')
  }, [email, router, setPhase, contractSigned])

  if (!email) return null

  // Determinar el estado de SPEI
  const speiState: SpeiState = contractSigned
    ? 'contracted'
    : intentDeclared
    ? 'in_progress'
    : 'available'

  const speiProduct = PRODUCTS[0]
  const otherProducts = PRODUCTS.slice(1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn(
              contractSigned
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-amber-100 text-amber-700 border-amber-200'
            )}>
              {contractSigned ? 'Producción activa' : 'Entorno Sandbox'}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Productos</h1>
          <p className="text-slate-600 text-sm mt-1">
            Bienvenido, <span className="font-medium">{companyName}</span>.{' '}
            {contractSigned
              ? 'Tu integración SPEI está activa en producción.'
              : 'Explora los productos disponibles en sandbox — nada aquí afecta producción.'}
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white border border-slate-200 rounded-lg px-4 py-2 shrink-0">
          {contractSigned ? (
            <span><span className="font-medium text-emerald-700">1</span> contratado · <span className="font-medium text-slate-700">4</span> próximamente</span>
          ) : (
            <span><span className="font-medium text-slate-700">1</span> disponible · <span className="font-medium text-slate-700">4</span> próximamente</span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <SpeiCard
          product={speiProduct}
          speiState={speiState}
          onNavigate={(href) => router.push(href)}
        />
        {otherProducts.map((product) => (
          <ComingSoonCard key={product.id} product={product} />
        ))}
      </div>

      {/* Footer note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-3 text-sm text-slate-600">
        <Clock className="h-5 w-5 text-slate-400 shrink-0" />
        <p>
          Los productos marcados como <strong>Próximamente</strong> estarán disponibles en los próximos meses.
          {contractSigned
            ? ' Tu account manager te notificará cuando estén listos.'
            : ' Al contratar SPEI / Cuenta IFPE, tu account manager te mantendrá informado sobre el roadmap.'}
        </p>
      </div>
    </div>
  )
}
