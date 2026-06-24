import { z } from 'zod'

export const MIN_PASSWORD_LENGTH = 12
export const MAX_PASSWORD_LENGTH = 128

export interface PasswordCriteria {
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasDigit: boolean
  hasSpecialCharacter: boolean
}

export type PasswordStrength = 'weak' | 'medium' | 'strong'

export function evaluatePassword(password: string): PasswordCriteria {
  return {
    hasMinLength:
      password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecialCharacter: /[^A-Za-z0-9]/.test(password),
  }
}

export function getPasswordStrength(password: string): PasswordStrength {
  const criteria = evaluatePassword(password)
  const satisfied = Object.values(criteria).filter(Boolean).length
  if (satisfied <= 2) {
    return 'weak'
  }
  if (satisfied <= 4) {
    return 'medium'
  }
  return 'strong'
}

export const newPasswordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`,
  )
  .max(
    MAX_PASSWORD_LENGTH,
    `Le mot de passe ne doit pas dépasser ${MAX_PASSWORD_LENGTH} caractères`,
  )
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')
