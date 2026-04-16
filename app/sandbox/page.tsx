'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Zap, Globe, RefreshCw, CreditCard, ArrowRight,
  Clock, CheckCircle2, Lock
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
  href?: string
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
    href: '/sandbox/spei',
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
  violet: {
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    btn: '',
    icon: 'text-violet-500',
    border: 'border-slate-200',
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    btn: '',
    icon: 'text-emerald-600',
    border: 'border-slate-200',
  },
  orange: {
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    btn: '',
    icon: 'text-orange-500',
    border: 'border-slate-200',
  },
  rose: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    btn: '',
    icon: 'text-rose-500',
    border: 'border-slate-200',
  },
}

function ProductCard({ product, onNavigate }: { product: Product; onNavigate: (href: string) => void }) {
  const colors = COLOR_MAP[product.color]
  const isAvailable = product.status === 'available'
  const Icon = product.icon

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border p-6 flex flex-col gap-4 transition-all',
        isAvailable
          ? `cursor-pointer hover:shadow-lg ${colors.border}`
          : 'opacity-70 cursor-default border-slate-200',
      )}
      onClick={() => isAvailable && product.href && onNavigate(product.href)}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', product.iconBg)}>
          <Icon className={cn('h-5 w-5', colors.icon)} />
        </div>
        {isAvailable ? (
          <Badge className={cn('text-xs shrink-0', colors.badge)}>
            <div className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
            Disponible
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-slate-400 border-slate-200 shrink-0 gap-1">
            <Clock className="h-3 w-3" /> Próximamente
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
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                isAvailable ? 'text-emerald-500' : 'text-slate-300',
              )}
            />
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      {isAvailable ? (
        <Button className={cn('w-full gap-2 mt-auto', colors.btn)}>
          Explorar en Sandbox <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" disabled className="w-full gap-2 mt-auto text-slate-400 border-slate-200">
          <Clock className="h-4 w-4" /> Próximamente
        </Button>
      )}
    </div>
  )
}

export default function SandboxDashboard() {
  const router = useRouter()
  const { email, companyName, setPhase } = useOnboardingStore()

  useEffect(() => {
    if (!email) router.push('/registro')
    else setPhase('sandbox')
  }, [email, router, setPhase])

  if (!email) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
              Entorno Sandbox
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Productos</h1>
          <p className="text-slate-600 text-sm mt-1">
            Bienvenido, <span className="font-medium">{companyName}</span>. Explora los productos disponibles
            en sandbox — nada aquí afecta producción.
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white border border-slate-200 rounded-lg px-4 py-2 shrink-0">
          <span className="font-medium text-slate-700">1</span> producto disponible ·{' '}
          <span className="font-medium text-slate-700">4</span> próximamente
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onNavigate={(href) => router.push(href)}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-3 text-sm text-slate-600">
        <Clock className="h-5 w-5 text-slate-400 shrink-0" />
        <p>
          Los productos marcados como <strong>Próximamente</strong> estarán disponibles en los próximos meses.
          Al contratar SPEI / Cuenta IFPE, tu account manager te mantendrá informado sobre el roadmap.
        </p>
      </div>
    </div>
  )
}
