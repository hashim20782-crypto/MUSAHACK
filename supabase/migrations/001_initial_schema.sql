-- ============================================================================
-- 001_initial_schema.sql
-- Unified Database Schema for AgriTech / Mandi Weigh-Station Platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up any prior types (if needed for idempotency)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('farmer', 'operator', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
    CREATE TYPE transaction_status AS ENUM (
      'pending',
      'assigned',
      'weighing',
      'verified',
      'completed',
      'rejected',
      'cancelled'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM (
      'pending',
      'processing',
      'paid',
      'failed',
      'cancelled'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dispute_status') THEN
    CREATE TYPE dispute_status AS ENUM (
      'open',
      'reviewing',
      'resolved',
      'rejected'
    );
  END IF;
END $$;

-- 1. Profiles Table (1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'farmer',
  avatar_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Mandis (Collection Centers / Weighbridges)
CREATE TABLE IF NOT EXISTS public.mandis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Farmers Table
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_code TEXT UNIQUE NOT NULL,
  address TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  land_area NUMERIC(10, 2), -- in acres or hectares
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Operators Table (assigned to a mandi)
CREATE TABLE IF NOT EXISTS public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  operator_code TEXT UNIQUE NOT NULL,
  mandi_id UUID REFERENCES public.mandis(id) ON DELETE SET NULL,
  designation TEXT DEFAULT 'Weighbridge Operator',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Produce Table (Farmer registered lots)
CREATE TABLE IF NOT EXISTS public.produce (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Grain',
  variety TEXT,
  declared_quantity NUMERIC(12, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quality_grade TEXT DEFAULT 'A',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Rate Cards Table (Pricing Matrix per grade)
CREATE TABLE IF NOT EXISTS public.rate_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produce_name TEXT NOT NULL,
  grade_a_rate NUMERIC(10, 2) NOT NULL,
  grade_b_rate NUMERIC(10, 2) NOT NULL,
  grade_c_rate NUMERIC(10, 2) NOT NULL,
  version TEXT NOT NULL DEFAULT 'v2.3',
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_active_produce_rate UNIQUE (produce_name, version)
);

-- 8. Transactions Table (Central Business Entity)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number TEXT UNIQUE NOT NULL,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE RESTRICT,
  mandi_id UUID NOT NULL REFERENCES public.mandis(id) ON DELETE RESTRICT,
  produce_id UUID REFERENCES public.produce(id) ON DELETE SET NULL,
  operator_id UUID REFERENCES public.operators(id) ON DELETE SET NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  declared_weight NUMERIC(12, 2) NOT NULL,
  actual_weight NUMERIC(12, 2),
  unit TEXT NOT NULL DEFAULT 'kg',
  quality_grade TEXT, -- 'A', 'B', 'C'
  rate_per_kg NUMERIC(10, 2),
  total_payout NUMERIC(14, 2),
  notes TEXT,
  hash_sha256 TEXT,
  photo_url TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  verified_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Weighments Table (Detailed scale readings)
CREATE TABLE IF NOT EXISTS public.weighments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE RESTRICT,
  measured_weight NUMERIC(12, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  weighing_time TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  scale_reference TEXT DEFAULT 'SCALE-DIGI-01',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE RESTRICT,
  amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Disputes Table (Farmer vs Weighbridge/Grade Claims)
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_code TEXT UNIQUE NOT NULL,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE RESTRICT,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  status dispute_status NOT NULL DEFAULT 'open',
  farmer_confirmed BOOLEAN NOT NULL DEFAULT true,
  admin_confirmed BOOLEAN NOT NULL DEFAULT false,
  resolution_notes TEXT,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  related_transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Audit Logs Table (Append-Only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_farmers_user_id ON public.farmers(user_id);
CREATE INDEX IF NOT EXISTS idx_operators_user_id ON public.operators(user_id);
CREATE INDEX IF NOT EXISTS idx_operators_mandi_id ON public.operators(mandi_id);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS idx_produce_farmer_id ON public.produce(farmer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_farmer_id ON public.transactions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_mandi_id ON public.transactions(mandi_id);
CREATE INDEX IF NOT EXISTS idx_transactions_operator_id ON public.transactions(operator_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weighments_transaction_id ON public.weighments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_farmer_id ON public.payments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_disputes_transaction_id ON public.disputes(transaction_id);
CREATE INDEX IF NOT EXISTS idx_disputes_farmer_id ON public.disputes(farmer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
