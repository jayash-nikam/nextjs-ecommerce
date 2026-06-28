'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useChatStore } from '@/store/useChatStore'
import { ChatPanel } from '@/components/chat/ChatPanel'

const emptySubscribe = () => () => {}

export function ChatWidget() {
  // True only after client hydration — avoids SSR/client mismatch from the
  // persisted (localStorage) chat state without a setState-in-effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const isOpen = useChatStore((s) => s.isOpen)
  const unread = useChatStore((s) => s.unread)
  const toggle = useChatStore((s) => s.toggle)
  const init = useChatStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  if (!mounted) return null

  return (
    <div className="chat-widget">
      {isOpen && <ChatPanel />}

      <button
        type="button"
        onClick={toggle}
        className={`chat-launcher${isOpen ? ' chat-launcher--open' : ''}`}
        aria-label={isOpen ? 'Close shopping assistant' : 'Open shopping assistant'}
        aria-expanded={isOpen}
      >
        <span className="chat-launcher__icon">
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </span>
        {!isOpen && unread > 0 && (
          <span className="chat-launcher__badge" aria-hidden="true">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
        {!isOpen && <span className="chat-launcher__pulse" aria-hidden="true" />}
      </button>
    </div>
  )
}
