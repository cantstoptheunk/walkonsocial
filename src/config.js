export const STRIPE_PAYMENT_LINK_URL = import.meta.env.VITE_STRIPE_PAYMENT_LINK

if (!STRIPE_PAYMENT_LINK_URL) {
  throw new Error(
    'VITE_STRIPE_PAYMENT_LINK is not set. Add it to .env.local (see .env.example) for local dev, or set it in the Amplify app\'s environment variables for production.'
  )
}
