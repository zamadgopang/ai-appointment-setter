'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BotIcon,
  SettingsIcon,
  MessageSquareIcon,
  BarChart3Icon,
  FileTextIcon,
  SparklesIcon,
  LogOutIcon,
  CreditCardIcon,
  ChevronRightIcon,
} from 'lucide-react'

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

const mainNavItems = [
  {
    title: 'Agent Setup',
    href: '/agent-setup',
    icon: BotIcon,
    description: 'Configure your AI agent',
  },
  {
    title: 'Conversations',
    href: '/conversations',
    icon: MessageSquareIcon,
    description: 'View chat history',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3Icon,
    description: 'Performance metrics',
  },
  {
    title: 'Knowledge Base',
    href: '/knowledge',
    icon: FileTextIcon,
    description: 'Manage documents',
  },
]

const settingsNavItems = [
  {
    title: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
  {
    title: 'Billing',
    href: '/settings?tab=billing',
    icon: CreditCardIcon,
  },
]

// Page title map for breadcrumbs
const pageTitles: Record<string, string> = {
  '/agent-setup': 'Agent Setup',
  '/conversations': 'Conversations',
  '/analytics': 'Analytics',
  '/knowledge': 'Knowledge Base',
  '/settings': 'Settings',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const pageTitle = pageTitles[pathname] || 'Dashboard'

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    router.push('/')
  }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        {/* Header with brand */}
        <SidebarHeader className="p-4">
          <Link href="/agent-setup" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <SparklesIcon className="size-4" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <span className="text-lg font-bold tracking-tight">
                Appoint<span className="text-primary">AI</span>
              </span>
            </div>
          </Link>
        </SidebarHeader>

        {/* Main Navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href.split('?')[0]}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer with sign-out */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign Out"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOutIcon className="size-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Top header bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 backdrop-blur-xl px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Dashboard</span>
            <ChevronRightIcon className="size-3.5 text-muted-foreground" />
            <span className="font-medium">{pageTitle}</span>
          </nav>

          <div className="flex-1" />

          {/* Right side actions could go here */}
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
