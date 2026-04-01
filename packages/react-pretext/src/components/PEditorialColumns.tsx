import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useElementWidth } from '../hooks/useElementWidth'
import { usePreparedSegments } from '../hooks/usePreparedSegments'
import type { PrepareOptions } from '../hooks/usePreparedText'
import type { EditorialPositionedLine } from '../lib/editorialLineAnnotation'
import type { ResolvedEditorialFigure } from '../lib/editorialFigures'
import { initialCursor, type TextFlowResult } from '../lib/flowText'
import { layoutEditorialTrack } from '../lib/layoutEditorialTrack'
import {
  getEditorialTracksWidth,
  resolveEditorialTracks,
  type EditorialTrack,
  type ResolvedEditorialTrack,
} from '../lib/editorialTracks'
import { renderResolvedEditorialFigure } from './renderResolvedEditorialFigure'

type EditorialColumnsProps = {
  text: string
  font: string
  lineHeight: number
  gap?: number
  lineRenderMode?: 'natural' | 'justify'
  prepareOptions?: PrepareOptions
  className?: string
  style?: CSSProperties
  tracks: EditorialTrack[]
}

type RenderedTrack = ResolvedEditorialTrack & {
  figures: ResolvedEditorialFigure[]
  body: TextFlowResult & {
    lines: EditorialPositionedLine[]
  }
}

function createEmptyEditorialBody(): RenderedTrack['body'] {
  return {
    lines: [],
    height: 0,
    exhausted: false,
    truncated: false,
    endCursor: initialCursor,
  }
}

function EditorialColumns({
  text,
  font,
  lineHeight,
  gap = 24,
  lineRenderMode = 'natural',
  prepareOptions,
  className,
  style,
  tracks: trackDefs,
}: EditorialColumnsProps) {
  const { ref, width: availableWidth } = useElementWidth<HTMLDivElement>()
  const tracks = useMemo(() => resolveEditorialTracks(trackDefs, gap, availableWidth), [availableWidth, gap, trackDefs])
  const { prepared } = usePreparedSegments({ text, font, options: prepareOptions })

  const renderedTracks = useMemo<RenderedTrack[]>(() => {
    if (prepared === null || availableWidth <= 0) {
      return tracks.map((track) => ({
        ...track,
        figures: [],
        body: createEmptyEditorialBody(),
      }))
    }

    let cursor = initialCursor
    const preserveParagraphBreaks = prepareOptions?.whiteSpace === 'pre-wrap'

    return tracks.map((track) => {
      const paddingInline = track.paddingInline ?? 16
      const paddingBlock = track.paddingBlock ?? 0
      const { figures, body } = layoutEditorialTrack({
        prepared,
        figures: track.figures,
        width: track.width,
        height: track.minHeight ?? 320,
        lineHeight,
        startCursor: cursor,
        startY: paddingBlock,
        maxY: track.minHeight === undefined ? undefined : track.minHeight - paddingBlock,
        paddingInline,
        paddingBlock,
        preserveParagraphBreaks,
      })

      cursor = body.endCursor

      return {
        ...track,
        figures,
        body,
      }
    })
  }, [availableWidth, lineHeight, prepared, prepareOptions?.whiteSpace, tracks])

  const width = getEditorialTracksWidth(tracks, gap)
  const minHeight = renderedTracks.reduce((current, track) => Math.max(current, track.minHeight ?? track.body.height), 0)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: `${minHeight}px`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${width}px`,
          minHeight: `${minHeight}px`,
        }}
      >
      {renderedTracks.map((track, trackIndex) => (
        <div
          key={trackIndex}
          className={track.className}
          style={{
            position: 'absolute',
            left: `${track.x}px`,
            top: 0,
            width: `${track.width}px`,
            minHeight: `${track.minHeight ?? track.body.height}px`,
            ...track.style,
          }}
        >
          {track.figures.map(renderResolvedEditorialFigure)}
          {track.body.lines.map((line: EditorialPositionedLine, lineIndex) => (
            <div
              key={`${trackIndex}-${line.start.segmentIndex}-${line.start.graphemeIndex}-${lineIndex}`}
              style={{
                position: 'absolute',
                left: `${line.slotLeft}px`,
                top: `${line.y}px`,
                width: `${Math.ceil(line.slotWidth)}px`,
                font,
                lineHeight: `${lineHeight}px`,
                whiteSpace: 'pre',
                textAlign: 'left',
                wordSpacing: lineRenderMode === 'justify' && line.justifyWordSpacing !== null ? `${line.justifyWordSpacing}px` : undefined,
              }}
            >
              {lineRenderMode === 'justify' && line.justifyWordSpacing !== null ? line.text.trimEnd() : line.text}
            </div>
          ))}
        </div>
      ))}
      </div>
    </div>
  )
}

export { EditorialColumns }
export type { EditorialColumnsProps }
