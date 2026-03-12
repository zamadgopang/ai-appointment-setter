/**
 * Plan definitions and limit enforcement for the SaaS tiers.
 * Free (BYOK) | Starter ($19/mo) | Pro ($49/mo)
 */

export type PlanId = 'free' | 'starter' | 'pro';

export interface PlanLimits {
  id: PlanId;
  name: string;
  price: number; // monthly in USD
  description: string;
  features: string[];
  limits: {
    documentsMax: number;
    conversationsPerMonth: number;
    teamMembers: number;
    fileSizeMb: number;
    customWidget: boolean;
    customCss: boolean;
    analytics: 'basic' | 'advanced';
    exportData: boolean;
    prioritySupport: boolean;
    aiModel: string;
    removeBranding: boolean;
  };
}

export const PLANS: Record<PlanId, PlanLimits> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Bring your own API key. Perfect for getting started.',
    features: [
      'Bring your own AI key',
      '3 knowledge documents',
      '50 conversations/month',
      'Basic analytics',
      'Google Calendar integration',
      'Embeddable chat widget',
    ],
    limits: {
      documentsMax: 3,
      conversationsPerMonth: 50,
      teamMembers: 1,
      fileSizeMb: 5,
      customWidget: false,
      customCss: false,
      analytics: 'basic',
      exportData: false,
      prioritySupport: false,
      aiModel: 'BYOK',
      removeBranding: false,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 19,
    description: 'Managed AI with more power. Best for small businesses.',
    features: [
      'Managed AI (GPT-4o-mini)',
      '25 knowledge documents',
      '500 conversations/month',
      'Advanced analytics',
      'Full widget customization',
      'Google Calendar integration',
      '3 team members',
      'Email support',
    ],
    limits: {
      documentsMax: 25,
      conversationsPerMonth: 500,
      teamMembers: 3,
      fileSizeMb: 10,
      customWidget: true,
      customCss: false,
      analytics: 'advanced',
      exportData: true,
      prioritySupport: false,
      aiModel: 'gpt-4o-mini',
      removeBranding: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    description: 'Maximum power with premium AI. For growing teams.',
    features: [
      'Managed AI (GPT-4o)',
      'Unlimited documents',
      'Unlimited conversations',
      'Advanced analytics + export',
      'Full widget + custom CSS',
      'Google Calendar integration',
      'Unlimited team members',
      'Remove branding',
      'Priority support',
    ],
    limits: {
      documentsMax: -1, // unlimited
      conversationsPerMonth: -1, // unlimited
      teamMembers: -1, // unlimited
      fileSizeMb: 25,
      customWidget: true,
      customCss: true,
      analytics: 'advanced',
      exportData: true,
      prioritySupport: true,
      aiModel: 'gpt-4o',
      removeBranding: true,
    },
  },
};

/**
 * Check if a specific limit is exceeded for a given plan.
 * Returns true if the action is allowed, false if limit reached.
 * A limit of -1 means unlimited.
 */
export function isWithinLimit(
  planId: PlanId,
  resource: 'documents' | 'conversations',
  currentCount: number
): boolean {
  const plan = PLANS[planId];
  if (!plan) return false;

  let max: number;
  switch (resource) {
    case 'documents':
      max = plan.limits.documentsMax;
      break;
    case 'conversations':
      max = plan.limits.conversationsPerMonth;
      break;
    default:
      return true;
  }

  if (max === -1) return true; // unlimited
  return currentCount < max;
}

/**
 * Get the AI model to use for a given plan.
 * For free plan (BYOK), returns null (use tenant's own key).
 */
export function getAiModelForPlan(planId: PlanId): string | null {
  const plan = PLANS[planId];
  if (!plan || plan.limits.aiModel === 'BYOK') return null;
  return plan.limits.aiModel;
}

/**
 * Get plan limit value for display.
 */
export function formatLimit(value: number): string {
  if (value === -1) return 'Unlimited';
  return value.toLocaleString();
}
