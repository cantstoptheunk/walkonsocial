import { buildPaymentUrl, getSignupState } from '../lib/signup'
import { STRIPE_PAYMENT_LINK_URL } from '../config'

export default function Hero() {
  const freeAgentUrl = buildPaymentUrl(STRIPE_PAYMENT_LINK_URL, 'Free Agent')
  const registerTeamHref = getSignupState().type === 'default' ? '#team-form' : '#signup'

  return (
    <header className="hero">
      <p className="hero-eyebrow">Walk-On Social</p>
      <h1>Adult Coed Rec Soccer. Saturdays &amp; Sundays.</h1>
      <p className="hero-dates">Sept 5 – Oct 11 + Playoffs</p>
      <div className="hero-ctas">
        <a href={freeAgentUrl} className="btn btn-primary">Sign Up as Free Agent</a>
        <a href={registerTeamHref} className="btn btn-secondary">Register a Team</a>
      </div>
    </header>
  )
}
