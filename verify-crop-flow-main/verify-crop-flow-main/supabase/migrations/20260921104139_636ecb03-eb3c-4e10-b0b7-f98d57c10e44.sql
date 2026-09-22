-- ============ FARMERS ============
CREATE TABLE public.farmers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fpo_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  village TEXT,
  qr_identifier TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.farmers TO authenticated;
GRANT ALL ON public.farmers TO service_role;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators can read farmer directory" ON public.farmers FOR SELECT TO authenticated USING (true);

-- ============ OPERATORS ============
CREATE TABLE public.operators (
  id UUID NOT NULL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Operator',
  phone TEXT,
  email TEXT,
  operator_code TEXT NOT NULL DEFAULT ('OP-' || lpad((floor(random()*9000)+1000)::text, 4, '0')),
  role TEXT NOT NULL DEFAULT 'Collection Operator',
  collection_center TEXT NOT NULL DEFAULT 'Nashik',
  language TEXT NOT NULL DEFAULT 'en',
  voice_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.operators TO authenticated;
GRANT ALL ON public.operators TO service_role;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read own profile" ON public.operators FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Operators insert own profile" ON public.operators FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Operators update own profile" ON public.operators FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_operator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.operators (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email,'operator@agritrust.in'), '@', 1)),
    NEW.email,
    NEW.phone
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_operator
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_operator();

-- ============ TRANSACTIONS ============
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE SET NULL,
  farmer_name TEXT NOT NULL,
  farmer_fpo_id TEXT,
  operator_id UUID,
  operator_name TEXT,
  weight NUMERIC(10,2) NOT NULL DEFAULT 0,
  grade TEXT NOT NULL DEFAULT 'A',
  crop_type TEXT NOT NULL DEFAULT 'Onion',
  audit_photo_path TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  approval_code TEXT,
  approval_method TEXT,
  dispute_status TEXT,
  dispute_reason TEXT,
  dispute_note TEXT,
  sync_status TEXT NOT NULL DEFAULT 'SYNCED',
  offline_created BOOLEAN NOT NULL DEFAULT false,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  CONSTRAINT transactions_grade_check CHECK (grade IN ('A','B','C')),
  CONSTRAINT transactions_status_check CHECK (status IN ('DRAFT','FARMER_SELECTED','WEIGHT_ENTERED','AUDIT_CAPTURED','PENDING_APPROVAL','VERIFIED_LOCKED','DISPUTED')),
  CONSTRAINT transactions_sync_check CHECK (sync_status IN ('SYNC_PENDING','SYNCING','SYNCED','SYNC_FAILED')),
  CONSTRAINT transactions_weight_check CHECK (weight >= 0 AND weight <= 100000)
);
CREATE INDEX transactions_operator_idx ON public.transactions(operator_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read own and demo transactions" ON public.transactions FOR SELECT TO authenticated USING (operator_id = auth.uid() OR is_demo = true);
CREATE POLICY "Operators create own transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (operator_id = auth.uid() AND is_demo = false);
CREATE POLICY "Operators update own unlocked transactions" ON public.transactions FOR UPDATE TO authenticated USING (operator_id = auth.uid()) WITH CHECK (operator_id = auth.uid());

CREATE OR REPLACE FUNCTION public.enforce_transaction_lock()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'VERIFIED_LOCKED' THEN
    RAISE EXCEPTION 'This transaction is verified and locked. It can no longer be changed.';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER transactions_lock_guard BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_transaction_lock();

-- ============ AUDIT EVENTS ============
CREATE TABLE public.audit_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  actor_id UUID,
  actor_role TEXT NOT NULL DEFAULT 'OPERATOR',
  actor_name TEXT,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_events_txn_idx ON public.audit_events(transaction_id, created_at);
GRANT SELECT, INSERT ON public.audit_events TO authenticated;
GRANT ALL ON public.audit_events TO service_role;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operators read audit trail for visible transactions" ON public.audit_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.transactions t WHERE t.transaction_id = audit_events.transaction_id AND (t.operator_id = auth.uid() OR t.is_demo = true)));
CREATE POLICY "Operators append audit trail" ON public.audit_events FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());

-- ============ STORAGE POLICIES ============
CREATE POLICY "Operators read own audit photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'audit-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Operators upload own audit photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'audit-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============ REALTIME ============
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- ============ DEMO FARMERS ============
INSERT INTO public.farmers (fpo_id, name, phone, village, qr_identifier) VALUES
  ('FPO-2048','Mohammed Irfan','+919812345642','Ozar','AGRI-QR-FPO-2048'),
  ('FPO-2049','Aamir Khan','+919822110045','Pimpalgaon','AGRI-QR-FPO-2049'),
  ('FPO-2050','Sameer Shaikh','+919833220178','Lasalgaon','AGRI-QR-FPO-2050'),
  ('FPO-2051','Ramesh Patil','+919844330291','Dindori','AGRI-QR-FPO-2051'),
  ('FPO-2052','Suresh Jadhav','+919855440384','Niphad','AGRI-QR-FPO-2052'),
  ('FPO-2053','Imran Sheikh','+919866550477','Yeola','AGRI-QR-FPO-2053'),
  ('FPO-2054','Rahul Pawar','+919877660560','Sinnar','AGRI-QR-FPO-2054'),
  ('FPO-2055','Vijay More','+919888770653','Chandwad','AGRI-QR-FPO-2055'),
  ('FPO-2056','Arif Khan','+919899880746','Satana','AGRI-QR-FPO-2056'),
  ('FPO-2057','Ganesh Shinde','+919900990839','Kalwan','AGRI-QR-FPO-2057');

-- ============ DEMO TRANSACTIONS ============
INSERT INTO public.transactions (transaction_id, farmer_id, farmer_name, farmer_fpo_id, operator_name, weight, grade, crop_type, status, approval_method, sync_status, dispute_status, dispute_reason, is_demo, created_at, approved_at, verified_at)
SELECT d.txn, f.id, f.name, f.fpo_id, 'Rahul', d.wt, d.grade, d.crop, d.status, d.method, d.sync, d.dstatus, d.dreason, true,
       now() - (d.mins || ' minutes')::interval,
       CASE WHEN d.status = 'VERIFIED_LOCKED' THEN now() - (d.mins || ' minutes')::interval + interval '6 minutes' END,
       CASE WHEN d.status = 'VERIFIED_LOCKED' THEN now() - (d.mins || ' minutes')::interval + interval '7 minutes' END
FROM (VALUES
  ('TXN-2026-08421','FPO-2048',248.50,'A','Onion','VERIFIED_LOCKED','REALTIME','SYNCED',NULL,NULL,42),
  ('TXN-2026-08420','FPO-2049',186.00,'B','Tomato','VERIFIED_LOCKED','OTP','SYNCED',NULL,NULL,75),
  ('TXN-2026-08419','FPO-2050',312.25,'A','Wheat','VERIFIED_LOCKED','REALTIME','SYNCED',NULL,NULL,110),
  ('TXN-2026-08418','FPO-2051',94.75,'C','Grapes','DISPUTED','NONE','SYNCED','OPEN','Farmer disputes grade',145),
  ('TXN-2026-08417','FPO-2052',201.00,'B','Onion','PENDING_APPROVAL','NONE','SYNCED',NULL,NULL,18),
  ('TXN-2026-08416','FPO-2053',420.50,'A','Soybean','VERIFIED_LOCKED','OTP','SYNCED',NULL,NULL,190),
  ('TXN-2026-08415','FPO-2054',150.00,'B','Tomato','PENDING_APPROVAL','NONE','SYNC_PENDING',NULL,NULL,26),
  ('TXN-2026-08414','FPO-2055',275.25,'A','Pomegranate','VERIFIED_LOCKED','REALTIME','SYNCED',NULL,NULL,230),
  ('TXN-2026-08413','FPO-2056',88.00,'C','Onion','DISPUTED','NONE','SYNCED','OPEN','Farmer left before approval',260),
  ('TXN-2026-08412','FPO-2057',365.75,'A','Wheat','VERIFIED_LOCKED','OTP','SYNCED',NULL,NULL,300)
) AS d(txn, fpo, wt, grade, crop, status, method, sync, dstatus, dreason, mins)
JOIN public.farmers f ON f.fpo_id = d.fpo;

INSERT INTO public.audit_events (transaction_id, actor_role, actor_name, event_type, created_at)
SELECT 'TXN-2026-08421', r.role, r.who, r.ev, (SELECT created_at FROM public.transactions WHERE transaction_id='TXN-2026-08421') + (r.offs || ' minutes')::interval
FROM (VALUES
  ('OPERATOR','Rahul','TRANSACTION_CREATED',0),
  ('OPERATOR','Rahul','FARMER_SELECTED',1),
  ('OPERATOR','Rahul','WEIGHT_ENTERED',3),
  ('OPERATOR','Rahul','GRADE_SELECTED',4),
  ('OPERATOR','Rahul','AUDIT_PHOTO_CAPTURED',5),
  ('OPERATOR','Rahul','AUDIT_PHOTO_UPLOADED',5),
  ('SYSTEM','AgriTrust','OTP_GENERATED',6),
  ('OPERATOR','Rahul','APPROVAL_REQUESTED',6),
  ('FARMER','Mohammed Irfan','FARMER_APPROVED',7),
  ('SYSTEM','AgriTrust','TRANSACTION_LOCKED',7)
) AS r(role, who, ev, offs);