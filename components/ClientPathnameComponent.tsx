'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Chat } from '@/lib/types'

const ClientPathnameComponent = ({ chats }: { chats: Chat[] }) => {
  const pathname = usePathname()
  console.log('pathname', pathname)
  const activeChat = chats.find(chat => chat.path === pathname)
  console.log('activeChat', activeChat)
  const activeChatName = activeChat?.title

  return (
    <>
      <span className="text-muted-foreground text-sm text-ellipsis max-w-60 overflow-hidden text-nowrap">
        {activeChatName}
      </span>
      <Button variant="ghost" asChild className="size-9 p-0 lg:flex">
        <Link href="/" rel="nofollow">
          <PlusCircle className="size-5 text-muted-foreground" />
        </Link>
      </Button>
    </>
  )
}

export default ClientPathnameComponent
