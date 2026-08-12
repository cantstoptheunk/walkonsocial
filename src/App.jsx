import Hero from './components/Hero'
import PhotoBand from './components/PhotoBand'
import SeasonDetails from './components/SeasonDetails'
import Pricing from './components/Pricing'
import SignUpSection from './components/SignUpSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="app">
      <Hero />
      <PhotoBand />
      <SeasonDetails />
      <Pricing />
      <SignUpSection />
      <Footer />
    </div>
  )
}
