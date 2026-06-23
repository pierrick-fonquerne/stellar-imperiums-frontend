import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext } from './authContext'
import type { AuthStatus } from './authContext'
import type { User } from '../types/auth'
import type { LoginCredentials } from '../types/auth'
import {
  login as loginRequest,
  logout as logoutRequest,
  refresh,
  fetchCurrentUser,
} from '../services/auth'
import { setAccessToken } from '../services/api'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const { accessToken } = await refresh()
        setAccessToken(accessToken)
        const u = await fetchCurrentUser()
        if (!cancelled) {
          setUser(u)
          setStatus('authenticated')
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null)
          setUser(null)
          setStatus('unauthenticated')
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  async function login(credentials: LoginCredentials): Promise<void> {
    const res = await loginRequest(credentials)
    setAccessToken(res.accessToken)
    setUser(res.user)
    setStatus('authenticated')
  }

  async function logout(): Promise<void> {
    try {
      await logoutRequest()
    } finally {
      setAccessToken(null)
      setUser(null)
      setStatus('unauthenticated')
    }
  }

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
