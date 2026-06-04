# FamilieKompas MVP Execution Plan

Date: 2026-06-04

Objective: launch the smallest real version that validates whether FamilieKompas helps parents and families find their next step when they need support and nobody else is available.

This plan does not add new strategic concepts. It reduces the architecture-complete blueprint to a focused MVP.

## MUST HAVE

### 1. Absolute Minimum Feature Set

The MVP must include only:

- Conversation-first entry
- Listening Mode, Structure Mode, and Action Mode
- Basic safety detection and escalation screen
- Structured case profile
- Basic guidance report
- Simple next-step action plan
- Appointment preparation output
- Basic referral/resource suggestions
- Founder Attention queue
- Founder/admin login
- Minimal resource library
- Minimal professional/support directory
- Consent and disclaimer flow
- Basic user email capture
- Data export/delete request path
- Basic analytics snapshots

Payment can be Stripe-ready in architecture but does not need to launch in the first live user test unless monetization validation is the immediate goal.

### 2. MVP User Journey

1. User arrives on the homepage.
2. The page immediately invites them to start a support conversation.
3. User accepts scope boundaries:
   - not therapy
   - not diagnosis
   - not legal advice
   - not medical advice
   - not emergency services
4. User chooses language: Dutch, French, or English.
5. User chooses a mode:
   - Listening Mode: "I need to explain what is happening."
   - Structure Mode: "I need help organizing the situation."
   - Action Mode: "I need to know what to do next."
6. User answers a short guided conversation.
7. Safety scan runs on submitted text.
8. If safety risk is detected, emergency guidance is shown and normal report flow stops.
9. If no safety block is triggered, system creates:
   - short situation summary
   - main themes
   - immediate next steps
   - appointment preparation
   - relevant resource/referral categories
10. User enters email to save or receive the report.
11. Case is scored for founder attention.
12. Founder sees mission-priority cases in the founder dashboard.

### 3. MVP Database Schema

Use only the core tables needed to validate the mission.

#### tenants

- id UUID primary key
- name text
- tenant_type text
- slug text unique
- default_language text
- supported_languages text[]
- status text
- created_at timestamptz

MVP note: create one default FamilieKompas tenant.

#### users

- id UUID primary key
- tenant_id UUID
- email text nullable
- preferred_language text
- country text nullable
- region text nullable
- created_at timestamptz
- deleted_at timestamptz nullable

#### user_consents

- id UUID primary key
- user_id UUID nullable
- consent_type text
- consent_version text
- granted boolean
- granted_at timestamptz

#### conversation_sessions

- id UUID primary key
- tenant_id UUID
- user_id UUID nullable
- mode text
- status text
- language text
- country text nullable
- region text nullable
- after_hours boolean default false
- started_at timestamptz
- ended_at timestamptz nullable

#### conversation_messages

- id UUID primary key
- conversation_session_id UUID
- sender_type text
- content text
- safety_scanned boolean default false
- created_at timestamptz

MVP retention rule: keep only what is needed for report generation and founder review. Add deletion/export path from the start.

#### cases

- id UUID primary key
- tenant_id UUID
- user_id UUID nullable
- conversation_session_id UUID
- status text
- language text
- country text nullable
- region text nullable
- main_challenge text
- urgency_level text
- created_at timestamptz
- updated_at timestamptz

#### case_profiles

- id UUID primary key
- case_id UUID
- summary text
- structured_json jsonb
- main_topics text[]
- stressors text[]
- practical_constraints text[]
- created_at timestamptz

#### safety_events

- id UUID primary key
- tenant_id UUID
- case_id UUID nullable
- conversation_session_id UUID
- risk_type text
- risk_level text
- matched_indicators text[]
- action_taken text
- created_at timestamptz

#### guidance_reports

- id UUID primary key
- case_id UUID
- report_type text
- status text
- language text
- content_json jsonb
- generated_at timestamptz

#### action_items

- id UUID primary key
- case_id UUID
- title text
- description text
- priority text
- status text
- created_at timestamptz

#### directory_entries

- id UUID primary key
- tenant_id UUID nullable
- entry_type text
- name text
- description text
- country text nullable
- region text nullable
- city text nullable
- languages text[]
- service_topics text[]
- website_url text nullable
- contact_email text nullable
- contact_phone text nullable
- crisis_resource boolean default false
- verified_status text
- created_at timestamptz
- updated_at timestamptz

#### resources

- id UUID primary key
- tenant_id UUID nullable
- title text
- slug text unique
- resource_type text
- language text
- topic_tags text[]
- summary text
- body_md text
- status text
- created_at timestamptz
- updated_at timestamptz

#### founder_attention_items

- id UUID primary key
- tenant_id UUID
- case_id UUID nullable
- conversation_session_id UUID nullable
- user_id UUID nullable
- priority text
- attention_reason text
- status text
- due_at timestamptz nullable
- created_at timestamptz
- resolved_at timestamptz nullable

#### admin_users

- id UUID primary key
- tenant_id UUID nullable
- auth_user_id UUID unique
- role text
- created_at timestamptz

#### growth_metrics_snapshots

- id UUID primary key
- tenant_id UUID nullable
- metric_date date
- metric_scope text
- metrics_json jsonb
- created_at timestamptz

MVP note: use this only for minimal support funnel, safety, conversion, referral, and founder workload metrics.

### 4. MVP Pages

Public/user pages:

- `/[locale]` - conversation-first homepage
- `/[locale]/conversation` - guided conversation
- `/[locale]/safety` - emergency/safety escalation
- `/[locale]/report/[id]` - guidance report
- `/[locale]/resources` - small resource library
- `/[locale]/directory` - small support directory
- `/[locale]/privacy` - privacy policy
- `/[locale]/terms` - terms and scope boundaries
- `/[locale]/data-request` - export/delete request

Admin pages:

- `/[locale]/admin` - admin overview
- `/[locale]/admin/founder-attention` - mission-priority queue
- `/[locale]/admin/cases/[id]` - case summary and report view
- `/[locale]/admin/resources` - resource CRUD
- `/[locale]/admin/directory` - directory CRUD
- `/[locale]/admin/safety` - safety events

### 5. MVP Conversation Flow

The conversation should be short enough to complete in 5-8 minutes.

#### Step 1: Welcome and Boundaries

Ask:

- language
- country/region
- consent to process sensitive family information
- acknowledgement that the platform is not therapy, diagnosis, legal advice, medical advice, or emergency support

#### Step 2: Mode Selection

Options:

- Listening Mode
- Structure Mode
- Action Mode

#### Step 3: Situation Capture

Ask:

- "What is happening right now?"
- "Who is involved?"
- "Are children involved? If yes, what age range?"
- "What feels most difficult today?"
- "What have you already tried?"

#### Step 4: Urgency Check

Ask:

- "Is anyone in immediate danger?"
- "Are there concerns about self-harm, violence, abuse, or a medical emergency?"
- "Do you need urgent help tonight?"

#### Step 5: Practical Context

Ask:

- "What kind of next step would help most?"
- "Do you need to contact a school, professional, service, or family member?"
- "Are there documents, appointments, or deadlines?"

#### Step 6: Output

Generate:

- situation summary
- key themes
- what matters first
- 3-5 next steps
- appointment preparation questions
- relevant resource/referral categories

### 6. MVP Founder-Attention Workflow

Founder attention is not a full support inbox. It is a mission-priority review queue.

Create a founder attention item when:

- safety event exists
- urgency level is high
- after-hours support need is high
- generated output confidence is low
- user expresses repeated overwhelm or no available support
- referral match is weak
- user requests human review

Founder dashboard shows:

- priority
- reason
- short case summary
- safety status
- generated report
- suggested next founder action
- created time

Founder actions:

- mark reviewed
- add internal note
- improve report summary
- suggest better referral/resource
- mark as referral gap
- mark as content gap
- close item

MVP limit:

- no direct live chat with founder
- no promise of response time unless manually offered
- no therapy-style case management

### 7. MVP Report-Generation Workflow

1. Conversation completes.
2. Safety classification runs.
3. If safety block exists, stop normal report.
4. Intake structuring creates case profile.
5. Guidance generation creates JSON report.
6. Report renderer displays user-friendly sections.
7. Founder attention scoring runs.
8. User can enter email to receive report link.

Report sections:

- "What you described"
- "What seems most important right now"
- "A few reflection points"
- "Practical next steps"
- "Preparing for a conversation or appointment"
- "Possible support directions"
- "Important boundaries"

Hard boundaries:

- no diagnosis
- no treatment plan
- no legal advice
- no medical advice
- no emergency handling

### 8. MVP Safety Workflow

Safety must be simple, strict, and tested.

Trigger categories:

- self-harm
- suicide
- child abuse concern
- domestic violence
- medical emergency
- immediate danger

Workflow:

1. Safety classifier runs on conversation text.
2. If clear risk exists, create safety_event.
3. Stop standard guidance report.
4. Show safety page with:
   - calm acknowledgement
   - "FamilieKompas is not an emergency service"
   - call local emergency services if immediate danger
   - country-specific emergency resources where available
   - recommendation to contact qualified professional or trusted local authority
5. Create founder_attention_item for review.

MVP emergency resources:

- EU emergency number 112
- country-specific suicide/domestic violence/child safety resources for launch geography

Before launch:

- manually verify every crisis resource
- run safety test cases
- legally review disclaimers if possible

### 9. MVP Deployment Architecture

Recommended MVP stack:

- Next.js App Router
- TypeScript
- Tailwind
- Supabase Postgres
- Supabase Auth for admin only at first
- Supabase RLS
- Supabase Storage only if needed for downloadable PDFs
- One background job mechanism for reminders/metrics if needed
- One email provider for report links and admin alerts
- Hosted on Vercel

MVP architecture:

- public conversation app
- server-side generation routes/actions
- Supabase database
- admin dashboard protected by auth
- email notifications for founder attention alerts
- one default tenant

Do not overbuild:

- no complex job orchestration
- no multi-region deployment
- no mobile app
- no partner portal
- no organization portal

### 10. Estimates

Development effort:

- 4-6 weeks for a focused solo/small-team MVP
- 6-8 weeks if multilingual polish, PDF generation, and admin quality workflows are included from day one

Technical complexity:

- Medium

Primary complexity drivers:

- safety workflow correctness
- multilingual prompt/report consistency
- privacy and consent handling
- founder attention routing
- clean report generation from conversation data

Risk level:

- Medium-high

Primary risks:

- safety boundary failures
- report quality not good enough for real parents
- over-scoping into full platform
- referral/resource quality too thin
- founder dashboard becoming a support inbox

## SHOULD HAVE LATER

Build after first real-user validation:

- Stripe payments
- premium report upsell
- premium human review purchase flow
- account dashboard for users
- saved case history
- weekly follow-up automation
- PDF export
- richer resource library
- richer professional directory
- Content Agent
- SEO Agent
- Partnership Agent
- Analytics Agent beyond minimum snapshots
- tenant-specific growth dashboards
- white-label pilot configuration
- newsletter automation
- organization reports
- advanced admin roles
- translation management workflow

These are valuable, but they are not required to validate the core mission.

## DO NOT BUILD YET

Do not build in the MVP:

- mobile app
- professional portal
- partner portal
- municipal portal
- school portal
- full multi-tenant admin experience
- live founder chat
- peer community/forum
- social media automation
- TikTok/Instagram/Facebook/LinkedIn publishing
- advanced CRM automation
- full white-label sales pipeline
- subscription billing
- professional network subscriptions
- referral partnership monetization
- complex analytics warehouse
- complex background job infrastructure
- document upload system
- co-parent collaboration tools
- real-time messaging between users
- therapy-like progress tracking
- legal document generation
- medical or diagnostic screening

## Step-By-Step Implementation Sequence

### Step 1: Project Foundation

Build:

- Next.js app
- TypeScript
- Tailwind
- locale routing
- Supabase client/server setup
- admin auth

Goal: have the app shell, database connection, and admin protection working.

### Step 2: Core Database And RLS

Build MVP tables:

- tenants
- users
- user_consents
- conversation_sessions
- conversation_messages
- cases
- case_profiles
- safety_events
- guidance_reports
- action_items
- directory_entries
- resources
- founder_attention_items
- admin_users
- growth_metrics_snapshots

Goal: store a full conversation-to-report flow safely.

### Step 3: Public Conversation Entry

Build:

- homepage
- consent/scope boundary UI
- language selection
- mode selection
- guided conversation form

Goal: user can complete a short support conversation.

### Step 4: Safety Workflow

Build:

- safety classifier
- safety event creation
- safety escalation page
- crisis resource seed data
- safety test cases

Goal: safety risks stop normal report generation.

### Step 5: Case Profile And Report Generation

Build:

- intake structuring
- case profile creation
- basic report generation
- report rendering page

Goal: user gets a useful, non-clinical next-step report.

### Step 6: Referral And Resource Suggestions

Build:

- resource seed content
- directory seed entries
- simple topic/language/location matching
- report section for support directions

Goal: user sees practical next places to turn.

### Step 7: Founder Attention Queue

Build:

- attention scoring rules
- founder attention item creation
- admin queue
- case detail page
- founder actions
- email alert for high-priority items

Goal: founder sees only mission-priority cases.

### Step 8: Email Capture And Report Link

Build:

- optional email capture
- report link email
- basic data request page

Goal: user can return to their report and request export/deletion.

### Step 9: Minimal Analytics

Track:

- conversation started
- conversation completed
- safety escalations
- reports generated
- referral/resource clicks
- founder attention items
- email captures

Goal: know whether the MVP is helping and where users drop off.

### Step 10: Private Real-User Launch

Launch with:

- small verified resource directory
- verified safety resources
- founder monitoring
- feedback form
- 20-50 real parents

Success criteria:

- users complete conversations
- users say the output helped them understand the next step
- safety flow behaves correctly
- founder queue remains manageable
- resource/referral suggestions are relevant enough to continue

## MVP Success Metrics

Minimum validation metrics:

- 60%+ conversation completion rate
- 70%+ of completed users report "I know my next step"
- safety escalations route correctly in 100% of test cases
- founder attention queue remains under agreed weekly capacity
- at least 30% of users click or save a resource/referral suggestion
- at least 20 real-user feedback responses collected

If these fail, improve the conversation/report/referral quality before adding paid features or growth automation.
