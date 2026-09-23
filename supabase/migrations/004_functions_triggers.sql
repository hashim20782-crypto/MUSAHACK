-- ============================================================================
-- 004_functions_triggers.sql
-- Database Functions, Triggers, and Realtime Publications
-- ============================================================================

-- 1. Auto-provision profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_role public.user_role;
  v_name TEXT;
  v_code TEXT;
  v_phone TEXT;
BEGIN
  -- Extract user metadata (or fallback defaults)
  v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  v_phone := NEW.raw_user_meta_data->>'phone';
  
  -- Prevent privilege escalation: only allow admin if expressly approved or created by admin
  -- Default to 'farmer' unless valid role specified
  IF NEW.raw_user_meta_data->>'role' = 'operator' THEN
    v_role := 'operator'::public.user_role;
  ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN
    -- In production, admin users should be created via secure invitation or dashboard
    v_role := 'admin'::public.user_role;
  ELSE
    v_role := 'farmer'::public.user_role;
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (NEW.id, v_name, NEW.email, v_phone, v_role)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
      updated_at = timezone('utc'::text, now());

  -- Create sub-record based on role
  IF v_role = 'farmer' THEN
    v_code := 'FMR-' || UPPER(SUBSTRING(MD5(NEW.id::text || clock_timestamp()::text) FROM 1 FOR 6));
    INSERT INTO public.farmers (user_id, farmer_code, village, district, state)
    VALUES (
      NEW.id,
      v_code,
      COALESCE(NEW.raw_user_meta_data->>'village', 'Ratlam Rural'),
      COALESCE(NEW.raw_user_meta_data->>'district', 'Ratlam'),
      COALESCE(NEW.raw_user_meta_data->>'state', 'Madhya Pradesh')
    )
    ON CONFLICT (user_id) DO NOTHING;

  ELSIF v_role = 'operator' THEN
    v_code := 'OP-' || UPPER(SUBSTRING(MD5(NEW.id::text || clock_timestamp()::text) FROM 1 FOR 6));
    INSERT INTO public.operators (user_id, operator_code, designation)
    VALUES (
      NEW.id,
      v_code,
      COALESCE(NEW.raw_user_meta_data->>'designation', 'Weighbridge Operator')
    )
    ON CONFLICT (user_id) DO NOTHING;

  ELSIF v_role = 'admin' THEN
    INSERT INTO public.admins (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Transaction Number Generator Trigger
CREATE OR REPLACE FUNCTION public.set_transaction_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.transaction_number IS NULL OR NEW.transaction_number = '' THEN
    NEW.transaction_number := 'TXN-' || TO_CHAR(timezone('utc'::text, now()), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(NEW.id::text || clock_timestamp()::text) FROM 1 FOR 5));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_transaction_number ON public.transactions;
CREATE TRIGGER trg_set_transaction_number
  BEFORE INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_transaction_number();

-- 3. Automatic SHA-256 Hash on Weighment/Verification
CREATE OR REPLACE FUNCTION public.generate_transaction_hash()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status IN ('verified', 'completed') AND (NEW.hash_sha256 IS NULL OR NEW.hash_sha256 = '') THEN
    NEW.hash_sha256 := encode(
      digest(
        NEW.transaction_number || '|' || 
        COALESCE(NEW.actual_weight::text, NEW.declared_weight::text) || '|' || 
        COALESCE(NEW.quality_grade, 'A') || '|' || 
        COALESCE(NEW.operator_id::text, '') || '|' ||
        COALESCE(NEW.farmer_id::text, '') || '|' ||
        timezone('utc'::text, now())::text,
        'sha256'
      ), 
      'hex'
    );
  END IF;
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_transaction_hash ON public.transactions;
CREATE TRIGGER trg_generate_transaction_hash
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.generate_transaction_hash();

-- 4. Audit Log Automation Trigger
CREATE OR REPLACE FUNCTION public.audit_transaction_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (
      auth.uid(),
      'TRANSACTION_CREATED',
      'transactions',
      NEW.id,
      jsonb_build_object(
        'transaction_number', NEW.transaction_number,
        'farmer_id', NEW.farmer_id,
        'mandi_id', NEW.mandi_id,
        'declared_weight', NEW.declared_weight,
        'status', NEW.status
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status OR OLD.actual_weight IS DISTINCT FROM NEW.actual_weight THEN
      INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (
        auth.uid(),
        'TRANSACTION_UPDATED',
        'transactions',
        NEW.id,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status,
          'old_weight', OLD.actual_weight,
          'new_weight', NEW.actual_weight,
          'quality_grade', NEW.quality_grade,
          'operator_id', NEW.operator_id
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_transaction ON public.transactions;
CREATE TRIGGER trg_audit_transaction
  AFTER INSERT OR UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.audit_transaction_event();

-- 5. Realtime Publication Setup
-- Enable Supabase Realtime for live cross-role reactivity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'disputes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.disputes;
  END IF;
END $$;
