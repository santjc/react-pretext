# @santjc/react-pretext

Simple React wrapper over [`@chenglou/pretext`](https://www.npmjs.com/package/@chenglou/pretext) for deterministic text measurement before paint, without DOM reads.

`@santjc/react-pretext` is intentionally a small React layer over `@chenglou/pretext`. It predicts text height and line count from text, typography, and width before layout hits the DOM. The core use case is measurement-driven UI: accordions, cards, previews, virtualized rows, and responsive layouts where text height affects placement.

The package has three layers:

- root: the normal React-facing adoption path
- `editorial`: advanced obstacle-aware and multi-column text flow
- `pretext`: the raw low-level `@chenglou/pretext` escape hatch

## Installation

```bash
npm install @santjc/react-pretext react react-dom
```

Peer dependencies: React 18 or 19.

## Start Here

### Measure text with one hook

```tsx
import { createPretextTypography, useMeasuredText } from '@santjc/react-pretext'

function Example({ text }: { text: string }) {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 18,
    weight: 400,
    lineHeight: 28,
    width: 320,
  })

  const { height, lineCount } = useMeasuredText({ text, typography })

  return <div>{height}px / {lineCount} lines</div>
}
```

### Render with `PText` using the same typography

```tsx
import { PText, createPretextTypography } from '@santjc/react-pretext'

function Example() {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 18,
    weight: 400,
    lineHeight: 28,
    width: 320,
  })

  return (
    <PText as="p" typography={typography}>
      Semantic text with one source of truth for measurement and render output.
    </PText>
  )
}
```

### Replace `scrollHeight` or hidden measurement nodes

```tsx
import { createPretextTypography, useMeasuredText, PText } from '@santjc/react-pretext'

function AccordionBody({ isOpen, text }: { isOpen: boolean; text: string }) {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 18,
    weight: 400,
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

## Typography input

`createPretextTypography()` accepts either a structured typography object or a CSS font shorthand string.

Structured input:

```tsx
const typography = createPretextTypography({
  family: 'Inter, sans-serif',
  size: 18,
  weight: 400,
  lineHeight: 28,
  width: 320,
})
```

Shorthand input:

```tsx
const typography = createPretextTypography({
  font: '400 18px Inter, sans-serif',
  lineHeight: 28,
  width: 320,
})
```

The structured form is the recommended default. It is easier to derive from theme tokens and less fragile in normal application code.

## Truncation

`useTruncatedText()` gives you the visible text that fits within a known line budget, plus a `didTruncate` flag you can use for UI like “Read more”.

```tsx
import { PText, createPretextTypography, useTruncatedText } from '@santjc/react-pretext'

function Preview({ text }: { text: string }) {
  const typography = createPretextTypography({
    family: 'Inter, sans-serif',
    size: 16,
    lineHeight: 24,
    width: 280,
  })

  const preview = useTruncatedText({
    text,
    typography,
    maxLines: 3,
  })

  return (
    <>
      <PText as="p" typography={typography}>{preview.text}</PText>
      {preview.didTruncate ? <button>Read more</button> : null}
    </>
  )
}
```

## Root API

- `createPretextTypography`
- `useElementWidth`
- `useMeasuredText`
- `usePreparedText`
- `usePreparedSegments`
- `usePretextLayout`
- `usePretextLines`
- `useTruncatedText`
- `PText`

`PText` is a semantic rendering helper, not the center of the measurement story. The main path still starts with hooks.

## Advanced layers

Use `@santjc/react-pretext/pretext` when you want the raw low-level pretext APIs.

Use `@santjc/react-pretext/editorial` when you need custom line rendering, obstacle-aware flow, or multi-column continuation.

## SSR and webfonts

Measurement depends on canvas-backed text metrics, so measurement hooks are a client-side feature.

- In Next.js and similar frameworks, call them from client components.
- If you need SSR fallback markup, hydrate into a measured client view.
- Webfont loading can affect first-render accuracy until the font is ready.

## Repository layout

- `packages/react-pretext`: the published library
- `apps/playground`: local adoption and showcase app
- `packages/react-pretext/src/core/*`: root stable API
- `packages/react-pretext/src/editorial/*`: advanced editorial API
- `packages/react-pretext/src/test/*`: package boundary and integration tests

The package README in `packages/react-pretext/README.md` contains the fuller API and guidance reference.

## Versioning and release

`@santjc/react-pretext` should stay on `0.x` until the API is stable enough to promise `1.0.0` compatibility.

- use `npm run version:react-pretext:patch` for fixes that do not change the intended API
- use `npm run version:react-pretext:minor` for new features and for any breaking change while still in `0.x`
- use `npm run version:react-pretext:prerelease` for `beta` publishes like `0.2.0-beta.0`

Recommended release flow:

1. Run the version bump script.
2. Update `CHANGELOG.md`.
3. Commit the versioned changes.
4. Trigger the `Publish @santjc/react-pretext` GitHub Action with the exact committed version.

The publish workflow validates the version, runs lint/test/build, checks that the version is not already on npm, and publishes only `@santjc/react-pretext` to the public npm registry.
