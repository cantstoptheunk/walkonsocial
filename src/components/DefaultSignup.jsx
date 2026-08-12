import { useState } from 'react'
import { buildPaymentUrl, buildTeamLink, isValidTeamName, MAX_TEAM_NAME_LENGTH } from '../lib/signup'

export default function DefaultSignup({ paymentLinkBaseUrl }) {
  const [teamName, setTeamName] = useState('')
  const [copied, setCopied] = useState(false)

  const valid = isValidTeamName(teamName)
  const teamLink = valid ? buildTeamLink(teamName) : ''
  const payUrl = valid ? buildPaymentUrl(paymentLinkBaseUrl, teamName.trim()) : ''
  const faPayUrl = buildPaymentUrl(paymentLinkBaseUrl, 'Free Agent')

  function handleNameChange(event) {
    setTeamName(event.target.value.slice(0, MAX_TEAM_NAME_LENGTH))
    setCopied(false)
  }

  function handleCopy() {
    if (!navigator.clipboard) return
    navigator.clipboard
      .writeText(teamLink)
      .then(() => setCopied(true))
      .catch(() => {})
  }

  return (
    <div className="default-signup">
      <div className="signup-option">
        <h3>Free Agent</h3>
        <p>No team? We'll place you on one.</p>
        <a href={faPayUrl} className="btn btn-primary">Sign Up as Free Agent – $60</a>
      </div>

      <div className="signup-option">
        <h3>Register a Team</h3>
        <input
          type="text"
          className="team-name-input"
          value={teamName}
          onChange={handleNameChange}
          placeholder="Team name"
          maxLength={MAX_TEAM_NAME_LENGTH}
        />
        {valid && (
          <>
            <div className="team-link-row">
              <input type="text" readOnly value={teamLink} className="team-link-field" />
              <button type="button" className="btn btn-secondary" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <a href={payUrl} className="btn btn-primary">Register &amp; Pay – $60</a>
          </>
        )}
      </div>
    </div>
  )
}
