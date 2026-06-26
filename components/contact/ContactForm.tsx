'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { showToast } from '@/store/useToastStore'
import {
  validateEmail,
  validateName,
  validateSubject,
  validateContactMessage,
  type FieldErrors,
} from '@/lib/validation'

interface ContactFields {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFields>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FieldErrors<ContactFields>>({})
  const [loading, setLoading] = useState(false)

  function setField(key: keyof ContactFields, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): boolean {
    const next: FieldErrors<ContactFields> = {
      name: validateName(form.name) ?? undefined,
      email: validateEmail(form.email) ?? undefined,
      subject: validateSubject(form.subject) ?? undefined,
      message: validateContactMessage(form.message) ?? undefined,
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    showToast('Message sent! We\'ll get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-surface p-6 space-y-4 not-prose">
      <h3 className="font-semibold text-lg">Send us a message</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Your Name" htmlFor="contact-name" error={errors.name} required>
          <input
            id="contact-name"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            className={inputClassName(!!errors.name)}
            placeholder="John Doe"
            autoComplete="name"
          />
        </FormField>

        <FormField label="Email" htmlFor="contact-email" error={errors.email} required>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            className={inputClassName(!!errors.email)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>
      </div>

      <FormField label="Subject" htmlFor="contact-subject" error={errors.subject} required>
        <input
          id="contact-subject"
          value={form.subject}
          onChange={(e) => setField('subject', e.target.value)}
          className={inputClassName(!!errors.subject)}
          placeholder="Order inquiry, product question..."
        />
      </FormField>

      <FormField label="Message" htmlFor="contact-message" error={errors.message} required>
        <textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={(e) => setField('message', e.target.value)}
          className={`${inputClassName(!!errors.message)} resize-y`}
          placeholder="How can we help?"
        />
      </FormField>

      <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Send size={16} />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
