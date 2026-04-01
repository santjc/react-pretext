import { forwardRef, useCallback, useEffect } from 'react'
import { useElementWidth } from '../hooks/useElementWidth'
import { usePreparedText, type PrepareOptions } from '../hooks/usePreparedText'
import { usePretextLayout } from '../hooks/usePretextLayout'
import { createPretextTypography, type PretextTypography } from '../lib/typography'

type PTextTag = 'p' | 'div' | 'span' | 'h1' | 'h2' | 'h3'

type PTextMeasure = {
  width: number
  height: number
  lineCount: number
}

type PTextOwnProps = {
  as?: PTextTag
  children: string
  prepareOptions?: PrepareOptions
  onMeasure?: (result: PTextMeasure) => void
}

type PTextExplicitMeasureProps = {
  font: string
  lineHeight: number
  width?: number
  typography?: PretextTypography
}

type PTextTypographyProps = {
  typography: PretextTypography
  font?: string
  lineHeight?: number
  width?: number
}

type PTextProps = PTextOwnProps & (PTextExplicitMeasureProps | PTextTypographyProps) & React.HTMLAttributes<HTMLElement>

type PTextElement = HTMLParagraphElement | HTMLDivElement | HTMLSpanElement | HTMLHeadingElement

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') {
    ref(value)
    return
  }

  if (ref) {
    ref.current = value
  }
}

function PTextInner(
  { as, children, font, lineHeight, prepareOptions, typography, width, onMeasure, style, ...rest }: PTextProps,
  forwardedRef: React.ForwardedRef<PTextElement>,
) {
  const { ref: observedRef, width: observedWidth } = useElementWidth<HTMLElement>()
  const explicitWidth = width ?? typography?.width
  const resolvedWidth = explicitWidth ?? observedWidth
  const resolvedFont = font ?? typography?.font
  const resolvedLineHeight = lineHeight ?? typography?.lineHeight

  if (resolvedFont === undefined || resolvedLineHeight === undefined) {
    throw new Error('PText requires `font` and `lineHeight`, either directly or via `typography`.')
  }

  const { prepared } = usePreparedText({ text: children, font: resolvedFont, options: prepareOptions })
  const result = usePretextLayout({ prepared, width: resolvedWidth, lineHeight: resolvedLineHeight })
  const typographyStyle = createPretextTypography({
    font: resolvedFont,
    lineHeight: resolvedLineHeight,
    width: explicitWidth,
  }).style

  const composedRef = useCallback(
    (node: HTMLElement | null) => {
      if (explicitWidth === undefined) {
        observedRef(node)
      }
      assignRef(forwardedRef, node as PTextElement | null)
    },
    [explicitWidth, forwardedRef, observedRef],
  )

  useEffect(() => {
    if (onMeasure === undefined) {
      return
    }

    onMeasure({
      width: resolvedWidth,
      height: result.height,
      lineCount: result.lineCount,
    })
  }, [onMeasure, resolvedWidth, result.height, result.lineCount])

  const Tag: React.ElementType = as ?? 'p'

  return (
    <Tag ref={composedRef} style={{ ...typographyStyle, ...style }} {...rest}>
      {children}
    </Tag>
  )
}

const PText = forwardRef(PTextInner)

export { PText }
export type { PTextProps, PTextMeasure, PTextTag }
