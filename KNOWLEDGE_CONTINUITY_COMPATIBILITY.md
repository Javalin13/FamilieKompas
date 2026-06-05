# Knowledge Continuity Compatibility

## Current Compatibility

Milestone 5F preserves the existing future-Hermes boundary:

- `contextExtraction.ts`
- `conversationIntelligence.ts`
- `staticGuidance.ts`

The follow-up model is separate from guidance generation, which means Hermes can later replace deterministic guidance without changing persistence, safety, founder alerts, or follow-up storage.

## Preservable Knowledge Patterns

Future versions could preserve generalized, non-personal knowledge about:

- parent-support heuristics
- reflection questions that help parents feel understood
- patterns that lead to follow-up requests
- situations where guidance was enough
- situations where further human attention was requested
- founder-attention patterns
- support recommendations that proved useful

## Follow-Up Model As Knowledge Signal

Follow-up requests can later indicate where deterministic guidance was useful but not sufficient.

Potential future ARC/Hermes learning signals:

- requested follow-up type
- key themes
- urgency level
- suggested next step
- founder review outcome

These should be generalized before knowledge preservation. They should not become personal profiling.

## Ryzen / ARC Compatibility

A future flow could remain:

FamilieKompas ARC -> Hermes Knowledge Archive -> Ryzen Knowledge Lineage

5F does not implement that flow. It only keeps the architecture compatible by separating:

- personal follow-up data
- product persistence
- generalized guidance knowledge
- future domain learning

## Outside MVP Scope

Not implemented:

- Hermes integration
- Ryzen integration
- ARC infrastructure
- memory federation
- knowledge synchronization
- personal user memory
- automated learning from user data
