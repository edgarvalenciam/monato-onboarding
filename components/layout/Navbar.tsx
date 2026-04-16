'use client'

import Link from 'next/link'
import { useOnboardingStore } from '@/lib/store'
import { OnboardingProgress } from './OnboardingProgress'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

export function Navbar() {
  const { email, companyName, currentPhase } = useOnboardingStore()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
              <span className="text-xs font-bold text-white">M</span>
            </div>
            <span className="font-semibold text-slate-900 hidden sm:block">Monato</span>
            <Badge variant="outline" className="text-xs hidden sm:flex">
              {currentPhase === 'sandbox' || currentPhase === 'registro' ? 'Sandbox' :
               currentPhase === 'produccion' ? 'Producción' : 'Onboarding'}
            </Badge>
          </Link>

          {/* Progress */}
          <OnboardingProgress />

          {/* User */}
          {email && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1 text-sm text-slate-600">
                <Building2 className="h-3.5 w-3.5" />
                <span className="font-medium">{companyName}</span>
              </div>
              <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-700">
                  {email[0].toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
