import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EditorialSurface } from './PEditorialSurface'

const useElementWidthMock = vi.fn()
const usePreparedSegmentsMock = vi.fn()
const layoutEditorialTrackMock = vi.fn()

vi.mock('../hooks/useElementWidth', () => ({
  useElementWidth: (...args: unknown[]) => useElementWidthMock(...args),
}))

vi.mock('../hooks/usePreparedSegments', () => ({
  usePreparedSegments: (...args: unknown[]) => usePreparedSegmentsMock(...args),
}))

vi.mock('../lib/layoutEditorialTrack', () => ({
  layoutEditorialTrack: (...args: unknown[]) => layoutEditorialTrackMock(...args),
}))

describe('EditorialSurface', () => {
  beforeEach(() => {
    useElementWidthMock.mockReset()
    usePreparedSegmentsMock.mockReset()
    layoutEditorialTrackMock.mockReset()

    useElementWidthMock.mockReturnValue({ ref: vi.fn(), width: 480, node: null })
    usePreparedSegmentsMock.mockReturnValue({ prepared: { segments: ['hello'], kinds: ['text'] }, isReady: true })
    layoutEditorialTrackMock.mockReturnValue({
      figures: [{ shape: 'circle', width: 120, height: 120, x: 320, y: 0, content: <div>orb</div> }],
      body: {
        lines: [
          { text: 'hello', x: 0, y: 100, width: 120, slotLeft: 0, slotRight: 120, slotWidth: 120, start: { segmentIndex: 0, graphemeIndex: 0 }, end: { segmentIndex: 0, graphemeIndex: 5 }, justifyWordSpacing: null, isTerminal: true, isParagraphTerminal: false },
        ],
        height: 120,
      },
    })
  })

  it('renders flowed lines and figure children', () => {
    const { container, getByText } = render(
      <EditorialSurface
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        startY={100}
        figures={[{ shape: 'circle', width: 120, height: 120, placement: 'top-right', content: <div>orb</div> }]}
      />,
    )

    expect(getByText('orb')).toBeTruthy()
    expect(getByText('hello')).toBeTruthy()
    expect(container.firstChild).toBeTruthy()
  })

  it('passes prepared text to useTextFlow', () => {
    render(
      <EditorialSurface
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        figures={[{ shape: 'rect', width: 120, height: 80, x: 40, y: 60, content: <div>figure</div> }]}
      />,
    )

    expect(layoutEditorialTrackMock).toHaveBeenCalled()
    expect(usePreparedSegmentsMock).toHaveBeenCalledWith({ text: 'body', font: '400 18px GeistVariable, sans-serif', options: undefined })
  })

  it('supports justify render mode and prepare options', () => {
    usePreparedSegmentsMock.mockReturnValue({
      prepared: { segments: ['hello', ' ', 'world', 'tail'], kinds: ['text', 'space', 'text', 'text'] },
      isReady: true,
    })
    layoutEditorialTrackMock.mockReturnValue({
      figures: [],
      body: {
        lines: [
          { text: 'hello world', x: 0, y: 0, width: 112, slotLeft: 0, slotRight: 120, slotWidth: 120, start: { segmentIndex: 0, graphemeIndex: 0 }, end: { segmentIndex: 2, graphemeIndex: 5 }, justifyWordSpacing: 8, isTerminal: false, isParagraphTerminal: false },
          { text: 'tail', x: 0, y: 28, width: 40, slotLeft: 0, slotRight: 120, slotWidth: 120, start: { segmentIndex: 3, graphemeIndex: 0 }, end: { segmentIndex: 3, graphemeIndex: 4 }, justifyWordSpacing: null, isTerminal: true, isParagraphTerminal: false },
        ],
        height: 120,
      },
    })

    const { getByText } = render(
      <EditorialSurface
        text="body"
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        lineRenderMode="justify"
        prepareOptions={{ whiteSpace: 'pre-wrap' }}
      />,
    )

    const line = getByText('hello world')
    expect(line.getAttribute('style')).toContain('word-spacing: 8px')
    expect(usePreparedSegmentsMock).toHaveBeenCalledWith({
      text: 'body',
      font: '400 18px GeistVariable, sans-serif',
      options: { whiteSpace: 'pre-wrap' },
    })
  })
})
