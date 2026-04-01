import type { CSSProperties } from 'react'

import type { EditorialFigure } from './editorialFigures'

type EditorialTrack = {
  width?: number
  fr?: number
  minHeight?: number
  paddingInline?: number
  paddingBlock?: number
  className?: string
  style?: CSSProperties
  figures?: EditorialFigure[]
}

type ResolvedEditorialTrack = Omit<EditorialTrack, 'width'> & {
  width: number
  x: number
}

function resolveEditorialTracks(
  tracks: EditorialTrack[],
  gap: number,
  availableWidth: number,
): ResolvedEditorialTrack[] {
  const fixedWidth = tracks.reduce((total, track) => total + (track.width ?? 0), 0)
  const totalGap = Math.max(0, tracks.length - 1) * gap
  const flexibleTracks = tracks.filter((track) => track.width === undefined)
  const totalFr = flexibleTracks.reduce((total, track) => total + (track.fr ?? 1), 0)
  const remainingWidth = Math.max(0, availableWidth - fixedWidth - totalGap)

  let x = 0

  return tracks.map((track) => {
    const resolvedWidth = track.width ?? (totalFr === 0 ? 0 : (remainingWidth * (track.fr ?? 1)) / totalFr)
    const resolved: ResolvedEditorialTrack = {
      ...track,
      width: resolvedWidth,
      x,
    }

    x += resolvedWidth + gap
    return resolved
  })
}

function getEditorialTracksWidth(tracks: ResolvedEditorialTrack[], gap: number): number {
  if (tracks.length === 0) {
    return 0
  }

  return tracks.reduce((total, track) => total + track.width, 0) + gap * (tracks.length - 1)
}

export { resolveEditorialTracks, getEditorialTracksWidth }
export type { EditorialTrack, ResolvedEditorialTrack }
