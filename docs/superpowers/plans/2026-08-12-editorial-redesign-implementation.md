# Editorial Minimal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Project-specific override:** this repo's convention is to work directly on `master` with no feature branches, committing after each completed round (established with the project owner). Skip worktree/branch setup from either execution skill — commit each task's changes straight to `master` as you go.

**Goal:** Restyle the existing Walk-On Social landing page from the original dark "Bold Turf" look to the approved "Editorial Minimal" design — cream/orange palette, sans-serif type, wider layout, a real photo band — without changing any behavior (sign-up flow, Stripe links, query-param routing all stay exactly as-is).

**Architecture:** Pure presentation-layer change. No new dependencies, no new state, no routing/logic changes. Almost all of it is CSS token and class updates in `src/index.css`; the only structural change is one new presentational component (`PhotoBand`) inserted into `App.jsx` between `Hero` and `SeasonDetails`.

**Tech Stack:** Existing Vite + React 18 + plain CSS. No CSS framework introduced.

## Global Constraints

- Palette: background `#f2efe6`, text `#1f2d22`, accent (CTAs/highlights) stays the existing `#e8542e` — no new accent color (no sage green).
- Typography: sans-serif headlines (not serif) — system sans-serif stack, no new font/webfont dependency.
- Layout width: widen `.app` from `max-width: 720px` to `max-width: 1080px`.
- Photo asset: `src/assets/images/team-celebration.png` (already copied into the repo) — import it as a module, don't reference it as a static/public path.
- No behavior changes: `getSignupState()`, `buildPaymentUrl`, `buildTeamLink`, `isValidTeamName` and all query-param logic are unchanged. Only className/JSX-structure/CSS changes.
- Copy already updated in a prior round and must NOT be reverted: "Adult Coed Rec Soccer." hero headline, "7v7 coed" in Season Details, "$60 Flat Fee" / "including tax" in Pricing.
- Spec of record: `docs/superpowers/specs/2026-08-12-landing-page-design.md` (Visual Style, Page Structure sections).

---

### Task 1: Design tokens, base layout, and typography

**Files:**
- Modify: `src/index.css:1-27`

**Interfaces:**
- Produces: the CSS custom properties `--color-bg`, `--color-text`, `--color-accent` that every later task's CSS relies on. Values change; names stay the same so no downstream class needs renaming.

- [ ] **Step 1: Update the root color tokens and drop the now-unused muted-green token**

Replace:

```css
:root {
  --color-bg: #0d2818;
  --color-text: #f4f1e8;
  --color-accent: #e8542e;
  --color-accent-muted: #8fd19e;
}
```

with:

```css
:root {
  --color-bg: #f2efe6;
  --color-text: #1f2d22;
  --color-text-muted: #5b5a4f;
  --color-accent: #e8542e;
  --color-border: #e2ddd0;
}
```

- [ ] **Step 2: Switch the body font stack to sans-serif and update `.app` width/padding**

Replace:

```css
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: Arial, Helvetica, sans-serif;
}

.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
}

h1, h2, h3 {
  font-weight: 800;
}

section {
  margin: 40px 0;
}
```

with:

```css
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
}

.app {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 56px;
}

h1, h2, h3 {
  font-weight: 800;
  letter-spacing: -0.5px;
}

section {
  margin: 56px 0;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--color-border);
}

section:last-of-type {
  border-bottom: none;
}
```

- [ ] **Step 3: Every class referencing the removed `--color-accent-muted` token must resolve — grep and confirm**

Run: `grep -n "color-accent-muted" src/index.css`

Expected: three matches (`.hero-eyebrow`, `.season-details a`, `.footer a`) — all three are fixed in Tasks 3, 4, and 7 respectively. Leaving them unresolved here is fine; this step just confirms you know the exact count so none get missed later.

- [ ] **Step 4: Visually sanity-check in the dev server**

Run: `npm run dev`

Expected: page loads with a cream background and dark text (still using old CTA/eyebrow colors that reference the now-missing `--color-accent-muted` variable — those will render as unstyled/inherited color until Tasks 3, 4, 7 land later in this plan; that's expected and fine at this checkpoint).

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "style: switch design tokens to editorial-minimal cream/orange palette"
```

---

### Task 2: Photo band component

**Files:**
- Create: `src/components/PhotoBand.jsx`
- Modify: `src/App.jsx:1-17`
- Modify: `src/index.css` (append)

**Interfaces:**
- Consumes: `src/assets/images/team-celebration.png` (already present in the repo).
- Produces: `PhotoBand` — a zero-prop component rendered once, directly after `Hero` and before `SeasonDetails`.

- [ ] **Step 1: Create the component**

```jsx
import teamPhoto from '../assets/images/team-celebration.png'

export default function PhotoBand() {
  return (
    <div className="photo-band">
      <img src={teamPhoto} alt="Walk-On Social players celebrating on the field" />
    </div>
  )
}
```

- [ ] **Step 2: Wire it into `App.jsx`**

Replace:

```jsx
import Hero from './components/Hero'
import SeasonDetails from './components/SeasonDetails'
import Pricing from './components/Pricing'
import SignUpSection from './components/SignUpSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="app">
      <Hero />
      <SeasonDetails />
      <Pricing />
      <SignUpSection />
      <Footer />
    </div>
  )
}
```

with:

```jsx
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
```

- [ ] **Step 3: Add the CSS — full-bleed band, cropped to a fixed aspect ratio**

Append to `src/index.css`:

```css
.photo-band {
  margin: 0 -56px 56px;
  overflow: hidden;
}

.photo-band img {
  display: block;
  width: 100%;
  height: 340px;
  object-fit: cover;
  object-position: center 30%;
}

@media (max-width: 640px) {
  .photo-band {
    margin: 0 -20px 40px;
  }

  .photo-band img {
    height: 220px;
  }
}
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`

Expected: a full-width photo strip renders directly below the hero, cropped to a horizontal band, no layout shift/overflow scrollbar introduced. Resize to a narrow (mobile) width and confirm the band shrinks in height but stays full-bleed with no horizontal scrollbar.

- [ ] **Step 5: Commit**

```bash
git add src/components/PhotoBand.jsx src/App.jsx src/index.css src/assets/images/team-celebration.png
git commit -m "feat: add full-width photo band below hero"
```

---

### Task 3: Hero restyle

**Files:**
- Modify: `src/index.css` (`.hero-eyebrow`, `.hero-dates`, `.hero-ctas` rules; add `.hero h1`)

**Interfaces:**
- Consumes: `--color-bg`, `--color-text`, `--color-text-muted`, `--color-accent` from Task 1. No JSX changes — `src/components/Hero.jsx` content is already correct from the earlier copy-fix round.

- [ ] **Step 1: Replace the hero-specific rules**

Replace:

```css
.hero-eyebrow {
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-accent-muted);
  font-size: 12px;
  margin: 0;
}

.hero-dates {
  font-size: 16px;
  opacity: 0.9;
}

.hero-ctas {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
```

with:

```css
.hero {
  padding-top: 8px;
}

.hero-eyebrow {
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-accent);
  font-size: 12px;
  margin: 0 0 14px;
}

.hero h1 {
  font-size: 54px;
  line-height: 1.02;
  margin: 0;
  max-width: 680px;
}

.hero-dates {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-top: 18px;
}

.hero-ctas {
  display: flex;
  gap: 14px;
  margin-top: 28px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .hero h1 {
    font-size: 36px;
  }
}
```

- [ ] **Step 2: Update the shared button styles to match the mockup's sizing**

Replace:

```css
.btn {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  border: none;
}
```

with:

```css
.btn {
  display: inline-block;
  padding: 13px 24px;
  border-radius: 2px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
}
```

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`

Expected: large sans-serif headline in dark text on cream background, orange eyebrow label above it, two pill-ish buttons (solid orange primary, outlined secondary) below with visible gap.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: restyle hero and shared button sizing for editorial-minimal"
```

---

### Task 4: Season Details restyle (two-column grid)

**Files:**
- Modify: `src/components/SeasonDetails.jsx`
- Modify: `src/index.css` (`.season-details` rules)

**Interfaces:**
- Consumes: `--color-accent`, `--color-text-muted` from Task 1. Text content (labels/values) is unchanged from the current file — only the markup shape changes from a `<ul>` to a labeled grid.

- [ ] **Step 1: Replace the list markup with a labeled grid**

Replace the full file:

```jsx
export default function SeasonDetails() {
  return (
    <section className="season-details">
      <h2>Season Details</h2>
      <ul>
        <li><strong>Format:</strong> 7v7 coed, 25-minute halves</li>
        <li><strong>Schedule:</strong> Saturdays &amp; Sundays, 10:00am–1:00pm</li>
        <li><strong>Season:</strong> Sept 5 – Oct 11 (6 weeks)</li>
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
```

with:

```jsx
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
```

- [ ] **Step 2: Replace the CSS**

Replace:

```css
.season-details ul {
  list-style: none;
  padding: 0;
  line-height: 1.8;
}

.season-details a {
  color: var(--color-accent-muted);
}
```

with:

```css
.section-label {
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-accent);
  font-size: 12px;
  margin: 0 0 18px;
}

.season-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 40px;
  font-size: 16px;
}

.season-grid strong {
  display: block;
  margin-bottom: 4px;
}

.season-grid span {
  color: var(--color-text-muted);
}

.season-grid-full {
  grid-column: span 2;
}

.season-details a {
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .season-grid {
    grid-template-columns: 1fr;
  }

  .season-grid-full {
    grid-column: span 1;
  }
}
```

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`

Expected: "SEASON DETAILS" small orange label, then a two-column grid of format/schedule/season/playoffs, location spanning both columns underneath. Narrow the window below 640px and confirm it collapses to a single column.

- [ ] **Step 4: Commit**

```bash
git add src/components/SeasonDetails.jsx src/index.css
git commit -m "style: restyle season details as a labeled two-column grid"
```

---

### Task 5: Pricing restyle

**Files:**
- Modify: `src/components/Pricing.jsx`
- Modify: `src/index.css` (append `.pricing` rules)

**Interfaces:**
- Consumes: `.section-label` class from Task 4 (reused, not redefined).

- [ ] **Step 1: Replace the markup to split label/copy from the price callout**

Replace:

```jsx
export default function Pricing() {
  return (
    <section className="pricing">
      <h2>$60 Flat Fee</h2>
      <p>Covers your full season plus playoffs, including tax. No hidden fees.</p>
    </section>
  )
}
```

with:

```jsx
export default function Pricing() {
  return (
    <section className="pricing">
      <div>
        <p className="section-label">Pricing</p>
        <p className="pricing-copy">Covers your full season plus playoffs, including tax. No hidden fees.</p>
      </div>
      <div className="pricing-amount">
        $60<span>flat fee</span>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add the CSS**

Append to `src/index.css`:

```css
.pricing {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.pricing-copy {
  color: var(--color-text-muted);
  font-size: 15px;
  max-width: 420px;
  margin: 0;
}

.pricing-amount {
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -1px;
  white-space: nowrap;
}

.pricing-amount span {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-left: 6px;
}
```

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`

Expected: "PRICING" label with the tax/no-hidden-fees copy on the left, a large "$60 flat fee" callout on the right, wrapping to stack on narrow screens instead of overflowing.

- [ ] **Step 4: Commit**

```bash
git add src/components/Pricing.jsx src/index.css
git commit -m "style: restyle pricing section as label+copy vs. large amount callout"
```

---

### Task 6: Sign-up section restyle (shared box + all three states)

**Files:**
- Modify: `src/index.css` (`.signup-section`, `.thank-you`, `.join-team`, `.default-signup`, `.signup-option h3`, `.team-name-input`, `.team-link-row`, `.team-link-field`, `.secondary-link`, `.secondary-link a`)

**Interfaces:**
- Consumes: `--color-bg`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-border` from Task 1. No JSX changes in `SignUpSection.jsx`, `DefaultSignup.jsx`, `JoinTeam.jsx`, or `ThankYou.jsx` — all three states keep their current markup; only the shared classNames they already use get restyled.

- [ ] **Step 1: Replace the signup box and state-specific rules**

Replace:

```css
.signup-section {
  background: rgba(244, 241, 232, 0.05);
  border-radius: 8px;
  padding: 24px;
}

.thank-you, .join-team {
  text-align: center;
}

.default-signup {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.signup-option h3 {
  margin-bottom: 4px;
}
```

with:

```css
.signup-section {
  background: #ece7d9;
  border-radius: 4px;
  padding: 40px 48px;
}

.thank-you, .join-team {
  text-align: center;
}

.default-signup {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.signup-option h3 {
  margin-bottom: 4px;
}
```

- [ ] **Step 2: Replace the form-field and secondary-link rules to use the light-theme border/text colors**

Replace:

```css
.team-name-input {
  display: block;
  width: 100%;
  max-width: 320px;
  padding: 10px 12px;
  margin: 12px 0;
  border-radius: 4px;
  border: 1.5px solid var(--color-text);
  background: transparent;
  color: var(--color-text);
  font-size: 14px;
}

.team-link-row {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  max-width: 480px;
}

.team-link-field {
  flex: 1;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1.5px solid var(--color-text);
  background: transparent;
  color: var(--color-text);
  font-size: 13px;
}

.secondary-link {
  margin-top: 16px;
  font-size: 14px;
}

.secondary-link a {
  color: var(--color-text);
  opacity: 0.75;
}
```

with:

```css
.team-name-input {
  display: block;
  width: 100%;
  max-width: 320px;
  padding: 10px 12px;
  margin: 12px 0;
  border-radius: 2px;
  border: 1.5px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
  font-size: 14px;
}

.team-link-row {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  max-width: 480px;
}

.team-link-field {
  flex: 1;
  padding: 10px 12px;
  border-radius: 2px;
  border: 1.5px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
  font-size: 13px;
}

.secondary-link {
  margin-top: 16px;
  font-size: 14px;
}

.secondary-link a {
  color: var(--color-text);
  opacity: 0.65;
}
```

- [ ] **Step 3: Verify all three sign-up states in the browser**

Run: `npm run dev`

Expected checks (use the URL query params to force each state):
- Default: `http://localhost:5173/` → free agent + register-a-team form render inside a light `#ece7d9` box, input fields have white backgrounds with a visible light border.
- Team-join: `http://localhost:5173/?team=Test%20Team` → "You're joining Test Team" centered, orange CTA button, muted secondary link below.
- Thank-you: `http://localhost:5173/?success=true` → "You're in! 🎉" centered with the same box styling.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: restyle sign-up section box and form fields for editorial-minimal"
```

---

### Task 7: Footer restyle

**Files:**
- Modify: `src/index.css` (`.footer`, `.footer a`)

**Interfaces:**
- Consumes: `--color-border`, `--color-text-muted` from Task 1. No JSX changes.

- [ ] **Step 1: Replace the footer rules**

Replace:

```css
.footer {
  border-top: 1px solid rgba(244, 241, 232, 0.2);
  margin-top: 60px;
  padding-top: 20px;
  font-size: 14px;
}

.footer a {
  color: var(--color-accent-muted);
}
```

with:

```css
.footer {
  border-top: 1px solid var(--color-border);
  margin-top: 60px;
  padding-top: 20px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.footer a {
  color: var(--color-accent);
}
```

- [ ] **Step 2: Confirm no CSS references to the removed token remain**

Run: `grep -n "color-accent-muted" src/index.css`

Expected: no output (all three original references — hero eyebrow, season-details links, footer links — have now been replaced across Tasks 3, 4, and this task).

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`

Expected: muted footer text above a thin light border, contact email link in orange.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: restyle footer for editorial-minimal palette"
```

---

### Task 8: Full-page manual QA pass

**Files:**
- None (verification-only task; fixes any issues found go back into the relevant task's files).

- [ ] **Step 1: Production build sanity check**

Run: `npm run build`

Expected: build succeeds with no errors/warnings about the new image import or removed CSS variable.

- [ ] **Step 2: Full-page visual walkthrough at desktop width**

Run: `npm run dev`, open `http://localhost:5173/` in a browser at a wide window (~1200px+).

Checklist:
- Hero → photo band → season details → pricing → sign-up → footer all flow with consistent cream background and no dark-theme leftovers (spot-check for any remaining `#0d2818`/`#f4f1e8` looking colors).
- No horizontal scrollbar.
- All three sign-up states (`/`, `?team=X`, `?success=true`) still render correctly and the "Copy" button still works for the generated team link.

- [ ] **Step 3: Mobile-width walkthrough**

In the browser, resize to ~375px wide (or use device toolbar).

Checklist:
- Hero headline drops to the smaller mobile size (Task 3) without overflowing.
- Photo band stays full-bleed with no gutters/scrollbar.
- Season details grid collapses to one column.
- Pricing section stacks instead of overflowing.
- CTAs wrap instead of getting clipped.

- [ ] **Step 4: Fix any issues found**

If the walkthrough surfaces a problem, fix it in the relevant task's file (e.g. a spacing tweak belongs in that task's CSS block) and commit it as its own small fix — don't bundle unrelated changes.

- [ ] **Step 5: Push**

```bash
git push
```

Expected: AWS Amplify picks up the push to `master` and deploys automatically — confirm the live site once the Amplify build finishes.
