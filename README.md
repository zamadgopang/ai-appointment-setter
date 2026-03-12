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
