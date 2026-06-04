# FamilieKompas MVP Simplification Review

Date: 2026-06-04

Core validation question: can FamilieKompas help a parent find a useful next step when support is unavailable?

This review challenges every component in the MVP Execution Plan. The goal is a smaller MVP, not a better-looking platform.

## Classification Summary

### Must Exist For Launch

These are required to validate the core mission with real parents:

- Conversation-first entry
- Scope boundary and consent acknowledgement
- One launch language, with copy prepared for later translation
- Short guided conversation
- Basic safety detection
- Safety escalation screen with verified emergency resources
- Basic generated next-step output
- Report page or result screen
- Minimal resource/referral suggestions as static curated lists
- Founder notification for high-risk or mission-priority cases
- One protected founder/admin view or simple database-backed review list
- Basic event tracking through simple database fields or lightweight analytics
- Feedback capture

### Can Wait Until After First Paying Users

These are useful after the first validation loop, but not required for first launch:

- Dutch, French, and English fully polished at launch
- Separate Listening, Structure, and Action Mode UI
- Structured case profile as a separate table
- Appointment preparation as a separate module
- Action items as separate database records
- User email capture and report email
- Saved report links
- Founder dashboard with multiple pages
- Directory CRUD
- Resource CRUD
- Data export/delete self-service page
- PDF export
- Stripe payments
- Premium reports
- Weekly follow-up automation
- Basic user account dashboard
- Rich analytics snapshots

### Can Wait Until After Product-Market Fit

These should not shape the first launch:

- Full multi-tenant implementation
- White-label configuration
- Growth Operating System
- Content Agent
- SEO Agent
- Community Agent
- Partnership Agent
- Advanced Analytics Agent
- Professional portal
- Partner portal
- Organization portals
- Mobile app
- Social media automation
- Subscription billing
- Professional subscriptions
- Referral monetization
- Complex CRM
- Advanced admin roles
- Translation management workflow

## Component Challenge

### Conversation-First Entry

Classification: must exist for launch.

Reason: this is the core experience. Without it, the MVP becomes a website and cannot validate the mission.

Simplification:

- Use one page with a guided form or chat-like flow.
- Do not build a sophisticated chat engine.

### Listening / Structure / Action Modes

Classification: can wait until after first paying users as separate UI modes.

Reason: the ideas matter, but the first version can bake them into one flow:

- listen: ask what is happening
- structure: summarize the situation
- action: provide next steps

Simplification:

- Do not ask users to choose a mode yet.
- Use one guided flow that naturally moves from listening to structure to action.

### Multilingual Support

Classification: can wait until after first paying users for full multilingual implementation.

Reason: three-language launch increases QA, copy, prompt, and safety burden.

Simplification:

- Launch first in one language, likely Dutch if the first market is Flanders.
- Keep the code locale-ready but do not translate every flow before validation.

### Safety Detection And Escalation

Classification: must exist for launch.

Reason: the product touches family distress and cannot safely launch without this.

Simplification:

- Use strict keyword/rule detection plus model classification if available.
- Keep the escalation output static and verified.
- Stop normal guidance when safety triggers.

### Structured Case Profile

Classification: can wait until after first paying users as a separate persistent object.

Reason: the user needs a summary and next steps, not necessarily a stored normalized profile.

Simplification:

- Generate a structured JSON object inside the report record.
- Add a separate case_profiles table later.

### Basic Guidance Report

Classification: must exist for launch.

Reason: the first validation depends on whether the user leaves with clarity.

Simplification:

- Generate one concise result screen, not a full downloadable report.
- Sections:
  - what you described
  - what seems most important
  - what to do next
  - who or what to contact
  - important boundaries

### Simple Action Plan

Classification: must exist for launch, but not as separate action item records.

Reason: next steps are core to the mission.

Simplification:

- Put 3 next steps directly inside the report JSON.
- Do not build tracking, statuses, due dates, or reminders.

### Appointment Preparation

Classification: can wait until after first paying users as a separate module.

Reason: it is valuable, but "find my next step" can be validated with a short "questions to ask" section.

Simplification:

- Include 3 suggested questions in the report.
- Do not build appointment-prep pages or tables.

### Referral / Resource Suggestions

Classification: must exist for launch in minimal form.

Reason: a next step often means knowing what type of support to contact.

Simplification:

- Use static curated resources by topic and region.
- Do not build directory search, filters, or admin CRUD.

### Founder Attention Workflow

Classification: must exist for launch in minimal form.

Reason: founder oversight protects mission quality.

Simplification:

- Create a simple alert list or email notification.
- Only alert on safety, high urgency, failed referral, or user feedback concern.
- Do not build a full founder dashboard with workflows yet.

### Founder/Admin Login

Classification: can wait until after first paying users if founder alerts go by email and review happens in Supabase.

Reason: admin UI takes time and does not directly validate user value.

Simplification:

- Fastest launch can use Supabase dashboard plus email alerts.
- Highest-confidence launch should include one protected admin list.

### Minimal Resource Library

Classification: can wait until after first paying users as a browsable page.

Reason: curated suggestions inside the result are enough for first validation.

Simplification:

- Store or hardcode 10-20 verified resources.
- No public library page for fastest launch.

### Professional / Support Directory

Classification: can wait until after first paying users.

Reason: a full directory is not needed to validate next-step guidance.

Simplification:

- Provide support categories and a small verified resource list.
- Add directory search later.

### Consent And Disclaimer Flow

Classification: must exist for launch.

Reason: boundaries are legally and ethically central.

Simplification:

- One short required acknowledgement before starting.
- Link to static terms/privacy pages.

### User Email Capture

Classification: can wait until after first paying users.

Reason: report delivery is convenient, not essential.

Simplification:

- Show result immediately.
- Use optional feedback form.
- Add email capture only if retention/recontact is required for test cohort.

### Data Export / Delete Request Path

Classification: can wait until after first paying users as self-service, but manual contact must exist at launch.

Reason: privacy requests must be possible, but not automated.

Simplification:

- Static privacy page with email contact for deletion/export.
- Build self-service later.

### Basic Analytics Snapshots

Classification: can wait until after first paying users as a database snapshot system.

Reason: first launch can use simple event logs or external lightweight analytics.

Simplification:

- Track only conversation started, completed, safety triggered, report generated, feedback submitted.

## Database Table Challenge

### Must Exist For Launch

Use the smallest schema:

#### conversations

- id UUID primary key
- language text
- country text nullable
- region text nullable
- status text
- urgency_level text nullable
- safety_status text
- user_input_json jsonb
- result_json jsonb nullable
- feedback_json jsonb nullable
- created_at timestamptz
- completed_at timestamptz nullable

#### safety_events

- id UUID primary key
- conversation_id UUID
- risk_type text
- risk_level text
- action_taken text
- created_at timestamptz

#### founder_alerts

- id UUID primary key
- conversation_id UUID nullable
- reason text
- priority text
- status text
- created_at timestamptz
- resolved_at timestamptz nullable

#### resources

- id UUID primary key
- title text
- language text
- country text nullable
- region text nullable
- topic_tags text[]
- url text nullable
- description text
- crisis_resource boolean default false
- verified boolean default false
- created_at timestamptz

#### admin_users

- id UUID primary key
- auth_user_id UUID unique
- role text
- created_at timestamptz

### Can Wait Until After First Paying Users

- users
- user_consents
- conversation_sessions
- conversation_messages
- cases
- case_profiles
- guidance_reports
- action_items
- directory_entries
- growth_metrics_snapshots

These can be replaced initially by one `conversations` table with JSON fields.

### Can Wait Until After Product-Market Fit

- tenants
- tenant_settings
- content_calendar_items
- seo_opportunities
- community_insights
- partner_leads
- partner_outreach_events
- full audit_logs

## Workflow Challenge

### Must Exist For Launch

One flow:

1. Read short boundary statement.
2. Answer 6-8 guided questions.
3. Run safety detection.
4. If unsafe, show emergency guidance.
5. If safe, generate a concise next-step result.
6. Show 3 next steps and 2-4 relevant resources.
7. Ask: "Was this helpful in finding your next step?"
8. Alert founder only when necessary.

### Can Wait Until After First Paying Users

- separate report generation pipeline
- separate case profile creation
- appointment prep workflow
- email report workflow
- founder action workflow
- referral matching engine
- user account flow

### Can Wait Until After Product-Market Fit

- white-label workflows
- growth workflows
- CRM workflows
- community workflows
- tenant analytics workflows

## Page Challenge

### Must Exist For Launch

- `/` or `/nl` - landing plus start conversation
- `/conversation` - guided flow
- `/result/[id]` - result screen
- `/safety` - safety escalation
- `/privacy` - static privacy
- `/terms` - static terms and boundaries

Optional but useful:

- `/admin` - simple founder alert list

### Can Wait Until After First Paying Users

- `/resources`
- `/directory`
- `/data-request`
- `/admin/cases/[id]`
- `/admin/resources`
- `/admin/directory`
- `/admin/safety`

### Can Wait Until After Product-Market Fit

- tenant pages
- partner pages
- organization dashboards
- user account dashboard
- growth dashboard

## Launch Versions

### Smallest Possible Launch Version

Goal: validate usefulness with the least code.

Build:

- one-language guided conversation
- static consent/boundary copy
- safety detection and safety page
- generated result screen
- static verified resources
- simple feedback capture
- founder email alert for high-risk/high-need cases
- no admin dashboard
- no user accounts
- no email report
- no directory page
- no resource library page

Database:

- conversations
- safety_events
- founder_alerts
- resources

Estimated effort:

- 10-15 working days

Technical complexity:

- Low-medium

Risk level:

- Medium-high because founder review and admin workflows are manual.

### Fastest Possible Launch Version

Goal: get 10-20 parents through the flow fastest with founder supervision.

Build:

- static landing page
- Typeform/Tally-like embedded intake or custom simple form
- server-side report generation
- safety keyword/model check
- result page or email/manual delivery
- founder reviews all outputs before users receive them for the first pilot

Database:

- conversations
- safety_events

Estimated effort:

- 5-10 working days

Technical complexity:

- Low

Risk level:

- Medium because human review slows scale, but it reduces report-quality risk.

Tradeoff:

- This validates value, not automation.

### Highest-Confidence Launch Version

Goal: validate real automated support while keeping safety and founder oversight credible.

Build:

- one-language conversation-first flow
- one integrated listen-structure-action journey
- safety detection and verified safety page
- generated result screen
- static resource/referral suggestions
- feedback capture
- simple protected admin page for founder alerts and conversation review
- optional email capture for report link
- basic event tracking

Database:

- conversations
- safety_events
- founder_alerts
- resources
- admin_users

Estimated effort:

- 3-4 weeks

Technical complexity:

- Medium

Risk level:

- Medium

Tradeoff:

- Slower than the fastest version, but it tests the actual product shape better.

## Recommended Version To Build First

Build the Highest-Confidence Launch Version first.

Reason:

- The fastest version relies too heavily on manual founder review and does not validate the automated after-hours mission.
- The smallest version lacks enough founder review tooling to safely learn from real family situations.
- The highest-confidence version is still small, avoids accounts/payments/directories/multi-tenancy/growth automation, and tests the real core loop: parent explains situation, system structures it, safety is handled, parent receives next steps, founder sees mission-priority cases.

## Revised MVP Definition

The first launch should be:

- one language
- one conversation flow
- one result screen
- one safety flow
- one static resource set
- one founder alert list
- no user accounts
- no payments
- no public directory
- no resource library UI
- no full admin dashboard
- no growth system
- no multi-tenant UI

This is the smallest version that still validates the mission with real parents.
