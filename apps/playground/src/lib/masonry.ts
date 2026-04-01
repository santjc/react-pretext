import { layout, prepare } from '@santjc/react-pretext/pretext'

type MasonryCard = {
  id: string
  title: string
  body: string
  accent: string
}

type MasonryCardLayout = {
  card: MasonryCard
  textHeight: number
  totalHeight: number
  lineCount: number
}

type MasonryPlacement = {
  columns: MasonryCardLayout[][]
  columnHeights: number[]
}

function predictCardLayout({
  card,
  width,
  font,
  lineHeight,
  chromeHeight,
}: {
  card: MasonryCard
  width: number
  font: string
  lineHeight: number
  chromeHeight: number
}): MasonryCardLayout {
  const prepared = prepare(card.body, font)
  const measured = layout(prepared, width, lineHeight)

  return {
    card,
    textHeight: measured.height,
    totalHeight: chromeHeight + measured.height,
    lineCount: measured.lineCount,
  }
}

function packMasonryCards(cards: MasonryCardLayout[], columnCount: number, gap: number): MasonryPlacement {
  const columns = Array.from({ length: columnCount }, () => [] as MasonryCardLayout[])
  const columnHeights = Array.from({ length: columnCount }, () => 0)

  cards.forEach((card) => {
    let targetColumnIndex = 0

    for (let index = 1; index < columnHeights.length; index += 1) {
      if (columnHeights[index]! < columnHeights[targetColumnIndex]!) {
        targetColumnIndex = index
      }
    }

    columns[targetColumnIndex]!.push(card)
    columnHeights[targetColumnIndex]! += card.totalHeight + gap
  })

  return {
    columns,
    columnHeights,
  }
}

export { packMasonryCards, predictCardLayout }
export type { MasonryCard, MasonryCardLayout, MasonryPlacement }
