'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { ArrowUp, Mic, Paperclip, Trash2 } from 'lucide-react'

export function PromptForm({
  input,
  setInput
}: {
  input: string
  setInput: (value: string) => void
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
  }

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value && !uploadedFile) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        // Create form data
        const formData = new FormData()
        formData.append('message', value)
        if (uploadedFile) {
          formData.append('file', uploadedFile)
        }

        // Submit and get response message
        const responseMessage = await submitUserMessage(formData)
        setMessages(currentMessages => [...currentMessages, responseMessage])
        setUploadedFile(null)
      }}
    >
      {uploadedFile && (
        <div className="relative mb-2 px-8">
          <img
            src={URL.createObjectURL(uploadedFile)}
            alt="Uploaded file"
            className="w-8 h-auto rounded-md"
          />
          <button
            type="button"
            className="absolute -top-4 left-14 text-foreground rounded-full p-1"
            onClick={handleRemoveFile}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 border rounded-full sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-[13px] left-[12px] rounded-full bg-background p-0 size-9 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Paperclip size={20} className="text-muted-foreground" />
                <span className="sr-only">Upload a file</span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent>Upload a file</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-2 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              {input === '' ? (
                <Button type="submit" size="icon" className="rounded-full">
                  <Mic size={20} className="right-1 top-1" />
                  <span className="sr-only">Send message</span>
                </Button>
              ) : (
                <Button type="submit" size="icon" className="rounded-full">
                  <ArrowUp size={20} className="right-1 top-1" />
                  <span className="sr-only">Send message</span>
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
