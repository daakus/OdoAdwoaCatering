# Odo Adwoa Catering Services

Production-oriented Next.js 14 (App Router) booking platform for a Ghana-based salon: public marketing site, customer dashboard, admin portal, and staff tools. Payments are manual (MTN MoMo, Vodafone Cash, AirtelTigo Money) with screenshot upload and admin verification.

## Stack

- Next.js 14, TypeScript, Tailwind CSS, shadcn-style UI (Radix + CVA)
- Supabase (Auth, Postgres, Storage) with row-level security
- React Hook Form + Zod (forms wired incrementally), Zustand (booking wizard), date-fns, react-day-picker, Recharts, Sonner

## Local development

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project settings. Set `NEXT_PUBLIC_SITE_URL` to `http://localhost:3000` for local auth redirects.

2. Apply the database schema in the Supabase SQL editor or CLI:

   - File: `supabase/migrations/20260408120000_initial_schema.sql`
   - Creates tables, RLS policies, auth trigger for `profiles`, and storage buckets/policies.

3. In Supabase Auth → URL configuration, add redirect URLs:

   - `http://localhost:3000/auth/callback`
   - Your production URL + `/auth/callback`

4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

## Netlify

- Repository includes `netlify.toml` with `@netlify/plugin-nextjs`.
- Build command: `npm run build`.
- Add the same `NEXT_PUBLIC_*` variables in Netlify Site settings → Environment variables.
- After deploy, add your production `/auth/callback` URL in Supabase Auth settings.

## Project layout

- `app/(marketing)` — public pages (home, about, services, gallery, contact, booking flow, payment instructions).
- `app/(auth)` — login, register, forgot password.
- `app/customer`, `app/admin`, `app/staff` — role-scoped dashboards (protected by middleware + `requireRole`).
- `components/` — UI primitives, layout shells, sections, booking and payment blocks.
- `supabase/` — browser/server clients; SQL under `supabase/migrations/`.
- `types/` — shared TypeScript models and enums.
- `stores/booking-wizard-store.ts` — client booking flow state.

## Roles

Default role on signup is **customer**. Promote users to **staff** or **admin** by updating `profiles.role_id` in Supabase (after creating the corresponding `staff` row for therapists).

## Stitch HTML → React

When you paste exported HTML from Stitch, the workflow is: analyze structure → propose component split → implement components with Tailwind + shadcn patterns → align file structure under `components/` and `app/`.
