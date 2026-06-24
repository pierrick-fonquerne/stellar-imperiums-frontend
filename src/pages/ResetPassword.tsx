import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { resetPassword } from '../services/auth'
import { newPasswordSchema } from '../lib/passwordPolicy'
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter'

const resetPasswordSchema = z
  .object({
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, 'La confirmation est requise'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

const INVALID_TOKEN_MESSAGE =
  'Ce lien est invalide ou a expiré. Demandez un nouvel email de réinitialisation.'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [resetError, setResetError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })
  const password = watch('newPassword') ?? ''

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="w-full max-w-sm rounded-lg bg-gray-900 p-8 text-center shadow-lg">
          <h1 className="mb-4 text-2xl font-bold tracking-tight">Lien invalide</h1>
          <p className="mb-6 text-sm text-gray-300">{INVALID_TOKEN_MESSAGE}</p>
          <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    )
  }

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      return
    }
    setResetError(null)
    try {
      await resetPassword(token, values.newPassword)
      await navigate('/login', {
        state: { notice: 'Mot de passe modifié, vous pouvez vous connecter.' },
      })
    } catch {
      setResetError(INVALID_TOKEN_MESSAGE)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-sm rounded-lg bg-gray-900 p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Nouveau mot de passe</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              type="password"
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              placeholder="••••••••"
              {...register('newPassword')}
            />
            <PasswordStrengthMeter password={password} />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          {resetError !== null && (
            <p className="mb-4 text-sm text-red-400">{resetError}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  )
}
