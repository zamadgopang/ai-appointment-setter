import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a confirmation link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email we sent you to confirm your account and
            get started with your AI appointment setter.
          </p>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                try signing up again
              </Link>
              .
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
