import { getSignupState } from '../lib/signup'
import { STRIPE_PAYMENT_LINK_URL } from '../config'
import ThankYou from './ThankYou'
import DefaultSignup from './DefaultSignup'

export default function SignUpSection() {
  const state = getSignupState()

  return (
    <section id="signup" className="signup-section">
      {state.type === 'success' && <ThankYou />}
      {state.type === 'default' && (
        <DefaultSignup paymentLinkBaseUrl={STRIPE_PAYMENT_LINK_URL} />
      )}
    </section>
  )
}
