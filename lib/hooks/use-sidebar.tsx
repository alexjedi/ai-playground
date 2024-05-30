'use client'

import * as React from 'react'

const LOCAL_STORAGE_KEY_CHATS = 'sidebar-chats'
const LOCAL_STORAGE_KEY_PARAMS = 'sidebar-params'

interface SidebarContext {
  isSidebarOpenChats: boolean
  toggleSidebarChats: () => void
  isSidebarOpenParams: boolean
  toggleSidebarParams: () => void
  isLoading: boolean
}

const SidebarContext = React.createContext<SidebarContext | undefined>(
  undefined
)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpenChats, setSidebarOpenChats] = React.useState(true)
  const [isSidebarOpenParams, setSidebarOpenParams] = React.useState(true)
  const [isLoading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const valueChats = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS)
    const valueParams = localStorage.getItem(LOCAL_STORAGE_KEY_PARAMS)
    if (valueChats) {
      setSidebarOpenChats(JSON.parse(valueChats))
    }
    if (valueParams) {
      setSidebarOpenParams(JSON.parse(valueParams))
    }
    setLoading(false)
  }, [])

  const toggleSidebarChats = () => {
    setSidebarOpenChats(value => {
      const newState = !value
      localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(newState))
      return newState
    })
  }

  const toggleSidebarParams = () => {
    setSidebarOpenParams(value => {
      const newState = !value
      localStorage.setItem(LOCAL_STORAGE_KEY_PARAMS, JSON.stringify(newState))
      return newState
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpenChats,
        isSidebarOpenParams,
        toggleSidebarChats,
        toggleSidebarParams,
        isLoading
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
