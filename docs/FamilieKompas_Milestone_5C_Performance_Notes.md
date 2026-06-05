# FamilieKompas Milestone 5C Performance Notes

## What Was Reviewed

The chat message flow is now local-first. Sending a normal chat message updates the UI immediately and does not call Supabase or navigate.

The heavier work still happens when the user asks for the result:

- server action submission
- Supabase writes for the session, messages, result, alerts, and safety events when relevant
- redirect to `/resultaat/[id]` or `/veiligheid`
- server rendering of the destination page

## Improvements Made

- Added immediate user-message rendering.
- Added a short listening/thinking state after sending a message.
- Disabled result creation while the assistant is still responding, so incomplete context is not submitted.
- Kept guidance generation deterministic and local to the server action.
- Introduced `lib/conversation/conversationIntelligence.ts` as the future replacement boundary for Hermes or AI.

## Remaining Causes Of Delay

Result creation still depends on Supabase network writes and Next.js navigation. That is expected for the current no-account MVP because persistence happens at the moment the result is created.

Future improvements can stream or persist conversation turns incrementally, but that is outside the frozen MVP scope.
