import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { server } from '../test/mocks/server'
import { ResetPassword } from './ResetPassword'

function renderResetPassword(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<div>Page de connexion</div>} />
        <Route path="/forgot-password" element={<div>Mot de passe oublie</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ResetPassword', () => {
  it('affiche un etat lien invalide sans token', () => {
    renderResetPassword('/reset-password')
    expect(screen.getByRole('heading', { name: /lien invalide/i })).toBeInTheDocument()
    expect(screen.queryByLabelText('Nouveau mot de passe')).not.toBeInTheDocument()
  })

  it('affiche le formulaire quand un token est present', () => {
    renderResetPassword('/reset-password?token=abc')
    expect(screen.getByLabelText('Nouveau mot de passe')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument()
  })

  it('refuse un mot de passe trop faible', async () => {
    renderResetPassword('/reset-password?token=abc')
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'abc')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Réinitialiser le mot de passe' }))
    await waitFor(() => {
      expect(screen.getByText(/au moins 12/)).toBeInTheDocument()
    })
  })

  it('refuse quand la confirmation ne correspond pas', async () => {
    renderResetPassword('/reset-password?token=abc')
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'Abcdef1!ghij')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Abcdef1!ZZZZ')
    await user.click(screen.getByRole('button', { name: 'Réinitialiser le mot de passe' }))
    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument()
    })
  })

  it('redirige vers la connexion apres un reset reussi', async () => {
    renderResetPassword('/reset-password?token=abc')
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'Abcdef1!ghij')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Abcdef1!ghij')
    await user.click(screen.getByRole('button', { name: 'Réinitialiser le mot de passe' }))
    expect(await screen.findByText('Page de connexion')).toBeInTheDocument()
  })

  it('affiche une erreur quand le token est rejete (400)', async () => {
    server.use(
      http.post('*/v1/auth/reset-password', () => new HttpResponse(null, { status: 400 })),
    )
    renderResetPassword('/reset-password?token=abc')
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'Abcdef1!ghij')
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Abcdef1!ghij')
    await user.click(screen.getByRole('button', { name: 'Réinitialiser le mot de passe' }))
    await waitFor(() => {
      expect(screen.getByText(/invalide ou a expiré/i)).toBeInTheDocument()
    })
  })
})
