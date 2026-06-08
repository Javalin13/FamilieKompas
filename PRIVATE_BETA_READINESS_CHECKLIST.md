# Private Beta Readiness Checklist

## Purpose

Use this checklist before inviting the first small group of Dutch-speaking parents in Flanders. The goal is confidence, not perfection.

## Local Run Checklist

- Install dependencies with `npm install`.
- Confirm `.env.local` exists.
- Run `npm test`.
- Run `npm run lint`.
- Run `npm run build`.
- Start locally with `npm run dev`.
- Open `/`, `/gesprek`, `/veiligheid`, `/beheer/login`, and `/beheer`.

## Supabase Checklist

- Confirm Supabase URL and anon key are present.
- Confirm service role key is server-only.
- Confirm migrations `0001` through `0004` are applied.
- Confirm writes work for:
  - `conversation_sessions`
  - `conversation_messages`
  - `guidance_results`
  - `founder_alerts`
  - `feedback_entries`
  - `follow_up_requests`
- Confirm no user accounts are required.

## Safety Checklist

- Test a normal parenting concern.
- Test a mission-priority concern.
- Test a suicide/self-harm phrase.
- Test violence or abuse wording.
- Test child-safety wording.
- Confirm safety-triggering conversations route to `/veiligheid`.
- Confirm normal guidance does not continue after a safety trigger.
- Confirm crisis founder alerts are created.
- Confirm emergency resources are visible and readable on mobile.

## Follow-Up Checklist

- Submit result feedback.
- Choose "Dit is voldoende".
- Choose "Ik wil hier later op terugkomen".
- Choose "Ik wil graag verdere opvolging".
- Confirm contact fields appear only when needed.
- Confirm follow-up requests appear in `/beheer`.

## Founder/Admin Checklist

- Confirm `/beheer` is protected.
- Confirm admin password is configured.
- Confirm login works.
- Confirm logout works.
- Confirm founder alerts are readable.
- Confirm follow-up requests are readable.
- Confirm alert close action still works.

## Manual Test Scenarios

1. Parent feels overwhelmed by a child's anger at home.
2. Single parent has no support network and feels stuck.
3. Co-parenting conflict without immediate danger.
4. School concern with a child falling behind.
5. Safety-triggering message with self-harm language.
6. Safety-triggering message with domestic violence or child-safety language.

## Private Beta Tester Instructions

Tell testers:

- FamilieKompas is not therapy, diagnosis, legal advice, medical advice, or emergency help.
- They should not use the tool in immediate danger; emergency services remain the right path.
- They can describe a real but limited situation.
- They should notice whether the product helps them find a calmer next step.
- They can give feedback on wording, trust, warmth, and clarity.

## No-Go Criteria

Do not invite testers if:

- `npm test`, `npm run lint`, or `npm run build` fails.
- Supabase writes are failing.
- Safety-triggering messages continue into normal guidance.
- `/beheer` is publicly accessible without the password gate.
- Follow-up requests are not visible to the founder.
- Emergency resources are missing or unreadable.
- The product copy implies therapy, diagnosis, legal advice, or medical advice.

## Known Limitations

- Conversation intelligence is deterministic.
- Emotional nuance is limited.
- No Hermes or AI provider is enabled.
- No accounts.
- No payments.
- No portals.
- No multilingual support.
- No full dashboard.
- No automated professional referral workflow.

## Hermes Not Yet Enabled

Hermes is architecture-ready but not implemented. Private beta feedback should help decide where Hermes must improve the experience later:

- Better emotional interpretation.
- Better follow-up questions.
- Less repetitive replies.
- More natural guidance drafting.
- More useful founder summaries.
