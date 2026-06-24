import { describe, expect, it } from 'vitest'
import {
  evaluatePassword,
  getPasswordStrength,
  newPasswordSchema,
  MIN_PASSWORD_LENGTH,
} from './passwordPolicy'

describe('passwordPolicy', () => {
  it('detecte chaque critere CNIL', () => {
    const criteria = evaluatePassword('Abcdef1!ghij')
    expect(criteria.hasMinLength).toBe(true)
    expect(criteria.hasUppercase).toBe(true)
    expect(criteria.hasLowercase).toBe(true)
    expect(criteria.hasDigit).toBe(true)
    expect(criteria.hasSpecialCharacter).toBe(true)
  })

  it('marque les criteres manquants', () => {
    const criteria = evaluatePassword('abc')
    expect(criteria.hasMinLength).toBe(false)
    expect(criteria.hasUppercase).toBe(false)
    expect(criteria.hasDigit).toBe(false)
    expect(criteria.hasSpecialCharacter).toBe(false)
  })

  it('classe la force du mot de passe', () => {
    expect(getPasswordStrength('abc')).toBe('weak')
    expect(getPasswordStrength('Abcdefghijkl')).toBe('medium')
    expect(getPasswordStrength('Abcdef1!ghij')).toBe('strong')
  })

  it('rejette un mot de passe trop court via le schema', () => {
    const result = newPasswordSchema.safeParse('Ab1!')
    expect(result.success).toBe(false)
  })

  it('accepte un mot de passe conforme via le schema', () => {
    const result = newPasswordSchema.safeParse('Abcdef1!ghij')
    expect(result.success).toBe(true)
  })

  it('expose la longueur minimale attendue', () => {
    expect(MIN_PASSWORD_LENGTH).toBe(12)
  })
})
