import { z } from 'zod';

// Knowledge document validation
export const knowledgeDocumentSchema = z.object({
  fileName: z.string().min(1).max(255),
  content: z.string().min(1).max(1000000), // 1MB text limit
  fileSize: z.number().optional(),
  fileType: z.string().optional(),
});

// Tenant configuration validation
export const tenantConfigSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  planType: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  apiProvider: z.enum(['openai', 'anthropic', 'google']).optional(),
  apiKey: z.string().min(20).max(500).optional(),
  widgetGreeting: z.string().min(1).max(500).optional(),
});

// Chat message validation
export const chatMessageSchema = z.object({
  message: z.string().min(1).max(5000),
  conversationId: z.string().uuid().optional(),
  visitorId: z.string().min(1).max(255),
  tenantId: z.string().uuid(),
});

// Appointment validation
export const appointmentSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  purpose: z.string().min(1).max(500).optional(),
});

// UUID validation helper
export const uuidSchema = z.string().uuid();

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
