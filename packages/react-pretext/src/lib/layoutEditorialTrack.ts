import type { LayoutCursor, PreparedTextWithSegments } from '@chenglou/pretext'
import { annotateEditorialLines, type EditorialPositionedLine } from './editorialLineAnnotation'
import {
  getBlockedLineRangesForEditorialFigures,
  resolveEditorialPlacement,
  type EditorialFigure,
  type ResolvedEditorialFigure,
} from './editorialFigures'
import { flowText, initialCursor, type TextFlowResult } from './flowText'
import { createLineSlotResolver } from './lineSlots'

type LayoutEditorialTrackInput = {
  prepared: PreparedTextWithSegments
  figures?: EditorialFigure[]
  width: number
  height: number
  lineHeight: number
  paddingInline?: number
  paddingBlock?: number
  startCursor?: LayoutCursor
  startY?: number
  maxY?: number
  preserveParagraphBreaks?: boolean
}

type LayoutEditorialTrackResult = {
  figures: ResolvedEditorialFigure[]
  body: TextFlowResult & {
    lines: EditorialPositionedLine[]
  }
}

function layoutEditorialTrack({
  prepared,
  figures: figureDefs = [],
  width,
  height,
  lineHeight,
  paddingInline = 0,
  paddingBlock = 0,
  startCursor = initialCursor,
  startY = paddingBlock,
  maxY,
  preserveParagraphBreaks = false,
}: LayoutEditorialTrackInput): LayoutEditorialTrackResult {
  const innerWidth = Math.max(24, width - paddingInline * 2)
  const innerHeight = Math.max(0, height - paddingBlock * 2)
  const figures = figureDefs.map((figure) => {
    const resolved = resolveEditorialPlacement(figure, {
      width: innerWidth,
      height: innerHeight,
    })

    return {
      ...figure,
      x: paddingInline + resolved.x,
      y: paddingBlock + resolved.y,
    }
  })

  const getLineSlotAtY = createLineSlotResolver({
    baseLineSlot: { left: paddingInline, right: width - paddingInline },
    lineHeight,
    minWidth: 24,
    getBlockedLineRanges: (lineTop, lineBottom) =>
      getBlockedLineRangesForEditorialFigures(figures, lineTop, lineBottom),
  })

  const rawBody = flowText({
    prepared,
    lineHeight,
    startCursor,
    startY,
    getLineSlotAtY,
    maxY,
  })

  return {
    figures,
    body: {
      ...rawBody,
      lines: annotateEditorialLines(prepared, rawBody.lines, preserveParagraphBreaks),
    },
  }
}

export { layoutEditorialTrack }
export type { LayoutEditorialTrackInput, LayoutEditorialTrackResult }
