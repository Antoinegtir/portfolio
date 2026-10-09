import { describe, it, expect } from 'vitest'
import { experiences, profile } from '../content/experiences'

describe('content', () => {
  it('lists the experiences, newest first', () => {
    expect(experiences.map(e => e.name)).toEqual([
      'Wellnotes', 'Dreamoji', 'Vibes Widget', 'Fhreads', 'ReBeal', 'Kams',
    ])
  })
  it('every entry has id, role, period, icon and bullets', () => {
    for (const e of experiences) {
      expect(e.id).toMatch(/^[a-z0-9-]+$/)
      expect(e.role).toBeTruthy()
      expect(e.period).toBeTruthy()
      expect(e.icon).toMatch(/^\/icons\/.+\.png$/)
      expect(e.bullets.length).toBeGreaterThan(0)
    }
  })
  it('section ids are unique (they are scroll targets for the phone icons)', () => {
    const ids = experiences.map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('never exposes a phone number in displayed text', () => {
    // URLs (App Store ids, etc.) legitimately contain long digit runs, so only check the copy
    const text = experiences.map(({ links: _links, ...rest }) => rest)
    expect(JSON.stringify({ text, profile })).not.toMatch(/\+?\d[\d .]{8,}\d/)
  })
})
