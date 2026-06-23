import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'
import type { AuthContextValue } from '../contexts/authContext'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit etre utilise dans un AuthProvider')
  }
  return context
}
