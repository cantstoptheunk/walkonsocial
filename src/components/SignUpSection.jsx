import { getSignupState } from '../lib/signup'
import { STRIPE_PAYMENT_LINK_URL } from '../config'
import ThankYou from './ThankYou'
import JoinTeam from './JoinTeam'
import DefaultSignup from './DefaultSignup'

export default function SignUpSection() {
  const state = getSignupState()

  return (
    <section id="signup" className="signup-section">
      {state.type === 'success' && <ThankYou />}
      {state.type === 'team' && (
        <JoinTeam name={state.name} paymentLinkBaseUrl={STRIPE_PAYMENT_LINK_URL} />
      )}
      {state.type === 'default' && (
        <DefaultSignup paymentLinkBaseUrl={STRIPE_PAYMENT_LINK_URL} />
      )}
    </section>
  )
}
