const PLAYGROUND_FONT_FAMILY = 'GeistVariable, sans-serif'
const fontWeightOptions = [300, 400, 500, 600, 700] as const

function buildPlaygroundFont(fontWeight: number, fontSize: number) {
  return `${fontWeight} ${fontSize}px ${PLAYGROUND_FONT_FAMILY}`
}

export { PLAYGROUND_FONT_FAMILY, buildPlaygroundFont, fontWeightOptions }
