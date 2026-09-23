-- ============================================================================
-- 002_rls_policies.sql
-- Row Level Security (RLS) Policies and Security-Definer Helper Functions
-- ============================================================================

-- Enable RLS on all public tables
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

-- ----------------------------------------------------------------------------
-- SECURITY DEFINER Helper Functions (Safe Search Path)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.auth_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'::public.user_role
  );
$$;

CREATE OR REPLACE FUNCTION public.get_auth_farmer_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT id FROM public.farmers WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_operator_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT id FROM public.operators WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_operator_mandi_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT mandi_id FROM public.operators WHERE user_id = auth.uid() AND active = true;
$$;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------

-- Anyone authenticated can view their own profile; admins can view all profiles
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR public.is_admin()
  );

-- Users can update their own profile (except changing their role)
CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (
    (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- Admins can insert/delete profiles
CREATE POLICY "profiles_admin_insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin() OR id = auth.uid());

CREATE POLICY "profiles_admin_delete"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- MANDIS POLICIES
-- ----------------------------------------------------------------------------

-- All authenticated users can view active mandis
CREATE POLICY "mandis_select_policy"
  ON public.mandis FOR SELECT
  TO authenticated
  USING (active = true OR public.is_admin());

-- Only admins can manage mandis
CREATE POLICY "mandis_admin_all"
  ON public.mandis FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- FARMERS POLICIES
-- ----------------------------------------------------------------------------

-- Farmers view own record; Operators and Admins can view farmer records
CREATE POLICY "farmers_select_policy"
  ON public.farmers FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.auth_user_role() = 'operator'::public.user_role
    OR public.is_admin()
  );

-- Farmer can update own details; Admin can manage
CREATE POLICY "farmers_update_policy"
  ON public.farmers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Farmer can insert own initial profile; Admin can insert
CREATE POLICY "farmers_insert_policy"
  ON public.farmers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "farmers_delete_policy"
  ON public.farmers FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- OPERATORS POLICIES
-- ----------------------------------------------------------------------------

-- Operators view own record; Admins view all operators
CREATE POLICY "operators_select_policy"
  ON public.operators FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

-- Only admins can insert, update, delete operators
CREATE POLICY "operators_admin_insert"
  ON public.operators FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "operators_update_policy"
  ON public.operators FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (
    (user_id = auth.uid() AND mandi_id = (SELECT mandi_id FROM public.operators WHERE user_id = auth.uid()))
    OR public.is_admin()
  );

CREATE POLICY "operators_admin_delete"
  ON public.operators FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- ADMINS POLICIES
-- ----------------------------------------------------------------------------

CREATE POLICY "admins_select_policy"
  ON public.admins FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "admins_manage_policy"
  ON public.admins FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PRODUCE POLICIES
-- ----------------------------------------------------------------------------

-- Farmers view own produce; Operators and Admins view produce
CREATE POLICY "produce_select_policy"
  ON public.produce FOR SELECT
  TO authenticated
  USING (
    farmer_id = public.get_auth_farmer_id()
    OR public.auth_user_role() = 'operator'::public.user_role
    OR public.is_admin()
  );

-- Farmers can insert produce for their own farmer_id
CREATE POLICY "produce_insert_policy"
  ON public.produce FOR INSERT
  TO authenticated
  WITH CHECK (
    farmer_id = public.get_auth_farmer_id()
    OR public.is_admin()
  );

CREATE POLICY "produce_update_policy"
  ON public.produce FOR UPDATE
  TO authenticated
  USING (farmer_id = public.get_auth_farmer_id() OR public.is_admin())
  WITH CHECK (farmer_id = public.get_auth_farmer_id() OR public.is_admin());

CREATE POLICY "produce_delete_policy"
  ON public.produce FOR DELETE
  TO authenticated
  USING (farmer_id = public.get_auth_farmer_id() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- RATE CARDS POLICIES
-- ----------------------------------------------------------------------------

-- All authenticated users can view active rate cards
CREATE POLICY "rate_cards_select_policy"
  ON public.rate_cards FOR SELECT
  TO authenticated
  USING (active = true OR public.is_admin());

-- Only Admins manage rate cards
CREATE POLICY "rate_cards_admin_manage"
  ON public.rate_cards FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- TRANSACTIONS POLICIES (Central Workflow)
-- ----------------------------------------------------------------------------

-- Farmer: sees own transactions
-- Operator: sees transactions assigned to their mandi
-- Admin: sees all transactions
CREATE POLICY "transactions_select_policy"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (
    farmer_id = public.get_auth_farmer_id()
    OR (
      public.auth_user_role() = 'operator'::public.user_role
      AND mandi_id = public.get_auth_operator_mandi_id()
    )
    OR public.is_admin()
  );

-- Farmer can submit transaction for themselves
CREATE POLICY "transactions_farmer_insert"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    farmer_id = public.get_auth_farmer_id()
    OR public.is_admin()
  );

-- Operator can update transactions at their assigned mandi (recording weights, status)
CREATE POLICY "transactions_operator_update"
  ON public.transactions FOR UPDATE
  TO authenticated
  USING (
    (
      public.auth_user_role() = 'operator'::public.user_role
      AND mandi_id = public.get_auth_operator_mandi_id()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    (
      public.auth_user_role() = 'operator'::public.user_role
      AND mandi_id = public.get_auth_operator_mandi_id()
    )
    OR public.is_admin()
  );

-- Admin can delete/manage transactions
CREATE POLICY "transactions_admin_delete"
  ON public.transactions FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- WEIGHMENTS POLICIES
-- ----------------------------------------------------------------------------

-- Farmer can select weighments for their transactions
-- Operator can select weighments for their mandi transactions
-- Admin can select all weighments
CREATE POLICY "weighments_select_policy"
  ON public.weighments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE t.id = weighments.transaction_id
      AND (
        t.farmer_id = public.get_auth_farmer_id()
        OR (
          public.auth_user_role() = 'operator'::public.user_role
          AND t.mandi_id = public.get_auth_operator_mandi_id()
        )
        OR public.is_admin()
      )
    )
  );

-- Operator can record weighment for permitted transactions at their mandi
CREATE POLICY "weighments_operator_insert"
  ON public.weighments FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      public.auth_user_role() = 'operator'::public.user_role
      AND operator_id = public.get_auth_operator_id()
      AND EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.id = weighments.transaction_id
        AND t.mandi_id = public.get_auth_operator_mandi_id()
      )
    )
    OR public.is_admin()
  );

CREATE POLICY "weighments_admin_manage"
  ON public.weighments FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PAYMENTS POLICIES
-- ----------------------------------------------------------------------------

-- Farmer views own payments; Admin views all; Operator views status for their mandi
CREATE POLICY "payments_select_policy"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    farmer_id = public.get_auth_farmer_id()
    OR public.is_admin()
    OR (
      public.auth_user_role() = 'operator'::public.user_role
      AND EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.id = payments.transaction_id
        AND t.mandi_id = public.get_auth_operator_mandi_id()
      )
    )
  );

-- Admin manages payments
CREATE POLICY "payments_admin_manage"
  ON public.payments FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- DISPUTES POLICIES
-- ----------------------------------------------------------------------------

-- Farmer views own disputes; Operator and Admin view disputes
CREATE POLICY "disputes_select_policy"
  ON public.disputes FOR SELECT
  TO authenticated
  USING (
    farmer_id = public.get_auth_farmer_id()
    OR (
      public.auth_user_role() = 'operator'::public.user_role
      AND EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.id = disputes.transaction_id
        AND t.mandi_id = public.get_auth_operator_mandi_id()
      )
    )
    OR public.is_admin()
  );

-- Farmer can file dispute on own transaction
CREATE POLICY "disputes_farmer_insert"
  ON public.disputes FOR INSERT
  TO authenticated
  WITH CHECK (
    farmer_id = public.get_auth_farmer_id()
    OR public.is_admin()
  );

-- Farmer and Admin can update dispute confirmation status
CREATE POLICY "disputes_update_policy"
  ON public.disputes FOR UPDATE
  TO authenticated
  USING (
    farmer_id = public.get_auth_farmer_id()
    OR public.is_admin()
  )
  WITH CHECK (
    farmer_id = public.get_auth_farmer_id()
    OR public.is_admin()
  );

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ----------------------------------------------------------------------------

-- User sees only their own notifications
CREATE POLICY "notifications_select_policy"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- User updates read flag on own notifications
CREATE POLICY "notifications_update_policy"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- System / Authenticated can insert notification
CREATE POLICY "notifications_insert_policy"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- AUDIT LOGS POLICIES (Append-Only)
-- ----------------------------------------------------------------------------

-- Only Admins can view audit logs
CREATE POLICY "audit_logs_select_policy"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Authenticated users can insert audit records (via triggers or actions)
CREATE POLICY "audit_logs_insert_policy"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- NO UPDATE OR DELETE POLICY on audit_logs! (Strictly Immutable)
