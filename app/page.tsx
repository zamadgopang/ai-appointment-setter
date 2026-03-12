import Link from 'next/link'
import {
  BotIcon,
  CalendarIcon,
  BarChart3Icon,
  CodeIcon,
  ShieldCheckIcon,
  ZapIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  MessageSquareIcon,
  GlobeIcon,
  SparklesIcon,
} from 'lucide-react'
import { PLANS, type PlanId } from '@/lib/plans'

const features = [
  {
    icon: BotIcon,
    title: 'AI-Powered Conversations',
    description:
      'Intelligent chatbot handles scheduling naturally. Understands context, answers business questions, and books appointments seamlessly.',
  },
  {
    icon: CalendarIcon,
    title: 'Google Calendar Sync',
    description:
      'Real-time calendar integration. AI checks your actual availability and creates events automatically — no double-bookings.',
  },
  {
    icon: CodeIcon,
    title: 'Easy Widget Embed',
    description:
      'Add a single line of code to any website. Works with WordPress, Shopify, Wix, or any custom site.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Bring Your Own Key',
    description:
      'Use your own OpenAI, Anthropic, or Google AI key for free. Your data stays under your control.',
  },
  {
    icon: BarChart3Icon,
    title: 'Smart Analytics',
    description:
      'Track conversations, booking rates, and AI performance. Export reports and optimize your scheduling workflow.',
  },
  {
    icon: ZapIcon,
    title: 'Knowledge Base RAG',
    description:
      'Upload your business docs and the AI learns your services, pricing, and FAQs — answering accurately every time.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Sign Up & Configure',
    description:
      'Create your account, upload business documents, and connect your Google Calendar.',
  },
  {
    number: '02',
    title: 'Customize Your Widget',
    description:
      'Style your chat widget to match your brand. Set colors, greeting messages, and appointment types.',
  },
  {
    number: '03',
    title: 'Embed & Go Live',
    description:
      'Copy one line of code to your website. Your AI assistant starts booking appointments instantly.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Dentist, Bright Smiles Dental',
    text: 'AppointAI reduced our no-shows by 40%. Patients love booking through chat — it feels so natural.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Owner, MJ Consulting',
    text: 'I was spending hours on scheduling. Now the AI handles it 24/7 while I focus on client work.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Yoga Studio Manager',
    text: "The BYOK option is perfect. I use my own API key and pay nothing extra. It's genuinely free!",
    rating: 5,
  },
]

const planOrder: PlanId[] = ['free', 'starter', 'pro']

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ===== Navbar ===== */}
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
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute -top-40 right-0 size-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 left-0 size-[400px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium shadow-sm">
              <SparklesIcon className="size-4 text-primary" />
              <span>AI-Powered Appointment Scheduling</span>
            </div>

            <h1 className="animate-fade-in-up delay-100 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ animationFillMode: 'both' }}
            >
              Turn Your Website Into a{' '}
              <span className="gradient-text">24/7 Booking Machine</span>
            </h1>

            <p
              className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
              style={{ animationFillMode: 'both' }}
            >
              Add an AI chat widget that schedules appointments, answers
              questions, and syncs with your calendar — all in one line of code.
              Free with your own API key.
            </p>

            <div
              className="animate-fade-in-up delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animationFillMode: 'both' }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 animate-pulse-glow"
              >
                Start Free — No Card Required
                <ArrowRightIcon className="size-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border bg-card px-8 py-3.5 text-base font-semibold shadow-sm transition-all hover:bg-secondary hover:shadow-md"
              >
                See How It Works
              </a>
            </div>

            <p
              className="animate-fade-in-up delay-400 mt-6 text-sm text-muted-foreground"
              style={{ animationFillMode: 'both' }}
            >
              ✓ Free forever with BYOK &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ 2-minute setup
            </p>
          </div>

          {/* Widget Preview Mock */}
          <div
            className="animate-fade-in-up delay-500 mx-auto mt-16 max-w-md"
            style={{ animationFillMode: 'both' }}
          >
            <div className="animate-float overflow-hidden rounded-2xl border bg-card shadow-2xl">
              <div className="flex items-center gap-3 bg-primary p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20">
                  <MessageSquareIcon className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground">
                    AI Assistant
                  </p>
                  <p className="text-xs text-primary-foreground/80">Online</p>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="inline-block rounded-lg rounded-tl-none bg-secondary px-4 py-2">
                  <p className="text-sm">
                    Hi! I&apos;d love to help you book an appointment. What service
                    are you interested in? 😊
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="inline-block rounded-lg rounded-tr-none bg-primary px-4 py-2 text-primary-foreground">
                    <p className="text-sm">
                      I need a dental cleaning next Tuesday
                    </p>
                  </div>
                </div>
                <div className="inline-block rounded-lg rounded-tl-none bg-secondary px-4 py-2">
                  <p className="text-sm">
                    Great choice! I have openings at 9:00 AM, 11:30 AM, and 2:00
                    PM on Tuesday. Which works best for you?
                  </p>
                </div>
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                    Type a message...
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <ArrowRightIcon className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="border-t bg-secondary/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to{' '}
              <span className="gradient-text">Automate Scheduling</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete AI scheduling toolkit that works on any website.
              Powerful features, simple setup.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section id="how-it-works" className="border-t py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Go live in <span className="gradient-text">3 simple steps</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From sign-up to live appointments in under 5 minutes.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
                )}
                <div className="relative mx-auto mb-6 flex size-24 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
                  <span className="text-2xl font-bold gradient-text">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing Section ===== */}
      <section id="pricing" className="border-t bg-secondary/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent{' '}
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Free forever with your own API key. Upgrade for managed AI and
              more power.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {planOrder.map((planId) => {
              const plan = PLANS[planId]
              const isPopular = planId === 'starter'
              return (
                <div
                  key={planId}
                  className={`relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg ${
                    isPopular
                      ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
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

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <Link
                    href="/signup"
                    className={`mb-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                      isPopular
                        ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
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

      {/* ===== Testimonials ===== */}
      <section className="border-t py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by{' '}
              <span className="gradient-text">businesses worldwide</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our users have to say about AppointAI.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className="size-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="border-t bg-primary/5 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to automate your scheduling?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of businesses using AppointAI. Set up in minutes,
            free forever with BYOK.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <SparklesIcon className="size-4" />
              </div>
              <span className="font-bold">AppointAI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="transition-colors hover:text-foreground">Features</a>
              <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
              <Link href="/login" className="transition-colors hover:text-foreground">Login</Link>
              <Link href="/signup" className="transition-colors hover:text-foreground">Sign Up</Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <GlobeIcon className="size-4" />
              <span>© {new Date().getFullYear()} AppointAI. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
