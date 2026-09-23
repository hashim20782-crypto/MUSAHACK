-- ============================================================================
-- COMBINED_SETUP.SQL (100% Idempotent - Safe to re-run multiple times)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/uujklkizvjtvqrzygnsa/sql/new
-- ============================================================================

-- 1. Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enums
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

-- 3. Core Relational Tables
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

CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_code TEXT UNIQUE NOT NULL,
  address TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  land_area NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

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

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

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
  quality_grade TEXT,
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

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_farmers_user_id ON public.farmers(user_id);
CREATE INDEX IF NOT EXISTS idx_operators_user_id ON public.operators(user_id);
CREATE INDEX IF NOT EXISTS idx_operators_mandi_id ON public.operators(mandi_id);
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
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- 5. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weighments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. Helper Functions (Security Definer)
CREATE OR REPLACE FUNCTION public.auth_user_role()
RETURNS public.user_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT role FROM public.profiles WHERE id = auth.uid(); $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'::public.user_role); $$;

CREATE OR REPLACE FUNCTION public.get_auth_farmer_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT id FROM public.farmers WHERE user_id = auth.uid(); $$;

CREATE OR REPLACE FUNCTION public.get_auth_operator_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT id FROM public.operators WHERE user_id = auth.uid(); $$;

CREATE OR REPLACE FUNCTION public.get_auth_operator_mandi_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT mandi_id FROM public.operators WHERE user_id = auth.uid() AND active = true; $$;

-- 7. Drop and Recreate RLS Policies (Safe for repeated execution)
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_delete" ON public.profiles;

CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_admin_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR id = auth.uid());
CREATE POLICY "profiles_admin_delete" ON public.profiles FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "mandis_select_policy" ON public.mandis;
DROP POLICY IF EXISTS "mandis_admin_all" ON public.mandis;

CREATE POLICY "mandis_select_policy" ON public.mandis FOR SELECT TO authenticated USING (active = true OR public.is_admin());
CREATE POLICY "mandis_admin_all" ON public.mandis FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "farmers_select_policy" ON public.farmers;
DROP POLICY IF EXISTS "farmers_update_policy" ON public.farmers;
DROP POLICY IF EXISTS "farmers_insert_policy" ON public.farmers;
DROP POLICY IF EXISTS "farmers_delete_policy" ON public.farmers;

CREATE POLICY "farmers_select_policy" ON public.farmers FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.auth_user_role() = 'operator'::public.user_role OR public.is_admin());
CREATE POLICY "farmers_update_policy" ON public.farmers FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "farmers_insert_policy" ON public.farmers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "farmers_delete_policy" ON public.farmers FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "operators_select_policy" ON public.operators;
DROP POLICY IF EXISTS "operators_admin_all" ON public.operators;

CREATE POLICY "operators_select_policy" ON public.operators FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "operators_admin_all" ON public.operators FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admins_select_policy" ON public.admins;
DROP POLICY IF EXISTS "admins_manage_policy" ON public.admins;

CREATE POLICY "admins_select_policy" ON public.admins FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins_manage_policy" ON public.admins FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "produce_select_policy" ON public.produce;
DROP POLICY IF EXISTS "produce_insert_policy" ON public.produce;
DROP POLICY IF EXISTS "produce_update_policy" ON public.produce;
DROP POLICY IF EXISTS "produce_delete_policy" ON public.produce;

CREATE POLICY "produce_select_policy" ON public.produce FOR SELECT TO authenticated USING (farmer_id = public.get_auth_farmer_id() OR public.auth_user_role() = 'operator'::public.user_role OR public.is_admin());
CREATE POLICY "produce_insert_policy" ON public.produce FOR INSERT TO authenticated WITH CHECK (farmer_id = public.get_auth_farmer_id() OR public.is_admin());
CREATE POLICY "produce_update_policy" ON public.produce FOR UPDATE TO authenticated USING (farmer_id = public.get_auth_farmer_id() OR public.is_admin());
CREATE POLICY "produce_delete_policy" ON public.produce FOR DELETE TO authenticated USING (farmer_id = public.get_auth_farmer_id() OR public.is_admin());

DROP POLICY IF EXISTS "rate_cards_select_policy" ON public.rate_cards;
DROP POLICY IF EXISTS "rate_cards_admin_manage" ON public.rate_cards;

CREATE POLICY "rate_cards_select_policy" ON public.rate_cards FOR SELECT TO authenticated USING (active = true OR public.is_admin());
CREATE POLICY "rate_cards_admin_manage" ON public.rate_cards FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "transactions_select_policy" ON public.transactions;
DROP POLICY IF EXISTS "transactions_farmer_insert" ON public.transactions;
DROP POLICY IF EXISTS "transactions_operator_update" ON public.transactions;
DROP POLICY IF EXISTS "transactions_admin_delete" ON public.transactions;

CREATE POLICY "transactions_select_policy" ON public.transactions FOR SELECT TO authenticated USING (farmer_id = public.get_auth_farmer_id() OR (public.auth_user_role() = 'operator'::public.user_role AND mandi_id = public.get_auth_operator_mandi_id()) OR public.is_admin());
CREATE POLICY "transactions_farmer_insert" ON public.transactions FOR INSERT TO authenticated WITH CHECK (farmer_id = public.get_auth_farmer_id() OR public.is_admin());
CREATE POLICY "transactions_operator_update" ON public.transactions FOR UPDATE TO authenticated USING ((public.auth_user_role() = 'operator'::public.user_role AND mandi_id = public.get_auth_operator_mandi_id()) OR public.is_admin());
CREATE POLICY "transactions_admin_delete" ON public.transactions FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "weighments_select_policy" ON public.weighments;
DROP POLICY IF EXISTS "weighments_operator_insert" ON public.weighments;
DROP POLICY IF EXISTS "weighments_admin_manage" ON public.weighments;

CREATE POLICY "weighments_select_policy" ON public.weighments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.transactions t WHERE t.id = weighments.transaction_id AND (t.farmer_id = public.get_auth_farmer_id() OR (public.auth_user_role() = 'operator'::public.user_role AND t.mandi_id = public.get_auth_operator_mandi_id()) OR public.is_admin())));
CREATE POLICY "weighments_operator_insert" ON public.weighments FOR INSERT TO authenticated WITH CHECK ((public.auth_user_role() = 'operator'::public.user_role AND operator_id = public.get_auth_operator_id()) OR public.is_admin());
CREATE POLICY "weighments_admin_manage" ON public.weighments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "payments_select_policy" ON public.payments;
DROP POLICY IF EXISTS "payments_admin_manage" ON public.payments;

CREATE POLICY "payments_select_policy" ON public.payments FOR SELECT TO authenticated USING (farmer_id = public.get_auth_farmer_id() OR public.is_admin() OR public.auth_user_role() = 'operator'::public.user_role);
CREATE POLICY "payments_admin_manage" ON public.payments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "disputes_select_policy" ON public.disputes;
DROP POLICY IF EXISTS "disputes_farmer_insert" ON public.disputes;
DROP POLICY IF EXISTS "disputes_update_policy" ON public.disputes;

CREATE POLICY "disputes_select_policy" ON public.disputes FOR SELECT TO authenticated USING (farmer_id = public.get_auth_farmer_id() OR public.auth_user_role() = 'operator'::public.user_role OR public.is_admin());
CREATE POLICY "disputes_farmer_insert" ON public.disputes FOR INSERT TO authenticated WITH CHECK (farmer_id = public.get_auth_farmer_id() OR public.is_admin());
CREATE POLICY "disputes_update_policy" ON public.disputes FOR UPDATE TO authenticated USING (farmer_id = public.get_auth_farmer_id() OR public.is_admin());

DROP POLICY IF EXISTS "notifications_select_policy" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_policy" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_policy" ON public.notifications;

CREATE POLICY "notifications_select_policy" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "notifications_update_policy" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "notifications_insert_policy" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "audit_logs_select_policy" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_logs;

CREATE POLICY "audit_logs_select_policy" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- 8. Triggers for User Profiles & Hashing
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_role public.user_role;
  v_name TEXT;
  v_code TEXT;
BEGIN
  v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  IF NEW.raw_user_meta_data->>'role' = 'operator' THEN v_role := 'operator'::public.user_role;
  ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN v_role := 'admin'::public.user_role;
  ELSE v_role := 'farmer'::public.user_role; END IF;

  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (NEW.id, v_name, NEW.email, NEW.raw_user_meta_data->>'phone', v_role)
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

  IF v_role = 'farmer' THEN
    v_code := 'FMR-' || UPPER(SUBSTRING(MD5(NEW.id::text || clock_timestamp()::text) FROM 1 FOR 6));
    INSERT INTO public.farmers (user_id, farmer_code, village, district, state)
    VALUES (NEW.id, v_code, COALESCE(NEW.raw_user_meta_data->>'village', 'Ratlam Rural'), 'Ratlam', 'Madhya Pradesh')
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF v_role = 'operator' THEN
    v_code := 'OP-' || UPPER(SUBSTRING(MD5(NEW.id::text || clock_timestamp()::text) FROM 1 FOR 6));
    INSERT INTO public.operators (user_id, operator_code, designation)
    VALUES (NEW.id, v_code, 'Weighbridge Operator')
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF v_role = 'admin' THEN
    INSERT INTO public.admins (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Automatic Transaction Number Trigger
CREATE OR REPLACE FUNCTION public.set_transaction_number()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.transaction_number IS NULL OR NEW.transaction_number = '' THEN
    NEW.transaction_number := 'TXN-' || TO_CHAR(timezone('utc'::text, now()), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(NEW.id::text || clock_timestamp()::text) FROM 1 FOR 5));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_transaction_number ON public.transactions;
CREATE TRIGGER trg_set_transaction_number BEFORE INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.set_transaction_number();

-- 9. Seed Initial Mandis and Rate Cards
INSERT INTO public.mandis (id, name, code, address, district, state, latitude, longitude, active)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Ratlam Main Mandi', 'MND-RTL-01', 'Industrial Area, Ratlam', 'Ratlam', 'Madhya Pradesh', 23.3315, 75.0367, true),
  ('a2222222-2222-2222-2222-222222222222', 'Nashik Agricultural Terminal', 'MND-NSK-02', 'APMC Yard, Dindori Road, Nashik', 'Nashik', 'Maharashtra', 19.9975, 73.7898, true),
  ('a3333333-3333-3333-3333-333333333333', 'Indore Central APMC', 'MND-IND-03', 'Choithram Mandi, Indore', 'Indore', 'Madhya Pradesh', 22.7196, 75.8577, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.rate_cards (id, produce_name, grade_a_rate, grade_b_rate, grade_c_rate, version, active)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Soybean (Black / Yellow)', 52.00, 48.00, 41.50, 'v2.3', true),
  ('b2222222-2222-2222-2222-222222222222', 'Wheat (Sharbati & Lokwan)', 34.50, 31.00, 26.00, 'v2.3', true),
  ('b3333333-3333-3333-3333-333333333333', 'Gram / Chana (Desi)', 64.00, 59.50, 51.00, 'v2.3', true)
ON CONFLICT (id) DO NOTHING;
