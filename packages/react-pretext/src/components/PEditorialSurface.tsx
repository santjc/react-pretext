import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useElementWidth } from '../hooks/useElementWidth'
import { usePreparedSegments } from '../hooks/usePreparedSegments'
import type { PrepareOptions } from '../hooks/usePreparedText'
import type { EditorialFigure } from '../lib/editorialFigures'
import type { EditorialPositionedLine } from '../lib/editorialLineAnnotation'
import { layoutEditorialTrack } from '../lib/layoutEditorialTrack'
import { renderResolvedEditorialFigure } from './renderResolvedEditorialFigure'

type EditorialSurfaceProps = {
  text: string
  font: string
  lineHeight: number
  startY?: number
  maxY?: number
  minHeight?: number
  lineRenderMode?: 'natural' | 'justify'
  prepareOptions?: PrepareOptions
  className?: string
  style?: CSSProperties
  figures?: EditorialFigure[]
}

function EditorialSurface({
  text,
  font,
  lineHeight,
  startY = 0,
  maxY,
  minHeight = 320,
  lineRenderMode = 'natural',
  prepareOptions,
  className,
  style,
  figures,
}: EditorialSurfaceProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const { prepared } = usePreparedSegments({ text, font, options: prepareOptions })

  const baseHeight = Math.max(minHeight, maxY ?? startY + 320)
  const preserveParagraphBreaks = prepareOptions?.whiteSpace === 'pre-wrap'

  const layout = useMemo(() => {
    if (prepared === null || width <= 0) {
      return {
        figures: [],
        body: {
          lines: [],
          height: 0,
        },
      }
    }

    return layoutEditorialTrack({
      prepared,
      figures,
      width,
      height: baseHeight,
      lineHeight,
      startY,
      maxY,
      preserveParagraphBreaks,
    })
  }, [baseHeight, figures, lineHeight, maxY, preserveParagraphBreaks, prepared, startY, width])

  const height = Math.max(baseHeight, startY + layout.body.height)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        minHeight: `${height}px`,
        ...style,
      }}
    >
      {layout.figures.map(renderResolvedEditorialFigure)}
      {layout.body.lines.map((line: EditorialPositionedLine, index) => (
        <div
          key={`${line.start.segmentIndex}-${line.start.graphemeIndex}-${index}`}
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
  )
}

export { EditorialSurface }
export type { EditorialSurfaceProps }
