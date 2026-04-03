# Changelog

## 0.1.1

- Refactored the playground into route-based showcases so each demo has a stable URL and the home page only links to real, current examples.
- Tightened showcase copy across the site to better match the current public API and reduced overstated framing around deterministic measurement.
- Added a real `PText` demo to the core showcase with `onMeasure` and responsive width observation.
- Added a `Dynamic Layout` showcase built from public editorial primitives including `usePreparedSegments`, `useTextFlow`, `createLineSlotResolver`, `getCircleBlockedLineRangeForRow`, and `FlowLines`.
- Restored the editorial newspaper composition to a fuller content density so the layout reads like a real spread again while keeping the updated package framing elsewhere.
- Simplified the playground favicon setup to a single SVG brand mark using the black and orange site palette.

## 0.1.0

- First public pre-1.0 release of `@santjc/react-pretext`.
- Includes the core React hooks, semantic `PText` renderer, and editorial subpath exports.
- Updated the playground `Core`, `Cards`, `Editorial`, and `Editorial Engine` showcases to use the real package APIs instead of simulated measurements.
- Fixed editorial line rendering to avoid React font/line-height rerender warnings and clarified the editorial `font`/`figures` contract in the docs.
- Refactored the playground into route-based showcases, added a real `Dynamic Layout` route built from public editorial primitives, added a `PText` demo to the core route, and tightened showcase copy to remove missing or overstated references.
