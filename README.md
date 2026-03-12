# AI Appointment Setter

An AI-powered appointment scheduling assistant built with Next.js, Supabase, and the AI SDK. Features include a knowledge base for business information, Google Calendar integration, and an embeddable chat widget.

## Features

- 🤖 **AI-Powered Chat**: Natural language appointment scheduling using OpenAI
- 📚 **Knowledge Base**: Upload documents to train your AI agent on your business
- 📅 **Calendar Integration**: Connect with Google Calendar for real-time availability
- 💬 **Embeddable Widget**: Add the chat widget to any website
- 🔐 **Secure by Default**: Supabase authentication and encrypted API keys
- 📊 **Analytics Dashboard**: Track conversations and appointments

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zamadgopang/ai-appointment-setter.git
cd ai-appointment-setter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `OPENAI_API_KEY` - Your OpenAI API key

5. Set up the Supabase database:
   - Create a new Supabase project
   - Run the SQL schema (see Database Setup below)

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Setup

Create the following tables in your Supabase project:

```sql
-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  plan_type TEXT DEFAULT 'managed',
  api_provider TEXT,
  api_key_encrypted TEXT,
  google_calendar_connected BOOLEAN DEFAULT FALSE,
  widget_greeting TEXT DEFAULT 'Hi there! How can I help you today?',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business knowledge table
CREATE TABLE business_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table (optional - for analytics)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  visitor_id TEXT,
  messages JSONB DEFAULT '[]',
  appointment_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (customize based on your auth requirements)
CREATE POLICY "Enable read access for all users" ON tenants FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON tenants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON tenants FOR UPDATE USING (true);

CREATE POLICY "Enable all access for knowledge" ON business_knowledge FOR ALL USING (true);
CREATE POLICY "Enable all access for conversations" ON conversations FOR ALL USING (true);
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables for Production

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `OPENAI_API_KEY` | Yes | OpenAI API key for managed service |
| `NEXT_PUBLIC_APP_URL` | No | Your application URL |

### Health Check

The application includes a health check endpoint at `/api/health` that returns:
- Database connectivity status
- Environment configuration status
- Overall application health

## Widget Integration

To embed the chat widget on your website, add this script before the closing `</body>` tag:

```html
<script src="https://your-domain.com/widget.js" data-tenant-id="YOUR_TENANT_ID"></script>
```

## Architecture

```
app/
├── (dashboard)/        # Dashboard pages with sidebar layout
│   ├── agent-setup/    # AI agent configuration
│   ├── analytics/      # Performance metrics
│   ├── conversations/  # Chat history
│   └── settings/       # Account settings
├── api/
│   ├── chat/           # AI chat endpoint
│   ├── health/         # Health check endpoint
│   ├── knowledge/      # Document upload/management
│   └── tenant/         # Tenant configuration
components/
├── agent/              # Agent-specific components
└── ui/                 # Shadcn UI components
lib/
├── supabase/           # Supabase client utilities
├── env.ts              # Environment validation
└── utils.ts            # Utility functions
```

## Security

- API keys are encrypted before storage
- Supabase Row Level Security (RLS) protects data
- Security headers configured for production
- CORS configured for widget embedding

## License

MIT License

## Support

For issues and feature requests, please open a GitHub issue.
