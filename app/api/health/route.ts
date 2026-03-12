import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type HealthStatus = {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  checks: {
    database: {
      status: 'healthy' | 'unhealthy'
      latency?: number
      error?: string
    }
    environment: {
      status: 'healthy' | 'unhealthy'
      missing?: string[]
    }
  }
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const startTime = Date.now()
  
  const checks: HealthStatus['checks'] = {
    database: { status: 'unhealthy' },
    environment: { status: 'healthy' },
  }

  // Check required environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  )
  
  if (missingEnvVars.length > 0) {
    checks.environment = {
      status: 'unhealthy',
      missing: missingEnvVars,
    }
  }

  // Check database connection
  try {
    const supabase = await createClient()
    const dbStartTime = Date.now()
    
    // Simple query to check database connectivity
    const { error } = await supabase
      .from('tenants')
      .select('id')
      .limit(1)
    
    const dbLatency = Date.now() - dbStartTime
    
    if (error) {
      // If the table doesn't exist, it's a configuration issue but DB is reachable
      if (error.code === '42P01') {
        checks.database = {
          status: 'healthy',
          latency: dbLatency,
        }
      } else {
        checks.database = {
          status: 'unhealthy',
          latency: dbLatency,
          error: error.message,
        }
      }
    } else {
      checks.database = {
        status: 'healthy',
        latency: dbLatency,
      }
    }
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown database error',
    }
  }

  // Determine overall status
  // Environment issues are critical (unhealthy), database issues are degraded
  let overallStatus: HealthStatus['status'] = 'healthy'
  
  if (checks.environment.status === 'unhealthy') {
    // Missing environment variables is critical
    overallStatus = 'unhealthy'
  } else if (checks.database.status === 'unhealthy') {
    // Database issues are degraded (app can still partially function)
    overallStatus = 'degraded'
  }

  const healthResponse: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks,
  }

  const statusCode = overallStatus === 'unhealthy' ? 503 : 200

  return NextResponse.json(healthResponse, { status: statusCode })
}
