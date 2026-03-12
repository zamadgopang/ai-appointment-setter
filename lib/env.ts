import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),

  // Application
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Encryption
  ENCRYPTION_KEY: z.string().refine((value) => {
    try {
      const buffer = Buffer.from(value, 'base64');
      return buffer.length === 32;
    } catch {
      return false;
    }
  }, {
    message: 'ENCRYPTION_KEY must be a base64-encoded 32-byte key for AES-256-GCM',
  }),

  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes

  // Feature Flags
  ENABLE_DEMO_MODE: z.coerce.boolean().default(false),
  ENABLE_BYOK: z.coerce.boolean().default(true),
});

function validateEnv() {
  // Provide dummy values during build phase to prevent static rendering crashes
  if (
    process.env.SKIP_ENV_VALIDATION === '1' ||
    process.env.SKIP_ENV_VALIDATION === 'true' ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.VERCEL === '1'
  ) {
    return {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'dummy',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      RATE_LIMIT_MAX_REQUESTS: 100,
      RATE_LIMIT_WINDOW_MS: 900000,
      ENABLE_DEMO_MODE: false,
      ENABLE_BYOK: true,
    } as unknown as z.infer<typeof envSchema>;
  }

  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.')).join(', ');
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}\n` +
        `Please check your .env file and ensure all required variables are set.\n` +
        `See .env.example for reference.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
