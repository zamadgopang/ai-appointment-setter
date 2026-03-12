'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SparklesIcon, EyeIcon, EyeOffIcon, Loader2Icon, ArrowRightIcon, CheckIcon } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

const benefits = [
  'Free forever with your own API key',
  '2-minute setup, no credit card required',
  'Google Calendar sync included',
  'AI-powered appointment scheduling',
]

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Create the user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        // 2. Create tenant via API (this will also create subscription, widget config, etc.)
        await fetch('/api/tenant/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim() || 'My Business' }),
        }).catch(() => {})

        setSuccess(true)
        // If email confirmation is required, show message.
        // Otherwise, redirect to dashboard.
        if (data.session) {
          router.push('/agent-setup')
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignUp() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/google/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CheckIcon className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to <strong>{email}</strong>.
            Click the link to activate your account and start scheduling.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Go to Login
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Benefits Panel */}
      <div className="relative hidden w-1/2 items-center justify-center bg-primary/5 lg:flex">
        <div className="absolute inset-0 dot-pattern" />
        <div className="relative z-10 max-w-md space-y-8 p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <SparklesIcon className="size-5" />
            </div>
            <span className="text-2xl font-bold">
              Appoint<span className="gradient-text">AI</span>
            </span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Start booking appointments with AI
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands of businesses automating their scheduling.
            </p>
          </div>

          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CheckIcon className="size-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Widget Preview */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
            <div className="flex items-center gap-2 bg-primary px-4 py-3">
              <div className="size-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <SparklesIcon className="size-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-primary-foreground">AI Assistant</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="inline-block rounded-lg rounded-tl-none bg-secondary px-3 py-1.5 text-xs">
                Hi! I can help schedule your appointment 😊
              </div>
              <div className="flex justify-end">
                <div className="inline-block rounded-lg rounded-tr-none bg-primary px-3 py-1.5 text-xs text-primary-foreground">
                  I need a consultation Thursday
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Sign-Up Form */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <SparklesIcon className="size-5" />
              </div>
              <span className="text-2xl font-bold">
                Appoint<span className="gradient-text">AI</span>
              </span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm font-medium shadow-sm transition-all hover:bg-secondary hover:shadow-md disabled:opacity-60"
          >
            <svg className="size-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or sign up with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Business Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="E.g. Bright Smiles Dental"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-xl border bg-card px-4 py-3 pr-12 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
