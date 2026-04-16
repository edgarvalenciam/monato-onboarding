'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/lib/store'
import { RotateCcw, X, AlertTriangle } from 'lucide-react'

export function ResetButton() {
  const { email, reset } = useOnboardingStore()
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)

  // Solo visible si ya hay una sesión activa
  if (!email) return null

  function handleReset() {
    reset()
    setConfirm(false)
    router.push('/')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip de confirmación */}
      {confirm && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-60 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-snug">
              Esto borra toda la sesión y te regresa al inicio del demo.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirm(false)}
              className="flex-1 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              className="flex-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1.5 transition-colors"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setConfirm((v) => !v)}
        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-md rounded-full pl-3 pr-4 py-2.5 shadow-sm transition-all text-sm font-medium"
        title="Reiniciar demo"
      >
        {confirm ? (
          <X className="h-4 w-4 text-slate-500" />
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
        <span>{confirm ? 'Cerrar' : 'Reiniciar demo'}</span>
      </button>
    </div>
  )
}
