-- ============================================================================
-- AGRI-TECH UNIFIED SUPABASE SCHEMA & SEED (Combined Setup)
-- Safe to re-run multiple times (Idempotent)
-- ============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enums (Safe creation)
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

-- 3. Profiles Table
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

-- 4. Mandis (Collection Centers / Weighbridges)
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

-- 5. Farmers Table (Unified for both Operator Flow & Admin Ledger)
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  fpo_id TEXT,
  name TEXT,
  phone TEXT,
  village TEXT,
  qr_identifier TEXT,
  farmer_code TEXT,
  address TEXT,
  district TEXT,
  state TEXT,
  land_area NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add any missing columns to farmers if it already existed
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS fpo_id TEXT;
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS village TEXT;
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS qr_identifier TEXT;

-- 6. Operators Table
CREATE TABLE IF NOT EXISTS public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  operator_code TEXT,
  name TEXT,
  role TEXT DEFAULT 'Collection Operator',
  collection_center TEXT DEFAULT 'Nashik',
  email TEXT,
  phone TEXT,
  language TEXT DEFAULT 'en',
  voice_enabled BOOLEAN DEFAULT true,
  mandi_id UUID REFERENCES public.mandis(id) ON DELETE SET NULL,
  designation TEXT DEFAULT 'Weighbridge Operator',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Collection Operator';
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS collection_center TEXT DEFAULT 'Nashik';
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS voice_enabled BOOLEAN DEFAULT true;

-- 7. Produce Table
CREATE TABLE IF NOT EXISTS public.produce (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Grain',
  variety TEXT,
  declared_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  quality_grade TEXT DEFAULT 'A',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Rate Cards Table
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

-- 9. Transactions Table (Unified Schema)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE,
  transaction_number TEXT,
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE SET NULL,
  farmer_name TEXT,
  farmer_fpo_id TEXT,
  mandi_id UUID REFERENCES public.mandis(id) ON DELETE SET NULL,
  produce_id UUID REFERENCES public.produce(id) ON DELETE SET NULL,
  operator_id UUID,
  operator_name TEXT,
  weight NUMERIC(12, 2) DEFAULT 0,
  declared_weight NUMERIC(12, 2) DEFAULT 0,
  actual_weight NUMERIC(12, 2),
  grade TEXT DEFAULT 'A',
  quality_grade TEXT DEFAULT 'A',
  crop_type TEXT DEFAULT 'Wheat',
  unit TEXT NOT NULL DEFAULT 'kg',
  rate_per_kg NUMERIC(10, 2),
  total_payout NUMERIC(14, 2),
  audit_photo_path TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
  approval_code TEXT,
  approval_method TEXT,
  dispute_status TEXT,
  dispute_reason TEXT,
  dispute_note TEXT,
  sync_status TEXT NOT NULL DEFAULT 'SYNCED',
  offline_created BOOLEAN NOT NULL DEFAULT false,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  hash_sha256 TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  approved_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS transaction_id TEXT UNIQUE;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS farmer_name TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS farmer_fpo_id TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS operator_name TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS weight NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS grade TEXT DEFAULT 'A';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS crop_type TEXT DEFAULT 'Wheat';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS audit_photo_path TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS approval_code TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS approval_method TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS dispute_status TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS dispute_reason TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS dispute_note TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'SYNCED';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS offline_created BOOLEAN DEFAULT false;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- 10. Audit Events Table
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL,
  actor_id UUID,
  actor_role TEXT NOT NULL DEFAULT 'OPERATOR',
  actor_name TEXT,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Storage Buckets & Policies
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('audit-photos', 'audit-photos', true),
  ('transaction-documents', 'transaction-documents', true),
  ('farmer-documents', 'farmer-documents', true),
  ('avatars', 'avatars', true),
  ('mandi-assets', 'mandi-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS & open policies for development/demo
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Permissive policies for smooth multi-portal sync
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Public read mandis" ON public.mandis;
  DROP POLICY IF EXISTS "Public read farmers" ON public.farmers;
  DROP POLICY IF EXISTS "Public read write farmers" ON public.farmers;
  DROP POLICY IF EXISTS "Public read operators" ON public.operators;
  DROP POLICY IF EXISTS "Public read write operators" ON public.operators;
  DROP POLICY IF EXISTS "Public read write transactions" ON public.transactions;
  DROP POLICY IF EXISTS "Public read write audit_events" ON public.audit_events;
  DROP POLICY IF EXISTS "Public read rate_cards" ON public.rate_cards;
END $$;

CREATE POLICY "Public read write profiles" ON public.profiles FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read write mandis" ON public.mandis FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read write farmers" ON public.farmers FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read write operators" ON public.operators FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read write transactions" ON public.transactions FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read write audit_events" ON public.audit_events FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public read write rate_cards" ON public.rate_cards FOR ALL TO public USING (true) WITH CHECK (true);

-- Enable Realtime on transactions
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  END IF;
END $$;

-- 12. Seed Registered Farmers
INSERT INTO public.farmers (fpo_id, name, phone, village, qr_identifier, farmer_code) VALUES
  ('FPO-2048','Mohammed Irfan','+919812345642','Ozar','AGRI-QR-FPO-2048','FMR-2048'),
  ('FPO-2049','Aamir Khan','+919822110045','Pimpalgaon','AGRI-QR-FPO-2049','FMR-2049'),
  ('FPO-2050','Sameer Shaikh','+919833220178','Lasalgaon','AGRI-QR-FPO-2050','FMR-2050'),
  ('FPO-2051','Ramesh Patil','+919844330291','Dindori','AGRI-QR-FPO-2051','FMR-2051'),
  ('FPO-2052','Suresh Jadhav','+919855440384','Niphad','AGRI-QR-FPO-2052','FMR-2052'),
  ('FPO-2053','Imran Sheikh','+919866550477','Yeola','AGRI-QR-FPO-2053','FMR-2053'),
  ('FPO-2054','Rahul Pawar','+919877660560','Sinnar','AGRI-QR-FPO-2054','FMR-2054'),
  ('FPO-2055','Vijay More','+919888770653','Chandwad','AGRI-QR-FPO-2055','FMR-2055'),
  ('FPO-2056','Arif Khan','+919899880746','Satana','AGRI-QR-FPO-2056','FMR-2056'),
  ('FPO-2057','Ganesh Shinde','+919900990839','Kalwan','AGRI-QR-FPO-2057','FMR-2057')
ON CONFLICT DO NOTHING;

-- Seed Rate Cards
INSERT INTO public.rate_cards (produce_name, grade_a_rate, grade_b_rate, grade_c_rate, version) VALUES
  ('Wheat', 26.50, 23.00, 19.50, 'v2.3'),
  ('Soybean', 48.00, 42.50, 36.00, 'v2.3'),
  ('Onion', 22.00, 17.50, 12.00, 'v2.3'),
  ('Tomato', 30.00, 24.00, 18.00, 'v2.3'),
  ('Grapes', 65.00, 52.00, 38.00, 'v2.3'),
  ('Pomegranate', 85.00, 70.00, 55.00, 'v2.3'),
  ('Cotton', 68.00, 58.00, 48.00, 'v2.3'),
  ('Rice', 34.00, 28.50, 22.00, 'v2.3')
ON CONFLICT (produce_name, version) DO NOTHING;
