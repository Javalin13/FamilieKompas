# Hermes Integration Path

## Current Status

Hermes is not implemented. The current MVP uses deterministic conversation flow, context extraction, safety rules, founder alerts, follow-up requests, and rule-based guidance generation.

The deterministic system has reached its natural human-experience limit. More empathy templates should not be treated as the long-term solution.

## Future Architecture

UI -> Conversation Service -> Hermes Reasoning Layer -> Structured Guidance Layer -> Safety Layer -> Founder Layer -> Result / Portal Layer

## What Hermes Owns Later

- Conversational reasoning.
- Better follow-up questions.
- Human-feeling reflection.
- Context-aware summarization.
- Structured draft guidance.
- Continuity suggestions.
- Founder summary drafts.
- Knowledge archive suggestions.

## What Hermes Must Not Own

- Final safety enforcement.
- Emergency routing.
- Legal, medical, diagnostic, or therapy claims.
- Consent decisions.
- Data retention policy.
- Account or subscription logic.
- Founder escalation authority.
- Direct upward transfer of personal data to Ryzen or ARC systems.

## What Remains Deterministic

- Safety hard checks.
- Crisis routing.
- Required boundary copy.
- Founder alert creation for crisis and mission-priority cases.
- Persistence contracts.
- Consent gates.
- Resource lists until verified resource governance exists.
- Result schema validation.

## Structured Guidance Contract

Hermes should output structured draft guidance, not unbounded prose. A future response should map into:

- Situation summary.
- What seems important.
- First calm step.
- Practical steps.
- When to seek help.
- Relevant resources.
- Founder review summary when needed.
- Safety flags or uncertainty notes.

The Structured Guidance Layer should validate and normalize this output before it reaches users.

## Context Preservation

Hermes may use conversation context inside the active flow. Longer-term memory must be explicit, consent-based, and family-controlled. Hidden profiling is not allowed.

## Follow-Up Support

Hermes can later improve follow-up by:

- Reading the previous guidance summary.
- Asking what changed.
- Detecting unresolved pressure points.
- Suggesting smaller next steps.
- Preparing concise founder review notes.

Follow-up must still respect the same consent, safety, and founder-attention boundaries.

## Knowledge Archive Feed

Hermes can suggest generalized learning objects for future review:

- Reusable guidance patterns.
- Common family pressure patterns.
- Resource gaps.
- Conversation strategies that worked.

Only generalized, non-identifying, founder-reviewed patterns should enter knowledge continuity systems.

## ARC Maturity

Hermes can later support FamilieKompas ARC maturity by producing cleaner domain patterns and structured guidance traces. ARC readiness must preserve safety, consent, and creator alignment.

## Integration Phases

### Phase A: Current Deterministic System

Rules, context extraction, deterministic guidance, safety checks, founder alerts, and Supabase persistence.

### Phase B: Hermes Prototype

Hermes runs behind the existing conversation service boundary in a private test mode. Deterministic safety remains active.

### Phase C: Hermes Assisted Guidance

Hermes drafts structured guidance while deterministic layers validate boundaries, safety, and output shape.

### Phase D: Hermes Continuity

Consent-based family continuity and follow-up support become possible after user accounts or another explicit continuity mechanism exists.

### Phase E: Founder Operations Support

Hermes prepares founder summaries, review suggestions, and pattern notes. The founder remains the human authority.

### Phase F: Family ARC Intelligence

Specialized family-support intelligence matures through reviewed, generalized knowledge patterns.

## Boundary

No Hermes integration belongs in the current private-launch MVP. Safety remains outside Hermes as a hard control layer.
