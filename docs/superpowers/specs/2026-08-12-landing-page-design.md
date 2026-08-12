# Walk-On Social — Landing Page Design

## Overview

A single-page React landing site for **Walk-On Social**, an adult rec soccer league. Purpose: let players register (as free agents or as part of a team) and pay online. No backend, no database — Stripe is the system of record for who's registered, and the site owner reconciles free-agent-vs-team assignments manually from Stripe's dashboard/exports.

## Season Details (v1 — soccer only)

- **Format:** 7v7 coed, 25-minute halves
- **Schedule:** Saturdays and Sundays, 10:00am–1:00pm
- **Season:** Sept 5 – Oct 11 (6 weeks)
- **Playoffs:** Oct 17–18
- **Location:** Lakewood Memorial Field, 7655 W 10th Ave, Lakewood, CO 80214
- **Price:** $60 flat fee per player, including tax (covers full season + playoffs)

## Architecture

- **Stack:** Vite + React, single page, no router library (client-side "routing" is just reading URL query params).
- **No backend, no database.** All state lives in the URL and in Stripe's own dashboard/data after payment.
- **Payments:** Stripe Payment Links — one link for the $60 season registration product, created manually in the Stripe Dashboard. The app never calls the Stripe API; it only builds URLs to this link with a `client_reference_id` query param appended to tag each payment as a specific team or "Free Agent."
- **Hosting:** AWS Amplify Hosting, connected to `cantstoptheunk/walkonsocial` on GitHub, auto-deploy on push to `master`. Build command `npm run build`, output `dist/`.
- **Config:** Stripe Payment Link base URL is an Amplify build-time environment variable (not a secret — Payment Links are meant to be shared publicly).

### Why query-param routing over path-based routing

Path-based URLs (`/team/kickback-fc`) look nicer but require a router library plus a host-level SPA rewrite rule so a page refresh on a deep path doesn't 404. Query-param URLs (`/?team=kickback-fc`) need neither — every request hits the same `/` route Amplify already serves by default, and the "routing" is just three states of one component based on `URLSearchParams`. Chosen for simplicity; the shared-link UX is identical either way.

## Visual Style — "Editorial Minimal"

Redesigned from the original "Bold Turf" look toward a cleaner, more editorial feel (loosely inspired by moheim.com — a minimal, photography-forward product site — without copying it directly).

- **Palette:** cream/off-white background (`#f2efe6`), near-black text (`#1f2d22`), the existing burnt-orange (`#e8542e`) kept as the sole accent for CTAs and highlighted labels. No sage-green or other new accent color introduced — the brand orange carries over from the original dark theme.
- **Typography:** large, bold sans-serif headlines (not serif) — chosen over a serif treatment as the closer match to the editorial-minimal reference. Body copy in a lighter-weight sans-serif for contrast.
- **Layout width:** widened from the original narrow single column (`max-width: 720px`) to a more spacious ~960–1100px container with generous side margins, to give the editorial-minimal type and photography room to breathe.
- **Photography:** a full-width photo band of real team/league photography sits directly below the hero (hero itself stays pure type — no photo bleed into it). One additional real photo may be added lower on the page (e.g. near sign-up or season details) so the "real community" feeling isn't carried by a single hero image alone. Actual photography to be sourced/confirmed before implementation — mockups used a placeholder reference image, not confirmed Walk-On Social photography.
- **Tone:** still "this is a real league," but calmer and more polished than the original high-contrast turf look — clean, modern, image-forward rather than loud.

## Page Structure

One scrolling page:

1. **Hero** — pure-type hero: eyebrow label, large "Adult Coed Rec Soccer. Saturdays & Sundays." headline, season dates at a glance, two primary CTAs: **Sign Up as Free Agent** and **Register a Team**
2. **Photo band** — full-width real photography, directly below the hero, no copy overlaid
3. **Season Details** — format (7v7 coed), schedule, 6 weeks + playoffs, location with a Google Maps link
4. **Pricing** — "$60 Flat Fee" callout, one line noting it includes tax and what it covers
5. **Sign Up** — the interactive section; see [Sign-Up Flow](#sign-up--team-link-data-flow) below
6. **Footer** — contact email (walkonsocial@gmail.com), one-line FAQ ("Free agent? We'll place you on a team.")

## Sign-Up & Team-Link Data Flow

On load, the app reads `window.location.search` for `team` and `success` params. Exactly one of three states renders in the Sign Up section, checked in this order — `success` takes priority if somehow both are present:

**Case A — `?success=true`** (Stripe redirects here after payment; configured once in the Payment Link's "after payment" setting in the Stripe Dashboard):
- Replaces the sign-up section with: *"You're in! 🎉 Thanks for registering — check your email for your Stripe receipt."*
- Generic, not team-specific (the redirect URL is fixed in Stripe's dashboard config, not dynamic per request).

**Case B — `?team=<name>` present** (someone opened a link a captain shared):
- Decode and trim the name, show a banner: *"You're joining **\<name>**"*
- One CTA: **Register & Pay – $60** → navigates to the Stripe Payment Link with `?client_reference_id=<encoded name>` appended

**Case C — no params** (default landing view):
- **Free Agent** button → Stripe Payment Link with `?client_reference_id=Free%20Agent` (tagged explicitly so FA payments are just as filterable in Stripe as team payments)
- **Register a Team** mini-form:
  - Text input for team name (max 20 characters)
  - **Generate Link** → builds `https://<domain>/?team=<encoded name>` client-side, shown in a copyable field for the captain to share with their roster
  - A **Register & Pay – $60** CTA also appears here for the captain themselves, tagged with that same team name

Every payment — FA or team — becomes a row in Stripe filterable by `client_reference_id`. The app does no tracking of roster size, team fullness, or FA-vs-team bookkeeping; that's done manually from Stripe's data.

## Error Handling & Edge Cases

No backend means no failure modes to recover from — this is entirely defensive input handling:

- **Empty/whitespace team name** → disable "Generate Link" / "Register & Pay" until non-empty
- **Team name over 20 characters** → hard cap at the input level
- **Malformed/missing `team` param** → falls back to Case C rather than erroring
- **Team name rendering** → React renders it as text by default (no `dangerouslySetInnerHTML`), so no XSS concern
- **Duplicate team names** (two captains pick the same name) → explicitly out of scope; reconciled manually by the site owner

Anything not caught at the input form is expected to fail naturally with no special handling — there's no state to corrupt and no downstream system to protect beyond Stripe itself.

## Testing

Given the risk surface (a static page that links out to Stripe, no backend), testing is intentionally light and written **after** the feature is built, not test-first:

- Unit tests (Vitest) for the pure logic only: parsing `team`/`success` query params, building the shareable team link, and the 20-character validation
- No component or e2e suite — manual click-through QA before each deploy covers more ground per minute than automated UI tests would for a page this size
- Manual QA checklist before going live: FA flow tags correctly in Stripe, team-link generation + join banner works, success screen shows post-payment, mobile layout (links get shared and opened on phones)

## Deployment

AWS Amplify Hosting, connected to `cantstoptheunk/walkonsocial`, auto-deploy on push to `master`. Stripe Payment Link base URL set as an Amplify environment variable. Custom domain attached once purchased/settled on.

## Explicitly Out of Scope (v1)

- Backend, database, or any server-side logic
- Live roster/capacity tracking or "spots left" indicators
- Duplicate team name detection/prevention
- Sports other than soccer, or weekday leagues
- Automated FA-to-team assignment (handled manually by the site owner)
