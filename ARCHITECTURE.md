# NextGen Platform — Architecture

NextGen is a 1-on-1 kids' coding tutoring **marketplace** for Lebanon: parents book vetted,
admin-approved tutors for live 1-on-1 lessons; payments are collected via Whish Pay; sessions
are activated only after payment is confirmed **and** an admin manually turns them on; tutors
earn 80% of each session fee (20% platform commission), paid out manually by the admin.

This document is the single source of truth for the stack, data model, routing, auth/roles,
payments/ledger, video/classroom, activation gating, and security — and the phase plan the
build follows. It is written before and updated alongside the code; nothing here is aspirational
copy, it describes what is actually being built.

---

## 1. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)**, TypeScript | one codebase for marketing site + portals + API routes; React Server Components for fast public pages |
| Styling | **Tailwind CSS** | matches the existing NextGen design system (Plus Jakarta Sans / Outfit / JetBrains Mono, indigo/coral/navy palette) already defined for the brand |
| Database | **PostgreSQL** | relational integrity for bookings, payments, ledger entries — this is a money-handling app, not a document store |
| ORM | **Prisma** | typed schema + migrations, works cleanly with Next.js route handlers |
| Auth | **Auth.js (NextAuth v5)**, credentials + session JWT, role stored on the User row | self-hosted, no per-seat cost, full control over the role model (Parent / Tutor / Admin) which off-the-shelf providers don't model natively |
| Payments | **Whish Pay** via a modular adapter (`/lib/payments/whish`) — see §6 | Lebanon-specific provider named explicitly in the spec; **no invented endpoints** — adapter is built against documented env vars and a clearly isolated interface so the real API calls are a drop-in once credentials/API docs are provided |
| Video | **Daily.co** (`@daily-co/daily-js`) embedded rooms, created per confirmed session | managed WebRTC, generates a room + token per session so a session is only joinable once activated |
| Email | **Resend** (transactional) | booking confirmations, activation notices, payout notices |
| Hosting target | Vercel (app) + a managed Postgres (Neon/Supabase/RDS) | not provisioned in this sandbox; left as a deploy target |
| Validation | **Zod** on every API route input | fastest way to stop bad data before it touches the ledger |
| Testing | **Vitest** (unit) + **Playwright** (e2e, already available in this environment) | |

---

## 2. Role model

Three roles on one `User` table (`role` enum), each with a 1:1 profile table for role-specific data:

- **PARENT** — books sessions for one or more `Child` records they own.
- **TUTOR** — starts as `PENDING` (application submitted), becomes `APPROVED` or `REJECTED` by an
  admin. Only `APPROVED` tutors appear in the marketplace or can be booked.
- **ADMIN** — the founder's account(s). Approves tutors, activates paid sessions, issues payouts,
  resolves disputes. No self-service admin signup — seeded directly in the DB.

A user is never two roles at once; a tutor who is also a parent creates a second account (keeps
the ledger and permission model unambiguous).

---

## 3. Core data model (Prisma, abbreviated — full schema in `prisma/schema.prisma`)

```
User            id, email, passwordHash, name, role[PARENT|TUTOR|ADMIN], createdAt
TutorProfile    userId, status[PENDING|APPROVED|REJECTED], bio, subjects[], ageGroups[],
                hourlyRateUSD, videoIntroUrl, appliedAt, reviewedAt, reviewedByAdminId
ParentProfile   userId, phone, country (default "LB")
Child           id, parentId, firstName, ageGroup[LITTLE_4_7|YOUNG_7_12], notes
Availability    id, tutorId, dayOfWeek, startTime, endTime, timezone
Booking         id, parentId, childId, tutorId, type[DISCOVERY|PAID], scheduledStart, scheduledEnd,
                status[REQUESTED|CONFIRMED|AWAITING_PAYMENT|AWAITING_ACTIVATION|ACTIVE|
                        COMPLETED|CANCELLED], priceUSD
Payment         id, bookingId, provider["WHISH"], providerRef, amountUSD, status[PENDING|PAID|
                FAILED|REFUNDED], rawPayload (jsonb), createdAt, confirmedAt
SessionActivation id, bookingId, activatedByAdminId, activatedAt, videoRoomUrl, videoRoomName
LedgerEntry     id, bookingId, tutorId, grossUSD, platformFeeUSD (20%), tutorEarningsUSD (80%),
                createdAt
Payout         id, tutorId, amountUSD, method, reference, status[PENDING|PAID], issuedByAdminId,
               periodStart, periodEnd, createdAt
ProgressNote    id, bookingId, tutorId, childId, summary, skillsCovered[], projectLink, nextSteps
Review          id, bookingId, parentId, tutorId, rating(1-5), comment, createdAt
Notification    id, userId, type, payload(jsonb), readAt, createdAt
```

Every money-bearing row (`Payment`, `LedgerEntry`, `Payout`) is append-only in practice — status
transitions are recorded, not overwritten, so there's always an audit trail.

---

## 4. Route map

**Public (marketing)** — `/`, `/programs`, `/programs/little-coders`, `/programs/young-coders`,
`/tutors` (marketplace browse), `/tutors/[id]`, `/pricing`, `/about`, `/contact`,
`/book-discovery` (free discovery session funnel).

**Auth** — `/signup/parent`, `/signup/tutor`, `/login`, `/logout`.

**Parent portal** (`/parent/*`, role-gated) — `dashboard`, `children`, `book/[tutorId]`,
`bookings`, `bookings/[id]` (classroom link once active), `payments`, `progress`.

**Tutor portal** (`/tutor/*`, role-gated, requires `APPROVED`) — `apply` (pre-approval),
`dashboard`, `availability`, `bookings`, `bookings/[id]`, `earnings`, `profile`.

**Admin portal** (`/admin/*`, `ADMIN` only) — `dashboard`, `tutors` (approval queue),
`bookings` (activation queue), `payments`, `payouts`, `ledger`, `reviews`.

**API** (`/api/*`) — REST-ish route handlers per resource, plus `/api/webhooks/whish` for
payment-confirmation callbacks and `/api/webhooks/daily` for room/session events.

---

## 5. Booking → activation → classroom flow (the critical path)

This is the one flow the spec is strictest about, so it's spelled out explicitly:

1. Parent books a `PAID` session with an `APPROVED` tutor → `Booking.status = REQUESTED`.
2. Tutor confirms availability → `CONFIRMED`.
3. Parent pays via Whish Pay → `Booking.status = AWAITING_PAYMENT` until the webhook confirms →
   on confirmation, `Payment.status = PAID` and `Booking.status = AWAITING_ACTIVATION`.
4. **Admin manually reviews and activates** the booking in `/admin/bookings` →
   `SessionActivation` row created, a Daily.co room is provisioned, `Booking.status = ACTIVE`.
5. Only now does `/parent/bookings/[id]` and `/tutor/bookings/[id]` render the "Join classroom"
   button with the real video room URL.

**Hard rule enforced in code, not just UI:** the classroom API route checks
`booking.status === 'ACTIVE' && sessionActivation exists` server-side before ever returning a
room token. Payment alone never unlocks it; booking alone never unlocks it. Both payment
confirmation *and* a human admin action are required — there is no code path that skips step 4.

---

## 6. Payments — Whish Pay adapter

Whish Pay's actual API is not something to guess at. The adapter is built as an isolated,
swappable module so integrating the real API later touches one file:

```
/lib/payments/
  types.ts          // PaymentProvider interface: createCheckout(), verifyWebhook(), refund()
  whish/
    client.ts        // thin wrapper — reads WHISH_API_KEY, WHISH_API_SECRET, WHISH_BASE_URL,
                      // WHISH_WEBHOOK_SECRET from env; throws a clear "not configured" error
                      // until these are supplied, rather than silently no-op'ing
    createCheckout.ts
    verifyWebhook.ts
  index.ts            // selects provider by env, currently only "whish"
```

Required environment variables (documented in `.env.example`, all placeholders until the real
Whish Pay merchant credentials exist):

```
WHISH_API_KEY=
WHISH_API_SECRET=
WHISH_BASE_URL=
WHISH_WEBHOOK_SECRET=
```

Nothing in the adapter fabricates a Whish endpoint shape — `createCheckout.ts` and
`verifyWebhook.ts` are written with the request/response shapes left as explicit `TODO: confirm
against Whish Pay merchant API docs` blocks, so the rest of the app (booking flow, ledger) can be
built and tested against the `PaymentProvider` interface with a `MOCK` provider in development,
and the real Whish calls are dropped in once their API documentation is available.

---

## 7. Financial ledger

Every `PAID` booking produces exactly one `LedgerEntry` on activation:
`tutorEarningsUSD = grossUSD * 0.80`, `platformFeeUSD = grossUSD * 0.20`. Payouts are **manual**:
an admin selects a tutor + period in `/admin/payouts`, the system sums unpaid `LedgerEntry` rows
for that tutor into a proposed `Payout`, the admin marks it paid (with a reference, e.g. a bank
transfer number) once money has actually moved outside the app. No automatic bank transfers —
matches the spec's "manual payouts" requirement exactly.

---

## 8. Security model

- Every `/parent/*`, `/tutor/*`, `/admin/*` route is checked server-side (middleware + per-route
  session check) against role — never just hidden in the UI.
- Tutor marketplace visibility and bookability both require `TutorProfile.status === 'APPROVED'`,
  re-checked at booking time (not just at listing time) so a de-approved tutor can't be booked.
- All payment webhook endpoints verify a signature (`WHISH_WEBHOOK_SECRET`) before trusting any
  payload.
- Classroom room URLs/tokens are generated server-side per request and scoped to the booking +
  requesting user; never stored client-side or reusable across bookings.
- Passwords hashed with bcrypt; sessions are httpOnly, signed JWTs.
- All mutating API routes validate input with Zod and return typed errors.

---

## 9. Build phases

1. Repo scaffold, Prisma schema, auth, design system wiring *(this session, immediate)*
2. Public marketing website
3. Auth + roles + tutor application/approval
4. Booking & calendar
5. Parent / Tutor / Admin dashboards
6. Payments & ledger (Whish adapter, mocked until real credentials exist)
7. Admin session-activation gate
8. Embedded live video classroom (Daily.co)
9. Progress tracking & parent updates
10. Reviews & notifications
11. QA & security pass

Each phase ships working, committed code — this is not a plan-only document; the build continues
directly from here into Phase 1 scaffolding.
