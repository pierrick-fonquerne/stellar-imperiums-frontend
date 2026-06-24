import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../test/mocks/server'
import { requestPasswordReset, resetPassword } from './auth'

describe('services de recuperation de mot de passe', () => {
  it('requestPasswordReset resout quand le backend accepte (202)', async () => {
    await expect(requestPasswordReset('vega@stellar.io')).resolves.toBeUndefined()
  })

  it('resetPassword resout quand le backend confirme (204)', async () => {
    await expect(resetPassword('token-valide', 'Abcdef1!ghij')).resolves.toBeUndefined()
  })

  it('resetPassword rejette quand le token est invalide (400)', async () => {
    server.use(
      http.post('*/v1/auth/reset-password', () => new HttpResponse(null, { status: 400 })),
    )
    await expect(resetPassword('token-invalide', 'Abcdef1!ghij')).rejects.toBeDefined()
  })
})
