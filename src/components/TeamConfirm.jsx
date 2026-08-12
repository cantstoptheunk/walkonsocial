import { buildPaymentUrl } from '../lib/signup'

export default function TeamConfirm({ name, paymentLinkBaseUrl }) {
  const payUrl = buildPaymentUrl(paymentLinkBaseUrl, name)

  return (
    <div className="team-confirm">
      <p className="hero-eyebrow">Walk-On Social</p>
      <h1>Join {name}?</h1>
      <p className="team-confirm-copy">
        You're about to register for Adult Coed Rec Soccer (Sept 5 – Oct 11 + Playoffs) under{' '}
        <strong>{name}</strong>. On the next screen, enter <strong>{name}</strong> as your team
        name to lock it in.
      </p>
      <div className="team-confirm-ctas">
        <a href={payUrl} className="btn btn-primary">Continue – $60</a>
        <a href="/" className="btn btn-secondary">Cancel</a>
      </div>
    </div>
  )
}
