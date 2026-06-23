import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../test/mocks/server'
import { AuthProvider } from './AuthProvider'
import { useAuth } from '../hooks/useAuth'

function AuthConsumer() {
  const { status, user } = useAuth()
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="username">{user?.username ?? 'aucun'}</span>
    </div>
  )
}

function AuthConsumerWithActions() {
  const { status, user, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="username">{user?.username ?? 'aucun'}</span>
      <button
        onClick={() => { void login({ email: 'vega@stellar.io', password: 'mdp123' }) }}
      >
        Login
      </button>
      <button onClick={() => { void logout() }}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  it("au montage, demarre le bootstrap (refresh) et passe en 'authenticated' si succes", async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated')
    })
    expect(screen.getByTestId('username').textContent).toBe('Cmdr_Vega')
  })

  it("login() passe en 'authenticated' et remplit user", async () => {
    server.use(
      http.post('*/v1/auth/refresh', () => new HttpResponse(null, { status: 401 })),
    )
    render(
      <AuthProvider>
        <AuthConsumerWithActions />
      </AuthProvider>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('unauthenticated')
    })
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Login' }))
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated')
    })
    expect(screen.getByTestId('username').textContent).toBe('Cmdr_Vega')
  })

  it("logout() repasse en 'unauthenticated' et vide user", async () => {
    server.use(
      http.post('*/v1/auth/refresh', () => new HttpResponse(null, { status: 401 })),
    )
    render(
      <AuthProvider>
        <AuthConsumerWithActions />
      </AuthProvider>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('unauthenticated')
    })
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Login' }))
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated')
    })
    await user.click(screen.getByRole('button', { name: 'Logout' }))
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('unauthenticated')
    })
    expect(screen.getByTestId('username').textContent).toBe('aucun')
  })
})
