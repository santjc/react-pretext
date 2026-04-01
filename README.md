# @santjc/react-pretext

Thin React primitives and re-exports for [`@chenglou/pretext`](https://www.npmjs.com/package/@chenglou/pretext).

`@santjc/react-pretext` is designed to keep the original `pretext` mental model intact:

- prepare text once
- lay it out many times
- use richer line-level primitives when composition gets more advanced

The package does not try to hide `pretext` behind a large framework. Instead, it gives you a small React layer where React actually helps: width observation, memoized preparation, semantic DOM components, and composition helpers when layout gets more advanced.

## Features

- Re-exports the core `pretext` API
- Thin React hooks over `prepare`, `prepareWithSegments`, `layout`, and `layoutWithLines`
- `PText` component for semantic DOM text with measurement support
- Width observation with `ResizeObserver`
- Advanced editorial text-flow helpers on a dedicated subpath
- Works well as a foundation for measurement-heavy UIs, article layouts, and custom editorial composition

## Installation

```bash
npm install @santjc/react-pretext react react-dom
```

## Stable API

Import stable APIs from the package root:

```ts
import {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  layoutNextLine,
  walkLineRanges,
  useElementWidth,
  usePreparedText,
  usePreparedSegments,
  usePretextLayout,
  usePretextLines,
  PText,
} from '@santjc/react-pretext'
```

### Stable exports

- `prepare`, `prepareWithSegments`, `layout`, `layoutWithLines`, `layoutNextLine`, `walkLineRanges`
- `useElementWidth`
- `usePreparedText`
- `usePreparedSegments`
- `usePretextLayout`
- `usePretextLines`
- `PText`

## Editorial API

Editorial APIs are available from the advanced `editorial` subpath:

```ts
import {
  useTextFlow,
  flowText,
  carveLineSlots,
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  pickWidestLineSlot,
  PEditorialColumns,
  PEditorialSurface,
  PEditorialTrack,
  PEditorialFigure,
} from '@santjc/react-pretext/editorial'
```

These APIs are public and supported, but they are intentionally separate from the root adoption path.

Use them when you need:

- custom line-by-line rendering
- obstacle-aware text flow
- multi-column continuation with cursor handoff
- editorial or newspaper-style composition

## Why this package exists

`pretext` already solves the hard text problem: measuring and laying out text without relying on DOM layout reads.

What React applications still need is a thin layer that makes those primitives pleasant to use inside components:

- width observation
- memoized preparation
- semantic DOM integration
- line-by-line composition helpers when layout becomes custom enough to opt into the editorial layer

That is the purpose of `@santjc/react-pretext`.

## Examples

### Measure text with prepared text and layout

```tsx
import { usePreparedText, usePretextLayout } from '@santjc/react-pretext'

function Example() {
  const text = 'Prepare once, layout often.'
  const font = '400 18px GeistVariable, sans-serif'

  const { prepared } = usePreparedText({ text, font })
  const { height, lineCount } = usePretextLayout({
    prepared,
    width: 320,
    lineHeight: 28,
  })

  return <div>{height}px / {lineCount} lines</div>
}
```

Enable profiling only when you need the timing metric:

```tsx
const { prepareMs } = usePreparedText({
  text,
  font,
  enableProfiling: true,
})
```

### Get actual lines from segmented text

```tsx
import { usePreparedSegments, usePretextLines } from '@santjc/react-pretext'

function Example() {
  const { prepared } = usePreparedSegments({
    text: 'Line-by-line rendering starts here.',
    font: '400 18px GeistVariable, sans-serif',
  })

  const { lines } = usePretextLines({
    prepared,
    width: 280,
    lineHeight: 28,
  })

  return (
    <div>
      {lines.map((line, index) => (
        <div key={index}>{line.text}</div>
      ))}
    </div>
  )
}
```

### Use `PText`

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
      Semantic text with a thin measurement wrapper.
    </PText>
  )
}
```

### Recommended typography workflow

Use `createPretextTypography()` when the same values should drive both measurement and rendering.

```tsx
import { PText, createPretextTypography, usePreparedText, usePretextLayout } from '@santjc/react-pretext'

function Example({ text }: { text: string }) {
  const typography = createPretextTypography({
    font: '400 18px GeistVariable, sans-serif',
    lineHeight: 28,
    width: 360,
  })

  const { prepared } = usePreparedText({ text, font: typography.font })
  const layout = usePretextLayout({
    prepared,
    width: typography.width ?? 360,
    lineHeight: typography.lineHeight,
  })

  return (
    <PText typography={typography}>
      {text}
    </PText>
  )
}
```

`PText` now applies `font`, `lineHeight`, and explicit `width` from its measurement inputs by default. If you pass `style.font` or `style.width`, those render overrides still win.

### Preserve textarea-style whitespace

```tsx
import { PText, createPretextTypography } from '@santjc/react-pretext'

function Example({ value }: { value: string }) {
  const body = createPretextTypography({
    font: '400 16px GeistVariable, sans-serif',
    lineHeight: 24,
    width: 420,
  })

  return (
    <PText as="p" typography={body} prepareOptions={{ whiteSpace: 'pre-wrap' }}>
      {value}
    </PText>
  )
}
```

## Editorial layout example

For obstacle-aware layouts, use segmented preparation from the stable API and the editorial helpers from the `editorial` subpath.

```tsx
import { PText, createPretextTypography, usePreparedSegments } from '@santjc/react-pretext'
import {
  createLineSlotResolver,
  getCircleBlockedLineRangeForRow,
  useTextFlow,
} from '@santjc/react-pretext/editorial'

function EditorialExample({ width }: { width: number }) {
  const body = createPretextTypography({
    font: '400 18px GeistVariable, sans-serif',
    lineHeight: 30,
  })
  const title = 'The Future of Text Layout Is Not CSS'
  const text = 'An editorial surface needs more than a single block height...'

  const paddingX = 28
  const bodyStartY = 180
  const bodyWidth = width - paddingX * 2
  const orb = {
    x: paddingX + bodyWidth * 0.72,
    y: bodyStartY + body.lineHeight * 3,
    radius: 72,
  }

  const { prepared } = usePreparedSegments({ text, font: body.font })

  const getLineSlotAtY = createLineSlotResolver({
    baseLineSlot: { left: paddingX, right: paddingX + bodyWidth },
    lineHeight: body.lineHeight,
    minWidth: 180,
    getBlockedLineRanges: (lineTop, lineBottom) => {
      const blocked = getCircleBlockedLineRangeForRow({
        cx: orb.x,
        cy: orb.y,
        radius: orb.radius,
        lineTop,
        lineBottom,
        horizontalPadding: 16,
      })

      return blocked === null ? [] : [blocked]
    },
  })

  const flow = useTextFlow({
    prepared,
    lineHeight: body.lineHeight,
    startY: bodyStartY,
    getLineSlotAtY,
  })

  return (
    <div style={{ position: 'relative', minHeight: bodyStartY + flow.height + 48 }}>
      <PText
        as="h1"
        typography={createPretextTypography({
          font: '700 64px GeistVariable, sans-serif',
          lineHeight: 60,
          width: bodyWidth * 0.7,
        })}
        style={{ position: 'absolute', left: paddingX, top: 28 }}
      >
        {title}
      </PText>

      <div
        style={{
          position: 'absolute',
          left: orb.x - orb.radius,
          top: orb.y - orb.radius,
          width: orb.radius * 2,
          height: orb.radius * 2,
          borderRadius: '999px',
          background: 'rgba(255, 77, 0, 0.2)',
        }}
      />

      {flow.lines.map((line, index) => (
        <div
          key={`${line.start.segmentIndex}-${line.start.graphemeIndex}-${index}`}
          style={{
            position: 'absolute',
            left: line.x,
            top: line.y,
            width: Math.ceil(line.width),
            ...body.style,
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  )
}
```

## How to think about the API

The package works best if you treat it in layers:

### Stable root layer
- prepare text
- layout text
- observe width
- render semantic DOM text

### Editorial layer
- resolve available line slots
- flow text around obstacles
- assemble editorial or custom layouts

If you are building normal UI text measurement, stay on the stable root API.
If you are building custom layout systems, the editorial APIs on the `editorial` subpath are the right place to explore.

## Current Scope

What this package is good at today:

- stable text preparation and measurement in React
- semantic DOM rendering with `PText`
- low-level line access for custom rendering
- editorial surfaces and columns with figure obstacles and explicit justify spacing

What it is not trying to be:

- a general rich text editor
- a DOM-based typography framework
- a full publishing system

## Caveats

- `createPretextTypography()` is the recommended way to keep measurement inputs and render styles aligned.
- `font` should match the actual rendered font declaration as closely as possible.
- Webfont loading can affect measurement accuracy until the font is ready.
- `PText` currently supports `string` children only.
- `prepareOptions` currently map directly to pretext preparation options such as `whiteSpace`.
- `useTextFlow` expects a reference-stable `getLineSlotAtY` callback. Memoize it with `useMemo` when passing custom resolvers from React components.
- `usePreparedText` only includes `prepareMs` when `enableProfiling: true` is passed.
- Editorial `lineRenderMode="justify"` uses explicit `word-spacing` derived from pretext line measurements instead of browser `text-align: justify`. Complex whitespace cases fall back to left alignment.
- `PEditorialFigure` treats explicit `x` and `y` as overrides over `placement`, and clamps the final position within the available bounds.

The current package surface is intentionally small and public:

- stable measurement hooks and `PText`
- public editorial primitives on the `editorial` subpath
- explicit justify rendering based on pretext measurements
- playground routes that exercise both measurement and editorial flow

## Contributing

Issues and pull requests are welcome.

Good contributions for this project usually look like one of these:

- improving the React ergonomics without hiding pretext’s original model
- adding tests around public package behavior
- improving TypeScript types and package DX
- clarifying docs and examples
- validating whether a helper belongs in the root public API or should stay internal

When contributing, prefer small, explicit abstractions over large convenience layers. The package is intentionally trying to stay close to `pretext`.
