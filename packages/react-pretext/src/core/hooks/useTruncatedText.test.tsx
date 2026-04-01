import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createPretextTypography } from '../lib/typography'
import { useTruncatedText } from './useTruncatedText'

describe('useTruncatedText', () => {
  it('returns the original text when it already fits within maxLines', () => {
    const typography = createPretextTypography({
      family: 'Inter, sans-serif',
      size: 16,
      lineHeight: 24,
      width: 120,
    })

    const { result } = renderHook(() =>
      useTruncatedText({
        text: 'alpha beta',
        typography,
        maxLines: 2,
      }),
    )

    expect(result.current).toEqual({
      text: 'alpha beta',
      didTruncate: false,
      visibleLineCount: 1,
      fullLineCount: 1,
      height: 24,
      isReady: true,
    })
  })

  it('truncates to the requested line count with an ellipsis', () => {
    const typography = createPretextTypography({
      family: 'Inter, sans-serif',
      size: 16,
      lineHeight: 24,
      width: 80,
    })

    const { result } = renderHook(() =>
      useTruncatedText({
        text: 'alpha beta gamma delta',
        typography,
        maxLines: 2,
      }),
    )

    expect(result.current).toEqual({
      text: 'alpha beta gamma…',
      didTruncate: true,
      visibleLineCount: 2,
      fullLineCount: 3,
      height: 48,
      isReady: true,
    })
  })

  it('prefers dropping a partial trailing word when ellipsis would overflow the last line', () => {
    const typography = createPretextTypography({
      family: 'Inter, sans-serif',
      size: 16,
      lineHeight: 24,
      width: 80,
    })

    const { result } = renderHook(() =>
      useTruncatedText({
        text: 'alpha beta delta',
        typography,
        maxLines: 1,
      }),
    )

    expect(result.current).toEqual({
      text: 'alpha…',
      didTruncate: true,
      visibleLineCount: 1,
      fullLineCount: 2,
      height: 24,
      isReady: true,
    })
  })

  it('supports a custom ellipsis token', () => {
    const typography = createPretextTypography({
      family: 'Inter, sans-serif',
      size: 16,
      lineHeight: 24,
      width: 80,
    })

    const { result } = renderHook(() =>
      useTruncatedText({
        text: 'alpha beta gamma delta',
        typography,
        maxLines: 2,
        ellipsis: '...',
      }),
    )

    expect(result.current.text).toBe('alpha beta gamma...')
    expect(result.current.didTruncate).toBe(true)
    expect(result.current.visibleLineCount).toBe(2)
  })

  it('throws when maxLines is not a positive integer', () => {
    const typography = createPretextTypography({
      family: 'Inter, sans-serif',
      size: 16,
      lineHeight: 24,
      width: 80,
    })

    expect(() =>
      renderHook(() =>
        useTruncatedText({
          text: 'alpha beta gamma',
          typography,
          maxLines: 0,
        }),
      ),
    ).toThrowError('useTruncatedText requires `maxLines` to be a positive integer.')
  })
})
