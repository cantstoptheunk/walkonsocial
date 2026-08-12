export default function SeasonDetails() {
  return (
    <section className="season-details">
      <h2>Season Details</h2>
      <ul>
        <li><strong>Format:</strong> 7v7, 25-minute halves</li>
        <li><strong>Schedule:</strong> Saturdays &amp; Sundays, 10:00am–1:00pm</li>
        <li><strong>Season:</strong> Sept 5–6, 12–13, 19–20, 26–27, Oct 3–4, Oct 10–11 (6 weeks)</li>
        <li><strong>Playoffs:</strong> Oct 17–18</li>
        <li>
          <strong>Location:</strong>{' '}
          <a
            href="https://maps.google.com/?q=7655+W+10th+Ave,+Lakewood,+CO+80214"
            target="_blank"
            rel="noreferrer"
          >
            Lakewood Memorial Field, 7655 W 10th Ave, Lakewood, CO 80214
          </a>
        </li>
      </ul>
    </section>
  )
}
