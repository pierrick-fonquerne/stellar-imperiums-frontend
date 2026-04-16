import { Routes, Route } from 'react-router'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Stellar Imperiums
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Jeu de gestion de colonie spatiale en navigateur
        </p>
      </div>
    </div>
  )
}

export default App
