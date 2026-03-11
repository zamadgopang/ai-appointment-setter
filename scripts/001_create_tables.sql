-- Table: tenants
-- Stores tenant configuration including pricing plan and API credentials
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'managed' CHECK (plan_type IN ('managed', 'byok')),
  api_provider TEXT,
  api_key_encrypted TEXT,
  google_oauth_token TEXT,
  google_calendar_connected BOOLEAN DEFAULT FALSE,
  widget_greeting TEXT DEFAULT 'Hi there! How can I help you today?',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: business_knowledge
-- Stores uploaded knowledge base documents for RAG
CREATE TABLE IF NOT EXISTS business_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_knowledge ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants table
CREATE POLICY "tenants_select_own" ON tenants 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tenants_insert_own" ON tenants 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tenants_update_own" ON tenants 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "tenants_delete_own" ON tenants 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for business_knowledge table
CREATE POLICY "knowledge_select_own" ON business_knowledge 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = business_knowledge.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

CREATE POLICY "knowledge_insert_own" ON business_knowledge 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = business_knowledge.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

CREATE POLICY "knowledge_update_own" ON business_knowledge 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = business_knowledge.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

CREATE POLICY "knowledge_delete_own" ON business_knowledge 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = business_knowledge.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );
