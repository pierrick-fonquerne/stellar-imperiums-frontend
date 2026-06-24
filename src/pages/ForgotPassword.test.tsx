import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { server } from '../test/mocks/server'
import { ForgotPassword } from './ForgotPassword'

function renderForgotPassword() {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>,
  )
}

describe('ForgotPassword', () => {
  it('affiche le champ e-mail et le bouton', () => {
    renderForgotPassword()
    expect(screen.getByLabelText('Adresse e-mail')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Envoyer le lien de réinitialisation' }),
    ).toBeInTheDocument()
  })

  it('affiche une erreur quand le formulaire est soumis vide', async () => {
    renderForgotPassword()
    const user = userEvent.setup()
    await user.click(
      screen.getByRole('button', { name: 'Envoyer le lien de réinitialisation' }),
    )
    await waitFor(() => {
      expect(screen.getByText("L'adresse e-mail est requise")).toBeInTheDocument()
    })
  })

  it('affiche un message neutre apres une soumission valide', async () => {
    renderForgotPassword()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse e-mail'), 'vega@stellar.io')
    await user.click(
      screen.getByRole('button', { name: 'Envoyer le lien de réinitialisation' }),
    )
    expect(
      await screen.findByText(/Si un compte est associé à cette adresse/),
    ).toBeInTheDocument()
  })

  it('affiche le meme message neutre meme en cas de rejet (429)', async () => {
    server.use(
      http.post('*/v1/auth/forgot-password', () => new HttpResponse(null, { status: 429 })),
    )
    renderForgotPassword()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse e-mail'), 'vega@stellar.io')
    await user.click(
      screen.getByRole('button', { name: 'Envoyer le lien de réinitialisation' }),
    )
    expect(
      await screen.findByText(/Si un compte est associé à cette adresse/),
    ).toBeInTheDocument()
  })
})
