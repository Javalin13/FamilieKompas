# Hermes Prototype Implementation Plan

## Purpose

This document prepares the future Hermes prototype path without enabling Hermes, adding AI providers, or changing the current MVP behavior.

The current deterministic system should remain the private beta baseline. Hermes should be introduced only behind a clean service boundary, with deterministic safety and founder-alert rules still in control.

## Current Files Hermes May Replace Or Augment

Hermes may later augment:

- `lib/conversation/conversationIntelligence.ts` for conversational reasoning and response drafting.
- `lib/conversation/contextExtraction.ts` for deeper narrative interpretation.
- `lib/guidance/staticGuidance.ts` for structured guidance drafting.

Hermes should not replace directly:

- `lib/safety/dutchSafetyRules.ts`.
- `lib/founder-alerts/missionPriorityRules.ts`.
- `app/actions.ts` persistence authority.
- Supabase migrations or database write rules.
- Admin authentication and founder alert hard rules.

## Future Flow

ConversationShell -> conversationIntelligence service -> Hermes adapter -> structured response -> safety validation -> UI rendering -> persistence

The UI should keep calling the conversation intelligence service. The service can later decide whether to use deterministic logic or Hermes. This prevents the UI from knowing whether a response came from templates, a local model, or an API provider.

## Future `conversationIntelligence.ts` Boundary

`conversationIntelligence.ts` should become the orchestration layer:

- Build a normalized Hermes input object.
- Call a Hermes adapter only when enabled.
- Validate Hermes output shape.
- Run deterministic safety checks outside Hermes.
- Fall back to deterministic replies if Hermes is unavailable.
- Return the same `ConversationMessage` compatible content currently used by the UI.

## Required Hermes Input Schema

```ts
type HermesConversationInput = {
  locale: "nl-BE";
  productMode: "familiekompas_private_beta";
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  extractedContext: {
    mode: string;
    familySignals: string[];
    pressureSignals: string[];
    urgencySignals: string[];
    safetySignals: string[];
  };
  boundaries: {
    noTherapy: true;
    noDiagnosis: true;
    noLegalAdvice: true;
    noMedicalAdvice: true;
    noEmergencyReplacement: true;
  };
};
```

## Required Hermes Output Schema

```ts
type HermesConversationOutput = {
  assistantReply: string;
  reflection: {
    emotionalTone: string;
    keyConcern: string;
    likelyNeed: string;
    uncertainty: string;
  };
  suggestedNextQuestion?: string;
  draftGuidance?: {
    shortSummary: string;
    whatSeemsImportant: string;
    firstCalmStep: string;
    practicalSteps: string[];
    whenToSeekHelp: string;
  };
  flags: {
    possibleSafetyConcern: boolean;
    possibleFounderAttention: boolean;
    needsHumanReview: boolean;
  };
};
```

Hermes output must be treated as a draft. It should be schema-validated before use.

## Safety Boundaries

Safety remains outside Hermes.

Deterministic controls still own:

- Self-harm and suicide routing.
- Violence, abuse, and child-safety detection.
- Acute medical emergency routing.
- Crisis founder alert creation.
- Boundary language.
- Final decision to continue normal guidance or route to `/veiligheid`.

Hermes may surface concern, but it must not be the only safety control.

## Fallback Behavior

If Hermes is unavailable, slow, malformed, or uncertain:

- Continue using deterministic conversation replies.
- Continue using deterministic guidance.
- Preserve current safety behavior.
- Do not show an error to the parent unless the existing persistence action fails.
- Log or surface prototype errors only in development or founder review tools later.

## Local Model / Ollama Compatibility Path

A future local prototype may use Ollama for private experimentation.

Recommended constraints:

- Run only in local development or private test mode.
- Keep model URL and model name in environment variables.
- Never expose model provider details in the user interface.
- Do not send data to a local model unless the environment is explicitly configured.
- Keep deterministic fallback active.

Potential environment variables later:

- `HERMES_MODE=off|local|api`
- `HERMES_LOCAL_URL`
- `HERMES_LOCAL_MODEL`

Do not add these variables until implementation begins.

## Future API Compatibility Path

A future API-backed Hermes adapter should:

- Use a server-side adapter only.
- Keep provider keys out of browser code.
- Use timeouts.
- Validate output schema.
- Strip unnecessary personal data where possible.
- Preserve deterministic safety checks after the model response.

## What Remains Deterministic

- Safety detection and routing.
- Mission-priority founder alert hard rules.
- Consent and data-retention decisions.
- Database writes.
- Admin access.
- Verified resource lists until resource governance changes.
- Non-therapy, non-diagnosis, non-legal, and non-medical boundaries.

## What Remains Outside Hermes

- Crisis escalation authority.
- Legal boundaries.
- Medical boundaries.
- Consent authority.
- Founder alert creation rules.
- Database authority.
- Payment, account, portal, CRM, or subscription logic.

## Private Beta Position

Hermes is not enabled for private beta. The private beta should collect real UX feedback on the current deterministic baseline so Hermes can later solve the right problem: living conversation intelligence, not more templates.
