'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  Send,
  Sparkles,
  Star,
  Plus,
  ArrowRight,
  RefreshCcw,
} from 'lucide-react'
import { useChatStore } from '@/store/useChatStore'
import { useCartStore } from '@/store/useCartStore'
import { showToast } from '@/store/useToastStore'
import { BRAND_NAME } from '@/lib/brand'
import type { ChatMessage, ChatProduct } from '@/types/chat'

function inr(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}

function TypingDots() {
  return (
    <div className="chat-msg chat-msg--assistant">
      <div className="chat-avatar" aria-hidden="true">
        <Sparkles size={15} />
      </div>
      <div className="chat-bubble chat-bubble--assistant chat-typing" aria-label="Nova is typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function ChatProductCard({
  product,
  onNavigate,
}: {
  product: ChatProduct
  onNavigate: () => void
}) {
  const addToCart = useCartStore((s) => s.addToCart)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
      1,
    )
    showToast(`${product.title} added to cart`)
  }

  return (
    <Link
      href={`/products/${product.id}`}
      onClick={onNavigate}
      className="chat-product"
    >
      <div className="chat-product__img">
        {product.image && (
          <Image
            src={product.image}
            alt=""
            aria-hidden="true"
            fill
            sizes="56px"
            className="object-cover"
          />
        )}
      </div>
      <div className="chat-product__body">
        <p className="chat-product__brand">{product.brand}</p>
        <p className="chat-product__title">{product.title}</p>
        <div className="chat-product__meta">
          <span className="chat-product__price">{inr(product.price)}</span>
          <span className="chat-product__rating">
            <Star size={12} className="fill-current" />
            {product.rating}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={product.stock === 0}
        className="chat-product__add"
        aria-label={`Add ${product.title} to cart`}
      >
        <Plus size={16} />
      </button>
    </Link>
  )
}

function MessageBubble({
  message,
  onSuggestion,
  onNavigate,
}: {
  message: ChatMessage
  onSuggestion: (text: string) => void
  onNavigate: () => void
}) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="chat-msg chat-msg--user">
        <div className="chat-bubble chat-bubble--user">{message.text}</div>
      </div>
    )
  }

  return (
    <div className="chat-msg chat-msg--assistant">
      <div className="chat-avatar" aria-hidden="true">
        <Sparkles size={15} />
      </div>
      <div className="chat-msg__content">
        <div className="chat-bubble chat-bubble--assistant">{message.text}</div>

        {message.products && message.products.length > 0 && (
          <div className="chat-products">
            {message.products.map((p) => (
              <ChatProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
            {message.query && (
              <Link
                href={`/products?q=${encodeURIComponent(message.query)}`}
                onClick={onNavigate}
                className="chat-seeall"
              >
                See all results in store
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && (
          <div className="chat-suggestions">
            {message.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="chat-chip"
                onClick={() => onSuggestion(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function ChatPanel() {
  const messages = useChatStore((s) => s.messages)
  const isTyping = useChatStore((s) => s.isTyping)
  const close = useChatStore((s) => s.close)
  const clear = useChatStore((s) => s.clear)
  const sendMessage = useChatStore((s) => s.sendMessage)

  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  function handleSend(text: string) {
    const value = text.trim()
    if (!value) return
    void sendMessage(value)
    setDraft('')
    inputRef.current?.focus()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSend(draft)
  }

  return (
    <section
      className="chat-panel"
      role="dialog"
      aria-modal="false"
      aria-label={`${BRAND_NAME} shopping assistant`}
    >
      <header className="chat-header">
        <div className="chat-header__id">
          <span className="chat-header__avatar" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <div className="chat-header__text">
            <p className="chat-header__name">Nova Assistant</p>
            <p className="chat-header__status">
              <span className="chat-header__dot" aria-hidden="true" />
              Online · AI shopping help
            </p>
          </div>
        </div>
        <div className="chat-header__actions">
          <button
            type="button"
            onClick={clear}
            className="chat-header__btn"
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <RefreshCcw size={16} />
          </button>
          <button
            type="button"
            onClick={close}
            className="chat-header__btn"
            aria-label="Close chat"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      <div className="chat-body" ref={scrollRef} aria-live="polite">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            onSuggestion={handleSend}
            onNavigate={close}
          />
        ))}
        {isTyping && <TypingDots />}
      </div>

      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask Nova anything…"
          className="chat-input"
          aria-label="Message the shopping assistant"
          maxLength={500}
          autoComplete="off"
        />
        <button
          type="submit"
          className="chat-send"
          disabled={!draft.trim()}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </section>
  )
}
