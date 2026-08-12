import Brand from './components/Brand'
import Hero from './components/Hero'
import PhotoBand from './components/PhotoBand'
import SeasonDetails from './components/SeasonDetails'
import Pricing from './components/Pricing'
import SignUpSection from './components/SignUpSection'
import Footer from './components/Footer'
import TeamConfirm from './components/TeamConfirm'
import { getSignupState } from './lib/signup'
import { STRIPE_PAYMENT_LINK_URL } from './config'

export default function App() {
  const state = getSignupState()

  if (state.type === 'team') {
    return (
      <div className="app app-team-confirm">
        <TeamConfirm name={state.name} paymentLinkBaseUrl={STRIPE_PAYMENT_LINK_URL} />
      </div>
    )
  }

  return (
    <div className="app">
      <Brand />
      <Hero />
      <PhotoBand />
      <SeasonDetails />
      <Pricing />
      <SignUpSection />
      <Footer />
    </div>
  )
}
