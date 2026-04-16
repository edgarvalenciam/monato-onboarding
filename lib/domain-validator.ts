const BLOCKED_DOMAINS = [
  'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com',
  'live.com', 'msn.com', 'aol.com', 'protonmail.com', 'mail.com',
  'ymail.com', 'me.com', 'mac.com', 'hotmail.es', 'yahoo.es',
]

export function validateCorporateDomain(email: string): { valid: boolean; reason?: string } {
  const parts = email.split('@')
  if (parts.length !== 2) return { valid: false, reason: 'Correo inválido' }

  const domain = parts[1].toLowerCase()

  if (BLOCKED_DOMAINS.includes(domain)) {
    return {
      valid: false,
      reason: `Los correos de ${domain} no son aceptados. Usa tu correo corporativo (ej. nombre@tuempresa.com).`,
    }
  }

  if (!domain.includes('.')) {
    return { valid: false, reason: 'Dominio inválido' }
  }

  return { valid: true }
}
