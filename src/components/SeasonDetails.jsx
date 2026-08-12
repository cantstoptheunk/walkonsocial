export default function SeasonDetails() {
  return (
    <section className="season-details">
      <p className="section-label">Season Details</p>
      <div className="season-grid">
        <div>
          <strong>Format</strong>
          <span>7v7 coed, 25-minute halves</span>
        </div>
        <div>
          <strong>Schedule</strong>
          <span>Saturdays &amp; Sundays, 10:00am–1:00pm</span>
        </div>
        <div>
          <strong>Season</strong>
          <span>Sept 5 – Oct 11 (6 weeks)</span>
        </div>
        <div>
          <strong>Playoffs</strong>
          <span>Oct 17–18</span>
        </div>
        <div className="season-grid-full">
          <strong>Location</strong>
          <a
            href="https://maps.google.com/?q=7655+W+10th+Ave,+Lakewood,+CO+80214"
            target="_blank"
            rel="noreferrer"
          >
            Lakewood Memorial Field, 7655 W 10th Ave, Lakewood, CO 80214
          </a>
        </div>
      </div>
    </section>
  )
}
