import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { server } from '../test/mocks/server'
import { AuthProvider } from '../contexts/AuthProvider'
import { Login } from './Login'

function renderLogin() {
  server.use(
    http.post('*/v1/auth/refresh', () => new HttpResponse(null, { status: 401 })),
  )
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Login', () => {
  it('affiche le champ e-mail, le champ mot de passe et le bouton', () => {
    renderLogin()
    expect(screen.getByLabelText('Adresse e-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument()
  })

  it('affiche des erreurs de validation quand le formulaire est soumis vide', async () => {
    renderLogin()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))
    await waitFor(() => {
      expect(screen.getByText("L'adresse e-mail est requise")).toBeInTheDocument()
      expect(screen.getByText('Le mot de passe est requis')).toBeInTheDocument()
    })
  })

  it("affiche une erreur si l'e-mail est invalide", async () => {
    renderLogin()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse e-mail'), 'pas-un-email')
    await user.type(screen.getByLabelText('Mot de passe'), 'monmotdepasse')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))
    await waitFor(() => {
      expect(screen.getByText("L'adresse e-mail est invalide")).toBeInTheDocument()
    })
  })

  it('navigue apres connexion avec des identifiants valides', async () => {
    server.use(
      http.post('*/v1/auth/refresh', () => new HttpResponse(null, { status: 401 })),
    )
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<div>Accueil</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse e-mail'), 'vega@stellar.io')
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse123')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))
    expect(await screen.findByText('Accueil')).toBeInTheDocument()
  })

  it('affiche une erreur sur identifiants invalides (401)', async () => {
    server.use(
      http.post('*/v1/auth/login', () => {
        return new HttpResponse(null, { status: 401 })
      }),
    )
    renderLogin()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse e-mail'), 'vega@stellar.io')
    await user.type(screen.getByLabelText('Mot de passe'), 'mauvaismdp')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))
    await waitFor(() => {
      expect(screen.getByText('Identifiants invalides')).toBeInTheDocument()
    })
  })
})
