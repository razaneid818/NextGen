# NextGen — 1-on-1 Kids Coding Tutoring Marketplace

Online coding academy for kids ages 4–12 in Lebanon. See [`ARCHITECTURE.md`](./ARCHITECTURE.md)
for the full technical design (stack, data model, routes, auth, payments, the booking →
activation → classroom gate, and the build-phase plan this repo follows).

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma + Auth.js +
Whish Pay (adapter, pending real API docs) + Daily.co (video) + Resend (email).

## Getting started

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL at minimum to run locally
npx prisma migrate dev --name init
npm run db:seed              # creates an admin account — see SEED_ADMIN_EMAIL/PASSWORD below
npm run dev
```

> This repo was scaffolded in a sandboxed environment whose network policy blocks the npm
> registry, so dependencies have not been installed or build-verified here yet. Run
> `npm install` (and ideally `npm run typecheck` / `npm run build`) in an environment with
> normal internet access — your machine, or CI — as the first step before relying on this code.

### Environment variables

See `.env.example` for the full list. Notable ones:

- `DATABASE_URL` — a PostgreSQL connection string (Neon/Supabase/local Postgres all work).
- `PAYMENT_PROVIDER` — `"mock"` (default, for development) or `"whish"`. The Whish Pay adapter
  (`lib/payments/whish/`) is **intentionally left unimplemented** against guessed endpoints —
  it throws a clear error until Whish Pay's merchant API documentation is available. Build and
  test the full booking/payment/ledger flow with `PAYMENT_PROVIDER=mock` in the meantime; it
  simulates a successful payment without a real gateway.
- `DAILY_API_KEY` / `DAILY_DOMAIN` — optional in development; without them, session activation
  creates a placeholder room URL so the activation flow can still be tested end to end.
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — set before running `npm run db:seed` to control
  the admin login it creates (defaults to `admin@nextgen.example` / `changeme123` — change this
  before any real deployment).

## The one rule the whole app is built around

A session is only joinable once **both** of these are true — never one without the other:

1. `Payment.status === "PAID"` (parent paid via Whish Pay)
2. An admin has manually activated the booking in `/admin/bookings`

That check is enforced server-side in `/api/bookings/[id]/classroom` and
`/api/admin/bookings/[id]/activate` — not just hidden in the UI — so there's no path that skips
either step.

## What's built so far (Phase 1)

- Public marketing site (home, programs, tutor marketplace, pricing, about, contact)
- Parent + tutor signup, tutor application → admin approval queue
- Booking creation (discovery + paid), mock payment checkout, admin activation gate
- Financial ledger (80% tutor / 20% platform split) on activation
- Parent, tutor, and admin dashboards wired to real data (Prisma) — no mocked UI state
- Embedded video classroom (Daily.co adapter, with a dev fallback room)

## What's next

Availability/calendar UI for tutors, progress notes, reviews, notifications/email, payouts UI,
and the real Whish Pay integration once its API docs are available — see `ARCHITECTURE.md`
§9 for the full phase list and current task tracker for live status.
