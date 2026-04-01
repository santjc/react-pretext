import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as editorial from './editorial'
import * as root from './index'
import * as pretext from './pretext'

describe('package surface', () => {
  it('keeps editorial exports off the root entrypoint', () => {
    expect(root.createPretextTypography).toBeTypeOf('function')
    expect('prepare' in root).toBe(false)
    expect('layout' in root).toBe(false)
    expect('layoutWithLines' in root).toBe(false)
    expect('useTextFlow' in root).toBe(false)
    expect('flowText' in root).toBe(false)
    expect('createLineSlotResolver' in root).toBe(false)
    expect('EditorialColumns' in root).toBe(false)
    expect('EditorialSurface' in root).toBe(false)
    expect('EditorialTrack' in root).toBe(false)
    expect('EditorialFigure' in root).toBe(false)
  })

  it('exposes editorial exports from the editorial entrypoint', () => {
    expect(editorial.useTextFlow).toBeTypeOf('function')
    expect(editorial.flowText).toBeTypeOf('function')
    expect(editorial.createLineSlotResolver).toBeTypeOf('function')
    expect(editorial.EditorialColumns).toBeTypeOf('function')
    expect(editorial.EditorialSurface).toBeTypeOf('function')
    expect('PEditorialColumns' in editorial).toBe(false)
    expect('PEditorialSurface' in editorial).toBe(false)
    expect('PEditorialTrack' in editorial).toBe(false)
    expect('PEditorialFigure' in editorial).toBe(false)
  })

  it('exposes raw pretext exports from the pretext entrypoint', () => {
    expect(pretext.prepare).toBeTypeOf('function')
    expect(pretext.prepareWithSegments).toBeTypeOf('function')
    expect(pretext.layout).toBeTypeOf('function')
    expect(pretext.layoutWithLines).toBeTypeOf('function')
    expect(pretext.layoutNextLine).toBeTypeOf('function')
    expect(pretext.walkLineRanges).toBeTypeOf('function')
  })

  it('publishes an editorial subpath in package exports', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      exports?: Record<string, { import?: string; types?: string }>
    }

    expect(packageJson.exports?.['.']).toEqual({
      import: './dist/index.js',
      types: './dist/index.d.ts',
    })
    expect(packageJson.exports?.['./pretext']).toEqual({
      import: './dist/pretext.js',
      types: './dist/pretext.d.ts',
    })
    expect(packageJson.exports?.['./editorial']).toEqual({
      import: './dist/editorial.js',
      types: './dist/editorial.d.ts',
    })
  })
})
