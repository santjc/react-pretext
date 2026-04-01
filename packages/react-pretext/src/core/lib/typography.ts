import type { CSSProperties } from 'react'

type PretextTypographyShorthandInput = {
  font: string
  lineHeight: number
  width?: number
  family?: never
  size?: never
  weight?: never
}

type PretextTypographyObjectInput = {
  family: string
  size: number
  weight?: number | string
  lineHeight: number
  width?: number
  font?: never
}

type PretextTypographyInput = PretextTypographyShorthandInput | PretextTypographyObjectInput

type PretextTypography = {
  font: string
  lineHeight: number
  width?: number
  style: CSSProperties
}

function isShorthandInput(input: PretextTypographyInput): input is PretextTypographyShorthandInput {
  return 'font' in input
}

function resolveFont(input: PretextTypographyInput): string {
  if (isShorthandInput(input)) {
    if (input.font.trim().length === 0) {
      throw new Error('createPretextTypography requires a non-empty `font` string.')
    }

    return input.font
  }

  if (input.family.trim().length === 0) {
    throw new Error('createPretextTypography requires a non-empty `family` value.')
  }

  if (!Number.isFinite(input.size) || input.size <= 0) {
    throw new Error('createPretextTypography requires `size` to be a positive number.')
  }

  return [input.weight === undefined ? undefined : `${input.weight}`, `${input.size}px`, input.family].filter(Boolean).join(' ')
}

function createPretextTypography(input: PretextTypographyInput): PretextTypography {
  const font = resolveFont(input)
  const { lineHeight, width } = input

  if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
    throw new Error('createPretextTypography requires `lineHeight` to be a positive number.')
  }

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
export type { PretextTypography, PretextTypographyInput, PretextTypographyObjectInput, PretextTypographyShorthandInput }
