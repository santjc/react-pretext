import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPretextTypography } from '../lib/typography'
import { PText } from './PText'

const useElementWidthMock = vi.fn()
const usePreparedTextMock = vi.fn()
const usePretextLayoutMock = vi.fn()

vi.mock('../hooks/useElementWidth', () => ({
  useElementWidth: (...args: unknown[]) => useElementWidthMock(...args),
}))

vi.mock('../hooks/usePreparedText', () => ({
  usePreparedText: (...args: unknown[]) => usePreparedTextMock(...args),
}))

vi.mock('../hooks/usePretextLayout', () => ({
  usePretextLayout: (...args: unknown[]) => usePretextLayoutMock(...args),
}))

describe('PText', () => {
  beforeEach(() => {
    useElementWidthMock.mockReset()
    usePreparedTextMock.mockReset()
    usePretextLayoutMock.mockReset()

    useElementWidthMock.mockReturnValue({ ref: vi.fn(), width: 260, node: null })
    usePreparedTextMock.mockReturnValue({ prepared: { id: 'prepared' }, prepareMs: 0.5, isReady: true })
    usePretextLayoutMock.mockReturnValue({ height: 72, lineCount: 3, isReady: true })
  })

  it('renders a paragraph by default', () => {
    const { container } = render(
      <PText font="400 16px Georgia" lineHeight={24}>
        hello world
      </PText>,
    )

    expect(container.querySelector('p')?.textContent).toBe('hello world')
  })

  it('passes explicit width to the layout hook when provided', () => {
    render(
      <PText width={320} font="400 16px Georgia" lineHeight={24}>
        hello world
      </PText>,
    )

    expect(usePretextLayoutMock).toHaveBeenCalledWith({
      prepared: { id: 'prepared' },
      width: 320,
      lineHeight: 24,
    })
  })

  it('notifies measurement results', () => {
    const onMeasure = vi.fn()

    render(
      <PText onMeasure={onMeasure} font="400 16px Georgia" lineHeight={24}>
        hello world
      </PText>,
    )

    expect(onMeasure).toHaveBeenCalledWith({ width: 260, height: 72, lineCount: 3 })
  })

  it('passes prepareOptions to usePreparedText', () => {
    render(
      <PText font="400 16px Georgia" lineHeight={24} prepareOptions={{ whiteSpace: 'pre-wrap' }}>
        hello world
      </PText>,
    )

    expect(usePreparedTextMock).toHaveBeenCalledWith({
      text: 'hello world',
      font: '400 16px Georgia',
      options: { whiteSpace: 'pre-wrap' },
    })
  })

  it('applies typography styles from measurement inputs by default', () => {
    const { container } = render(
      <PText width={320} font="400 16px Georgia" lineHeight={24}>
        hello world
      </PText>,
    )

    const paragraph = container.querySelector('p')

    expect(paragraph?.style.fontFamily).toBe('Georgia')
    expect(paragraph?.style.fontSize).toBe('16px')
    expect(paragraph?.style.lineHeight).toBe('24px')
    expect(paragraph?.style.width).toBe('320px')
  })

  it('accepts typography as the measurement source of truth', () => {
    const typography = createPretextTypography({
      font: '500 18px Georgia',
      lineHeight: 28,
      width: 300,
    })

    render(<PText typography={typography}>hello world</PText>)

    expect(usePreparedTextMock).toHaveBeenCalledWith({
      text: 'hello world',
      font: '500 18px Georgia',
      options: undefined,
    })
    expect(usePretextLayoutMock).toHaveBeenCalledWith({
      prepared: { id: 'prepared' },
      width: 300,
      lineHeight: 28,
    })
  })

  it('lets explicit style.font and style.width override the auto-applied defaults', () => {
    const { container } = render(
      <PText
        width={320}
        font="400 16px Georgia"
        lineHeight={24}
        style={{ font: '700 20px Inter', width: '280px' }}
      >
        hello world
      </PText>,
    )

    const paragraph = container.querySelector('p')

    expect(paragraph?.style.fontFamily).toBe('Inter')
    expect(paragraph?.style.fontSize).toBe('20px')
    expect(paragraph?.style.fontWeight).toBe('700')
    expect(paragraph?.style.lineHeight).toBe('24px')
    expect(paragraph?.style.width).toBe('280px')
  })

  it('lets explicit props override typography values', () => {
    const typography = createPretextTypography({
      font: '400 16px Georgia',
      lineHeight: 24,
      width: 260,
    })

    render(
      <PText typography={typography} font="700 20px Georgia" lineHeight={30} width={320}>
        hello world
      </PText>,
    )

    expect(usePreparedTextMock).toHaveBeenCalledWith({
      text: 'hello world',
      font: '700 20px Georgia',
      options: undefined,
    })
    expect(usePretextLayoutMock).toHaveBeenCalledWith({
      prepared: { id: 'prepared' },
      width: 320,
      lineHeight: 30,
    })
  })
})
