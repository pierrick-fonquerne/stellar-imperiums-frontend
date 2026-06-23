import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AuthContext } from '../contexts/authContext'
import type { AuthContextValue } from '../contexts/authContext'
import { RequireAuth } from './RequireAuth'

function renderWithAuth(contextValue: AuthContextValue, initialPath = '/protected') {
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/protected" element={<div>Contenu protege</div>} />
          </Route>
          <Route path="/login" element={<div>Page de connexion</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

const unauthenticatedCtx: AuthContextValue = {
  user: null,
  status: 'unauthenticated',
  login: async () => { throw new Error('not implemented') },
  logout: async () => { throw new Error('not implemented') },
}

const authenticatedCtx: AuthContextValue = {
  user: { id: 1, username: 'Cmdr_Vega', email: 'vega@stellar.io', role: 'joueur' },
  status: 'authenticated',
  login: async () => { throw new Error('not implemented') },
  logout: async () => { throw new Error('not implemented') },
}

const loadingCtx: AuthContextValue = {
  user: null,
  status: 'loading',
  login: async () => { throw new Error('not implemented') },
  logout: async () => { throw new Error('not implemented') },
}

describe('RequireAuth', () => {
  it("redirige vers /login quand l'utilisateur est non authentifie", () => {
    renderWithAuth(unauthenticatedCtx)
    expect(screen.getByText('Page de connexion')).toBeInTheDocument()
    expect(screen.queryByText('Contenu protege')).not.toBeInTheDocument()
  })

  it('affiche le contenu protege quand authentifie', () => {
    renderWithAuth(authenticatedCtx)
    expect(screen.getByText('Contenu protege')).toBeInTheDocument()
  })

  it("n'affiche ni le contenu protege ni la page de connexion pendant le chargement", () => {
    renderWithAuth(loadingCtx)
    expect(screen.queryByText('Contenu protege')).not.toBeInTheDocument()
    expect(screen.queryByText('Page de connexion')).not.toBeInTheDocument()
  })
})
