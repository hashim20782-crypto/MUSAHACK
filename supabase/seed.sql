-- ============================================================================
-- seed.sql
-- Seed Data for Testing AgriTech Platform
-- ============================================================================

-- 1. Seed Mandis / Collection Centers
INSERT INTO public.mandis (id, name, code, address, district, state, latitude, longitude, active)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Ratlam Main Mandi', 'MND-RTL-01', 'Industrial Area, Ratlam', 'Ratlam', 'Madhya Pradesh', 23.3315, 75.0367, true),
  ('a2222222-2222-2222-2222-222222222222', 'Nashik Agricultural Terminal', 'MND-NSK-02', 'APMC Yard, Dindori Road, Nashik', 'Nashik', 'Maharashtra', 19.9975, 73.7898, true),
  ('a3333333-3333-3333-3333-333333333333', 'Indore Central APMC', 'MND-IND-03', 'Choithram Mandi, Indore', 'Indore', 'Madhya Pradesh', 22.7196, 75.8577, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Rate Cards (v2.3)
INSERT INTO public.rate_cards (id, produce_name, grade_a_rate, grade_b_rate, grade_c_rate, version, active)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Soybean (Black / Yellow)', 52.00, 48.00, 41.50, 'v2.3', true),
  ('b2222222-2222-2222-2222-222222222222', 'Wheat (Sharbati & Lokwan)', 34.50, 31.00, 26.00, 'v2.3', true),
  ('b3333333-3333-3333-3333-333333333333', 'Gram / Chana (Desi)', 64.00, 59.50, 51.00, 'v2.3', true),
  ('b4444444-4444-4444-4444-444444444444', 'Mustard / Sarson', 58.00, 53.50, 47.00, 'v2.3', true),
  ('b5555555-5555-5555-5555-555555555555', 'Cotton (Medium Staple)', 72.00, 66.00, 58.00, 'v2.3', true)
ON CONFLICT (id) DO NOTHING;
