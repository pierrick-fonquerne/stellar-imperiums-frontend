import { getPasswordStrength } from '../lib/passwordPolicy'
import type { PasswordStrength } from '../lib/passwordPolicy'

const STRENGTH_CONFIG: Record<
  PasswordStrength,
  { label: string; widthClass: string; colorClass: string }
> = {
  weak: { label: 'Faible', widthClass: 'w-1/3', colorClass: 'bg-red-500' },
  medium: { label: 'Moyen', widthClass: 'w-2/3', colorClass: 'bg-yellow-500' },
  strong: { label: 'Fort', widthClass: 'w-full', colorClass: 'bg-green-500' },
}

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) {
    return null
  }
  const config = STRENGTH_CONFIG[getPasswordStrength(password)]
  return (
    <div className="mt-2" aria-live="polite">
      <div className="h-1.5 w-full rounded bg-gray-700">
        <div className={`h-1.5 rounded ${config.widthClass} ${config.colorClass}`} />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        Force du mot de passe : {config.label}
      </p>
    </div>
  )
}
