# FamilieKompas

Dutch-only MVP foundation for FamilieKompas.

## Frozen MVP Scope

Build only:

- one Dutch conversation flow
- one result screen
- one safety flow
- static verified resources
- simple feedback capture placeholder
- simple founder alert list placeholder

Do not build yet:

- user accounts
- payments
- multilingual routing
- public professional directory
- resource library UI
- full admin dashboard
- growth system
- tenant UI
- white-label functionality

## Local Setup

Install dependencies:

```bash
npm install
```

Create local environment file:

```bash
cp .env.example .env.local
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Milestone 1 Status

Milestone 1 created the Dutch-only frontend foundation.

## Milestone 2 Status

Milestone 2 adds minimal Supabase persistence:

- conversation sessions
- conversation messages
- guidance results
- founder alerts
- feedback entries
- deterministic Dutch safety rules
- deterministic mission-priority alert rules

Still not included:

- user accounts
- payments
- AI provider integration
- multilingual routing
- full admin dashboard
- public directory
- resource library UI

## Environment Variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
APP_BASE_URL=http://localhost:3000
```

Optional for later milestones:

```bash
FOUNDER_ALERT_EMAIL=
EMAIL_FROM=
EMAIL_PROVIDER_API_KEY=
GUIDANCE_PROVIDER_API_KEY=
GUIDANCE_MODEL=
SAFETY_MODEL=
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-only.

`ADMIN_PASSWORD` protects `/beheer` during the MVP private launch.

`ADMIN_SESSION_SECRET` signs the admin cookie. Use a long random value and do not reuse the admin password.

## Supabase Setup

Create a Supabase project, then run the MVP migration:

```bash
supabase db push
```

Or apply the SQL manually from:

```text
supabase/migrations/0001_mvp_persistence.sql
```

The migration creates only:

- `conversation_sessions`
- `conversation_messages`
- `guidance_results`
- `founder_alerts`
- `feedback_entries`

No user account, payment, directory, tenant, or growth tables are part of this milestone.

## Local Testing

1. Start the app:

```bash
npm run dev
```

2. Open `http://localhost:3000`.
3. Start the Dutch conversation at `/gesprek`.
4. Submit normal answers and confirm you are routed to `/resultaat/[id]`.
5. Submit a high-risk term such as `zelfmoord` in a test conversation and confirm you are routed to `/veiligheid`.
6. Open `/beheer`, log in with `ADMIN_PASSWORD`, and confirm founder alerts appear for safety or mission-priority cases.
7. Submit feedback on a result page and confirm a `feedback_entries` record is created.

Important: `/beheer` uses a simple MVP password gate, not full user accounts. Keep the password private and rotate it if shared during testing.

## Admin Protection

Milestone 3 protects `/beheer` with:

- environment-based admin password
- signed HTTP-only admin cookie
- middleware redirect to `/beheer/login`
- logout button on `/beheer`

This is intentionally simple. It is enough for a controlled private MVP, but not a full admin identity system.

## Safety Resource Notes

Safety resources are stored in:

```text
content/nl/resources.ts
```

Current MVP resources are Belgian/Flemish and should be manually rechecked before every broader launch:

- 112 for immediate danger or medical emergency
- Zelfmoordlijn 1813 for suicide/self-harm concern
- 1712 for violence, abuse, and child safety concerns
- Tele-Onthaal 106 for a listening conversation
- Opvoedingslijn for parenting questions
- CAW for family/social/welfare orientation
- Awel for children and young people
- TEJO for young people who need accessible mental-health support

FamilieKompas does not decide which service is clinically, legally, or medically right for a user. It only shows conservative orientation resources and tells users to contact emergency services in immediate danger.

## Private Launch Readiness

Use the private launch checklist before inviting real parents:

```text
docs/FamilieKompas_Private_Launch_Checklist.md
```

Milestone 5 certification reports:

```text
PRIVATE_LAUNCH_CERTIFICATION.md
LAUNCH_BLOCKER_REPORT.md
FINAL_PRIVATE_LAUNCH_STATUS.md
```

Manual QA must cover:

- normal conversation
- mission-priority conversation
- safety-triggering conversation
- user-indicated urgency
- result page generation
- feedback persistence
- founder alert creation
- `/beheer` login/logout
- `/beheer` alert visibility and close action

Supabase validation must confirm writes to:

- `conversation_sessions`
- `conversation_messages`
- `guidance_results`
- `founder_alerts`
- `feedback_entries`

Known MVP limitations for private launch:

- deterministic safety rules only
- rule-based guidance only
- password-gated admin only
- static manually maintained resources
- no user accounts
- no payments
- no multilingual routing
- no public directory or resource library UI

## Tests

Run deterministic rule tests:

```bash
npm test
```

Run type checking:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

## Safety Boundary

FamilieKompas is not therapy, diagnosis, legal advice, medical advice, or emergency support. Any future production flow must preserve this boundary.
