# Deployment Guide

This guide covers various deployment options for the AI Appointment Setter.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Production Checklist](#production-checklist)
- [Monitoring & Logging](#monitoring--logging)
- [Scaling Considerations](#scaling-considerations)

## Prerequisites

Before deploying to production, ensure you have:

1. ✅ Completed database migrations
2. ✅ Set up all required environment variables
3. ✅ Generated a secure encryption key
4. ✅ Configured Supabase RLS policies
5. ✅ Tested the application locally
6. ✅ Set up domain and SSL certificates

## Environment Setup

### Required Environment Variables

```env
# Production URLs
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI API Key
OPENAI_API_KEY=sk-your_production_openai_key

# Application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Security
ENCRYPTION_KEY=your_generated_encryption_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback

# Feature Flags
ENABLE_DEMO_MODE=false
ENABLE_BYOK=true

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Generate Encryption Key

```bash
openssl rand -base64 32
```

## Vercel Deployment

### Step 1: Prepare Repository

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add all required variables from `.env.example`.

### Step 4: Deploy

```bash
vercel --prod
```

Or push to your main branch for automatic deployment.

### Step 5: Configure Custom Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### Vercel Configuration File

Create `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Docker Deployment

### Step 1: Create Dockerfile

See `Dockerfile` in the repository root.

### Step 2: Create docker-compose.yml

See `docker-compose.yml` in the repository root.

### Step 3: Build Image

```bash
docker build -t ai-appointment-setter:latest .
```

### Step 4: Run Container

```bash
# Using docker run
docker run -d \
  --name ai-appointment-setter \
  -p 3000:3000 \
  --env-file .env.production \
  ai-appointment-setter:latest

# Using docker-compose
docker-compose up -d
```

### Step 5: View Logs

```bash
docker logs -f ai-appointment-setter
```

### Docker Best Practices

1. **Multi-stage builds**: Reduce image size
2. **Health checks**: Monitor container health
3. **Volume mounts**: Persist logs and data
4. **Resource limits**: Set CPU and memory limits
5. **Non-root user**: Run as unprivileged user

## Production Checklist

### Security

- [ ] Disable demo mode (`ENABLE_DEMO_MODE=false`)
- [ ] Use strong encryption key (32+ bytes)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable Supabase RLS
- [ ] Rotate API keys regularly
- [ ] Set up WAF (Web Application Firewall)
- [ ] Configure CSP headers
- [ ] Enable audit logging

### Performance

- [ ] Enable image optimization
- [ ] Configure CDN (Vercel Edge Network)
- [ ] Set up caching headers
- [ ] Optimize database indexes
- [ ] Enable compression
- [ ] Monitor Core Web Vitals
- [ ] Set up Redis for rate limiting (optional)
- [ ] Enable Turbopack for faster builds

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure log aggregation
- [ ] Set up uptime monitoring
- [ ] Enable Vercel Analytics
- [ ] Monitor database performance
- [ ] Set up alerts for errors
- [ ] Track API usage
- [ ] Monitor rate limit hits

### Database

- [ ] Run all migrations
- [ ] Set up backups (Supabase automatic backups)
- [ ] Configure connection pooling
- [ ] Optimize query performance
- [ ] Set up read replicas (if needed)
- [ ] Monitor database size
- [ ] Clean up old data periodically

### Testing

- [ ] Run integration tests
- [ ] Test authentication flows
- [ ] Verify API endpoints
- [ ] Test widget embed
- [ ] Check mobile responsiveness
- [ ] Verify calendar integration
- [ ] Test error handling
- [ ] Load testing

## Monitoring & Logging

### Vercel Analytics

Built-in analytics automatically track:
- Page views
- Web Vitals
- Deployment metrics

### Error Tracking with Sentry

Install Sentry:

```bash
npm install @sentry/nextjs
```

Configure in `sentry.client.config.js` and `sentry.server.config.js`.

### Log Aggregation

Production logs should be sent to a centralized service:
- **Vercel**: Built-in log streaming
- **Datadog**: Full observability platform
- **LogRocket**: Session replay + logging

### Health Check Monitoring

Set up monitoring for `/api/health`:

```bash
curl https://yourdomain.com/api/health
```

Use services like:
- UptimeRobot
- Pingdom
- Better Uptime

## Scaling Considerations

### Horizontal Scaling

Vercel automatically scales with traffic. For Docker:

```bash
docker-compose up -d --scale app=3
```

### Database Scaling

1. **Connection Pooling**: Use PgBouncer
2. **Read Replicas**: For heavy read workloads
3. **Caching**: Implement Redis for frequently accessed data
4. **Indexes**: Optimize based on query patterns

### Rate Limiting at Scale

For distributed systems, replace in-memory rate limiting with Redis:

```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function rateLimit(key: string, limit: number, window: number) {
  const current = await redis.incr(key)
  if (current === 1) {
    await redis.expire(key, window)
  }
  return current <= limit
}
```

### CDN Configuration

Use Vercel Edge Network or configure your own CDN:

- Cache static assets (images, JS, CSS)
- Cache API responses with appropriate TTL
- Enable compression
- Use edge functions for low-latency

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

### Docker

```bash
# Rollback to previous image
docker-compose down
docker-compose up -d ai-appointment-setter:previous-tag
```

### Database Rollback

```sql
-- Rollback a migration
-- Create a rollback script for each migration
-- Example: 001_initial_schema.rollback.sql
```

## Backup & Recovery

### Database Backups

Supabase provides automatic daily backups. For additional safety:

```bash
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20260312.sql
```

### File Backups

If storing files outside Supabase Storage:

```bash
# Backup uploaded files
aws s3 sync ./uploads s3://backup-bucket/uploads
```

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection Issues**
- Check Supabase service status
- Verify connection string
- Check IP allowlist in Supabase

**High Memory Usage**
- Enable memory profiling
- Check for memory leaks
- Optimize bundle size

**Slow API Responses**
- Check database query performance
- Enable query logging
- Add missing indexes
- Review N+1 query patterns

## Support

For deployment assistance:
- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📚 Docs: [Documentation](https://docs.example.com)

---

**Last Updated**: March 2026
