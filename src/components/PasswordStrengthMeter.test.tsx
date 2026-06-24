import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'

describe('PasswordStrengthMeter', () => {
  it("n'affiche rien quand le mot de passe est vide", () => {
    const { container } = render(<PasswordStrengthMeter password="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('affiche une force faible', () => {
    render(<PasswordStrengthMeter password="abc" />)
    expect(screen.getByText(/Faible/)).toBeInTheDocument()
  })

  it('affiche une force forte', () => {
    render(<PasswordStrengthMeter password="Abcdef1!ghij" />)
    expect(screen.getByText(/Fort/)).toBeInTheDocument()
  })
})
