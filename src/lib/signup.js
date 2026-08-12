export const MAX_TEAM_NAME_LENGTH = 20

export function getSignupState(search = window.location.search) {
  const params = new URLSearchParams(search)

  if (params.get('success') === 'true') {
    return { type: 'success' }
  }

  const team = params.get('team')
  if (team && team.trim().length > 0) {
    return { type: 'team', name: team.trim() }
  }

  return { type: 'default' }
}

export function isValidTeamName(name) {
  const trimmed = name.trim()
  return trimmed.length > 0 && trimmed.length <= MAX_TEAM_NAME_LENGTH
}

export function buildTeamLink(name, origin = window.location.origin) {
  return `${origin}/?team=${encodeURIComponent(name.trim())}`
}

export function buildPaymentUrl(paymentLinkBaseUrl, clientReferenceId) {
  return `${paymentLinkBaseUrl}?client_reference_id=${encodeURIComponent(clientReferenceId)}`
}
