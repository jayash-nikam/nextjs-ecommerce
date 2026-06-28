import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { BRAND_NAME } from '@/lib/brand'
import type { ChatContext, ChatMessage, ChatReply } from '@/types/chat'

const MAX_PERSISTED = 40
const MIN_TYPING_MS = 420

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function welcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    createdAt: Date.now(),
    text: `Hi! I'm Nova, your ${BRAND_NAME} shopping assistant 🛍️\n\nI can help you find the perfect laptop, headphones, monitor and more — or answer questions about orders, shipping and returns. What are you looking for today?`,
    suggestions: [
      'Recommend a laptop',
      'Best headphones under ₹20,000',
      'Track my order',
      'Shipping & returns',
    ],
  }
}

interface ChatStore {
  messages: ChatMessage[]
  isOpen: boolean
  isTyping: boolean
  unread: number
  hasInteracted: boolean
  /** Conversation memory (last search filters) for multi-turn follow-ups. */
  context?: ChatContext
  init: () => void
  open: () => void
  close: () => void
  toggle: () => void
  clear: () => void
  sendMessage: (text: string) => Promise<void>
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isOpen: false,
      isTyping: false,
      unread: 0,
      hasInteracted: false,
      context: undefined,

      init: () => {
        if (get().messages.length === 0) {
          set({ messages: [welcomeMessage()] })
        }
      },

      open: () => set({ isOpen: true, unread: 0 }),
      close: () => set({ isOpen: false }),
      toggle: () =>
        set((state) => ({
          isOpen: !state.isOpen,
          unread: state.isOpen ? state.unread : 0,
        })),

      clear: () =>
        set({
          messages: [welcomeMessage()],
          isTyping: false,
          unread: 0,
          context: undefined,
        }),

      sendMessage: async (raw: string) => {
        const content = raw.trim()
        if (!content || get().isTyping) return

        const userMsg: ChatMessage = {
          id: uid(),
          role: 'user',
          text: content,
          createdAt: Date.now(),
        }

        set((state) => ({
          messages: [...state.messages, userMsg],
          isTyping: true,
          hasInteracted: true,
        }))

        const startedAt = Date.now()

        let reply: ChatReply
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: content, context: get().context }),
          })
          reply = await res.json()
        } catch {
          reply = {
            text: "I couldn't reach the assistant just now. Please check your connection and try again.",
            suggestions: ['Recommend a laptop', 'Shipping & returns'],
          }
        }

        // Keep the typing indicator visible long enough to feel natural.
        const elapsed = Date.now() - startedAt
        if (elapsed < MIN_TYPING_MS) {
          await new Promise((r) => setTimeout(r, MIN_TYPING_MS - elapsed))
        }

        const assistantMsg: ChatMessage = {
          id: uid(),
          role: 'assistant',
          text: reply.text,
          products: reply.products,
          suggestions: reply.suggestions,
          query: reply.query,
          createdAt: Date.now(),
        }

        set((state) => ({
          messages: [...state.messages, assistantMsg],
          isTyping: false,
          unread: state.isOpen ? 0 : state.unread + 1,
          context: reply.context ?? state.context,
        }))
      },
    }),
    {
      name: 'ai-store-chat',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages.slice(-MAX_PERSISTED),
        hasInteracted: state.hasInteracted,
      }),
    },
  ),
)
