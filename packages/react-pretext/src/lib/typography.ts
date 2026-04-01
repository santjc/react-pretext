import type { CSSProperties } from 'react'

type PretextTypographyInput = {
  font: string
  lineHeight: number
  width?: number
}

type PretextTypography = PretextTypographyInput & {
  style: CSSProperties
}

function createPretextTypography({ font, lineHeight, width }: PretextTypographyInput): PretextTypography {
  const style: CSSProperties = {
    font,
    lineHeight: `${lineHeight}px`,
  }

  if (width !== undefined) {
    style.width = `${width}px`
  }

  return {
    font,
    lineHeight,
    width,
    style,
  }
}

export { createPretextTypography }
export type { PretextTypography, PretextTypographyInput }
