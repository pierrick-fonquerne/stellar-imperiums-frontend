import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { requestPasswordReset } from '../services/auth'

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse e-mail est requise")
    .email("L'adresse e-mail est invalide"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

const NEUTRAL_MESSAGE =
  "Si un compte est associé à cette adresse, un email de réinitialisation a été envoyé."

export function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await requestPasswordReset(values.email)
    } catch {
      // Anti-enumeration : on affiche le meme message quel que soit le resultat
    }
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-sm rounded-lg bg-gray-900 p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Mot de passe oublié</h1>
        {submitted ? (
          <div>
            <p className="mb-6 text-sm text-gray-300">{NEUTRAL_MESSAGE}</p>
            <Link to="/login" className="text-sm text-indigo-400 hover:text-indigo-300">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Envoyer le lien de réinitialisation
            </button>
            <Link
              to="/login"
              className="mt-4 block text-center text-sm text-indigo-400 hover:text-indigo-300"
            >
              Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
