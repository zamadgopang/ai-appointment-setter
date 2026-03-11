import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          AI Appointment Setter
        </h1>
        <p className="text-muted-foreground max-w-md">
          Configure your AI agent to handle appointment scheduling with
          knowledge base, calendar integration, and customizable chat widget.
        </p>
        <Link
          href="/agent-setup"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
