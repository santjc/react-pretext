# @santjc/react-pretext

Thin React primitives over [`@chenglou/pretext`](https://www.npmjs.com/package/@chenglou/pretext).

`@santjc/react-pretext` is meant to make normal React adoption clearer, not to hide `pretext` behind a large framework.

The default story is:

- define typography once
- measure text with one hook
- render semantic DOM with `PText`
- use predicted heights in ordinary UI like accordions, cards, lists, and previews
- reach for editorial flow only when block measurement is no longer enough

## Features

- Re-exports the core `pretext` API
- `createPretextTypography()` for shared measurement and render config
- `useMeasuredText()` for the simplest height and line-count cases
- `PText` for semantic DOM text with measurement support
- Width observation with `ResizeObserver` when `PText` does not receive an explicit `width`
- Lower-level hooks for prepared text, segmented text, and line access
- Advanced editorial helpers on a dedicated `editorial` subpath

## Installation

```bash
npm install @santjc/react-pretext react react-dom
```

## Stable API

Import the React-facing stable APIs from the package root:

```ts
import {
  createPretextTypography,
  useElementWidth,
  useMeasuredText,
  usePreparedText,
  usePreparedSegments,
  usePretextLayout,
  usePretextLines,
  PText,
} from '@santjc/react-pretext'
```

Stable React exports:

- `createPretextTypography`
- `useElementWidth`
- `useMeasuredText`
- `usePreparedText`
- `usePreparedSegments`
- `usePretextLayout`
- `usePretextLines`
- `PText`

## Start Here

### 1. Measure text with one hook

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

Use this for the common case where a component needs a known text height, line count, or both.

Enable profiling only when you need the timing metric:

```tsx
const { prepareMs } = useMeasuredText({
  text,
  typography,
  enableProfiling: true,
})
```

### 2. Use shared typography with `PText`

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
      Semantic text with one source of truth for measurement and render output.
    </PText>
  )
}
```

`PText` applies `font`, `lineHeight`, and explicit `width` from its measurement inputs by default. If you pass `style.font` or `style.width`, those render overrides still win.

### 3. Let `PText` observe responsive width

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
        This paragraph does not receive an explicit width. PText observes the element width and remeasures as the container changes.
      </PText>
    </div>
  )
}
```

This is the intended happy path when the font is known but the final width comes from responsive layout.

### 4. Replace hidden measurement or `scrollHeight`

```tsx
import { createPretextTypography, useMeasuredText, PText } from '@santjc/react-pretext'

function AccordionBody({ isOpen, text }: { isOpen: boolean; text: string }) {
  const typography = createPretextTypography({
    font: '400 18px GeistVariable, sans-serif',
    lineHeight: 28,
    width: 360,
  })
  const { height } = useMeasuredText({ text, typography })

  return (
    <div style={{ height: isOpen ? `${height}px` : '0px', overflow: 'hidden' }}>
      <PText as="p" typography={typography}>
        {text}
      </PText>
    </div>
  )
}
```

This keeps the DOM semantic while removing hidden probe nodes or animation logic that depends on reading `scrollHeight` after render.

### 5. Predict measured card or list heights

```tsx
import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

function ResultCard({ text, width }: { text: string; width: number }) {
  const typography = createPretextTypography({
    font: '400 16px GeistVariable, sans-serif',
    lineHeight: 26,
    width: width - 32,
  })
  const { height, lineCount } = useMeasuredText({ text, typography })

  return (
    <div>
      <div>{lineCount} lines</div>
      <div>predicted body height: {height}px</div>
    </div>
  )
}
```

This pattern works well for feeds, search results, CMS previews, issue lists, and any responsive grid where text height affects placement.

### 6. Drop lower only when you need more control

If you want to prepare once and reuse that prepared handle across multiple layouts yourself, drop down to `usePreparedText()` and `usePretextLayout()`.

If you want actual line output from segmented text, use `usePreparedSegments()` with `usePretextLines()`.

If you want the raw `@chenglou/pretext` APIs directly, import them from the dedicated `pretext` subpath instead of the root entrypoint.

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
  EditorialColumns,
  EditorialSurface,
  type EditorialTrack,
  type EditorialFigure,
} from '@santjc/react-pretext/editorial'
```

These APIs are public and supported, but they are intentionally separate from the default adoption path.

Reach for them when you need:

- custom line-by-line rendering
- obstacle-aware text flow
- multi-column continuation with cursor handoff
- editorial or newspaper-style composition

### Advanced editorial example

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

The package works best if you treat it in layers.

### Stable root layer

- prepare text
- layout text
- observe width
- render semantic DOM text
- predict heights for ordinary UI

### Editorial layer

- resolve available line slots
- flow text around obstacles
- assemble editorial or custom layouts

If you are building normal UI text measurement, stay on the stable root API.
If you are building custom layout systems, the editorial APIs on the `editorial` subpath are the right place to explore.

If you want the original non-React low-level helpers, use the `pretext` subpath.

## Caveats

- `createPretextTypography()` is the recommended way to keep measurement inputs and render styles aligned.
- `font` should match the actual rendered font declaration as closely as possible.
- Webfont loading can affect measurement accuracy until the font is ready.
- `PText` currently supports `string` children only.
- `prepareOptions` currently map directly to pretext preparation options such as `whiteSpace`.
- `useTextFlow` expects a reference-stable `getLineSlotAtY` callback. Memoize it with `useMemo` when passing custom resolvers from React components.
- `usePreparedText` only includes `prepareMs` when `enableProfiling: true` is passed.
- Editorial `lineRenderMode="justify"` uses explicit `word-spacing` derived from pretext line measurements instead of browser `text-align: justify`. Complex whitespace cases fall back to left alignment.
- `EditorialFigure` treats explicit `x` and `y` as overrides over `placement`, and clamps the final position within the available bounds.

## Breaking Changes

- Root imports no longer re-export raw `@chenglou/pretext` APIs.
- Migrate `import { prepare } from '@santjc/react-pretext'` to `import { prepare } from '@santjc/react-pretext/pretext'`.
- `PEditorialColumns` and `PEditorialSurface` were renamed to `EditorialColumns` and `EditorialSurface`.
- `PEditorialTrack` and `PEditorialFigure` sentinel children were replaced by `EditorialTrack` and `EditorialFigure` config objects passed through `tracks` and `figures` props.

## Contributing

Issues and pull requests are welcome.

Good contributions for this project usually look like one of these:

- improving the React ergonomics without hiding pretext’s original model
- adding tests around public package behavior
- improving TypeScript types and package DX
- clarifying docs and examples
- validating whether a helper belongs in the root public API or should stay internal

When contributing, prefer small, explicit abstractions over large convenience layers. The package is intentionally trying to stay close to `pretext`.
