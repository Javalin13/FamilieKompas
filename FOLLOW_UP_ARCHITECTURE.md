# Follow-Up Architecture

## Principle

Value first. Relationship second.

FamilieKompas does not ask for contact details during the initial conversation or before the result. Follow-up is offered only after the user has received guidance.

## User Flow

1. User completes conversation.
2. User receives guidance result.
3. User can leave feedback.
4. User chooses whether follow-up is needed:
   - Dit is voldoende
   - Ik wil hier later op terugkomen
   - Ik wil graag verdere opvolging
5. Contact details are requested only for the last two choices.

## Persistence

New table:

`follow_up_requests`

Linked to:

- `conversation_sessions`
- `guidance_results`
- `founder_alerts`

Stored fields:

- requested follow-up type
- first name
- last name
- email
- optional phone
- optional municipality
- preferred contact
- reason
- key themes
- urgency level
- suggested next step
- status

## Founder Experience

`/beheer` now shows a simple "Opvolgingsvragen" section with:

- name
- contact details
- requested follow-up
- key themes
- urgency level
- suggested next step
- status

No full dashboard was added.

## Privacy Boundary

The MVP stores only the contact information needed for requested follow-up. It does not add accounts, subscriptions, user profiles, automated nurturing, or cross-session personal memory.
