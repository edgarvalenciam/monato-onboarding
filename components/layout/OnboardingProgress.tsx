'use client'

import { useOnboardingStore, OnboardingPhase } from '@/lib/store'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS: { phase: OnboardingPhase; label: string }[] = [
  { phase: 'sandbox', label: 'Sandbox' },
  { phase: 'kyb', label: 'KYB' },
  { phase: 'uat', label: 'UAT' },
  { phase: 'contrato', label: 'Contrato' },
  { phase: 'produccion', label: 'Producción' },
]

const PHASE_ORDER: OnboardingPhase[] = ['registro', 'sandbox', 'kyb', 'uat', 'contrato', 'produccion']

function phaseIndex(phase: OnboardingPhase) {
  return PHASE_ORDER.indexOf(phase)
}

export function OnboardingProgress() {
  const { currentPhase, email } = useOnboardingStore()

  if (!email) return null

  const currentIdx = phaseIndex(currentPhase)

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((step, i) => {
        const stepIdx = phaseIndex(step.phase)
        const isDone = currentIdx > stepIdx
        const isActive = currentIdx === stepIdx
        const isPending = currentIdx < stepIdx

        return (
          <div key={step.phase} className="flex items-center gap-1">
            {i > 0 && (
              <div
                className={cn(
                  'h-px w-4 sm:w-8',
                  isDone ? 'bg-emerald-500' : 'bg-slate-200'
                )}
              />
            )}
            <div className="flex items-center gap-1">
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              ) : (
                <Circle className="h-4 w-4 text-slate-300" />
              )}
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  isDone && 'text-emerald-600',
                  isActive && 'text-blue-700',
                  isPending && 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
