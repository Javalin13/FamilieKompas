# Narrative Engine Report

## Changes Made

- Extended `ConversationContext` with pressure sources, underlying needs, narrative themes, and a central human question.
- Added anti-repetition behavior by comparing the latest user message with previous conversation context.
- Added follow-up response behavior that answers what is new instead of restarting the same analysis.
- Preserved `conversationIntelligence.ts` as the future Hermes replacement boundary.

## Narrative Model

The deterministic model now derives:

- facts: role, child age, school involvement, services, family structure
- emotions: exhaustion, fear, guilt, loneliness, confusion, helplessness
- pressure sources: school, finances, housing, work, relationship, custody, isolation
- attempts already made: school conversations, calls, services, support attempts
- underlying needs: reassurance, structure, support, validation, direction, relief
- narrative themes: carrying alone, fear for child, loss of direction, isolation, pressure from multiple sides
- central human question: the question beneath the factual story

## Anti-Repetition Engine

For follow-up messages, the engine:

1. Builds context from previous user messages.
2. Builds context from all user messages.
3. Compares new emotions, pressures, needs, themes, and concerns.
4. Responds primarily to the new signal.
5. Avoids repeating known facts such as child age, role, or earlier school concerns.

## Limitations

- Deterministic matching can miss unexpected language.
- It does not diagnose or infer certainty.
- Narrative memory is session-scoped only.
- No Hermes, ARC, or Ryzen integration was implemented.
