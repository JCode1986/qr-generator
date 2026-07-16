# QuickQR

QR codes made fast, clean, and customizable.

QuickQR is a JavaScript-first Next.js app for creating static QR codes in the browser. It supports live QR generation, design controls, logo preview, PNG/SVG exports, and a Stripe-powered one-time Pro checkout for premium exports.

## Implemented Features

- URL and plain-text static QR generation
- Email, phone, Wi-Fi, multiline, Unicode, and emoji content support
- Live QR preview
- Foreground and background colors
- QR size, margin, and error-correction controls
- Logo upload preview with local-only file handling
- PNG download
- SVG download
- Copy QR image where the browser supports image clipboard writes
- Example, clear, and reset actions
- Responsive landing page, features, use cases, pricing, FAQ, privacy, and terms pages
- Stripe Checkout route for one-time Pro purchases
- Browser-local signed entitlement token after verified payment

## Free vs Pro

Free:

- Unlimited static QR generation
- URLs and plain text
- Foreground and background colors
- 256px and 512px PNG
- Basic SVG without logo
- No account required

QuickQR Pro:

- 1024px and 2048px PNG
- Logo upload and export
- Premium presets
- High-resolution export
- Full SVG export with logo
- One-time purchase

Premium access is stored on this browser. Clearing browser data or switching devices may require a new purchase until account-based restoration is introduced.

## Stack

- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- qrcode
- Stripe
- ESLint

## Local Setup

Install dependencies:

```bash
npm install
```

Copy the environment example:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
PREMIUM_TOKEN_SECRET=
```

`PREMIUM_TOKEN_SECRET` signs browser-local Pro entitlement tokens. Use a long random value.

## Stripe Setup

1. Create a Stripe one-time Price for QuickQR Pro.
2. Set `STRIPE_SECRET_KEY` to your Stripe secret key.
3. Set `STRIPE_PRICE_ID` to the one-time Price ID.
4. Set `NEXT_PUBLIC_APP_URL` to your local or production app URL.
5. Set `PREMIUM_TOKEN_SECRET` to a long random secret.

The checkout route does not accept arbitrary price IDs from the browser.

## No-Database Architecture

Static QR content is generated client-side. Uploaded logos remain local in the browser and are not sent to QuickQR routes.

Stripe requires server routes to create Checkout Sessions and verify completed sessions. After verification, QuickQR stores a signed entitlement token in browser storage. There is no account-based entitlement restoration yet.

## Validation

Run linting:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

## Branch Workflow

- `main` is production-ready.
- `dev` is the integration branch.
- Feature work may use `feature/*` branches.

## Known Limitations

- Static QR destinations cannot be changed after export.
- Dynamic QR codes and scan analytics are not implemented.
- There are no accounts, saved QR history, teams, custom domains, or database-backed restoration.
- Browser-local Pro access can be lost if browser storage is cleared.
