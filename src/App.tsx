import { Routes, Route, useNavigate } from 'react-router'
import { Login } from './pages/Login'
import { RequireAuth } from './components/RequireAuth'
import { useAuth } from './hooks/useAuth'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    await navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Stellar Imperiums
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Jeu de gestion de colonie spatiale en navigateur
        </p>
        {user && (
          <p className="mt-4 text-lg text-gray-300">
            Bienvenue {user.username}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="mt-6 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Se deconnecter
        </button>
      </div>
    </div>
  )
}

export default App
