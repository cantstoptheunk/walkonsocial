import { getSignupState } from '../lib/signup'
import { STRIPE_PAYMENT_LINK_URL } from '../config'
import ThankYou from './ThankYou'
import JoinTeam from './JoinTeam'

export default function SignUpSection() {
  const state = getSignupState()

  return (
    <section id="signup" className="signup-section">
      {state.type === 'success' && <ThankYou />}
      {state.type === 'team' && (
        <JoinTeam name={state.name} paymentLinkBaseUrl={STRIPE_PAYMENT_LINK_URL} />
      )}
      {state.type === 'default' && <p>Sign-up form coming in the next task.</p>}
    </section>
  )
}
