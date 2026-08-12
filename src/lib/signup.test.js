import { describe, expect, it } from 'vitest'
import {
  MAX_TEAM_NAME_LENGTH,
  buildPaymentUrl,
  buildTeamLink,
  getSignupState,
  isValidTeamName,
  toClientReferenceId,
} from './signup'

describe('getSignupState', () => {
  it('returns success when ?success=true', () => {
    expect(getSignupState('?success=true')).toEqual({ type: 'success' })
  })

  it('returns team with the trimmed, decoded name when ?team=<name>', () => {
    expect(getSignupState('?team=Kickback%20FC')).toEqual({ type: 'team', name: 'Kickback FC' })
  })

  it('prioritizes success over team when both params are present', () => {
    expect(getSignupState('?success=true&team=Kickback%20FC')).toEqual({ type: 'success' })
  })

  it('returns default when there are no recognized params', () => {
    expect(getSignupState('')).toEqual({ type: 'default' })
  })

  it('returns default when team is present but blank', () => {
    expect(getSignupState('?team=%20%20')).toEqual({ type: 'default' })
  })

  it('returns default when team exceeds the max length', () => {
    expect(getSignupState(`?team=${'a'.repeat(MAX_TEAM_NAME_LENGTH + 1)}`)).toEqual({
      type: 'default',
    })
  })
})

describe('isValidTeamName', () => {
  it('accepts a normal name', () => {
    expect(isValidTeamName('Kickback FC')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(isValidTeamName('')).toBe(false)
  })

  it('rejects a whitespace-only string', () => {
    expect(isValidTeamName('   ')).toBe(false)
  })

  it(`accepts a name exactly ${MAX_TEAM_NAME_LENGTH} characters long`, () => {
    expect(isValidTeamName('a'.repeat(MAX_TEAM_NAME_LENGTH))).toBe(true)
  })

  it(`rejects a name longer than ${MAX_TEAM_NAME_LENGTH} characters`, () => {
    expect(isValidTeamName('a'.repeat(MAX_TEAM_NAME_LENGTH + 1))).toBe(false)
  })
})

describe('buildTeamLink', () => {
  it('builds a URL-encoded team link against the given origin', () => {
    expect(buildTeamLink('Kickback FC', 'https://walkonsocial.com')).toBe(
      'https://walkonsocial.com/?team=Kickback%20FC'
    )
  })

  it('trims the name before encoding', () => {
    expect(buildTeamLink('  Kickback FC  ', 'https://walkonsocial.com')).toBe(
      'https://walkonsocial.com/?team=Kickback%20FC'
    )
  })
})

describe('buildPaymentUrl', () => {
  it('appends a sanitized client_reference_id to the base URL', () => {
    expect(buildPaymentUrl('https://buy.stripe.com/test_abc', 'Free Agent')).toBe(
      'https://buy.stripe.com/test_abc?client_reference_id=Free-Agent'
    )
  })

  it('sanitizes a team name with special characters', () => {
    expect(buildPaymentUrl('https://buy.stripe.com/test_abc', 'FC & Friends')).toBe(
      'https://buy.stripe.com/test_abc?client_reference_id=FC-Friends'
    )
  })

  it('preserves an existing query string on the base URL', () => {
    expect(buildPaymentUrl('https://buy.stripe.com/test_abc?locale=en', 'Free Agent')).toBe(
      'https://buy.stripe.com/test_abc?locale=en&client_reference_id=Free-Agent'
    )
  })
})

describe('toClientReferenceId', () => {
  it('replaces disallowed characters with a dash', () => {
    expect(toClientReferenceId('FC & Friends')).toBe('FC-Friends')
  })

  it('trims and strips leading/trailing dashes', () => {
    expect(toClientReferenceId('  Free Agent  ')).toBe('Free-Agent')
  })

  it('caps the result at 200 characters', () => {
    expect(toClientReferenceId('a'.repeat(250)).length).toBe(200)
  })
})

describe('team link round trip', () => {
  it('a link built by buildTeamLink is read back correctly by getSignupState', () => {
    const link = buildTeamLink('Kickback FC', 'https://walkonsocial.com')
    const search = link.split('?')[1]
    expect(getSignupState(`?${search}`)).toEqual({ type: 'team', name: 'Kickback FC' })
  })
})
