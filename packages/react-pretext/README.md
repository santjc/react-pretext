# @santjc/react-pretext

Thin React primitives over [`@chenglou/pretext`](https://www.npmjs.com/package/@chenglou/pretext).

This package keeps the original `pretext` model intact and adds a small React layer where React actually helps.

The intended adoption path is:

- define typography once
- measure text with `useMeasuredText()`
- render semantic DOM with `PText`
- use predicted heights in normal UI like accordions, cards, and lists
- opt into editorial flow only when you need custom line routing

## Installation

```bash
npm install @santjc/react-pretext react react-dom
```

## Stable API

The root package is the intentional React-facing surface.

Stable React exports:

- `createPretextTypography`
- `useElementWidth`
- `useMeasuredText`
- `usePreparedText`
- `usePreparedSegments`
- `usePretextLayout`
- `usePretextLines`
- `PText`

## Core examples

### Measure text with one hook

```tsx
import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

function Example({ text }: { text: string }) {
  const typography = createPretextTypography({
    font: '400 18px GeistVariable, sans-serif',
    lineHeight: 28,
    width: 320,
  })

  const { height, lineCount } = useMeasuredText({ text, typography })

  return <div>{height}px / {lineCount} lines</div>
}
```

### Use `PText` with shared typography

```tsx
import { PText, createPretextTypography } from '@santjc/react-pretext'

function Example() {
  const body = createPretextTypography({
    font: '400 18px GeistVariable, sans-serif',
    lineHeight: 28,
    width: 320,
  })

  return (
    <PText as="p" typography={body}>
      Semantic text with one source of truth for measurement and rendering.
    </PText>
  )
}
```

### Let `PText` observe responsive width

```tsx
import { PText, createPretextTypography } from '@santjc/react-pretext'

function Example() {
  const body = createPretextTypography({
    font: '400 18px GeistVariable, sans-serif',
    lineHeight: 28,
  })

  return (
    <div style={{ width: 'min(100%, 36rem)' }}>
      <PText as="p" typography={body}>
        Width is observed from the rendered element when no explicit width is supplied.
      </PText>
    </div>
  )
}
```

### Replace hidden measurement or `scrollHeight`

```tsx
import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

function Example({ text }: { text: string }) {
  const typography = createPretextTypography({
    font: '400 18px GeistVariable, sans-serif',
    lineHeight: 28,
    width: 360,
  })
  const { height } = useMeasuredText({ text, typography })

  return <div style={{ height }}>{text}</div>
}
```

### Predict measured card or list heights

```tsx
import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

function Example({ text, width }: { text: string; width: number }) {
  const typography = createPretextTypography({
    font: '400 16px GeistVariable, sans-serif',
    lineHeight: 26,
    width,
  })
  const { height } = useMeasuredText({ text, typography })

  return <div>predicted height: {height}px</div>
}
```

Drop down to `usePreparedText()` and `usePretextLayout()` when you want to control the prepare and layout phases separately. Use `usePreparedSegments()` with `usePretextLines()` when you need actual line output.

## Low-Level Pretext API

Raw `@chenglou/pretext` exports live on a dedicated `pretext` subpath:

```ts
import {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  layoutNextLine,
  walkLineRanges,
} from '@santjc/react-pretext/pretext'
```

Use this subpath when you want the original low-level pretext model without the React-first root entrypoint.

## Editorial API

Editorial helpers live on the advanced `editorial` subpath:

```ts
import {
  useTextFlow,
  flowText,
  carveLineSlots,
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  pickWidestLineSlot,
  EditorialColumns,
  EditorialSurface,
  type EditorialTrack,
  type EditorialFigure,
} from '@santjc/react-pretext/editorial'
```

These APIs are public and tested, but they are not part of the default root adoption path.

Reach for them when you need custom line rendering, obstacle-aware flow, or multi-column continuation.

## Caveats

- `createPretextTypography()` is the recommended way to keep measurement inputs and render styles aligned.
- `font` should match the actual rendered font declaration as closely as possible.
- Webfont loading can affect measurement accuracy until the font is ready.
- `PText` currently supports `string` children only.
- `prepareOptions` currently map directly to pretext preparation options, such as `whiteSpace`.
- `useTextFlow` expects a reference-stable `getLineSlotAtY` callback. Memoize custom resolvers in React.
- Editorial `lineRenderMode="justify"` uses pretext-derived `word-spacing` and will skip justification for unsupported whitespace patterns instead of delegating wrapping back to the browser.
- `EditorialFigure` treats explicit `x` and `y` as overrides over `placement`, and clamps the result within available bounds.

### Editorial migration

The editorial layer is now config-driven instead of sentinel-child driven.

Before:

```tsx
<PEditorialColumns text={text} font={font} lineHeight={28}>
  <PEditorialTrack fr={1}>
    <PEditorialFigure shape="circle" width={96} height={96}>
      <Orb />
    </PEditorialFigure>
  </PEditorialTrack>
</PEditorialColumns>
```

After:

```tsx
<EditorialColumns
  text={text}
  font={font}
  lineHeight={28}
  tracks={[
    {
      fr: 1,
      figures: [{ shape: 'circle', width: 96, height: 96, content: <Orb /> }],
    },
  ]}
/>
```

The package exposes a small React-first root API, a low-level `pretext` subpath, and an advanced `editorial` subpath.
