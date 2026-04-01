import { describe, expect, it } from 'vitest'
import { createPretextTypography } from './typography'

describe('createPretextTypography', () => {
  it('returns measurement fields and matching render styles from a font shorthand input', () => {
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

  it('builds a matching font shorthand from structured typography values', () => {
    const typography = createPretextTypography({
      family: 'GeistVariable, sans-serif',
      size: 18,
      weight: 400,
      lineHeight: 28,
      width: 320,
    })

    expect(typography).toEqual({
      font: '400 18px GeistVariable, sans-serif',
      lineHeight: 28,
      width: 320,
      style: {
        font: '400 18px GeistVariable, sans-serif',
        lineHeight: '28px',
        width: '320px',
      },
    })
  })

  it('supports structured typography input without an explicit weight', () => {
    const typography = createPretextTypography({
      family: 'Inter, sans-serif',
      size: 16,
      lineHeight: 24,
    })

    expect(typography.font).toBe('16px Inter, sans-serif')
    expect(typography.style).toEqual({
      font: '16px Inter, sans-serif',
      lineHeight: '24px',
    })
  })

  it('supports structured typography input with a string weight', () => {
    const typography = createPretextTypography({
      family: 'Inter, sans-serif',
      size: 16,
      weight: 'bold',
      lineHeight: 24,
    })

    expect(typography.font).toBe('bold 16px Inter, sans-serif')
  })

  it('throws for an empty font string', () => {
    expect(() =>
      createPretextTypography({
        font: '   ',
        lineHeight: 24,
      }),
    ).toThrowError('createPretextTypography requires a non-empty `font` string.')
  })

  it('throws for an empty family in structured input', () => {
    expect(() =>
      createPretextTypography({
        family: '   ',
        size: 16,
        lineHeight: 24,
      }),
    ).toThrowError('createPretextTypography requires a non-empty `family` value.')
  })

  it('throws for a non-positive size in structured input', () => {
    expect(() =>
      createPretextTypography({
        family: 'Inter, sans-serif',
        size: 0,
        lineHeight: 24,
      }),
    ).toThrowError('createPretextTypography requires `size` to be a positive number.')
  })

  it('throws for a non-positive line height', () => {
    expect(() =>
      createPretextTypography({
        family: 'Inter, sans-serif',
        size: 16,
        lineHeight: 0,
      }),
    ).toThrowError('createPretextTypography requires `lineHeight` to be a positive number.')
  })
})
