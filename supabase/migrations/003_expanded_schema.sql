-- =============================================
-- Migration 003: Expanded Schema
-- AI Appointment Setter - Full SaaS tables
-- =============================================

-- -----------------------------------------------
-- 1. Extend tenants table with new columns
-- -----------------------------------------------
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS google_calendar_email TEXT;

-- -----------------------------------------------
-- 2. Subscriptions table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL DEFAULT 'free' CHECK (plan_id IN ('free', 'starter', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 3. Usage tracking table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start DATE NOT NULL DEFAULT (CURRENT_DATE - (EXTRACT(DAY FROM CURRENT_DATE)::int - 1) * INTERVAL '1 day')::DATE,
  conversations_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  documents_count INTEGER DEFAULT 0,
  api_calls_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, period_start)
);

-- -----------------------------------------------
-- 4. Widget configurations table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS widget_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  primary_color TEXT DEFAULT '#10b981',
  text_color TEXT DEFAULT '#ffffff',
  position TEXT DEFAULT 'bottom-right' CHECK (position IN ('bottom-right', 'bottom-left')),
  avatar_url TEXT,
  display_name TEXT DEFAULT 'AI Assistant',
  welcome_message TEXT DEFAULT 'Hi! I can help you schedule an appointment. How can I assist you today?',
  show_branding BOOLEAN DEFAULT TRUE,
  custom_css TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 5. Appointment types table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS appointment_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  color TEXT DEFAULT '#10b981',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------
-- 6. Business hours table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL DEFAULT '09:00',
  end_time TIME NOT NULL DEFAULT '17:00',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, day_of_week)
);

-- -----------------------------------------------
-- 7. Extend appointments table
-- -----------------------------------------------
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS appointment_type_id UUID REFERENCES appointment_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS visitor_phone TEXT;

-- -----------------------------------------------
-- 8. Indexes for new tables
-- -----------------------------------------------
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_tenant_period ON usage_tracking(tenant_id, period_start);
CREATE INDEX IF NOT EXISTS idx_widget_configs_tenant_id ON widget_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointment_types_tenant_id ON appointment_types(tenant_id);
CREATE INDEX IF NOT EXISTS idx_business_hours_tenant_id ON business_hours(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- -----------------------------------------------
-- 9. Updated_at triggers for new tables
-- -----------------------------------------------
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widget_configs_updated_at BEFORE UPDATE ON widget_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_types_updated_at BEFORE UPDATE ON appointment_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_hours_updated_at BEFORE UPDATE ON business_hours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------
-- 10. Row Level Security for new tables
-- -----------------------------------------------
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- Subscriptions: tenant owner only
CREATE POLICY subscription_access ON subscriptions
  FOR ALL
  USING (tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid()));

-- Usage tracking: tenant owner only
CREATE POLICY usage_tracking_access ON usage_tracking
  FOR ALL
  USING (tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid()));

-- Widget configs: owner can manage, public can read (for widget rendering)
CREATE POLICY widget_configs_owner_access ON widget_configs
  FOR ALL
  USING (tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid()));

CREATE POLICY widget_configs_public_read ON widget_configs
  FOR SELECT
  USING (true);

-- Appointment types: owner can manage, public can read (for widget display)
CREATE POLICY appointment_types_owner_access ON appointment_types
  FOR ALL
  USING (tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid()));

CREATE POLICY appointment_types_public_read ON appointment_types
  FOR SELECT
  USING (true);

-- Business hours: owner can manage, public can read (for availability display)
CREATE POLICY business_hours_owner_access ON business_hours
  FOR ALL
  USING (tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid()));

CREATE POLICY business_hours_public_read ON business_hours
  FOR SELECT
  USING (true);

-- -----------------------------------------------
-- 11. Function to initialize default data for new tenants
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION initialize_tenant_defaults()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default subscription (free plan)
  INSERT INTO subscriptions (tenant_id, plan_id, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (tenant_id) DO NOTHING;

  -- Create default widget config
  INSERT INTO widget_configs (tenant_id)
  VALUES (NEW.id)
  ON CONFLICT (tenant_id) DO NOTHING;

  -- Create default business hours (Mon-Fri 9am-5pm)
  INSERT INTO business_hours (tenant_id, day_of_week, start_time, end_time, is_active)
  VALUES
    (NEW.id, 0, '09:00', '17:00', FALSE), -- Sunday (off)
    (NEW.id, 1, '09:00', '17:00', TRUE),  -- Monday
    (NEW.id, 2, '09:00', '17:00', TRUE),  -- Tuesday
    (NEW.id, 3, '09:00', '17:00', TRUE),  -- Wednesday
    (NEW.id, 4, '09:00', '17:00', TRUE),  -- Thursday
    (NEW.id, 5, '09:00', '17:00', TRUE),  -- Friday
    (NEW.id, 6, '09:00', '17:00', FALSE)  -- Saturday (off)
  ON CONFLICT (tenant_id, day_of_week) DO NOTHING;

  -- Create default appointment type
  INSERT INTO appointment_types (tenant_id, name, description, duration_minutes)
  VALUES (NEW.id, 'General Consultation', 'Standard appointment', 30)
  ON CONFLICT DO NOTHING;

  -- Initialize usage tracking for current month
  INSERT INTO usage_tracking (tenant_id, period_start)
  VALUES (NEW.id, DATE_TRUNC('month', CURRENT_DATE)::DATE)
  ON CONFLICT (tenant_id, period_start) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-initialize defaults when a tenant is created
CREATE TRIGGER trigger_initialize_tenant_defaults
  AFTER INSERT ON tenants
  FOR EACH ROW EXECUTE FUNCTION initialize_tenant_defaults();
