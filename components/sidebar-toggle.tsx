'use client'

import * as React from 'react'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { Button } from '@/components/ui/button'
import { IconSidebar } from '@/components/ui/icons'
import { MessagesSquare } from 'lucide-react'
import { Settings2 } from 'lucide-react'

export function SidebarToggle({ type }: { type: 'chats' | 'params' }) {
  const { toggleSidebarChats, toggleSidebarParams } = useSidebar()

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden size-9 p-0 lg:flex"
      onClick={() => {
        type === 'chats' ? toggleSidebarChats() : toggleSidebarParams()
      }}
    >
      {type === 'chats' ? (
        <MessagesSquare className="size-5 text-muted-foreground" />
      ) : (
        <Settings2 className="size-5 text-muted-foreground" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
