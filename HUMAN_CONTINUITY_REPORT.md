# Human Continuity Report

## Changes Made

- Reduced repeated fact restatement in the conversation engine.
- Adjusted guidance language from "what we identified" toward "what this may mean."
- Added continuity after value delivery with a follow-up choice on the result page.
- Added minimal follow-up persistence and founder visibility.
- Preserved deterministic behavior and the existing Hermes replacement boundary.

## Continuity Improvements

The result page now asks:

"Wil je dat FamilieKompas dit verder opvolgt?"

Options:

- Dit is voldoende
- Ik wil hier later op terugkomen
- Ik wil graag verdere opvolging

Contact details are only requested after the user asks to return later or requests further follow-up.

## Repetition Reductions

Conversation replies now avoid repeating known facts such as single-parent status, child age, and school concerns unless needed for interpretation.

The assistant instead moves toward:

- pressure sources
- hidden assumptions
- conflicting signals
- possible blind spots
- what deserves attention first

## Real Guidance Improvements

The guidance output now focuses on:

- what may be happening beneath the surface
- what deserves attention first
- what does not need to be solved today
- one thing not to carry alone
- one reflection question that can create movement

## Limitations

- The system remains deterministic.
- Follow-up is not an account system.
- No scheduling, messaging, automation, or CRM was added.
- Founder follow-up remains a simple list inside `/beheer`.
- Hermes, Ryzen, ARC infrastructure, AI providers, and memory federation were not implemented.
