# FamilieKompas MVP Repository Setup Plan

Date: 2026-06-04

Scope status: frozen.

Frozen MVP:

- Dutch only
- Flanders, Belgium as primary launch market
- one conversation flow
- one result screen
- one safety flow
- static verified resources
- simple feedback capture
- simple founder alert list

Explicitly not included:

- user accounts
- payments
- public professional directory
- resource library UI
- full admin dashboard
- Growth Operating System
- multi-tenant UI
- white-label functionality
- advanced analytics
- language switching
- translation management

## 1. Recommended GitHub Repository Setup

Repository name:

```text
familiekompas
```

Recommended visibility:

- private repository during MVP validation
- public only if there is a clear reason after launch

Recommended repository defaults:

- default branch: `main`
- require pull requests before merging once more than one contributor is active
- enable branch protection on `main`
- enable GitHub Actions later for tests and linting, but do not block initial setup on CI

Recommended initial repository files:

```text
README.md
.gitignore
.env.example
docs/
```

Do not add production code until the first coding milestone begins.

README should state:

- product name
- frozen MVP scope
- Dutch-only launch
- local setup steps
- safety and non-therapy boundaries
- deployment overview

## 2. Recommended Folder Structure

Use a simple Next.js structure that supports future expansion without building it now.

```text
familiekompas/
  app/
    page.tsx
    gesprek/
      page.tsx
    resultaat/
      [id]/
        page.tsx
    veiligheid/
      page.tsx
    privacy/
      page.tsx
    voorwaarden/
      page.tsx
    beheer/
      page.tsx
  components/
    conversation/
    result/
    safety/
    feedback/
    resources/
    founder-alerts/
    ui/
  content/
    nl/
      landing.ts
      conversation.ts
      safety.ts
      boundaries.ts
      resources.ts
      result.ts
      feedback.ts
  lib/
    supabase/
    safety/
    conversation/
    guidance/
    resources/
    founder-alerts/
    feedback/
  supabase/
    migrations/
    seed/
  docs/
  tests/
    safety/
    guidance/
```

Notes:

- Use Dutch route names for the MVP because there is no language switch.
- Keep Dutch text in `content/nl/` instead of scattering copy through components.
- Do not create `[locale]` routes yet.
- Future multilingual support can add locale routing later by moving current Dutch routes under a locale segment or by introducing route aliases.
- Keep modules named in English where they are internal developer concepts.

## 3. Branch Strategy

Keep branch strategy simple.

Branches:

- `main`: production-ready branch
- `mvp-foundation`: initial setup and schema work
- `feature/<short-name>`: short-lived feature branches once implementation starts

Recommended sequence:

1. Create `main`.
2. Create `mvp-foundation` for the first setup work.
3. Merge only small, reviewable changes into `main`.
4. Deploy previews from feature branches if using Vercel.

Avoid:

- long-running parallel branches
- complex Git Flow
- release branches before real production traffic exists

## 4. Environment Variable Strategy

Use one `.env.example` and environment-specific values in Vercel/Supabase.

Do not commit real secrets.

Recommended variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FOUNDER_ALERT_EMAIL=
EMAIL_FROM=
EMAIL_PROVIDER_API_KEY=
APP_BASE_URL=
GUIDANCE_PROVIDER_API_KEY=
GUIDANCE_MODEL=
SAFETY_MODEL=
```

MVP rules:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- `GUIDANCE_PROVIDER_API_KEY` is server-only.
- `EMAIL_PROVIDER_API_KEY` is server-only.
- Public browser code should only receive `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- If email is deferred, keep the variables in `.env.example` but do not wire email until needed.

Environment groups:

- local development
- preview
- production

Recommended validation:

- fail fast if required server env vars are missing
- keep env validation in one file later, such as `lib/env.ts`

## 5. Supabase Project Structure

Use one Supabase project for MVP production and optionally one for development.

Recommended:

- `familiekompas-dev`
- `familiekompas-prod`

If speed matters more than isolation:

- start with one dev project
- create production project before real-user launch

Supabase features:

- Postgres
- Row Level Security
- Auth only for founder/admin access
- Storage not needed for first MVP
- Edge Functions not required unless the implementation prefers them for server workflows

MVP access model:

- public users do not create accounts
- conversations are anonymous unless optional contact details are later added
- founder/admin uses Supabase Auth
- founder alert list is protected

Supabase folders:

```text
supabase/
  migrations/
    0001_initial_mvp_schema.sql
    0002_seed_static_resources.sql
  seed/
    verified_resources_nl_be.sql
    safety_resources_nl_be.sql
```

## 6. Database Migration Plan

Use the reduced schema from the simplification review.

### Migration 0001: Initial MVP Schema

Create:

- `conversations`
- `safety_events`
- `founder_alerts`
- `resources`
- `admin_users`

Recommended fields:

#### conversations

- `id uuid primary key`
- `language text default 'nl'`
- `country text default 'BE'`
- `region text default 'Vlaanderen'`
- `status text`
- `urgency_level text nullable`
- `safety_status text`
- `user_input_json jsonb`
- `result_json jsonb nullable`
- `feedback_json jsonb nullable`
- `created_at timestamptz`
- `completed_at timestamptz nullable`

#### safety_events

- `id uuid primary key`
- `conversation_id uuid references conversations(id)`
- `risk_type text`
- `risk_level text`
- `action_taken text`
- `created_at timestamptz`

#### founder_alerts

- `id uuid primary key`
- `conversation_id uuid references conversations(id) nullable`
- `reason text`
- `priority text`
- `status text`
- `created_at timestamptz`
- `resolved_at timestamptz nullable`

#### resources

- `id uuid primary key`
- `title text`
- `language text default 'nl'`
- `country text default 'BE'`
- `region text nullable`
- `topic_tags text[]`
- `url text nullable`
- `description text`
- `crisis_resource boolean default false`
- `verified boolean default false`
- `created_at timestamptz`

#### admin_users

- `id uuid primary key`
- `auth_user_id uuid unique`
- `role text`
- `created_at timestamptz`

### Migration 0002: Seed Verified Resources

Seed only:

- verified emergency resources
- a small number of parenting/family support resources for Flanders
- broad support categories if exact local resources are not yet verified

Do not seed a full directory.

### RLS Plan

Keep simple:

- public insert allowed for `conversations`
- public update allowed only for completing/adding feedback to the same conversation through server-side actions, not direct browser writes
- public read disabled for conversations
- public read allowed for verified non-sensitive `resources`
- admin read/update allowed for founder/admin on `conversations`, `safety_events`, and `founder_alerts`

Preferred MVP implementation:

- use server actions or route handlers for all conversation writes
- avoid exposing direct table writes from the browser

## 7. Deployment Strategy

Recommended hosting:

- Vercel for Next.js
- Supabase for database/auth

Deployment environments:

- local
- preview
- production

Production launch path:

1. Create production Supabase project.
2. Apply migrations.
3. Seed verified resources.
4. Configure Vercel production environment variables.
5. Deploy from `main`.
6. Run safety test cases in production-like preview.
7. Founder verifies Dutch copy, safety page, and result quality.
8. Invite first controlled group of parents.

Domain:

- use a temporary Vercel URL for internal testing
- connect real domain before external parent testing

Monitoring:

- Vercel logs
- Supabase logs
- manual founder review
- simple feedback collection

Do not set up advanced observability for first launch.

## 8. Documentation Structure

Keep docs short and operational.

Recommended docs:

```text
docs/
  FamilieKompas_Master_Blueprint.md
  FamilieKompas_MVP_Execution_Plan.md
  FamilieKompas_MVP_Simplification_Review.md
  FamilieKompas_MVP_Repository_Setup_Plan.md
  MVP_SCOPE_FREEZE.md
  SAFETY_POLICY_MVP.md
  DUTCH_COPY_GUIDE_MVP.md
  VERIFIED_RESOURCES_MVP.md
  LAUNCH_CHECKLIST_MVP.md
```

Purpose:

- `MVP_SCOPE_FREEZE.md`: exact frozen scope and explicit exclusions
- `SAFETY_POLICY_MVP.md`: safety triggers, escalation copy, test cases
- `DUTCH_COPY_GUIDE_MVP.md`: approved Dutch wording and tone
- `VERIFIED_RESOURCES_MVP.md`: manually checked resources and dates
- `LAUNCH_CHECKLIST_MVP.md`: final pre-launch verification

Do not create large process documents before implementation starts.

## 9. MVP Build Sequence

Build in this order:

### Step 1: Repository And App Foundation

- initialize Next.js
- configure TypeScript
- configure Tailwind
- add base layout
- add Dutch-only static routes
- add `.env.example`

Outcome:

- app runs locally
- no product logic yet

### Step 2: Supabase Schema

- create Supabase project
- add migrations
- add seed files
- configure server Supabase client
- protect admin access

Outcome:

- database can store conversations, resources, safety events, and founder alerts

### Step 3: Dutch Copy And Static Pages

- landing page
- privacy page
- terms/boundary page
- safety page shell

Outcome:

- founder can review Dutch wording before logic is added

### Step 4: Conversation Flow

- one guided flow
- no mode selector
- 6-8 questions
- store conversation

Outcome:

- parent can explain situation in Dutch

### Step 5: Safety Flow

- safety detection
- safety event creation
- safety escalation page
- founder alert creation for safety cases
- safety test cases

Outcome:

- unsafe cases stop normal guidance

### Step 6: Guidance Result

- generate concise result
- show result screen
- include 3 next steps
- include 2-4 static resource suggestions
- include boundaries

Outcome:

- parent receives a useful next-step result

### Step 7: Feedback Capture

- ask whether the result helped the user find a next step
- store feedback in `conversations.feedback_json`

Outcome:

- MVP can measure usefulness

### Step 8: Founder Alert List

- simple protected `/beheer`
- show founder alerts
- show linked conversation summary
- allow mark resolved

Outcome:

- founder can monitor mission-priority cases without a full dashboard

### Step 9: Launch QA

- run safety test cases
- review Dutch copy
- verify resources
- test mobile layout
- test complete conversation
- test founder alert
- test feedback

Outcome:

- ready for controlled real-user launch

### Step 10: Controlled Launch

- invite 10-20 Dutch-speaking parents first
- founder reviews early outputs daily
- fix guidance quality and safety issues before wider testing

Outcome:

- real validation of core mission

## 10. First Coding Milestone

First milestone name:

```text
MVP Foundation: Dutch-only conversation skeleton
```

Goal:

- create the runnable application foundation without report generation complexity

Definition of done:

- Next.js app runs locally
- Tailwind configured
- Dutch landing page exists
- Dutch privacy and terms pages exist
- `/gesprek` route exists with static conversation form UI
- `/veiligheid` route exists with static safety message
- `.env.example` exists
- repository README explains frozen MVP scope
- no user accounts
- no payments
- no multilingual routing
- no directory
- no resource library UI
- no growth system

This milestone should not include AI/report generation yet. It creates the visible foundation and allows founder review of Dutch tone and boundaries before the safety and guidance workflows are connected.

## Final Recommendation

Build the frozen MVP as a Dutch-only, single-flow product with the smallest durable foundation:

- Next.js
- Supabase
- one reduced schema
- static verified resources
- simple safety workflow
- one result screen
- one founder alert list

Do not introduce locale routing, account systems, payments, public directories, resource UI, tenant UI, or growth infrastructure until the core mission is validated with real Dutch-speaking parents in Flanders.
