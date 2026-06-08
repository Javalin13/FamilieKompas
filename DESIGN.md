---
design_system:
  name: FamilieKompas
  version: 0.1
  status: design_contract
  implementation_status: not_implemented
  source_inspiration:
    - google_labs_design_md
  principles:
    - conversation_first
    - human_first
    - calm_structure
    - trust_before_growth
    - accessibility_by_default
tokens:
  color:
    background: "#fbf7ef"
    surface: "#fffdf8"
    text: "#24342f"
    muted_text: "#60706a"
    border: "#e4ded2"
    primary: "#2f6f5e"
    primary_soft: "#dcebe4"
    warm_support: "#f0e3cf"
    safety: "#8a3b2f"
  radius:
    small: "6px"
    default: "8px"
    large: "12px"
  shadow:
    soft: "0 10px 30px rgba(36, 52, 47, 0.08)"
  spacing:
    xs: "4px"
    sm: "8px"
    md: "16px"
    lg: "24px"
    xl: "32px"
    section: "56px"
  typography:
    body_family: "system-ui"
    heading_weight: 650
    body_weight: 400
    line_height_body: 1.65
    line_height_heading: 1.15
---

# FamilieKompas Design Contract

## Purpose

This file gives future coding agents a persistent design-system contract for FamilieKompas. It follows the same direction as Google Labs DESIGN.md: machine-readable tokens first, then human-readable design rationale. The tokens above are normative unless a future design-system update explicitly changes them.

## Product Feeling

FamilieKompas should feel like a trusted guide helping families find their next step. It should be warm, calm, premium, practical, and human. It should not feel clinical, robotic, corporate, gamified, or like an AI product.

## Visual Identity

The visual world is soft but structured:

- Warm cream backgrounds.
- Paper-like surfaces.
- Deep green as the primary trust color.
- Muted green-gray text for secondary information.
- Sand tones for warmth and family context.
- Safety color used sparingly for urgent guidance.

Avoid purple AI gradients, sterile hospital blues, aggressive reds, large decorative blobs, heavy shadows, and tech-brand visual language.

## Typography Direction

Use a readable system sans-serif until a dedicated brand typeface is chosen. The typography should feel quiet and mature:

- Body text should be comfortable for stressed readers.
- Headings should be clear, not heroic.
- Avoid oversized marketing headlines on support screens.
- Avoid dense legalistic paragraphs in primary flows.
- Use short paragraphs and meaningful section titles.

## Spacing And Rhythm

Spacing should reduce cognitive load:

- Conversation screens should have generous vertical rhythm.
- Forms should ask one clear thing at a time.
- Result pages should use sections that are easy to scan.
- Admin views should be denser than family-facing views but still calm.
- Mobile layouts must avoid cramped action areas.

Use the spacing tokens as a base rhythm. Do not invent many one-off spacing values unless the component needs a specific correction.

## Component Principles

Cards are for repeated items, forms, modals, and focused result sections. Avoid nested cards and floating boxes around entire pages.

Buttons should be clear and restrained:

- Primary actions use the primary green.
- Secondary actions use surface and border.
- Safety actions may use the safety color only when the action is urgent.

Inputs should feel supportive:

- Large enough for comfortable typing.
- Clear labels.
- Helpful placeholder text only when it reduces hesitation.
- Error states that explain the next correction.

Conversation bubbles should be human and readable. They should not mimic a robot assistant brand. The interface should make the user feel accompanied, not processed.

## Chat Interface Principles

The chat interface is the primary product surface. It should:

- Start quickly.
- Ask one clear thing at a time.
- Let the user write naturally.
- Show progress through listening, structure, and action.
- Avoid robotic assistant language.
- Avoid exposing Hermes or AI as the user-facing promise.

## Result Page Principles

The result page should feel like a calm handover note. It should:

- Lead with a short summary.
- Make the first next step visible.
- Separate practical steps from urgent resources.
- Keep professional boundaries clear.
- Avoid diagnostic language and long generic blocks.

## Form And Follow-Up Principles

Forms should request the minimum needed information:

- Ask for contact details only when follow-up is requested.
- Explain why information is needed.
- Keep consent visible.
- Avoid account pressure.
- Use gentle error messages with concrete correction steps.

## Emotional UX Principles

FamilieKompas users may arrive tired, ashamed, scared, or overwhelmed. The interface should:

- Lower pressure.
- Ask less before giving value.
- Reflect the user's situation without judging.
- Offer the next step before offering an ecosystem.
- Make boundaries visible without leading with fear.
- Keep the founder's human mission present without over-personalizing every screen.

## Accessibility Expectations

- Maintain strong contrast for all text and controls.
- Do not rely on color alone for urgency or status.
- Preserve keyboard access for forms, navigation, login, and feedback.
- Keep focus states visible.
- Use semantic headings and labels.
- Make safety resources easy to scan on mobile.
- Do not hide critical safety language inside accordions.

## Mobile Expectations

Most stressed parents will likely arrive on a phone. Mobile screens must:

- Keep the main action visible.
- Avoid cramped text inputs.
- Preserve readable line lengths.
- Keep safety resources scannable.
- Avoid fixed panels that trap content.
- Prevent layout shift during conversation and result generation.

## Tone In Interface Copy

Tone should be Dutch-first, clear, and grounded:

- Use plain language.
- Prefer "volgende stap" over abstract transformation language.
- Avoid therapy, diagnosis, and medical claims.
- Avoid AI language in user-facing copy.
- Avoid exaggerated reassurance.
- Name limits calmly.

## What To Avoid

- Robot imagery or AI-branding.
- Clinical diagnosis framing.
- Therapy-style claims.
- Legal or medical advice claims.
- Overbuilt dashboards before real demand.
- Premature accounts, payments, portals, or marketplaces.
- Endless deterministic empathy templates.
- Dark, dramatic, or crisis-heavy visual atmospheres.

## Why These Choices Exist

FamilieKompas serves people in moments of confusion. The design must create enough safety for someone to describe a hard situation, enough structure to make the next step visible, and enough restraint to avoid pretending to be a professional service. The design system exists to keep that feeling consistent as future agents add Hermes, portals, subscriptions, and organization-facing infrastructure.
