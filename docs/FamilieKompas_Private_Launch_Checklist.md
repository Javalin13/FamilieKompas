# FamilieKompas Private Launch Checklist

Date: 2026-06-04

Scope: Dutch-only private MVP launch for Flanders.

This checklist is for a limited test with real parents. It does not approve public launch.

## Environment Checklist

- `.env.local` exists locally.
- Production environment variables are set in Vercel.
- `APP_BASE_URL` points to the correct domain.
- `NEXT_PUBLIC_SUPABASE_URL` is set.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set.
- `SUPABASE_SERVICE_ROLE_KEY` is set and never exposed to browser code.
- `ADMIN_PASSWORD` is set to a private launch password.
- `ADMIN_SESSION_SECRET` is set to a long random value.
- Optional provider keys remain empty unless explicitly used in a later milestone.

## Supabase Checklist

- Migration `0001_mvp_persistence.sql` has been applied.
- Table `conversation_sessions` receives normal and safety sessions.
- Table `conversation_messages` receives user and assistant/static messages.
- Table `guidance_results` receives result records for non-safety conversations.
- Table `founder_alerts` receives crisis and mission-priority alerts.
- Table `feedback_entries` receives feedback from result pages.
- RLS is enabled.
- Public users do not write directly to Supabase from browser code.
- Service role key is used only in server actions.

## Admin Password Checklist

- `/beheer` redirects to `/beheer/login` without cookie.
- Wrong password does not create access.
- Correct password creates signed admin cookie.
- `/beheer` displays founder alerts after login.
- Logout clears the admin cookie.
- Admin password is shared only with the founder/test operator.
- Admin password is rotated after private launch if shared during testing.

## Safety Resource Checklist

Manually recheck these before private launch:

- 112: https://112.be
- Zelfmoordlijn 1813: https://www.zelfmoord1813.be
- 1712: https://www.1712.be/nl
- Tele-Onthaal 106: https://www.tele-onthaal.be
- Opvoedingslijn: https://www.opvoedingslijn.be
- CAW: https://www.caw.be
- Awel: https://awel.be
- TEJO Vlaanderen: https://tejo.be

Safety page must state:

- FamilieKompas is not an emergency service.
- Immediate danger or medical emergency: call 112.
- The listed resources are orientation resources, not diagnosis or treatment.

## Manual Test Scenarios

### Normal Conversation

1. Open `/gesprek`.
2. Enter a parenting or school-related concern with no safety terms.
3. Submit.
4. Confirm redirect to `/resultaat/[id]`.
5. Confirm result includes:
   - korte samenvatting
   - wat lijkt belangrijk
   - eerste rustige stap
   - praktische stappen
   - wanneer hulp zoeken
   - hulpbronnen/resources
   - grenzen
6. Confirm Supabase rows:
   - `conversation_sessions.status = completed`
   - `guidance_results` row exists
   - `conversation_messages` rows exist

### Mission-Priority Conversation

Use a phrase such as:

```text
Ik ben een alleenstaande moeder en ik ben volledig vastgelopen met mijn kind met gedragsproblemen.
```

Expected:

- Result page is shown.
- `conversation_sessions.mission_priority = true`.
- `founder_alerts.priority = hoog`.
- Alert summary explains why it was flagged and suggests a review step.

### Safety-Triggering Conversation

Use a test phrase such as:

```text
Ik denk aan zelfmoord.
```

Expected:

- No normal result page.
- User is routed to `/veiligheid`.
- `conversation_sessions.safety_flag = true`.
- `safety_events` row exists.
- `founder_alerts.priority = crisis`.
- Safety page shows urgent resources and 112 message.

### User-Indicated Urgency

Submit a conversation without keywords but choose:

```text
Ja, mogelijk wel
```

Expected:

- User is routed to `/veiligheid`.
- `conversation_sessions.safety_flag = true`.
- `safety_events.risk_type = door_gebruiker_aangegeven`.
- Crisis founder alert exists.

### Feedback Submission

1. Open a result page.
2. Click a feedback option.
3. Confirm feedback message appears.
4. Confirm `feedback_entries` row exists.

### Admin Flow

1. Visit `/beheer` without cookie.
2. Confirm redirect to `/beheer/login`.
3. Log in with wrong password.
4. Confirm access is denied.
5. Log in with correct password.
6. Confirm alert list loads.
7. Mark an alert as closed.
8. Log out.
9. Confirm `/beheer` requires login again.

## Privacy And Boundary Checklist

- Landing page states FamilieKompas is not therapy, diagnosis, legal advice, medical advice, or emergency support.
- Conversation page repeats the core boundary.
- Result page includes boundaries.
- Safety page does not provide treatment advice.
- No user accounts are created.
- No payments are present.
- No multilingual routing is present.
- No professional directory or public resource library UI is present.
- Feedback is simple and does not request unnecessary sensitive details.

## Launch Blockers

Do not start private launch if any of these are true:

- `/beheer` is publicly accessible without password.
- Safety-triggering conversations produce normal guidance.
- Safety resources are stale or unverified.
- Supabase writes fail for normal conversation, safety event, result, alert, or feedback.
- Result page makes therapy, diagnosis, legal, or medical claims.
- Founder cannot access or understand alerts.
- Admin password or service role key is exposed in browser code.

## Known Limitations

- Safety detection is deterministic keyword matching only.
- Guidance is rule-based and does not use AI.
- `/beheer` uses a simple MVP password gate, not full identity management.
- Results are a first orientation, not professional advice.
- Resources are static and must be manually maintained.
- This MVP is for controlled private testing only.

## Rollback / Disable Plan

If launch must stop quickly:

1. Disable the Vercel production deployment or replace it with a maintenance page.
2. Rotate `ADMIN_PASSWORD`.
3. Rotate `SUPABASE_SERVICE_ROLE_KEY` if exposure is suspected.
4. Stop inviting new testers.
5. Review `conversation_sessions`, `safety_events`, and `founder_alerts` for unresolved safety cases.
6. Document the issue and required fix before relaunch.

## Verification Commands

Run before private launch:

```bash
npm test
npm run lint
npm run build
```
