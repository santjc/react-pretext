import { describe, expect, it } from 'vitest'
import { getEditorialTracksWidth, resolveEditorialTracks } from './editorialTracks'

describe('editorialTracks', () => {
  it('resolves tracks horizontally with gap', () => {
    expect(resolveEditorialTracks([{ width: 300 }, { width: 280 }], 24, 604)).toEqual([
      expect.objectContaining({ width: 300, x: 0 }),
      expect.objectContaining({ width: 280, x: 324 }),
    ])
  })

  it('distributes remaining width with fr tracks', () => {
    const tracks = resolveEditorialTracks([{ fr: 2 }, { fr: 1 }], 24, 624)

    expect(tracks[0]!.width).toBeCloseTo(400)
    expect(tracks[1]!.width).toBeCloseTo(200)
    expect(tracks[1]!.x).toBeCloseTo(424)
  })

  it('computes total tracks width including gaps', () => {
    expect(
      getEditorialTracksWidth(
        [
          { width: 300, x: 0 },
          { width: 280, x: 324 },
        ] as never,
        24,
      ),
    ).toBe(604)
  })
})
