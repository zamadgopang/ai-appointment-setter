import Link from 'next/link'
import {
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon,
} from 'lucide-react'
import { PLANS, type PlanId } from '@/lib/plans'

export const metadata = {
  title: 'Pricing — AppointAI',
  description:
    'Simple, transparent pricing. Free forever with your own API key. Upgrade for managed AI and more power.',
}

const planOrder: PlanId[] = ['free', 'starter', 'pro']

const faqs = [
  {
    q: 'What does "Bring Your Own Key" mean?',
    a: 'You provide your own OpenAI, Anthropic, or Google AI API key. This means you only pay your AI provider directly and AppointAI is completely free to use.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes! You can upgrade or downgrade at any time. When upgrading, you get instant access to new features. When downgrading, changes take effect at the next billing cycle.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'The Free plan with BYOK is already fully functional — no trial needed. You can use every core feature without paying us anything.',
  },
  {
    q: 'Do you store my API key?',
    a: 'Yes, but it is encrypted with AES-256-GCM before storage. We never share it with third parties and it is only used to process chat requests on your behalf.',
  },
  {
    q: 'What happens when I reach my plan limits?',
    a: 'You will receive a notification. New conversations will be paused until the next billing cycle or until you upgrade your plan.',
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <SparklesIcon className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Appoint<span className="gradient-text">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 dot-pattern" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple, transparent{' '}
            <span className="gradient-text">pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Free forever with your own API key. Upgrade when you need managed AI
            and more power.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {planOrder.map((planId) => {
              const plan = PLANS[planId]
              const isPopular = planId === 'starter'
              return (
                <div
                  key={planId}
                  className={`relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg ${
                    isPopular
                      ? 'border-primary ring-2 ring-primary/20 lg:scale-105'
                      : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <span className="text-5xl font-extrabold">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <Link
                    href="/signup"
                    className={`mb-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                      isPopular
                        ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg'
                        : 'border bg-card hover:bg-secondary'
                    }`}
                  >
                    {plan.price === 0 ? 'Start Free' : 'Get Started'}
                    <ArrowRightIcon className="size-4" />
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-secondary/30 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <SparklesIcon className="size-3.5" />
              </div>
              <span className="text-sm font-bold">AppointAI</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <GlobeIcon className="size-3.5" />
              <span>© {new Date().getFullYear()} AppointAI. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
