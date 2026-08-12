import { buildPaymentUrl } from '../lib/signup'

export default function JoinTeam({ name, paymentLinkBaseUrl }) {
  const payUrl = buildPaymentUrl(paymentLinkBaseUrl, name)

  return (
    <div className="join-team">
      <h2>You're joining {name}</h2>
      <a href={payUrl} className="btn btn-primary">Register &amp; Pay – $60</a>
    </div>
  )
}
