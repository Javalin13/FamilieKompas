# Design System Implementation Plan

## Purpose

This plan explains how `DESIGN.md` should later be applied. It is not a redesign implementation task.

## Sequence

1. Confirm the current MVP flow remains stable.
2. Translate `DESIGN.md` tokens into Tailwind theme values.
3. Create a small set of reusable primitives only when repeated patterns exist.
4. Apply the system to family-facing pages first.
5. Apply the system to founder/admin views second.
6. Extend the system to future portals only after those portals are validated.

## Landing Page

Later improvements should:

- Lead with human support, not platform features.
- Keep the first screen calm and direct.
- Make the primary action obvious.
- State boundaries in plain Dutch.
- Avoid marketing clutter before the conversation entry point.

## Conversation Page

Later improvements should:

- Make conversation the primary interface.
- Strengthen Listening, Structure, and Action mode transitions.
- Improve message readability and pacing.
- Keep safety messaging accessible without dominating normal flow.
- Avoid expanding deterministic empathy templates as the main solution.

## Result Page

Later improvements should:

- Use the result sections defined in the human experience blueprint.
- Make the first next step visually prominent.
- Keep resources scannable.
- Avoid report-like density.
- Include follow-up gently after value has been delivered.

## Follow-Up Form

Later improvements should:

- Keep the request optional.
- Ask only for information needed for follow-up.
- Explain why contact details are requested.
- Avoid account pressure.

## Founder Admin

Later improvements should:

- Improve alert hierarchy.
- Distinguish crisis, high-need, mission-priority, and follow-up cases.
- Surface suggested next review steps.
- Preserve simplicity until founder workload proves the need for richer workflows.

## Future Portals

The same design system should extend to:

- Family Portal.
- Partner Portal.
- School Portal.
- Municipality Portal.
- Association Portal.

Each portal should have its own density and task model, but all must preserve the same trust, consent, and calm structure.

## Do Not Implement In This Phase

- Full visual redesign.
- Component library extraction.
- Design token build tooling.
- Portal UI.
- Account UI.
- Payment UI.
- Hermes UI states.

## Success Criteria For Later Implementation

- Family-facing screens feel warmer and less mechanical.
- Result pages are easier to scan.
- Founder views are clearer without becoming a dashboard suite.
- The design system reduces one-off styling decisions.
- No production behavior changes are introduced by design-only work.
