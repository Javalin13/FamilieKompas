# FamilieKompas Private Launch Certification

Date: 2026-06-04

Scope: frozen Dutch-only MVP for private testing with Dutch-speaking families in Flanders.

## Certification Summary

Status: Conditional go for final owner dry-run. Not yet full go for real families until the owner manually completes one browser-based conversation submission against the deployed/private environment.

Reason: The real Supabase project is configured, migrations are applied, persistence tables are verified, result rendering from Supabase is verified, admin protection is verified, tests pass, and build passes. However, browser automation in this environment could not fill textareas because the in-app browser virtual clipboard was unavailable. The core conversation form still needs one manual owner-run UI submission before inviting real families.

## What Was Configured

- `.env.local` configured for the real Supabase project.
- `ADMIN_SESSION_SECRET` generated and configured locally.
- Existing migration `0001_mvp_persistence.sql` applied to Supabase.
- Launch-blocker migration `0002_add_safety_events.sql` added and applied.
- Local app run against the real Supabase project.

Secrets were not added to documentation.

## Supabase Project Verification

Project:

- Name: FamilieKompas
- Ref: `jfobavqnpnwrmkyqswss`
- Region: `eu-west-3`
- Status: `ACTIVE_HEALTHY`

Verified tables:

- `conversation_sessions`
- `conversation_messages`
- `guidance_results`
- `founder_alerts`
- `feedback_entries`
- `safety_events`

Note: `safety_events` was missing from the original real environment and was added as a launch-blocker fix.

## Persistence Validation

Controlled certification records were inserted and verified for:

- normal conversation session
- conversation message
- guidance result
- feedback entry
- mission-priority founder alert
- safety-escalated session
- safety event
- crisis founder alert

The controlled certification records were removed after validation so the launch database is not left with test alerts/results.

## App Validation

Verified:

- `/` responds locally.
- `/veiligheid` responds locally and displays safety content/resources.
- `/resultaat/[id]` can render a stored guidance result from the real Supabase database.
- `/beheer` is protected without admin cookie.
- `/beheer/login` loads.
- Admin login server action works via HTTP form submission.
- `/beheer` displays founder alerts after successful admin login.
- Admin logout server action works.
- `/beheer` becomes protected again after logout.

Not fully automated:

- Browser automation could not fill the conversation form due virtual clipboard support missing in the in-app browser environment.
- Manual owner test is still required for the full browser conversation submission path.

## Test Results

Passed:

- `npm test`
- `npm run lint`
- `npm run build`

## Safety Validation

Verified in deterministic tests:

- self-harm/suicide terms
- violence/abuse terms
- child safety terms
- acute medical emergency terms
- mission-priority terms including single parent, child developmental delay, child behavioral problems, stuck parent, no support network

Verified in database certification:

- safety-escalated session can be stored
- safety event can be stored
- crisis founder alert can be stored

## Admin Protection Validation

Protection mechanism:

- simple admin password
- signed HTTP-only admin cookie
- server-side `/beheer` guard
- logout action clears cookie

Verified:

- no cookie: `/beheer` returns redirect
- correct login form submission: redirects to `/beheer`
- authenticated `/beheer`: returns 200 and displays alerts
- logout: redirects to `/beheer/login`
- after logout: `/beheer` redirects again

## Result Quality Validation

Rule-based result output now includes:

- korte samenvatting
- wat lijkt belangrijk
- eerste rustige stap
- praktische stappen
- wanneer hulp zoeken
- nuttige hulplijnen/resources
- belangrijke grenzen

No AI provider integration was added.

## Certification Decision

Conditional go for final private-launch dry-run.

Not full go for real families until:

1. Owner runs the manual browser conversation scenarios from `docs/FamilieKompas_Private_Launch_Checklist.md`.
2. Owner confirms normal, mission-priority, safety, feedback, and admin flows work in the actual browser/deployment environment.
3. Owner confirms production/Vercel environment variables are configured.

