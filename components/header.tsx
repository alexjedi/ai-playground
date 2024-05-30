import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import { ThemeToggle } from './theme-toggle'
import { cache } from 'react'
import { getChats } from '@/app/actions'
import ClientPathnameComponent from './ClientPathnameComponent'

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

async function UserOrLogin() {
  const session = (await auth()) as Session
  const chats = await loadChats(session.user.id)
  return (
    <>
      <>
        <SidebarMobile>
          <ChatHistory userId={session.user.id} />
        </SidebarMobile>
        <SidebarToggle type="chats" />
      </>
      <div className="flex items-center ml-auto">
        <IconSeparator className="size-6 text-muted-foreground/50" />
      </div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <ClientPathnameComponent chats={chats} />
      </React.Suspense>
    </>
  )
}

export async function Header() {
  const session = (await auth()) as Session
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button
            variant="ghost"
            asChild
            className="-ml-2 hidden size-9 p-0 lg:flex"
          >
            <Link href="/login">Login</Link>
          </Button>
        )}
        <ThemeToggle />
        <SidebarToggle type="params" />
      </div>
    </header>
  )
}
