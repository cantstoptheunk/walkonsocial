import { buildPaymentUrl } from '../lib/signup'

export default function JoinTeam({ name, paymentLinkBaseUrl }) {
  const payUrl = buildPaymentUrl(paymentLinkBaseUrl, name)

  return (
    <div className="join-team">
      <h2>You're joining {name}</h2>
      <a href={payUrl} className="btn btn-primary">Register &amp; Pay – $60</a>
      <p className="secondary-link">
        <a href="/">Not joining {name}? Sign up as a free agent or start your own team instead.</a>
      </p>
    </div>
  )
}
