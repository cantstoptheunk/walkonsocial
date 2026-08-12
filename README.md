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
2. Under the Payment Link's "After payment" settings, set the redirect to `https://walkonsocial.com/?success=true`.
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
