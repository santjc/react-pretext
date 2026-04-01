import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as editorial from './editorial'
import * as root from './index'

describe('package surface', () => {
  it('keeps editorial exports off the root entrypoint', () => {
    expect(root.createPretextTypography).toBeTypeOf('function')
    expect('useTextFlow' in root).toBe(false)
    expect('flowText' in root).toBe(false)
    expect('createLineSlotResolver' in root).toBe(false)
    expect('PEditorialColumns' in root).toBe(false)
    expect('PEditorialSurface' in root).toBe(false)
    expect('PEditorialTrack' in root).toBe(false)
    expect('PEditorialFigure' in root).toBe(false)
  })

  it('exposes editorial exports from the editorial entrypoint', () => {
    expect(editorial.useTextFlow).toBeTypeOf('function')
    expect(editorial.flowText).toBeTypeOf('function')
    expect(editorial.createLineSlotResolver).toBeTypeOf('function')
    expect(editorial.PEditorialColumns).toBeTypeOf('function')
    expect(editorial.PEditorialSurface).toBeTypeOf('function')
    expect(editorial.PEditorialTrack).toBeTypeOf('function')
    expect(editorial.PEditorialFigure).toBeTypeOf('function')
  })

  it('publishes an editorial subpath in package exports', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      exports?: Record<string, { import?: string; types?: string }>
    }

    expect(packageJson.exports?.['.']).toEqual({
      import: './dist/index.js',
      types: './dist/index.d.ts',
    })
    expect(packageJson.exports?.['./editorial']).toEqual({
      import: './dist/editorial.js',
      types: './dist/editorial.d.ts',
    })
  })
})
