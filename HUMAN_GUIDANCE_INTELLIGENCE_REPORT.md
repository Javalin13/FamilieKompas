# Human Guidance Intelligence Report

## Changes Made

- Expanded deterministic context extraction with more fact recognition:
  - parent role
  - child role
  - child age
  - school involvement
  - support network signals
  - relationship/custody hints
  - services already contacted
  - previous actions
- Added emotional signal recognition for exhaustion, overwhelm, guilt, shame, fear, loneliness, helplessness, hopelessness, confusion, and frustration.
- Added pattern recognition for caregiver overload, isolation/support gaps, school-behavior tension, developmental concerns, behavioral concerns, unclear support routes, failed progress after prior attempts, and decision paralysis.
- Moved deeper deterministic reply generation into `lib/conversation/conversationIntelligence.ts`, preserving the future Hermes replacement boundary.
- Improved result generation so it focuses on interpretation, perspective, and direction instead of repeating the user story.

## Patterns Implemented

- `zorgdrager-overbelasting`: detects signals that the parent is carrying too much alone.
- `isolatie-of-steunnetwerkgat`: detects lack of support network or feeling alone.
- `school-gedrag-spanningsveld`: detects school concerns combined with behavior concerns.
- `ontwikkelingszorg`: detects development or learning delay concerns.
- `gedragszorg`: detects behavioral or aggression-related concerns.
- `ondersteuningsroute-onduidelijk`: detects not knowing which support route to take.
- `pogingen-zonder-voelbare-vooruitgang`: detects prior attempts without felt progress.
- `beslissingsverlamming`: detects not knowing what to do next.

## Reflection Strategies Added

The assistant now prefers reflection questions that create clarity instead of collecting facts already known.

Examples:

- "Wat maakt je op dit moment het meest bang: wat dit betekent voor je kind, of hoe lang jij dit nog alleen kan blijven dragen?"
- "Als er vandaag een betrouwbare volwassene naast je stond, welk stuk zou dan meteen lichter voelen?"
- "Welke keuze zou vandaag al genoeg zijn, zelfs als de rest nog onduidelijk blijft?"

## Perspective-Generation Logic

The system now looks for hidden pressure and competing priorities.

Example interpretation:

"School maakt zich zorgen over je kind, terwijl jij tegelijk veel alleen lijkt te dragen. Die twee dingen kunnen samenhangen, maar het zijn niet noodzakelijk hetzelfde probleem."

This preserves boundaries:

- no diagnosis
- no therapy claim
- no certainty beyond user-provided signals
- no medical/legal advice

## Limitations

- This remains deterministic and rule-based.
- It can miss nuance when users use unexpected wording.
- It can over-emphasize a pattern if keywords appear without enough context.
- It does not replace professional judgment.
- It is prepared for Hermes/AI replacement through `conversationIntelligence.ts`, but no AI or Hermes integration was added.
