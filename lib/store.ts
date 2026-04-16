'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UAT_CASES_SPEI, UatCase, generateApiKey } from './mocks'

export type OnboardingPhase = 'registro' | 'sandbox' | 'kyb' | 'uat' | 'contrato' | 'produccion'
export type KybStatus = 'idle' | 'in_review' | 'approved'

interface KybData {
  rfc: string
  razonSocial: string
  nombreRepresentante: string
  documentos: string[]
  volumenMensual: string
  casosDeUso: string
}

interface OnboardingStore {
  // Usuario
  email: string
  companyName: string
  userName: string

  // Fase actual
  currentPhase: OnboardingPhase

  // API Keys
  stagingPublicKey: string
  stagingSecretKey: string
  productionPublicKey: string | null
  productionSecretKey: string | null

  // Intención declarada
  intentDeclared: boolean

  // KYB
  kybStep: 1 | 2 | 3
  kybData: KybData
  kybStatus: KybStatus

  // UAT
  uatCases: UatCase[]
  uatCertified: boolean

  // Contrato
  contractSigned: boolean

  // Actions
  register: (email: string, companyName: string, userName: string) => void
  setPhase: (phase: OnboardingPhase) => void
  declareIntent: () => void
  setKybStep: (step: 1 | 2 | 3) => void
  updateKybData: (data: Partial<KybData>) => void
  setKybStatus: (status: KybStatus) => void
  updateUatCase: (id: string, status: UatCase['status']) => void
  certifyUat: () => void
  signContract: () => void
  reset: () => void
}

const defaultKybData: KybData = {
  rfc: '',
  razonSocial: '',
  nombreRepresentante: '',
  documentos: [],
  volumenMensual: '',
  casosDeUso: '',
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      email: '',
      companyName: '',
      userName: '',
      currentPhase: 'registro',
      stagingPublicKey: '',
      stagingSecretKey: '',
      productionPublicKey: null,
      productionSecretKey: null,
      intentDeclared: false,
      kybStep: 1,
      kybData: defaultKybData,
      kybStatus: 'idle',
      uatCases: UAT_CASES_SPEI,
      uatCertified: false,
      contractSigned: false,

      register: (email, companyName, userName) =>
        set({
          email,
          companyName,
          userName,
          currentPhase: 'sandbox',
          stagingPublicKey: generateApiKey('pk', 'sandbox'),
          stagingSecretKey: generateApiKey('sk', 'sandbox'),
        }),

      setPhase: (phase) => set({ currentPhase: phase }),

      declareIntent: () => set({ intentDeclared: true }),

      setKybStep: (step) => set({ kybStep: step }),

      updateKybData: (data) =>
        set((state) => ({ kybData: { ...state.kybData, ...data } })),

      setKybStatus: (status) => set({ kybStatus: status }),

      updateUatCase: (id, status) =>
        set((state) => ({
          uatCases: state.uatCases.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      certifyUat: () =>
        set({
          uatCertified: true,
          currentPhase: 'contrato',
        }),

      signContract: () => {
        const pk = generateApiKey('pk', 'production')
        const sk = generateApiKey('sk', 'production')
        set({
          contractSigned: true,
          productionPublicKey: pk,
          productionSecretKey: sk,
          currentPhase: 'produccion',
        })
      },

      reset: () =>
        set({
          email: '',
          companyName: '',
          userName: '',
          currentPhase: 'registro',
          stagingPublicKey: '',
          stagingSecretKey: '',
          productionPublicKey: null,
          productionSecretKey: null,
          intentDeclared: false,
          kybStep: 1,
          kybData: defaultKybData,
          kybStatus: 'idle',
          uatCases: UAT_CASES_SPEI,
          uatCertified: false,
          contractSigned: false,
        }),
    }),
    { name: 'monato-onboarding' }
  )
)
