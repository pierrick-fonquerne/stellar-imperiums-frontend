import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function RequireAuth() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p>Chargement...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
