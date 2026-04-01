import { prepareWithSegments } from '@chenglou/pretext'
import { describe, expect, it } from 'vitest'
import { annotateEditorialLines } from './editorialLineAnnotation'
import { flowText } from './flowText'
import { layoutEditorialTrack } from './layoutEditorialTrack'

const NEWSPRINT_FONT = "400 12px Georgia, 'Times New Roman', serif"

const featureText = `Across Europe and the Atlantic corridor, the promise of air travel is no longer presented as a stunt reserved for expositions and daredevils. Municipal officials are discussing aerodromes in the tone once reserved for rail depots, while insurers, publishers, and exporters have all begun to calculate what a shorter map might mean for ordinary business.

Pilots interviewed this week describe the work less as conquest than as discipline. They watch the color of weather fronts, the steadiness of fuel feed, the tremor in the frame, and the peculiar geometry of fields suitable for landing. A successful route is rarely an act of reckless bravado. It is a chain of small judgments, repeated without drama, until the destination appears below the wing.

Manufacturers insist that the next contest will not be altitude alone but reliability. Cabin comfort, steady schedules, spare parts, and trusted maintenance crews may do more to usher in the aerial age than any single headline-making crossing. That argument is finding support among businessmen who care less for records than for predictability.`

describe('editorial justification integration', () => {
  it('produces justify-eligible lines in direct flow output', () => {
    const prepared = prepareWithSegments(featureText, NEWSPRINT_FONT, { whiteSpace: 'pre-wrap' })
    const flow = flowText({
      prepared,
      lineHeight: 18,
      getLineSlotAtY: () => ({ left: 10, right: 180 }),
      maxLines: 12,
    })

    const annotated = annotateEditorialLines(prepared, flow.lines, true)
    const justifyCount = annotated.filter((line) => line.justifyWordSpacing !== null).length

    expect(justifyCount).toBeGreaterThan(0)
  })

  it('produces justify-eligible lines in obstacle-aware editorial track layout', () => {
    const prepared = prepareWithSegments(featureText, NEWSPRINT_FONT, { whiteSpace: 'pre-wrap' })
    const result = layoutEditorialTrack({
      prepared,
      width: 220,
      height: 410,
      lineHeight: 18,
      paddingInline: 10,
      startY: 0,
      preserveParagraphBreaks: true,
      figures: [],
    })

    const justifyCount = result.body.lines.filter((line) => line.justifyWordSpacing !== null).length

    expect(justifyCount).toBeGreaterThan(0)
  })
})
