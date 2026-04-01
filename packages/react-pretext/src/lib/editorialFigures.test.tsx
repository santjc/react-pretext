import { describe, expect, it } from 'vitest'
import {
  getBlockedLineRangesForEditorialFigures,
  getRectBlockedLineRangeForRow,
  resolveEditorialPlacement,
} from './editorialFigures'

describe('editorialFigures', () => {
  it('resolves preset placement within bounds', () => {
    expect(
      resolveEditorialPlacement(
        { shape: 'rect', width: 100, height: 80, placement: 'top-right' },
        { width: 500, height: 400 },
      ),
    ).toEqual({ x: 400, y: 0 })
  })

  it('prefers x/y override over placement', () => {
    expect(
      resolveEditorialPlacement(
        { shape: 'rect', width: 100, height: 80, placement: 'top-right', x: 20, y: 40 },
        { width: 500, height: 400 },
      ),
    ).toEqual({ x: 20, y: 40 })
  })

  it('supports partial x/y overrides over placement', () => {
    expect(
      resolveEditorialPlacement(
        { shape: 'rect', width: 100, height: 80, placement: 'bottom-right', x: 20 },
        { width: 500, height: 400 },
      ),
    ).toEqual({ x: 20, y: 320 })

    expect(
      resolveEditorialPlacement(
        { shape: 'rect', width: 100, height: 80, placement: 'bottom-right', y: 40 },
        { width: 500, height: 400 },
      ),
    ).toEqual({ x: 400, y: 40 })
  })

  it('gets a blocked range for a rectangle row overlap', () => {
    expect(
      getRectBlockedLineRangeForRow({
        x: 100,
        y: 120,
        width: 80,
        height: 50,
        lineTop: 130,
        lineBottom: 150,
      }),
    ).toEqual({ left: 100, right: 180 })
  })

  it('aggregates blocked ranges for resolved figures', () => {
    const ranges = getBlockedLineRangesForEditorialFigures(
      [
        { shape: 'rect', width: 80, height: 50, x: 100, y: 120 },
        { shape: 'circle', width: 80, height: 80, x: 220, y: 100, linePadding: 8 },
      ],
      130,
      150,
    )

    expect(ranges.length).toBeGreaterThanOrEqual(1)
  })
})
