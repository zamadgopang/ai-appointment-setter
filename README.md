# AI Appointment Setter

An intelligent appointment scheduling assistant powered by AI that integrates with your calendar and understands your business context.

## 🚀 Features

- **AI-Powered Chat**: Natural language appointment scheduling using OpenAI GPT-4
- **Knowledge Base**: Upload business documents (policies, hours, services) for context-aware responses
- **Calendar Integration**: Google Calendar sync for real-time availability
- **Multi-Tenancy**: Secure tenant isolation with row-level security
- **Customizable Widget**: Embeddable chat widget for your website
- **BYOK Support**: Bring your own API key or use managed service
- **Real-time Chat**: Streaming AI responses with tool calling
- **Analytics Dashboard**: Track conversations and appointment metrics

## 🛠️ Tech Stack
An AI-powered appointment scheduling assistant built with Next.js, Supabase, and the AI SDK. Features include a knowledge base for business information, Google Calendar integration, and an embeddable chat widget.

## Features

- 🤖 **AI-Powered Chat**: Natural language appointment scheduling using OpenAI
- 📚 **Knowledge Base**: Upload documents to train your AI agent on your business
- 📅 **Calendar Integration**: Connect with Google Calendar for real-time availability
- 💬 **Embeddable Widget**: Add the chat widget to any website
- 🔐 **Secure by Default**: Supabase authentication and encrypted API keys
- 📊 **Analytics Dashboard**: Track conversations and appointments

- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19, Tailwind CSS, Shadcn/UI
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (SSR)
- **AI**: Vercel AI SDK + OpenAI
- **Deployment**: Vercel (recommended) or Docker

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- OpenAI API key
- Google OAuth credentials (optional, for calendar integration)

## 🏃 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/zamadgopang/ai-appointment-setter.git
cd ai-appointment-setter
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Copy the example environment file and fill in your values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Required variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Encryption Key (generate with: openssl rand -base64 32)
ENCRYPTION_KEY=your_32_byte_encryption_key_base64

# Optional: Google OAuth (for Calendar Integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Feature Flags
ENABLE_DEMO_MODE=true
ENABLE_BYOK=true
\`\`\`

### 4. Set Up Database

Run the database migrations in your Supabase SQL editor:

\`\`\`bash
# Navigate to your Supabase project SQL Editor
# Run migrations in order:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_seed_demo_data.sql
\`\`\`

Or use the Supabase CLI:

\`\`\`bash
npx supabase db push
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

\`\`\`
ai-appointment-setter/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── agent-setup/         # Main configuration page
│   │   ├── conversations/       # Chat history
│   │   ├── analytics/          # Metrics dashboard
│   │   └── settings/           # Account settings
│   ├── api/                    # Backend API routes
│   │   ├── chat/              # AI chat endpoint
│   │   ├── knowledge/         # Document management
│   │   ├── tenant/config/     # Tenant configuration
│   │   └── health/            # Health check
│   └── layout.tsx             # Root layout
├── components/                 # React components
│   ├── agent/                 # Feature-specific components
│   └── ui/                    # Shadcn UI components
├── lib/                       # Utility libraries
│   ├── supabase/             # Database clients
│   ├── auth.ts               # Authentication helpers
│   ├── encryption.ts         # API key encryption
│   ├── env.ts                # Environment validation
│   ├── rate-limit.ts         # Rate limiting
│   └── validations.ts        # Zod schemas
├── supabase/                 # Database migrations
│   └── migrations/           # SQL migration files
├── hooks/                    # Custom React hooks
├── .env.example             # Environment template
├── next.config.mjs          # Next.js configuration
├── middleware.ts            # Auth middleware
└── package.json
\`\`\`

## 🗄️ Database Schema

### Core Tables

- **tenants**: Multi-tenant organization data
- **business_knowledge**: Uploaded business documents
- **conversations**: Chat sessions
- **messages**: Individual chat messages
- **appointments**: Scheduled appointments
- **analytics_events**: Usage tracking

See \`supabase/migrations/001_initial_schema.sql\` for full schema.

## 🔐 Security Features

- **Row-Level Security (RLS)**: Enforced at database level
- **API Key Encryption**: AES-256-GCM encryption for BYOK
- **Rate Limiting**: Prevents abuse and DoS attacks
- **Input Validation**: Zod schema validation on all endpoints
- **Security Headers**: CSP, XSS protection, frame options
- **Authentication**: Supabase Auth with SSR
- **CORS Configuration**: Controlled API access

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zamadgopang/ai-appointment-setter)

### Docker Deployment

Build and run with Docker:

\`\`\`bash
docker build -t ai-appointment-setter .
docker run -p 3000:3000 --env-file .env ai-appointment-setter
\`\`\`

Or use Docker Compose:

\`\`\`bash
docker-compose up -d
\`\`\`

See \`DEPLOYMENT.md\` for detailed deployment instructions.

## 🧪 Testing

\`\`\`bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

## 📚 API Documentation

### Health Check
\`\`\`
GET /api/health
\`\`\`

### Knowledge Management
\`\`\`
POST   /api/knowledge       # Upload document
GET    /api/knowledge       # List documents
DELETE /api/knowledge?id={id}  # Delete document
\`\`\`

### Tenant Configuration
\`\`\`
GET /api/tenant/config      # Get configuration
PUT /api/tenant/config      # Update configuration
\`\`\`

### Chat
\`\`\`
POST /api/chat              # Send message
\`\`\`

## 🔧 Configuration

### Demo Mode

Enable demo mode for testing without authentication:

\`\`\`env
ENABLE_DEMO_MODE=true
\`\`\`

### Rate Limiting

Adjust rate limits in \`.env\`:

\`\`\`env
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
\`\`\`

### Widget Customization

Customize the chat widget appearance and greeting in the Agent Setup page.

## 🐛 Troubleshooting

### Database Connection Issues

Ensure your Supabase URL and keys are correct:

\`\`\`bash
# Test connection
npx supabase projects list
\`\`\`

### Environment Variables Not Loading

Make sure you're using \`.env.local\` for local development and variables are properly set in production.

### TypeScript Errors

Run type checking:

\`\`\`bash
npm run type-check
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Powered by [Supabase](https://supabase.com/)
- AI by [OpenAI](https://openai.com/)

## 🗺️ Roadmap

- [ ] Vector embeddings (pgvector) for semantic search
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Webhook integrations
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Microsoft Calendar integration
- [ ] Slack integration

---

**Made with ❤️ for better appointment scheduling**
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
