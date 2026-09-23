# AgriTech Mandi & Weigh-Station Unified Platform

A unified enterprise agricultural procurement and weighbridge management platform powering three role-specific frontend applications across separate Git branches:

- **`farmer` branch**: Farmer mobile/desktop web portal (Produce lot declaration, digital weighbridge passes, dispute filings)
- **`OPERATOR` branch**: Mandi collection center & weighbridge operator terminal (Scale telemetry, live weighment input, quality grading)
- **`ADMIN` branch**: Principal FPO / APMC administrative dashboard (Master immutable ledger, fraud/anomaly detection, dispute adjudication, payout settlement, audit trail)

---

## 1. System Architecture

```
                                  ┌──────────────────────────────┐
                                  │       SUPABASE PROJECT       │
                                  │                              │
                                  │  • PostgreSQL Database       │
                                  │  • Supabase Auth (JWT)       │
                                  │  • Row Level Security (RLS)  │
                                  │  • Supabase Storage          │
                                  │  • Realtime Engine           │
                                  └──────────────┬───────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   │                             │                             │
                   ▼                             ▼                             ▼
       ┌───────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐
       │     FARMER Branch     │     │    OPERATOR Branch    │     │     ADMIN Branch      │
       │   (React / Kisan UI)  │     │  (Vite Crop Verification)│    │ (Vanilla JS Dashboard)│
       │                       │     │                       │     │                       │
       │  Role: 'farmer'       │     │  Role: 'operator'     │     │  Role: 'admin'        │
       │  • Submit produce lot │     │  • Assigned to Mandi  │     │  • Master Khata ledger│
       │  • View digital pass  │     │  • Record weighments  │     │  • Statistical fraud  │
       │  • Raise disputes     │     │  • Verify & lock lot  │     │  • Payout settlements │
       └───────────────────────┘     └───────────────────────┘     └───────────────────────┘
                   │                             │                             │
                   └─────────────────────────────┼─────────────────────────────┘
                                                 │
                                           SAME DATABASE
```

---

## 2. Shared Database Schema

The database consists of 13 core relational tables managed by SQL migrations located in `supabase/migrations/`:

| Table | Purpose | Primary Key | Key Foreign Keys |
|---|---|---|---|
| `profiles` | User profiles linked 1:1 with `auth.users` | `id` (UUID) | `auth.users(id)` |
| `farmers` | Farmer details & state/village records | `id` (UUID) | `profiles(id)` |
| `mandis` | APMC yards and collection center hubs | `id` (UUID) | — |
| `operators` | Weighbridge operators assigned to a Mandi | `id` (UUID) | `profiles(id)`, `mandis(id)` |
| `admins` | Platform administrators | `id` (UUID) | `profiles(id)` |
| `produce` | Farmer produce lots and categories | `id` (UUID) | `farmers(id)` |
| `rate_cards` | Procurement rate matrix per grade (A/B/C) | `id` (UUID) | — |
| `transactions` | Central business table for procurement lifecycle | `id` (UUID) | `farmers(id)`, `mandis(id)`, `operators(id)` |
| `weighments` | Scale readings and load-cell measurements | `id` (UUID) | `transactions(id)`, `operators(id)` |
| `payments` | Settlement amounts & payment status | `id` (UUID) | `transactions(id)`, `farmers(id)` |
| `disputes` | Multi-party farmer grievances on grading/weight | `id` (UUID) | `transactions(id)`, `farmers(id)` |
| `notifications` | Role-targeted system notifications | `id` (UUID) | `profiles(id)` |
| `audit_logs` | Append-only immutable system event trail | `id` (UUID) | `profiles(id)` |

---

## 3. Database Migrations & Setup

Apply the SQL migration scripts to your Supabase project in numerical order:

```bash
# Order of execution in Supabase SQL Editor:
1. supabase/migrations/001_initial_schema.sql      # Tables, enums, indexes
2. supabase/migrations/002_rls_policies.sql        # Security-definer helpers & RLS policies
3. supabase/migrations/003_storage_policies.sql    # Storage buckets & storage RLS
4. supabase/migrations/004_functions_triggers.sql  # Triggers for auto-profile & audit logging
5. supabase/seed.sql                               # Demo Mandis and Rate Cards
```

---

## 4. Row Level Security (RLS) Model

RLS is strictly enforced on all public tables. Authorization is resolved via database security-definer helper functions:

- **`auth_user_role()`**: Returns `'farmer'`, `'operator'`, or `'admin'`.
- **`get_auth_farmer_id()`**: Resolves authenticated user's `farmer.id`.
- **`get_auth_operator_id()`**: Resolves authenticated user's `operator.id`.
- **`get_auth_operator_mandi_id()`**: Resolves operator's assigned `mandi_id`.
- **`is_admin()`**: Returns `true` if `profiles.role = 'admin'`.

### Role Permissions Matrix:

| Resource | Farmer Role | Operator Role | Admin Role | Anonymous |
|---|---|---|---|---|
| **Profiles** | Read/Update Own | Read/Update Own | Full Read/Write | No Access |
| **Mandis** | Read Active | Read Active | Full Read/Write | No Access |
| **Produce** | Read/Write Own Lots | Read Assigned Lots | Full Read/Write | No Access |
| **Transactions** | Read Own / Insert Own | Read/Update Assigned Mandi Only | Full Read/Write | No Access |
| **Weighments** | Read Own | Insert & Read for Assigned Mandi | Full Read/Write | No Access |
| **Disputes** | File & Read Own | Read Assigned | Review & Resolve | No Access |
| **Audit Logs** | No Read / Insert Triggers | No Read / Insert Triggers | Full Read (Immutable) | No Access |

---

## 5. Storage Buckets & Policies

Four Supabase Storage buckets manage user media with least-privilege RLS:

1. **`avatars`**: User profile photos (`avatars/{user_id}/...`)
2. **`farmer-documents`** *(Private)*: KYC and land records (`farmer-documents/{user_id}/...`)
3. **`transaction-documents`** *(Private)*: Scale tickets & point-of-collection photo evidence (`transaction-documents/{transaction_id}/...`)
4. **`mandi-assets`** *(Public)*: Mandi logos, APMC rate card notices.

---

## 6. Frontend Supabase Client Integration

### Environment Variables (`.env`):
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key

# Vite React branches (farmer & OPERATOR)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
```

### ES Module / Bundler Client (`src/lib/supabase.js`):
```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Vanilla HTML / JS Client (`supabase-config.js`):
Loaded via CDN script tag:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="auth.js"></script>
```

---

## 7. End-to-End Workflow Walkthrough

```
[STEP 1: Farmer Submission]
Farmer logs into 'farmer' portal -> Enters 500 kg Wheat lot at Mandi A ->
Transaction created in database:
  • Status: 'pending'
  • Declared Weight: 500 kg

[STEP 2: Operator Weighment & Verification]
Operator logs into 'OPERATOR' portal -> Sees transaction in Mandi queue ->
Records digital scale weight: 487 kg, Grade: A ->
Transaction updated in database:
  • Status: 'verified'
  • Actual Weight: 487 kg
  • SHA-256 Hash Generated automatically by database trigger

[STEP 3: Farmer Live View]
Farmer logs into 'farmer' portal -> Sees Digital Weighbridge Pass updated in Realtime:
  • Status: 'verified'
  • Actual Weight: 487 kg
  • Official SHA-256 Hash

[STEP 4: Admin Oversight & Settlement]
Admin logs into 'ADMIN' dashboard ->
Sees the EXACT same transaction record in Master Ledger ->
Reviews aggregate statistics, verifies Merkle root integrity, and includes verified lot in automated Payout Settlement batch.
```

---

## 8. Branch Setup Instructions

### Admin Portal (`ADMIN` branch)
1. Ensure `supabase-config.js` contains your Supabase URL & anon key (or set in `localStorage`).
2. Serve locally with any static HTTP server:
   ```bash
   npx serve .
   ```
3. Open `http://localhost:3000/login.html` and sign in with admin credentials.

### Operator Portal (`OPERATOR` branch)
1. Switch branch: `git checkout OPERATOR`
2. Install dependencies: `npm install`
3. Configure `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Run dev server: `npm run dev`

### Farmer Portal (`farmer` branch)
1. Switch branch: `git checkout farmer`
2. Install dependencies: `npm install`
3. Configure `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Run dev server: `npm run dev`
