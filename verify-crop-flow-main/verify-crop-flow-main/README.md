# AgriTrust Verify

Build a complete, production-quality, premium Agricultural Collection Operator Portal called "AgriTrust".

This is a real operational web application designed for agricultural collection operators working at rural collection centers in India.

The core purpose of the application is to reduce crop grading fraud by creating a transparent, evidence-backed transaction between:

OPERATOR → FARMER → ADMIN

The application must combine:

- Premium modern agritech visual design

- Extremely fast transaction workflow

- Mobile-first field usability

- Responsive desktop experience

- Visual audit evidence

- Farmer verification

- Weight and grading capture

- OTP / farmer approval handshake

- Immutable transaction locking

- Offline-first transaction support

- Automatic synchronization

- Realtime transaction updates

- Daily ledger

- Dispute management

- Audit trail

- Accessibility

- PWA capabilities

Do not build a generic CRUD dashboard.

This must feel like a polished startup product that could realistically be launched as a commercial agricultural operations platform.

==================================================

1. PRODUCT DESIGN PHILOSOPHY

==================================================

The application should feel like a combination of:

- Premium fintech transaction platform

- Modern field-service application

- High-end agritech SaaS

- Modern mobile banking UX

- Premium agricultural management application

The interface must communicate:

TRUST

VERIFICATION

TRANSPARENCY

SPEED

SECURITY

SIMPLICITY

The operator is usually outdoors, potentially standing beside agricultural weighing equipment, using a smartphone with one hand.

Therefore:

- Primary actions must be extremely obvious.

- Buttons must be large.

- Typography must be highly readable.

- Important information must never be buried.

- Transaction flow must require minimal typing.

- Camera capture must be extremely simple.

- Status must always be visible.

- Offline state must never feel like an application failure.

- Loading states must be clear.

- Error messages must be human-readable.

The product should look sophisticated without sacrificing usability.

==================================================

2. VISUAL DESIGN DIRECTION

==================================================

Use the uploaded agricultural UI references as visual inspiration.

DO NOT copy their branding, layouts, logos, text, illustrations, or exact interfaces.

Use their visual language as inspiration for:

- Premium agricultural photography

- Large typography

- Full-bleed imagery

- Floating cards

- Soft glass surfaces

- Rounded corners

- Elegant mobile layouts

- Natural green color systems

- Spacious compositions

- Premium dashboard cards

- Minimal iconography

- Layered UI

- Strong visual hierarchy

The application should have a distinctive visual identity.

Primary colors:

Deep Forest Green:

#14532D

Agricultural Green:

#16A34A

Emerald:

#10B981

Sage:

#DDEAD9

Soft Sage:

#EEF6EC

Warm Cream:

#FAF8F2

Warm White:

#FFFFFF

Dark Text:

#17251D

Secondary Text:

#647067

Border:

#DDE5DD

Pending Amber:

#F59E0B

Pending Background:

#FEF3C7

Error Red:

#DC2626

Success:

#16A34A

Do not use neon green.

Do not use cyberpunk colors.

Do not use purple as a primary brand color.

Do not use excessive gradients.

Do not make every component glassmorphic.

Glassmorphism should be used selectively for:

- Hero overlays

- Floating statistics

- Status cards

- Camera instructions

- Approval states

- Important floating controls

Most operational cards should remain clean white/cream surfaces.

==================================================

3. TYPOGRAPHY

==================================================

Use a premium modern sans-serif font.

Preferred:

Inter

or

SF Pro-like typography

or

Satoshi

Use:

Large bold numerical values

Medium-weight section headings

Clean readable body text

Small uppercase metadata labels

Example hierarchy:

Page title:

32–40px desktop

26–32px mobile

Section heading:

22–28px

Card heading:

16–20px

Body:

14–16px

Metadata:

12–14px

Numbers:

32–48px

Never use tiny text for important information.

==================================================

4. PHOTOGRAPHY STYLE

==================================================

Use realistic agricultural photography.

Preferred imagery:

- Indian farmland

- Rice fields

- Wheat

- Vegetables

- Fruits

- Harvested crops

- Rural collection centers

- Weighing scales

- Farmers

- Agricultural workers

- Produce sacks

- Green crop fields

- Rural roads

- Morning sunlight

- Golden-hour agricultural scenes

Photography should feel authentic and premium.

Use images in:

- Dashboard hero

- Empty states

- Login page

- Transaction success

- Camera audit screen

- Farmer identification

- Offline mode

- Marketing/landing sections if applicable

Do not use cartoon farming illustrations.

Do not use generic Western farm imagery everywhere.

Prioritize realistic Indian agricultural environments.

==================================================

5. RESPONSIVE ARCHITECTURE

==================================================

The application must be fully responsive.

PRIMARY:

Mobile smartphone

SECONDARY:

Tablet

DESKTOP:

Large-screen operator workstation

Mobile should feel like a complete first-class product, not a squeezed desktop layout.

Mobile:

360px

390px

412px

Tablet:

768px+

Desktop:

1024px+

Large desktop:

1440px+

==================================================

6. DESKTOP APPLICATION SHELL

==================================================

On desktop use a premium application shell.

Left sidebar:

AgriTrust logo

Operator Portal

Navigation:

Home

New Delivery

Transactions

Sync Center

Disputes

Profile

Bottom of sidebar:

Connection status

Online • Synced

Operator avatar

Rahul

Operator ID

OP-2048

Logout

The sidebar should have:

- Rounded navigation items

- Minimal icons

- Active green indicator

- Clean spacing

- No excessive borders

Main content should have generous whitespace.

Do not make the desktop interface look like a traditional enterprise ERP.

==================================================

7. MOBILE NAVIGATION

==================================================

On mobile use a floating bottom navigation bar.

Items:

Home

Transactions

Sync

Profile

During the four-step transaction workflow:

Minimize navigation distractions.

Show a compact back button and workflow progress indicator.

==================================================

8. LOGIN PAGE

==================================================

Create a premium login experience.

Desktop:

Split screen.

Left side:

Large agricultural photograph.

Overlay:

AgriTrust

"Transparent collection. Verified transactions."

Small supporting text:

"Digital verification for modern agricultural collection centers."

Right side:

Clean login card.

Heading:

"Welcome back"

Subtitle:

"Sign in to your Operator Portal."

Fields:

Phone / Email

Password

Remember me

Forgot password?

Button:

"Sign In"

Below:

"Operator access only"

Show security indicator:

Secure connection

Mobile:

Use agricultural background with dark green overlay.

Keep login form extremely clean.

==================================================

9. DASHBOARD

==================================================

Create the main Operator Dashboard.

Desktop layout:

Hero section

Metrics

Primary action

Today's activity

Pending approvals

Recent disputes

Sync status

Mobile layout:

Hero image

Operator greeting

Connection status

Two metric cards

Start New Delivery

Today's Activity

Bottom navigation

Header:

"Good morning, Rahul"

Small location:

"Collection Center • Nashik"

Connection pill:

🟢 Online • Synced

Hero background:

Realistic agricultural collection center / crop field.

Statistics:

TOTAL WEIGHT TODAY

1,248.50 kg

PENDING APPROVALS

07

VERIFIED TODAY

18

DISPUTES

02

On mobile only show the most important two metrics prominently.

==================================================

10. PRIMARY CTA

==================================================

The primary action throughout the dashboard must be:

START NEW DELIVERY

Large deep green button.

Icon:

Plus / Package / Harvest

Secondary text:

"Create a verified collection transaction"

Click:

/delivery/farmer

==================================================

11. NEW DELIVERY WORKFLOW

==================================================

This is the most important part of the application.

The transaction workflow consists of:

STEP 1:

IDENTIFY FARMER

STEP 2:

WEIGH & GRADE

STEP 3:

VISUAL AUDIT

STEP 4:

FARMER APPROVAL

STEP 5:

TRANSACTION LOCK

The UI must visually communicate progress.

Desktop:

Centered workflow card.

Mobile:

Full-screen transaction interface.

Progress indicator:

01 Farmer

02 Weigh

03 Audit

04 Approve

Use connecting progress lines.

Completed:

Green

Current:

Dark green / emphasized

Upcoming:

Muted

==================================================

12. STEP 1 — FARMER IDENTIFICATION

==================================================

Title:

"Identify Farmer"

Subtitle:

"Search the farmer or scan their collection card."

Search field:

"Search phone number or FPO ID"

Support:

Phone number

FPO ID

Farmer ID

Search results should appear instantly.

Example:

Mohammed Irfan

FPO-2048

+91 98••••••42

Status:

✓ Farmer identity verified

Add QR button:

SCAN FARMER QR

The QR scanner should use the device camera.

Use:

capture="environment"

or a QR scanning library.

QR workflow:

Open camera

Scan QR

Read farmer ID

Find farmer

Select farmer

Confirm identity

Error states:

Farmer not found

Invalid QR

Camera permission denied

Invalid farmer ID

Continue button:

CONTINUE →

Disabled until farmer selected.

==================================================

13. STEP 2 — WEIGHT & GRADING

==================================================

Title:

"Enter Weight & Grade"

Show farmer summary:

Mohammed Irfan

FPO-2048

Weight:

248.50 kg

Build a custom numeric keypad.

Do not depend on the mobile keyboard.

Keypad:

1 2 3

4 5 6

7 8 9

. 0 backspace

Weight rules:

No negative values.

Only one decimal point.

Maximum reasonable weight validation.

Cannot continue with empty value.

Grade selection:

GRADE A

Premium

GRADE B

Standard

GRADE C

Below Standard

Each grade should have:

Icon

Color

Description

Selected state

Checkmark

Do not rely only on color.

Selected grade must also have:

Border

Checkmark

Text

Continue:

CONTINUE →

==================================================

14. STEP 3 — VISUAL AUDIT

==================================================

This is a mandatory fraud-prevention feature.

Title:

"Capture Visual Audit"

Subtitle:

"Capture the crop, scale and grade card in one image."

Open the rear camera.

Camera preview should show:

Agricultural produce

Physical weighing scale

Digital weight

Physical colored grade card

Framing overlay:

"Fit scale, crop & grade card inside frame"

Large shutter button.

After capture:

Show image preview.

Buttons:

RETAKE

USE PHOTO

Show:

✓ Audit photo attached

The operator cannot continue without a photo.

This image is evidence for the transaction.

==================================================

15. IMAGE STORAGE

==================================================

DO NOT store audit images as Base64 in the database.

Use cloud object storage.

Preferred:

Supabase Storage

Bucket:

audit-photos

File structure:

audit-photos/

operatorId/

transactionId/

audit-timestamp.jpg

Database stores:

audit_photo_path

or

audit_photo_url

The actual image remains in storage.

==================================================

16. PHOTO PROCESSING

==================================================

Before upload:

Compress large camera images.

Preserve sufficient quality for evidence.

Generate:

thumbnail

full-resolution/optimized image

Show upload progress.

States:

Uploading...

Uploaded ✓

Upload failed

Retry

==================================================

17. STEP 4 — FARMER APPROVAL

==================================================

Title:

"Farmer Approval"

Show:

Farmer

Mohammed Irfan

Weight

248.50 kg

Grade

A

Audit photo

Attached ✓

Generate secure four-digit approval code.

Example:

7 4 2 9

Display prominently:

FARMER APPROVAL CODE

Explain:

"Ask the farmer to confirm this delivery."

==================================================

18. REALTIME FARMER APPROVAL

==================================================

Show:

🟡 Waiting for farmer approval...

Text:

"Listening for confirmation from the farmer portal."

The Operator Portal must listen for realtime backend changes.

When farmer approves:

Immediately update UI.

Show:

✓ Farmer approved

✓ Transaction verified

Then transition to locked state.

Do not require manual refresh.

==================================================

19. MANUAL OTP

==================================================

Provide:

ENTER FARMER OTP

Four individual input boxes.

Allow:

Digit entry

Paste

Backspace

Auto-focus

If correct:

✓ OTP verified

If incorrect:

"Incorrect approval code. Please try again."

Do not expose raw backend errors.

Add reasonable attempt limits.

==================================================

20. TRANSACTION LOCK

==================================================

After successful farmer approval:

Transaction becomes:

VERIFIED & LOCKED

The following must no longer be editable:

Farmer

Weight

Grade

Audit photo

Approval status

Do not simply allow the operator to edit a verified transaction.

==================================================

21. SUCCESS SCREEN

==================================================

Large green check.

Heading:

TRANSACTION VERIFIED

Subtitle:

"This transaction is permanently locked."

Receipt:

TXN-2026-08421

Mohammed Irfan

248.50 kg

Grade A

03:42 PM

Status:

Verified & Locked

Indicators:

✓ Farmer approved

✓ Audit photo attached

✓ Audit trail created

🔒 Transaction locked

Primary:

START NEXT DELIVERY

Secondary:

VIEW TRANSACTION

Use subtle success animation.

==================================================

22. DAILY LEDGER

==================================================

Route:

/transactions

Desktop:

Premium data cards/table hybrid.

Mobile:

Vertical cards.

Header:

Today's Transactions

Statistics:

24 Deliveries

1,248 kg Collected

Search.

Filters:

All

Pending

Verified

Disputed

Sync Pending

Transaction card:

Farmer

Weight

Grade

Time

Status

Transaction ID

Example:

Mohammed Irfan

248.50 kg • Grade A

03:42 PM

🟢 Verified & Locked

==================================================

23. TRANSACTION DETAIL

==================================================

Route:

/transactions/:id

Show:

Transaction ID

Farmer

Phone

FPO ID

Weight

Grade

Audit photo

Approval status

Operator

Created time

Approved time

Verified time

Sync status

Show large audit photograph.

Add:

"View Full Evidence"

Audit timeline:

03:35

Transaction created

03:36

Farmer identified

03:38

Weight entered

03:39

Grade selected

03:40

Audit photo captured

03:41

Approval requested

03:42

Farmer approved

03:42

Transaction locked

==================================================

24. DISPUTE MANAGEMENT

==================================================

Allow operator to flag pending transactions.

Warning:

"Farmer approval not received"

Reasons:

Farmer left before approval

OTP not received

Network problem

Farmer disputes grade

Other

Notes:

"Add a short note..."

Button:

FLAG TRANSACTION

After submission:

Dispute status:

DISPUTED

Create audit event.

Notify Admin.

Show:

"Admin has been notified."

==================================================

25. DISPUTES PAGE

==================================================

Create a dedicated Disputes page.

Desktop:

Cards / table.

Mobile:

Cards.

Show:

Transaction ID

Farmer

Reason

Time

Status

Priority

Example:

TXN-2026-08421

Mohammed Irfan

Farmer left before approval

03:48 PM

Open

Use:

Amber for pending review.

Red for urgent.

Green for resolved.

==================================================

26. OFFLINE-FIRST EXPERIENCE

==================================================

Offline functionality is critical.

When internet disappears:

Header changes to:

🔴 Offline

Show:

"You're offline, but you can continue collecting."

The operator should still be able to:

Open application

Access cached farmer data

Create transaction

Enter weight

Select grade

Capture photo

Save transaction locally

Do not lose work.

==================================================

27. INDEXEDDB

==================================================

Use IndexedDB for:

Pending transactions

Audit photo Blobs

Sync queue

Cached farmer records

Do NOT use localStorage for large images.

Structure conceptually:

pending_transactions

pending_photos

sync_queue

cached_farmers

==================================================

28. OFFLINE QUEUE

==================================================

Every offline transaction receives a stable transaction ID.

Example:

TXN-LOCAL-928421

When connection returns:

Automatically synchronize.

Do not create duplicates.

Use idempotent transaction IDs.

==================================================

29. SYNC CENTER

==================================================

Route:

/sync

Show:

SYNC STATUS

Connection:

🟢 Connection restored

Progress:

8 / 12 transactions uploaded

Stages:

✓ Transaction data

✓ Audit photos

⟳ Farmer approvals

Activity:

TXN-08417 — Synced

TXN-08418 — Synced

TXN-08419 — Uploading photo

Last successful sync:

Today, 03:51 PM

==================================================

30. AUTOMATIC SYNC

==================================================

When network returns:

1. Detect connection.

2. Check IndexedDB queue.

3. Upload transaction.

4. Upload audit image.

5. Update database.

6. Reconnect realtime.

7. Resume approval state.

8. Mark local record synced.

9. Remove/complete queue item.

Retry failed uploads.

Use reasonable retry/backoff.

Do not duplicate records.

==================================================

31. CONNECTION STATUS

==================================================

Header status states:

ONLINE

🟢 Online • Synced

OFFLINE

🔴 Offline

SYNCING

🟡 Syncing...

ERROR

🔴 Connection Error

Use actual network events.

Also verify backend availability.

Browser "online" does not necessarily mean backend is reachable.

==================================================

32. TEXT-TO-SPEECH

==================================================

Use:

window.speechSynthesis

Languages:

English

Hindi

Marathi

Confirmation text:

"Farmer Mohammed Irfan. Your crop weight is 248.50 kilograms. Your grade is A. Please confirm this transaction."

Controls:

Replay

Pause

Stop

Do not repeatedly trigger speech on every render.

If unsupported:

Show graceful fallback.

==================================================

33. PROFILE

==================================================

Profile page:

Operator photo

Rahul

Operator ID:

OP-2048

Role:

Collection Operator

Collection Center:

Nashik

Connection:

Online

Last Sync:

03:51 PM

Storage:

3.2 MB / 50 MB

Language

Voice confirmation

Notifications

Logout

==================================================

34. ADMIN DATA PREPARATION

==================================================

Structure the backend so an Admin Portal can later access:

Live transactions

Disputes

Audit photos

Farmer approvals

Operator activity

Transaction history

Fraud alerts

Audit events

==================================================

35. DATABASE

==================================================

Use proper relational database architecture.

FARMERS

id

fpo_id

name

phone

qr_identifier

created_at

updated_at

OPERATORS

id

name

phone

email

role

collection_center

created_at

TRANSACTIONS

id

transaction_id

farmer_id

operator_id

weight

grade

crop_type

audit_photo_path

status

approval_method

created_at

updated_at

approved_at

verified_at

sync_status

offline_created

dispute_status

dispute_reason

dispute_note

AUDIT_EVENTS

id

transaction_id

actor_id

actor_role

event_type

metadata

created_at

==================================================

36. TRANSACTION STATUS

==================================================

Use controlled statuses:

DRAFT

FARMER_SELECTED

WEIGHT_ENTERED

AUDIT_CAPTURED

PENDING_APPROVAL

VERIFIED_LOCKED

DISPUTED

SYNC_PENDING

SYNCED

Do not allow arbitrary client-created statuses.

==================================================

37. AUDIT EVENTS

==================================================

Record:

TRANSACTION_CREATED

FARMER_SELECTED

WEIGHT_ENTERED

GRADE_SELECTED

AUDIT_PHOTO_CAPTURED

AUDIT_PHOTO_UPLOADED

OTP_GENERATED

APPROVAL_REQUESTED

FARMER_APPROVED

OTP_VERIFIED

TRANSACTION_LOCKED

DISPUTE_CREATED

SYNC_STARTED

SYNC_COMPLETED

==================================================

38. SECURITY

==================================================

Use authentication.

Use authorization.

Use Row Level Security if using Supabase.

Operator should only access authorized transactions.

Never expose service-role credentials.

Never put secret API keys into frontend code.

Audit photos should use private storage.

Do not make evidence photos publicly writable.

==================================================

39. PWA

==================================================

Make the application installable.

Include:

manifest

icons

theme color

standalone display

service worker

offline application shell

appropriate caching

The application should reopen even with poor connectivity.

Do not cache sensitive information carelessly.

==================================================

40. ACCESSIBILITY

==================================================

Support:

Large touch targets

High contrast

Semantic HTML

ARIA labels

Visible focus states

Keyboard navigation

Screen reader labels

Status text in addition to color

Voice confirmation

Language options

==================================================

41. LOADING STATES

==================================================

Create beautiful loading states.

Examples:

Finding farmer...

Scanning QR...

Uploading audit photo...

Generating approval code...

Waiting for farmer...

Verifying transaction...

Syncing...

Use skeletons and subtle progress indicators.

Never leave the user staring at a blank page.

==================================================

42. ERROR STATES

==================================================

Design dedicated polished states for:

Farmer not found

Invalid QR

Camera permission denied

Photo upload failed

Network unavailable

Backend unavailable

Incorrect OTP

OTP expired

Transaction already locked

Sync failed

Farmer approval timeout

Every error must explain:

What happened

What the operator can do

Example:

"Audit photo couldn't be uploaded."

"Your photo is safely stored on this device and will be uploaded when the connection returns."

==================================================

43. EMPTY STATES

==================================================

Transactions:

"No transactions today."

Pending approvals:

"You're all caught up."

Disputes:

"No disputes require attention."

Sync:

"Everything is synchronized."

==================================================

44. DESKTOP DASHBOARD

==================================================

Desktop should use a premium composition.

Top:

Greeting

Connection

Date

Operator profile

Main hero:

Large agricultural image

Overlay:

"Today's Collection"

1,248.50 kg

Below:

Metric cards

Pending approvals

Verified transactions

Disputes

Sync status

Then:

Today's collection activity

Recent transactions

Pending approvals

==================================================

45. PREMIUM CARD SYSTEM

==================================================

Use several card types.

Hero card:

Large photography

rounded corners

overlay content

Metric card:

Clean

large number

small label

Transaction card:

Farmer

weight

grade

status

Evidence card:

Photo

audit information

Status card:

Connection

sync

approval

Do not make every card look identical.

==================================================

46. ICON SYSTEM

==================================================

Use Lucide-style icons.

Examples:

Home

Package

Scale

Camera

QrCode

ShieldCheck

CheckCircle

AlertTriangle

CloudOff

RefreshCw

Clock

User

Search

Bell

Settings

Volume2

Lock

FileCheck

Avoid emoji as the primary UI icon system.

Use professional vector icons.

==================================================

47. MICRO-INTERACTIONS

==================================================

Add subtle premium interactions.

Examples:

Button press

Card hover

Page transition

Success check animation

Photo upload progress

Sync progress

Realtime approval transition

Connection state transition

OTP verification

Do not over-animate.

Animations should feel:

Fast

Elegant

Purposeful

==================================================

48. PERFORMANCE

==================================================

The app must feel extremely fast.

Optimize for:

Low-end Android phones

Slow mobile networks

Rural connectivity

Large camera photos

Requirements:

Lazy load non-critical screens.

Compress photos.

Debounce farmer search.

Cache appropriate data.

Minimize API requests.

Avoid unnecessary re-renders.

Avoid oversized assets.

Show immediate feedback.

==================================================

49. DEMO DATA

==================================================

Seed realistic demonstration data.

Farmers:

Mohammed Irfan

Aamir Khan

Sameer Shaikh

Ramesh Patil

Suresh Jadhav

Imran Sheikh

Rahul Pawar

Vijay More

Arif Khan

Ganesh Shinde

Transactions should include:

Grade A

Grade B

Grade C

Verified

Pending

Disputed

Sync Pending

Use realistic Indian agricultural data.

==================================================

50. HACKATHON DEMO MODE

==================================================

Create a development/demo mode.

Allow the team to simulate:

Farmer approval

OTP verification

Offline mode

Network recovery

Photo upload

Sync

Dispute creation

The demo should allow this complete flow:

LOGIN

↓

DASHBOARD

↓

START NEW DELIVERY

↓

IDENTIFY FARMER

↓

ENTER WEIGHT

↓

SELECT GRADE

↓

CAPTURE PHOTO

↓

GENERATE OTP

↓

WAITING FOR FARMER

↓

SIMULATE FARMER APPROVAL

↓

REALTIME UPDATE

↓

TRANSACTION VERIFIED

↓

TRANSACTION LOCKED

↓

AUDIT TRAIL

↓

DAILY LEDGER

This should be extremely smooth during a hackathon presentation.

==================================================

51. LANDING / PRODUCT INTRODUCTION

==================================================

If creating a public-facing entry page, make it premium.

Hero:

Large agricultural photography.

Headline:

"Every Crop. Every Grade. Verified."

Subtitle:

"AgriTrust creates a transparent digital record for agricultural collection, grading and farmer approval."

CTA:

"Enter Operator Portal"

Secondary:

"How It Works"

Show three pillars:

VERIFY

Visual farmer identification and transaction evidence.

PROVE

Live scale photograph and grading record.

LOCK

Farmer approval permanently locks the transaction.

==================================================

52. HOW IT WORKS SECTION

==================================================

Create a beautiful horizontal/vertical process:

01

IDENTIFY

Verify farmer using phone, FPO ID or QR.

02

WEIGH

Record exact crop weight.

03

GRADE

Operator records grade.

04

CAPTURE

Photograph crop, scale and grade card.

05

APPROVE

Farmer independently confirms.

06

LOCK

Transaction becomes immutable.

==================================================

53. FRAUD-PREVENTION VISUAL

==================================================

Create a premium section explaining the system.

Show:

Operator

Scale

Grade Card

Camera

Backend

Farmer

Admin

Visual flow:

Operator records

↓

Camera captures evidence

↓

Backend stores evidence

↓

Farmer verifies

↓

Transaction locks

↓

Admin can audit

Use subtle green connecting lines.

==================================================

54. RESPONSIVE DESIGN RULE

==================================================

Desktop should not simply be a larger mobile screen.

Desktop:

Sidebar

Large cards

Multi-column layouts

Detailed transaction information

Mobile:

Bottom navigation

Stacked cards

Large buttons

Simplified information

Focused workflow

Tablet:

Hybrid layout.

==================================================

55. IMPORTANT UX RULE

==================================================

The application should always answer these three questions:

WHERE AM I?

Show current workflow step.

WHAT DO I NEED TO DO?

Show one dominant primary action.

WHAT IS THE STATUS?

Show online/offline/approval/sync state.

Never make the operator guess what happens next.

==================================================

56. FINAL QUALITY STANDARD

==================================================

The finished product must look like a real premium startup product.

It should NOT look like:

- a school project

- a generic Tailwind template

- a basic CRUD application

- a generic admin dashboard

- a simple form application

It SHOULD look like:

- premium

- polished

- trustworthy

- modern

- agricultural

- operational

- fast

- secure

- visually impressive

- hackathon-ready

- production-ready

Use the uploaded UI references as visual inspiration throughout the design.

Maintain one coherent design system across every page.

Do not redesign each page independently.

==================================================

57. FINAL FUNCTIONAL TEST

==================================================

Before considering the application complete, verify:

LOGIN works.

Dashboard loads.

Connection status works.

Start New Delivery works.

Farmer search works.

QR scanning interface works.

Farmer selection works.

Weight keypad works.

Grade selection works.

Audit camera works.

Photo preview works.

Photo upload works.

Offline photo storage works.

OTP generation works.

OTP entry works.

Farmer approval state works.

Realtime approval works.

Transaction locks after approval.

Locked transaction cannot be edited.

Transaction appears in ledger.

Transaction detail shows evidence.

Audit timeline appears.

Dispute creation works.

Admin notification event is generated.

Offline queue works.

Automatic synchronization works.

Duplicate sync does not create duplicate transactions.

PWA can be installed.

Application remains usable during temporary connectivity loss.

Text-to-speech works where supported.

Mobile layout works.

Desktop layout works.

Tablet layout works.

Loading states exist.

Error states exist.

Empty states exist.

Accessibility labels exist.

==================================================

58. FINAL DESIGN INSTRUCTION

==================================================

Do not stop at creating attractive screens.

The application must combine:

PREMIUM VISUAL DESIGN

+

REAL FUNCTIONAL WORKFLOW

+

FRAUD PREVENTION

+

REALTIME VERIFICATION

+

VISUAL AUDIT EVIDENCE

+

OFFLINE-FIRST OPERATION

+

AUDITABILITY

+

FIELD USABILITY

The final experience should make a hackathon judge immediately understand:

"An operator records the crop transaction, photographs the physical evidence, the farmer independently confirms it, and the system locks the verified transaction so the record can be audited later."

Build the entire experience around that single powerful concept.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://verify-crop-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e93888b7-70f8-4194-88dc-212545d1dbb3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
