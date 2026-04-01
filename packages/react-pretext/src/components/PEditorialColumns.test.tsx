import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EditorialColumns } from './PEditorialColumns'

const useElementWidthMock = vi.fn()
const usePreparedSegmentsMock = vi.fn()
const flowTextMock = vi.fn()

vi.mock('../hooks/useElementWidth', () => ({
  useElementWidth: (...args: unknown[]) => useElementWidthMock(...args),
}))

vi.mock('../hooks/usePreparedSegments', () => ({
  usePreparedSegments: (...args: unknown[]) => usePreparedSegmentsMock(...args),
}))

vi.mock('../lib/flowText', () => ({
  flowText: (...args: unknown[]) => flowTextMock(...args),
  initialCursor: { segmentIndex: 0, graphemeIndex: 0 },
}))

describe('EditorialColumns', () => {
  beforeEach(() => {
    useElementWidthMock.mockReset()
    usePreparedSegmentsMock.mockReset()
    flowTextMock.mockReset()

    useElementWidthMock.mockReturnValue({ ref: vi.fn(), width: 460, node: null })
    usePreparedSegmentsMock.mockReturnValue({ prepared: { segments: ['first'], kinds: ['text'] }, isReady: true })
    flowTextMock
      .mockReturnValueOnce({
        lines: [{ text: 'first', x: 0, y: 0, width: 182, slotLeft: 16, slotRight: 204, slotWidth: 188, start: { segmentIndex: 0, graphemeIndex: 0 }, end: { segmentIndex: 0, graphemeIndex: 5 } }],
        height: 120,
        exhausted: false,
        truncated: false,
        endCursor: { segmentIndex: 0, graphemeIndex: 5 },
      })
      .mockReturnValueOnce({
        lines: [{ text: 'second', x: 0, y: 0, width: 120, slotLeft: 16, slotRight: 204, slotWidth: 188, start: { segmentIndex: 0, graphemeIndex: 5 }, end: { segmentIndex: 0, graphemeIndex: 11 } }],
        height: 100,
        exhausted: true,
        truncated: false,
        endCursor: { segmentIndex: 0, graphemeIndex: 11 },
      })
  })

  it('renders multiple tracks and continues text between them', () => {
    const { getByText } = render(
      <EditorialColumns
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        gap={20}
        tracks={[
          {
            width: 220,
            minHeight: 280,
            figures: [{ shape: 'circle', width: 100, height: 100, placement: 'top-right', content: <div>orb</div> }],
          },
          { width: 220, minHeight: 280 },
        ]}
      />,
    )

    expect(getByText('orb')).toBeTruthy()
    expect(getByText('first')).toBeTruthy()
    expect(getByText('second')).toBeTruthy()
    expect(flowTextMock).toHaveBeenNthCalledWith(1, expect.objectContaining({ startCursor: { segmentIndex: 0, graphemeIndex: 0 } }))
    expect(flowTextMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ startCursor: { segmentIndex: 0, graphemeIndex: 5 } }))
  })

  it('supports fr-based tracks from measured container width', () => {
    render(
      <EditorialColumns
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        gap={20}
        tracks={[{ fr: 2, minHeight: 280 }, { fr: 1, minHeight: 280 }]}
      />,
    )

    expect(flowTextMock).toHaveBeenNthCalledWith(1, expect.objectContaining({ getLineSlotAtY: expect.any(Function) }))
  })

  it('supports justify render mode', () => {
    flowTextMock.mockReset()
    usePreparedSegmentsMock.mockReturnValue({
      prepared: {
        segments: ['justify', ' ', 'line', 'terminal'],
        kinds: ['text', 'space', 'text', 'text'],
      },
      isReady: true,
    })
    flowTextMock.mockReturnValue({
      lines: [
        { text: 'justify line', x: 0, y: 0, width: 180, slotLeft: 16, slotRight: 204, slotWidth: 188, start: { segmentIndex: 0, graphemeIndex: 0 }, end: { segmentIndex: 2, graphemeIndex: 4 } },
        { text: 'terminal', x: 0, y: 28, width: 90, slotLeft: 16, slotRight: 204, slotWidth: 188, start: { segmentIndex: 3, graphemeIndex: 0 }, end: { segmentIndex: 3, graphemeIndex: 8 } },
      ],
      height: 120,
      exhausted: true,
      truncated: false,
      endCursor: { segmentIndex: 3, graphemeIndex: 8 },
    })

    const { getByText } = render(
      <EditorialColumns
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        lineRenderMode="justify"
        tracks={[{ width: 220, minHeight: 280 }]}
      />,
    )

    const line = getByText('justify line')
    expect(line.getAttribute('style')).toContain('word-spacing: 8px')
    expect(line.getAttribute('style')).toContain('white-space: pre')
  })

  it('does not justify the final line in a track', () => {
    flowTextMock.mockReset()
    flowTextMock.mockReturnValue({
      lines: [{ text: 'final line', x: 0, y: 0, width: 184, slotLeft: 16, slotRight: 204, slotWidth: 188, start: { segmentIndex: 0, graphemeIndex: 0 }, end: { segmentIndex: 0, graphemeIndex: 10 } }],
      height: 100,
      exhausted: true,
      truncated: false,
      endCursor: { segmentIndex: 0, graphemeIndex: 10 },
    })

    const { getByText } = render(
      <EditorialColumns
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        lineRenderMode="justify"
        tracks={[{ width: 220, minHeight: 280 }]}
      />,
    )

    const line = getByText('final line')
    expect(line.getAttribute('style')).toContain('text-align: left')
    expect(line.getAttribute('style')).not.toContain('word-spacing:')
  })

  it('passes prepareOptions to segmented preparation', () => {
    render(
      <EditorialColumns
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        prepareOptions={{ whiteSpace: 'pre-wrap' }}
        tracks={[{ width: 220, minHeight: 280 }]}
      />,
    )

    expect(usePreparedSegmentsMock).toHaveBeenCalledWith({
      text: 'body',
      font: '400 18px GeistVariable, sans-serif',
      options: { whiteSpace: 'pre-wrap' },
    })
  })

  it('does not flow text before the container width is measured', () => {
    useElementWidthMock.mockReturnValue({ ref: vi.fn(), width: 0, node: null })

    const { queryByText } = render(
      <EditorialColumns
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        tracks={[{ fr: 1, minHeight: 280 }]}
      />,
    )

    expect(flowTextMock).not.toHaveBeenCalled()
    expect(queryByText('first')).toBeNull()
  })
})
