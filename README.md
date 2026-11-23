# PizzaHub Client

Role-based Next.js App Router frontend for the PizzaHub pizza ordering platform.

## Features

- Better Auth email/password and Google authentication
- Customer, vendor, and protected admin dashboards
- Public menu search, category/location filtering, sorting, pagination, and item details
- Customer orders, cancellation, profile settings, and dashboard charts
- Vendor menu management, ImgBB uploads, order processing, and Stripe subscription UI
- Admin user, menu-item, and read-only transaction management
- Responsive layouts, loading/empty/error states, toast notifications, dark mode, and custom error pages

## Technology

Next.js App Router, React, Better Auth, MongoDB, Express API, Stripe, ImgBB, Tailwind CSS, Base UI, Recharts, Framer Motion, Lucide, and Sonner.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The Express API defaults to `http://localhost:5000/api`.

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_API_URL` | Yes | Express API base URL |
| `BETTER_AUTH_URL` | Yes | Public client URL |
| `BETTER_AUTH_SECRET` | Yes | Better Auth secret |
| `MONGODB_URI` | Yes | MongoDB Atlas/local connection |
| `DB_NAME` | Yes | Database name |
| `GOOGLE_CLIENT_ID` | For Google login | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google login | Google OAuth secret |
| `IMGBB_API_KEY` | For uploads | Server-side ImgBB key |
| `ADMIN_NAME` | For admin setup | Seed account display name |
| `ADMIN_EMAIL` | For admin setup | Seed account email |
| `ADMIN_PASSWORD` | For admin setup | Strong seed account password |

Google callback: `{BETTER_AUTH_URL}/api/auth/callback/google`

## Admin account

Public registration never grants admin access. Configure the admin variables and run:

```bash
node --env-file=.env.local scripts/seed-admin.mjs
```

Use a strong, unique password. Do not commit `.env.local`.

## API and authentication

The client sends API requests to `NEXT_PUBLIC_API_URL` (include `/api`). Better Auth issues a short-lived JWT through `/api/auth/token`; the Express server verifies it against the Better Auth JWKS endpoint at `/api/auth/jwks`. The server loads the user and role from MongoDB, rejects blocked accounts, and applies role and ownership checks on protected routes. Do not trust client-provided user IDs or roles.

Menu search and filtering use `GET /api/menu?search=&category=&location=&minPrice=&maxPrice=&sort=newest|price_asc|price_desc&page=&limit=`. Search terms are escaped before database matching; the UI debounces filter changes.

Key API routes include:

- Public menu: `GET /api/menu`, `/api/menu/featured`, `/api/menu/meta`, `/api/menu/:id`
- Customer: `POST /api/orders`, `GET /api/orders/my`, `PATCH /api/orders/:id/cancel`
- Vendor: `/api/vendor/items`, `/api/vendor/orders`, `/api/vendor/stats`
- Admin: `/api/admin/users`, `/api/admin/menu`, `/api/admin/transactions`
- Vendor Premium: `POST /api/payments/checkout`, `POST /api/payments/cancel-subscription`

Stripe Premium activation is performed by the server only after the signed webhook is verified; the payment success page only displays status. Customer food orders do not use Stripe. Test-mode card: `4242 4242 4242 4242`, any future expiry and CVC.

## Deployment

Set the client URL, Better Auth secret, MongoDB connection, and production API URL in Vercel. Configure Google OAuth callback as `{BETTER_AUTH_URL}/api/auth/callback/google`. Configure ImgBB if image uploads are required. The server requires matching `CLIENT_URL`, MongoDB settings, and Stripe test/live keys plus a webhook secret in Render. Register `/api/payments/webhook` in Stripe and configure the required subscription and invoice events. Never commit secrets or deploy without checking the environment-specific origins.

## Validation

```bash
npm run lint
npm run build
```
