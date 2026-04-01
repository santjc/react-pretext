import { layoutWithLines, prepareWithSegments } from '@santjc/react-pretext'

type BubbleMetrics = {
  lineCount: number
  cssWidth: number
  shrinkwrapWidth: number
  cssWaste: number
  shrinkwrapWaste: number
}

function sumHorizontalWaste(width: number, lineWidths: number[]) {
  return lineWidths.reduce((total, lineWidth) => total + Math.max(0, width - Math.ceil(lineWidth)), 0)
}

function getBubbleMetrics({
  text,
  font,
  maxWidth,
  lineHeight,
}: {
  text: string
  font: string
  maxWidth: number
  lineHeight: number
}): BubbleMetrics {
  const prepared = prepareWithSegments(text, font)
  const baseline = layoutWithLines(prepared, maxWidth, lineHeight)
  const lineWidths = baseline.lines.map((line) => line.width)
  const cssWidth = Math.max(1, Math.ceil(Math.max(...lineWidths, 0)))
  const targetLineCount = baseline.lineCount

  let bestWidth = cssWidth
  let low = 1
  let high = cssWidth

  while (low <= high) {
    const candidate = Math.floor((low + high) / 2)
    const candidateLineCount = layoutWithLines(prepared, candidate, lineHeight).lineCount

    if (candidateLineCount === targetLineCount) {
      bestWidth = candidate
      high = candidate - 1
    } else {
      low = candidate + 1
    }
  }

  return {
    lineCount: targetLineCount,
    cssWidth,
    shrinkwrapWidth: bestWidth,
    cssWaste: sumHorizontalWaste(cssWidth, lineWidths),
    shrinkwrapWaste: sumHorizontalWaste(bestWidth, lineWidths),
  }
}

export { getBubbleMetrics }
export type { BubbleMetrics }
