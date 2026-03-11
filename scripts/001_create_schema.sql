-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

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
-- Stores uploaded knowledge base documents with vector embeddings for RAG
CREATE TABLE IF NOT EXISTS business_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS business_knowledge_embedding_idx 
ON business_knowledge USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Function: match_knowledge
-- Performs cosine similarity search on business knowledge for a specific tenant
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
  match_tenant_id UUID,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  file_name TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bk.id,
    bk.content,
    bk.file_name,
    1 - (bk.embedding <=> query_embedding) AS similarity
  FROM business_knowledge bk
  WHERE bk.tenant_id = match_tenant_id
    AND 1 - (bk.embedding <=> query_embedding) > match_threshold
  ORDER BY bk.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

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
