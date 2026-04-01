import { layout, prepare, type LayoutResult, type LayoutCursor, type PreparedTextWithSegments } from '@chenglou/pretext'
import { useMemo } from 'react'
import { usePreparedSegments } from './usePreparedSegments'
import { usePretextLines } from './usePretextLines'
import type { PrepareOptions } from './usePreparedText'
import type { PretextTypography } from '../lib/typography'

type UseTruncatedTextInput = {
  text: string
  width?: number
  font?: string
  lineHeight?: number
  typography?: PretextTypography
  prepareOptions?: PrepareOptions
  maxLines: number
  ellipsis?: string
  enabled?: boolean
}

type UseTruncatedTextResult = {
  text: string
  didTruncate: boolean
  visibleLineCount: number
  fullLineCount: number
  height: number
  isReady: boolean
}

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
const wordLikePattern = /[\p{L}\p{N}\p{M}]/u
const whitespacePattern = /\s/u

function getSegmentGraphemes(segment: string, cache: Map<string, string[]>): string[] {
  const cached = cache.get(segment)
  if (cached !== undefined) {
    return cached
  }

  const graphemes = Array.from(graphemeSegmenter.segment(segment), ({ segment: grapheme }) => grapheme)
  cache.set(segment, graphemes)
  return graphemes
}

function getTextUpToCursor(prepared: PreparedTextWithSegments, end: LayoutCursor): string {
  const graphemeCache = new Map<string, string[]>()
  let result = ''

  for (let segmentIndex = 0; segmentIndex < end.segmentIndex; segmentIndex += 1) {
    result += prepared.segments[segmentIndex] ?? ''
  }

  if (end.graphemeIndex > 0) {
    const segment = prepared.segments[end.segmentIndex]
    if (segment !== undefined) {
      result += getSegmentGraphemes(segment, graphemeCache).slice(0, end.graphemeIndex).join('')
    }
  }

  return result
}

function isWordLike(grapheme: string | undefined): boolean {
  return grapheme !== undefined && wordLikePattern.test(grapheme)
}

function preferWordBoundary(graphemes: string[], count: number): number {
  if (count <= 0 || count >= graphemes.length) {
    return count
  }

  if (!isWordLike(graphemes[count - 1]) || !isWordLike(graphemes[count])) {
    return count
  }

  let boundary = count
  while (boundary > 0 && isWordLike(graphemes[boundary - 1])) {
    boundary -= 1
  }

  while (boundary > 0 && whitespacePattern.test(graphemes[boundary - 1] ?? '')) {
    boundary -= 1
  }

  return boundary === 0 ? count : boundary
}

function buildCandidateText(graphemes: string[], count: number, ellipsis: string): string {
  const base = graphemes.slice(0, count).join('').trimEnd()

  if (ellipsis.length === 0) {
    return base
  }

  return base.length === 0 ? ellipsis : `${base}${ellipsis}`
}

function useTruncatedText({
  text,
  width,
  font,
  lineHeight,
  typography,
  prepareOptions,
  maxLines,
  ellipsis = '…',
  enabled = true,
}: UseTruncatedTextInput): UseTruncatedTextResult {
  const resolvedFont = font ?? typography?.font
  const resolvedLineHeight = lineHeight ?? typography?.lineHeight
  const resolvedWidth = width ?? typography?.width

  if (resolvedFont === undefined || resolvedLineHeight === undefined) {
    throw new Error('useTruncatedText requires `font` and `lineHeight`, either directly or via `typography`.')
  }

  if (resolvedWidth === undefined) {
    throw new Error('useTruncatedText requires `width`, either directly or via `typography`.')
  }

  if (!Number.isInteger(maxLines) || maxLines <= 0) {
    throw new Error('useTruncatedText requires `maxLines` to be a positive integer.')
  }

  const prepared = usePreparedSegments({
    text,
    font: resolvedFont,
    options: prepareOptions,
    enabled,
  })
  const fullLayout = usePretextLines({
    prepared: prepared.prepared,
    width: resolvedWidth,
    lineHeight: resolvedLineHeight,
    enabled,
  })
  const normalizedWhiteSpace = prepareOptions?.whiteSpace

  return useMemo(() => {
    if (!enabled || !prepared.isReady || !fullLayout.isReady || prepared.prepared === null) {
      return {
        text: '',
        didTruncate: false,
        visibleLineCount: 0,
        fullLineCount: 0,
        height: 0,
        isReady: false,
      }
    }

    if (fullLayout.lineCount <= maxLines) {
      return {
        text,
        didTruncate: false,
        visibleLineCount: fullLayout.lineCount,
        fullLineCount: fullLayout.lineCount,
        height: fullLayout.height,
        isReady: true,
      }
    }

    const lastVisibleLine = fullLayout.lines[maxLines - 1]
    if (lastVisibleLine === undefined) {
      return {
        text: '',
        didTruncate: true,
        visibleLineCount: 0,
        fullLineCount: fullLayout.lineCount,
        height: 0,
        isReady: true,
      }
    }

    const visibleText = getTextUpToCursor(prepared.prepared, lastVisibleLine.end)
    const graphemes = Array.from(graphemeSegmenter.segment(visibleText), ({ segment }) => segment)
    const measurementCache = new Map<string, LayoutResult>()
    const normalizedOptions = normalizedWhiteSpace === undefined ? undefined : { whiteSpace: normalizedWhiteSpace }

    const measureCandidate = (candidateText: string): LayoutResult => {
      const cached = measurementCache.get(candidateText)
      if (cached !== undefined) {
        return cached
      }

      const nextResult =
        candidateText.length === 0
          ? { lineCount: 0, height: 0 }
          : layout(prepare(candidateText, resolvedFont, normalizedOptions), resolvedWidth, resolvedLineHeight)

      measurementCache.set(candidateText, nextResult)
      return nextResult
    }

    let low = 0
    let high = graphemes.length
    let bestCount = 0

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const candidate = buildCandidateText(graphemes, mid, ellipsis)
      const candidateResult = measureCandidate(candidate)

      if (candidateResult.lineCount <= maxLines) {
        bestCount = mid
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    const preferredCount = preferWordBoundary(graphemes, bestCount)
    const truncatedText = buildCandidateText(graphemes, preferredCount, ellipsis)
    const truncatedLayout = measureCandidate(truncatedText)

    return {
      text: truncatedText,
      didTruncate: true,
      visibleLineCount: truncatedLayout.lineCount,
      fullLineCount: fullLayout.lineCount,
      height: truncatedLayout.height,
      isReady: true,
    }
  }, [
    ellipsis,
    enabled,
    fullLayout.height,
    fullLayout.isReady,
    fullLayout.lineCount,
    fullLayout.lines,
    maxLines,
    normalizedWhiteSpace,
    prepared.isReady,
    prepared.prepared,
    resolvedFont,
    resolvedLineHeight,
    resolvedWidth,
    text,
  ])
}

export { useTruncatedText }
export type { UseTruncatedTextInput, UseTruncatedTextResult }
