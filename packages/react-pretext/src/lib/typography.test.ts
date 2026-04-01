import { describe, expect, it } from 'vitest'
import { createPretextTypography } from './typography'

describe('createPretextTypography', () => {
  it('returns measurement fields and matching render styles', () => {
    const typography = createPretextTypography({
      font: '400 18px GeistVariable, sans-serif',
      lineHeight: 28,
      width: 320,
    })

    expect(typography.font).toBe('400 18px GeistVariable, sans-serif')
    expect(typography.lineHeight).toBe(28)
    expect(typography.width).toBe(320)
    expect(typography.style).toEqual({
      font: '400 18px GeistVariable, sans-serif',
      lineHeight: '28px',
      width: '320px',
    })
  })

  it('omits width styles when width is not provided', () => {
    const typography = createPretextTypography({
      font: '700 40px GeistVariable, sans-serif',
      lineHeight: 42,
    })

    expect(typography.style).toEqual({
      font: '700 40px GeistVariable, sans-serif',
      lineHeight: '42px',
    })
  })
})
