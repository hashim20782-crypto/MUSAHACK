-- ============================================================================
-- 003_storage_policies.sql
-- Storage Buckets and Storage RLS Policies for Document & Photo Uploads
-- ============================================================================

-- Create storage buckets if not already present
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('farmer-documents', 'farmer-documents', false),
  ('transaction-documents', 'transaction-documents', false),
  ('mandi-assets', 'mandi-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 1. Avatars Bucket Policies
-- Path structure: avatars/{user_id}/{filename}
CREATE POLICY "avatars_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
  );

CREATE POLICY "avatars_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
  );

-- 2. Farmer Documents Bucket Policies (Private)
-- Path structure: farmer-documents/{user_id}/{filename}
CREATE POLICY "farmer_documents_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'farmer-documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.is_admin()
      OR public.auth_user_role() = 'operator'::public.user_role
    )
  );

CREATE POLICY "farmer_documents_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'farmer-documents'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
  );

-- 3. Transaction Documents Bucket Policies (Private evidence photos, weighment tickets)
-- Path structure: transaction-documents/{transaction_id}/{filename}
CREATE POLICY "transaction_docs_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'transaction-documents'
    AND (
      public.is_admin()
      OR public.auth_user_role() = 'operator'::public.user_role
      OR EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.id::text = (storage.foldername(name))[1]
        AND t.farmer_id = public.get_auth_farmer_id()
      )
    )
  );

CREATE POLICY "transaction_docs_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'transaction-documents'
    AND (
      public.is_admin()
      OR public.auth_user_role() = 'operator'::public.user_role
      OR EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.id::text = (storage.foldername(name))[1]
        AND t.farmer_id = public.get_auth_farmer_id()
      )
    )
  );

-- 4. Mandi Assets Bucket Policies (Public logos, rate charts)
CREATE POLICY "mandi_assets_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'mandi-assets');

CREATE POLICY "mandi_assets_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'mandi-assets' AND public.is_admin()
  );
