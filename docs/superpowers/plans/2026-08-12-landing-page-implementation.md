# Walk-On Social Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a single-page Vite + React landing site for Walk-On Social that lets players sign up as a free agent or register/join a team, paying via Stripe Payment Links, with zero backend.

**Architecture:** One Vite + React SPA with no router library — the Sign Up section reads `team`/`success` from `window.location.search` and renders one of three states. All payment data flows through Stripe Payment Links tagged with a `client_reference_id` query param; there is no backend, database, or API layer. Deploys to AWS Amplify Hosting on push to `master`.

**Tech Stack:** Vite, React 18, plain CSS (no CSS framework), Vitest (added in the final task only).

## Global Constraints

- No backend, no database. All state lives in the URL or in Stripe's own dashboard/data.
- Unit tests are written **after** implementation is complete and manually verified — not TDD-first. This plan intentionally omits "write failing test" steps from every task except the final one.
- Team name max length: **20 characters**, enforced at the input level.
- Visual style "Bold Turf": background `#0d2818`, text `#f4f1e8`, accent `#e8542e`, muted accent `#8fd19e`.
- Contact email: `walkonsocial@gmail.com`.
- Season copy: 7v7, 25-minute halves, Saturdays & Sundays 10:00am–1:00pm, Sept 5–6 / 12–13 / 19–20 / 26–27, Oct 3–4 / 10–11 (6 weeks), playoffs Oct 17–18. Location: Lakewood Memorial Field, 7655 W 10th Ave, Lakewood, CO 80214. Price: $60 all-in.
- Hosting: AWS Amplify Hosting, connected to `cantstoptheunk/walkonsocial`, auto-deploy on push to `master`, build command `npm run build`, output `dist/`.
- Stripe Payment Link base URL is read from the `VITE_STRIPE_PAYMENT_LINK` env var (not a secret — Payment Links are meant to be shared).
- **Every task ends with `git add` + `git commit` + `git push origin master`** from `/Users/ryun.song/projects/walkonsocial` — this is a standing instruction, not optional, and is repeated in every task's final step.

---

## File Structure

- `package.json`, `vite.config.js`, `index.html` — Vite + React project scaffold
- `src/main.jsx` — mounts `<App />`
- `src/index.css` — global styles: CSS variables for the Bold Turf palette, reset, `.app` container, `.btn` variants, section spacing
- `src/App.jsx` — top-level layout: renders Hero, SeasonDetails, Pricing, SignUpSection, Footer in order
- `src/config.js` — reads `VITE_STRIPE_PAYMENT_LINK` from `import.meta.env`
- `src/lib/signup.js` — pure logic: `getSignupState`, `isValidTeamName`, `buildTeamLink`, `buildPaymentUrl`, `MAX_TEAM_NAME_LENGTH`
- `src/lib/signup.test.js` — Vitest unit tests for the above (final task only)
- `src/components/Hero.jsx` — wordmark, tagline, dates, two CTA anchors linking to `#signup`
- `src/components/SeasonDetails.jsx` — format/schedule/season/playoffs/location list
- `src/components/Pricing.jsx` — "$60 all-in" callout
- `src/components/SignUpSection.jsx` — reads signup state, switches between `ThankYou` / `JoinTeam` / `DefaultSignup`
- `src/components/ThankYou.jsx` — post-payment thank-you message (Case A)
- `src/components/JoinTeam.jsx` — join-a-specific-team banner + pay CTA (Case B)
- `src/components/DefaultSignup.jsx` — Free Agent CTA + team registration mini-form (Case C)
- `src/components/Footer.jsx` — contact email + FAQ line
- `amplify.yml` — Amplify Hosting build spec
- `.env.example` — documents `VITE_STRIPE_PAYMENT_LINK`
- `README.md` — setup, local dev, Stripe Payment Link creation notes, deploy notes

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a running Vite dev server rendering `<App />`; `.app` container class and `.btn`/`.btn-primary`/`.btn-secondary` classes other tasks will use; CSS variables `--color-bg`, `--color-text`, `--color-accent`, `--color-accent-muted`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "walkonsocial",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Walk-On Social</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create `src/index.css`**

```css
:root {
  --color-bg: #0d2818;
  --color-text: #f4f1e8;
  --color-accent: #e8542e;
  --color-accent-muted: #8fd19e;
}

* {
  box-sizing: border-box;
}

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

.btn-primary {
  background: var(--color-accent);
  color: #fff;
}

.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1.5px solid var(--color-text);
}
```

- [ ] **Step 5: Create `src/App.jsx` (placeholder)**

```jsx
export default function App() {
  return (
    <div className="app">
      <h1>Walk-On Social</h1>
    </div>
  )
}
```

- [ ] **Step 6: Create `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 7: Install dependencies and verify the dev server**

Run: `cd /Users/ryun.song/projects/walkonsocial && npm install && npm run dev`
Expected: Vite prints a local URL (e.g. `http://localhost:5173/`). Open it and confirm the page shows a dark-green background with the "Walk-On Social" heading in cream text. Stop the server with Ctrl+C once confirmed.

- [ ] **Step 8: Commit and push**

```bash
cd /Users/ryun.song/projects/walkonsocial
git add package.json package-lock.json vite.config.js index.html src/main.jsx src/App.jsx src/index.css
git commit -m "feat: scaffold Vite + React project"
git push origin master
```

---

### Task 2: Core Signup Logic

**Files:**
- Create: `src/lib/signup.js`
- Create: `src/config.js`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `MAX_TEAM_NAME_LENGTH: number` (20)
  - `getSignupState(search?: string): { type: 'success' } | { type: 'team', name: string } | { type: 'default' }` — defaults `search` to `window.location.search`
  - `isValidTeamName(name: string): boolean`
  - `buildTeamLink(name: string, origin?: string): string` — defaults `origin` to `window.location.origin`
  - `buildPaymentUrl(paymentLinkBaseUrl: string, clientReferenceId: string): string`
  - `STRIPE_PAYMENT_LINK_URL: string` from `src/config.js`

- [ ] **Step 1: Create `src/config.js`**

```js
export const STRIPE_PAYMENT_LINK_URL = import.meta.env.VITE_STRIPE_PAYMENT_LINK
```

- [ ] **Step 2: Create `src/lib/signup.js`**

```js
export const MAX_TEAM_NAME_LENGTH = 20

export function getSignupState(search = window.location.search) {
  const params = new URLSearchParams(search)

  if (params.get('success') === 'true') {
    return { type: 'success' }
  }

  const team = params.get('team')
  if (team && team.trim().length > 0) {
    return { type: 'team', name: team.trim() }
  }

  return { type: 'default' }
}

export function isValidTeamName(name) {
  const trimmed = name.trim()
  return trimmed.length > 0 && trimmed.length <= MAX_TEAM_NAME_LENGTH
}

export function buildTeamLink(name, origin = window.location.origin) {
  return `${origin}/?team=${encodeURIComponent(name.trim())}`
}

export function buildPaymentUrl(paymentLinkBaseUrl, clientReferenceId) {
  return `${paymentLinkBaseUrl}?client_reference_id=${encodeURIComponent(clientReferenceId)}`
}
```

- [ ] **Step 3: Manually verify the logic with a throwaway Node script**

Run:
```bash
cd /Users/ryun.song/projects/walkonsocial
node --input-type=module -e "
import { getSignupState, buildTeamLink, buildPaymentUrl, isValidTeamName, MAX_TEAM_NAME_LENGTH } from './src/lib/signup.js';
console.log(getSignupState('?success=true'));
console.log(getSignupState('?team=Kickback%20FC'));
console.log(getSignupState('?success=true&team=Kickback%20FC'));
console.log(getSignupState(''));
console.log(buildTeamLink('Kickback FC', 'https://walkonsocial.com'));
console.log(buildPaymentUrl('https://buy.stripe.com/test_abc', 'Free Agent'));
console.log(isValidTeamName('Kickback FC'), isValidTeamName(''), isValidTeamName('a'.repeat(21)), MAX_TEAM_NAME_LENGTH);
"
```
Expected output (in order):
```
{ type: 'success' }
{ type: 'team', name: 'Kickback FC' }
{ type: 'success' }
{ type: 'default' }
https://walkonsocial.com/?team=Kickback%20FC
https://buy.stripe.com/test_abc?client_reference_id=Free%20Agent
true false false 20
```

- [ ] **Step 4: Commit and push**

```bash
cd /Users/ryun.song/projects/walkonsocial
git add src/lib/signup.js src/config.js
git commit -m "feat: add core signup logic (query param parsing, link building, validation)"
git push origin master
```

---

### Task 3: Hero, Season Details, and Pricing Sections

**Files:**
- Create: `src/components/Hero.jsx`
- Create: `src/components/SeasonDetails.jsx`
- Create: `src/components/Pricing.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: nothing (static content components)
- Produces: `<Hero />`, `<SeasonDetails />`, `<Pricing />` — no props, no exported functions beyond the default component export

- [ ] **Step 1: Create `src/components/Hero.jsx`**

```jsx
export default function Hero() {
  return (
    <header className="hero">
      <p className="hero-eyebrow">Walk-On Social</p>
      <h1>Adult Rec Soccer. Saturdays &amp; Sundays.</h1>
      <p className="hero-dates">Sept 5 – Oct 11 + Playoffs</p>
      <div className="hero-ctas">
        <a href="#signup" className="btn btn-primary">Sign Up as Free Agent</a>
        <a href="#signup" className="btn btn-secondary">Register a Team</a>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create `src/components/SeasonDetails.jsx`**

```jsx
export default function SeasonDetails() {
  return (
    <section className="season-details">
      <h2>Season Details</h2>
      <ul>
        <li><strong>Format:</strong> 7v7, 25-minute halves</li>
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

- [ ] **Step 3: Create `src/components/Pricing.jsx`**

```jsx
export default function Pricing() {
  return (
    <section className="pricing">
      <h2>$60 All-In</h2>
      <p>Covers your full season plus playoffs. No hidden fees.</p>
    </section>
  )
}
```

- [ ] **Step 4: Add hero-specific styles to `src/index.css`**

Append:
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

.season-details ul {
  list-style: none;
  padding: 0;
  line-height: 1.8;
}

.season-details a {
  color: var(--color-accent-muted);
}
```

- [ ] **Step 5: Wire the new sections into `src/App.jsx`**

```jsx
import Hero from './components/Hero'
import SeasonDetails from './components/SeasonDetails'
import Pricing from './components/Pricing'

export default function App() {
  return (
    <div className="app">
      <Hero />
      <SeasonDetails />
      <Pricing />
    </div>
  )
}
```

- [ ] **Step 6: Verify in the browser**

Run: `npm run dev`, open the printed URL.
Expected: Hero with wordmark/heading/dates/two buttons, Season Details list with a clickable Google Maps link, and the "$60 All-In" pricing callout, all in the Bold Turf palette. Stop the server once confirmed.

- [ ] **Step 7: Commit and push**

```bash
cd /Users/ryun.song/projects/walkonsocial
git add src/components/Hero.jsx src/components/SeasonDetails.jsx src/components/Pricing.jsx src/App.jsx src/index.css
git commit -m "feat: add Hero, Season Details, and Pricing sections"
git push origin master
```

---

### Task 4: Footer

**Files:**
- Create: `src/components/Footer.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: nothing
- Produces: `<Footer />` — no props

- [ ] **Step 1: Create `src/components/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer className="footer">
      <p>Questions? Email <a href="mailto:walkonsocial@gmail.com">walkonsocial@gmail.com</a></p>
      <p>Free agent? We'll place you on a team.</p>
    </footer>
  )
}
```

- [ ] **Step 2: Add footer styles to `src/index.css`**

Append:
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

- [ ] **Step 3: Wire `Footer` into `src/App.jsx`**

```jsx
import Hero from './components/Hero'
import SeasonDetails from './components/SeasonDetails'
import Pricing from './components/Pricing'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="app">
      <Hero />
      <SeasonDetails />
      <Pricing />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`, open the printed URL.
Expected: Footer appears below Pricing with a mailto link to `walkonsocial@gmail.com` and the FAQ line. Stop the server once confirmed.

- [ ] **Step 5: Commit and push**

```bash
cd /Users/ryun.song/projects/walkonsocial
git add src/components/Footer.jsx src/App.jsx src/index.css
git commit -m "feat: add Footer section"
git push origin master
```

---

### Task 5: Sign Up Section Shell — Success and Team-Join Cases

**Files:**
- Create: `src/components/SignUpSection.jsx`
- Create: `src/components/ThankYou.jsx`
- Create: `src/components/JoinTeam.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `getSignupState` from `src/lib/signup.js` (Task 2), `buildPaymentUrl` from `src/lib/signup.js` (Task 2), `STRIPE_PAYMENT_LINK_URL` from `src/config.js` (Task 2)
- Produces: `<SignUpSection />` (no props, mounted with `id="signup"`), `<ThankYou />` (no props), `<JoinTeam name: string, paymentLinkBaseUrl: string />`

- [ ] **Step 1: Create `src/components/ThankYou.jsx`**

```jsx
export default function ThankYou() {
  return (
    <div className="thank-you">
      <h2>You're in! 🎉</h2>
      <p>Thanks for registering — check your email for your Stripe receipt.</p>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/JoinTeam.jsx`**

```jsx
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
```

- [ ] **Step 3: Create `src/components/SignUpSection.jsx`**

```jsx
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
```

- [ ] **Step 4: Add signup section styles to `src/index.css`**

Append:
```css
.signup-section {
  background: rgba(244, 241, 232, 0.05);
  border-radius: 8px;
  padding: 24px;
}

.thank-you, .join-team {
  text-align: center;
}
```

- [ ] **Step 5: Wire `SignUpSection` into `src/App.jsx`**

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

- [ ] **Step 6: Verify in the browser**

Run: `echo "VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_placeholder" > .env.local && npm run dev`
Open:
- `http://localhost:5173/?success=true` → expect "You're in! 🎉" thank-you message
- `http://localhost:5173/?team=Kickback%20FC` → expect "You're joining Kickback FC" with a "Register & Pay – $60" button whose href is `https://buy.stripe.com/test_placeholder?client_reference_id=Kickback%20FC`
- `http://localhost:5173/?success=true&team=Kickback%20FC` → expect the thank-you message (success takes priority)
- `http://localhost:5173/` → expect the "Sign-up form coming in the next task." placeholder

Stop the server once confirmed.

- [ ] **Step 7: Commit and push**

```bash
cd /Users/ryun.song/projects/walkonsocial
git add src/components/SignUpSection.jsx src/components/ThankYou.jsx src/components/JoinTeam.jsx src/App.jsx src/index.css
git commit -m "feat: add Sign Up section with success and team-join cases"
git push origin master
```

---

### Task 6: Default Sign-Up — Free Agent and Team Registration

**Files:**
- Create: `src/components/DefaultSignup.jsx`
- Modify: `src/components/SignUpSection.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `buildPaymentUrl`, `buildTeamLink`, `isValidTeamName`, `MAX_TEAM_NAME_LENGTH` from `src/lib/signup.js` (Task 2)
- Produces: `<DefaultSignup paymentLinkBaseUrl: string />`

- [ ] **Step 1: Create `src/components/DefaultSignup.jsx`**

```jsx
import { useState } from 'react'
import { buildPaymentUrl, buildTeamLink, isValidTeamName, MAX_TEAM_NAME_LENGTH } from '../lib/signup'

export default function DefaultSignup({ paymentLinkBaseUrl }) {
  const [teamName, setTeamName] = useState('')
  const [copied, setCopied] = useState(false)

  const valid = isValidTeamName(teamName)
  const teamLink = valid ? buildTeamLink(teamName) : ''
  const payUrl = valid ? buildPaymentUrl(paymentLinkBaseUrl, teamName.trim()) : ''
  const faPayUrl = buildPaymentUrl(paymentLinkBaseUrl, 'Free Agent')

  function handleNameChange(event) {
    setTeamName(event.target.value.slice(0, MAX_TEAM_NAME_LENGTH))
    setCopied(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(teamLink)
    setCopied(true)
  }

  return (
    <div className="default-signup">
      <div className="signup-option">
        <h3>Free Agent</h3>
        <p>No team? We'll place you on one.</p>
        <a href={faPayUrl} className="btn btn-primary">Sign Up as Free Agent – $60</a>
      </div>

      <div className="signup-option">
        <h3>Register a Team</h3>
        <input
          type="text"
          className="team-name-input"
          value={teamName}
          onChange={handleNameChange}
          placeholder="Team name"
          maxLength={MAX_TEAM_NAME_LENGTH}
        />
        {valid && (
          <>
            <div className="team-link-row">
              <input type="text" readOnly value={teamLink} className="team-link-field" />
              <button type="button" className="btn btn-secondary" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <a href={payUrl} className="btn btn-primary">Register &amp; Pay – $60</a>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire `DefaultSignup` into `src/components/SignUpSection.jsx`**

```jsx
import { getSignupState } from '../lib/signup'
import { STRIPE_PAYMENT_LINK_URL } from '../config'
import ThankYou from './ThankYou'
import JoinTeam from './JoinTeam'
import DefaultSignup from './DefaultSignup'

export default function SignUpSection() {
  const state = getSignupState()

  return (
    <section id="signup" className="signup-section">
      {state.type === 'success' && <ThankYou />}
      {state.type === 'team' && (
        <JoinTeam name={state.name} paymentLinkBaseUrl={STRIPE_PAYMENT_LINK_URL} />
      )}
      {state.type === 'default' && (
        <DefaultSignup paymentLinkBaseUrl={STRIPE_PAYMENT_LINK_URL} />
      )}
    </section>
  )
}
```

- [ ] **Step 3: Add default-signup styles to `src/index.css`**

Append:
```css
.default-signup {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.signup-option h3 {
  margin-bottom: 4px;
}

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
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev` (with `.env.local` from Task 5 still in place), open `http://localhost:5173/`.
Expected:
- "Free Agent" button href is `https://buy.stripe.com/test_placeholder?client_reference_id=Free%20Agent`
- Typing a team name shows the generated link (`http://localhost:5173/?team=<encoded name>`) and a "Register & Pay – $60" button whose href includes `client_reference_id=<encoded name>`
- Typing more than 20 characters is blocked at the input
- Clicking "Copy" changes the button label to "Copied!" and puts the link on the clipboard
- Clearing the input hides the link/pay button again

Stop the server once confirmed.

- [ ] **Step 5: Commit and push**

```bash
cd /Users/ryun.song/projects/walkonsocial
git add src/components/DefaultSignup.jsx src/components/SignUpSection.jsx src/index.css
git commit -m "feat: add Free Agent and team registration sign-up flow"
git push origin master
```

---

### Task 7: Amplify Deployment Config and Docs

**Files:**
- Create: `amplify.yml`
- Create: `.env.example`
- Create: `README.md`

**Interfaces:**
- Consumes: nothing
- Produces: nothing consumed by later tasks (deployment/docs only)

- [ ] **Step 1: Create `amplify.yml`**

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

- [ ] **Step 2: Create `.env.example`**

```
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/xxxxxxxx
```

- [ ] **Step 3: Create `README.md`**

```markdown
# Walk-On Social

Landing page for Walk-On Social, an adult rec soccer league in Lakewood, CO. Vite + React, no backend — payments go through Stripe Payment Links.

## Local development

```bash
npm install
cp .env.example .env.local
# edit .env.local with your real Stripe Payment Link URL
npm run dev
```

## Setting up the Stripe Payment Link

1. In the Stripe Dashboard, create a Payment Link for the $60 season registration product.
2. Under the Payment Link's "After payment" settings, set the redirect to `https://<your-domain>/?success=true`.
3. Copy the Payment Link URL into `VITE_STRIPE_PAYMENT_LINK` (locally in `.env.local`, and in Amplify's environment variables for production).

Every registration — free agent or team — is tagged with a `client_reference_id` query param on the Payment Link (`Free Agent` or the team name), filterable in the Stripe Dashboard/exports. Reconciling who's a free agent vs. on a team is done manually from that data.

## Deployment

Hosted on AWS Amplify Hosting, connected to this repo's `master` branch. Amplify auto-deploys on every push to `master` using the build spec in `amplify.yml` (`npm run build`, output `dist/`). Set `VITE_STRIPE_PAYMENT_LINK` as an environment variable in the Amplify app settings.

## Tests

```bash
npm test
```

Unit tests cover the pure logic in `src/lib/signup.js` only (query param parsing, team link building, name validation). No component or e2e suite — manual click-through QA before each deploy.

## Manual QA checklist (before going live)

- [ ] Free Agent button tags the Stripe payment with `client_reference_id=Free Agent`
- [ ] Team-link generation works, and opening that link on another device/browser shows the correct join banner
- [ ] Success screen (`?success=true`) shows after completing a real test payment
- [ ] Mobile layout looks right — links get shared and opened on phones
```

- [ ] **Step 4: Verify the production build**

Run: `cd /Users/ryun.song/projects/walkonsocial && npm run build`
Expected: build succeeds and creates a `dist/` directory with `index.html` and bundled JS/CSS inside.

- [ ] **Step 5: Commit and push**

```bash
cd /Users/ryun.song/projects/walkonsocial
git add amplify.yml .env.example README.md
git commit -m "docs: add Amplify build config, env example, and README"
git push origin master
```

---

### Task 8: Unit Tests for Signup Logic

**Files:**
- Create: `src/lib/signup.test.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: `getSignupState`, `isValidTeamName`, `buildTeamLink`, `buildPaymentUrl`, `MAX_TEAM_NAME_LENGTH` from `src/lib/signup.js` (Task 2) — unchanged since that task
- Produces: nothing (final task)

- [ ] **Step 1: Install Vitest**

Run: `cd /Users/ryun.song/projects/walkonsocial && npm install --save-dev vitest`

- [ ] **Step 2: Add the `test` script to `package.json`**

Modify the `scripts` block:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Write `src/lib/signup.test.js`**

```js
import { describe, expect, it } from 'vitest'
import {
  MAX_TEAM_NAME_LENGTH,
  buildPaymentUrl,
  buildTeamLink,
  getSignupState,
  isValidTeamName,
} from './signup'

describe('getSignupState', () => {
  it('returns success when ?success=true', () => {
    expect(getSignupState('?success=true')).toEqual({ type: 'success' })
  })

  it('returns team with the trimmed, decoded name when ?team=<name>', () => {
    expect(getSignupState('?team=Kickback%20FC')).toEqual({ type: 'team', name: 'Kickback FC' })
  })

  it('prioritizes success over team when both params are present', () => {
    expect(getSignupState('?success=true&team=Kickback%20FC')).toEqual({ type: 'success' })
  })

  it('returns default when there are no recognized params', () => {
    expect(getSignupState('')).toEqual({ type: 'default' })
  })

  it('returns default when team is present but blank', () => {
    expect(getSignupState('?team=%20%20')).toEqual({ type: 'default' })
  })
})

describe('isValidTeamName', () => {
  it('accepts a normal name', () => {
    expect(isValidTeamName('Kickback FC')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(isValidTeamName('')).toBe(false)
  })

  it('rejects a whitespace-only string', () => {
    expect(isValidTeamName('   ')).toBe(false)
  })

  it(`accepts a name exactly ${MAX_TEAM_NAME_LENGTH} characters long`, () => {
    expect(isValidTeamName('a'.repeat(MAX_TEAM_NAME_LENGTH))).toBe(true)
  })

  it(`rejects a name longer than ${MAX_TEAM_NAME_LENGTH} characters`, () => {
    expect(isValidTeamName('a'.repeat(MAX_TEAM_NAME_LENGTH + 1))).toBe(false)
  })
})

describe('buildTeamLink', () => {
  it('builds a URL-encoded team link against the given origin', () => {
    expect(buildTeamLink('Kickback FC', 'https://walkonsocial.com')).toBe(
      'https://walkonsocial.com/?team=Kickback%20FC'
    )
  })

  it('trims the name before encoding', () => {
    expect(buildTeamLink('  Kickback FC  ', 'https://walkonsocial.com')).toBe(
      'https://walkonsocial.com/?team=Kickback%20FC'
    )
  })
})

describe('buildPaymentUrl', () => {
  it('appends an encoded client_reference_id to the base URL', () => {
    expect(buildPaymentUrl('https://buy.stripe.com/test_abc', 'Free Agent')).toBe(
      'https://buy.stripe.com/test_abc?client_reference_id=Free%20Agent'
    )
  })

  it('encodes a team name with special characters', () => {
    expect(buildPaymentUrl('https://buy.stripe.com/test_abc', 'FC & Friends')).toBe(
      'https://buy.stripe.com/test_abc?client_reference_id=FC%20%26%20Friends'
    )
  })
})
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test`
Expected: all tests pass (5 + 5 + 2 + 2 = 14 tests), 0 failures.

- [ ] **Step 5: Commit and push**

```bash
cd /Users/ryun.song/projects/walkonsocial
git add package.json package-lock.json src/lib/signup.test.js
git commit -m "test: add unit tests for signup logic"
git push origin master
```
