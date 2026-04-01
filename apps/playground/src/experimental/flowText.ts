import { layoutNextLine, type LayoutCursor, type PreparedTextWithSegments } from '@santjc/react-pretext/pretext'

type FlowRegion = {
  x: number
  width: number
}

type PositionedLine = {
  text: string
  x: number
  y: number
  width: number
  start: LayoutCursor
  end: LayoutCursor
}

type FlowTextInput = {
  prepared: PreparedTextWithSegments
  lineHeight: number
  getRegionAtY: (y: number) => FlowRegion | null
  startY?: number
  maxY?: number
  maxSteps?: number
}

type FlowTextResult = {
  lines: PositionedLine[]
  lineCount: number
  height: number
  exhausted: boolean
}

function flowText({ prepared, lineHeight, getRegionAtY, startY = 0, maxY, maxSteps = 2000 }: FlowTextInput): FlowTextResult {
  const lines: PositionedLine[] = []
  let y = startY
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
  let exhausted = false

  for (let step = 0; step < maxSteps; step += 1) {
    if (maxY !== undefined && y >= maxY) {
      break
    }

    const region = getRegionAtY(y)
    if (region === null || region.width <= 0) {
      y += lineHeight
      continue
    }

    const line = layoutNextLine(prepared, cursor, Math.max(1, Math.floor(region.width)))
    if (line === null) {
      exhausted = true
      break
    }

    lines.push({
      text: line.text,
      x: region.x,
      y,
      width: line.width,
      start: line.start,
      end: line.end,
    })

    cursor = line.end
    y += lineHeight
  }

  return {
    lines,
    lineCount: lines.length,
    height: Math.max(0, y - startY),
    exhausted,
  }
}

export { flowText }
