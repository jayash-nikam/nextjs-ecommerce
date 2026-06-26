'use client'

import { useEffect, useState } from 'react'
import { Loader2, MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react'
import { useAuthStore, authHeaders } from '@/store/useAuthStore'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { FormAlert } from '@/components/ui/FormAlert'
import type { Address, AddressInput } from '@/types/address'
import {
  validateLabel,
  validateName,
  validateAddressLine,
  validateCity,
  validateState,
  validatePincode,
  validatePhone,
  type FieldErrors,
} from '@/lib/validation'

const emptyForm: AddressInput = {
  label: 'Home',
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
  isDefault: false,
}

type AddressFields = Omit<AddressInput, 'isDefault'>

export function AddressesManager() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<AddressInput>(emptyForm)
  const [errors, setErrors] = useState<FieldErrors<AddressFields>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function loadAddresses() {
    return fetch('/api/addresses', { headers: authHeaders(token) })
      .then((res) => res.json())
      .then(setAddresses)
  }

  useEffect(() => {
    loadAddresses().finally(() => setLoading(false))
  }, [token])

  function openAdd() {
    setForm({ ...emptyForm, name: user?.name || '' })
    setEditingId(null)
    setShowForm(true)
    setError('')
    setErrors({})
  }

  function openEdit(addr: Address) {
    setForm({
      label: addr.label,
      name: addr.name,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
      isDefault: addr.isDefault,
    })
    setEditingId(addr.id)
    setShowForm(true)
    setError('')
    setErrors({})
  }

  function validate(): boolean {
    const next: FieldErrors<AddressFields> = {
      label: validateLabel(form.label) ?? undefined,
      name: validateName(form.name) ?? undefined,
      line1: validateAddressLine(form.line1) ?? undefined,
      city: validateCity(form.city) ?? undefined,
      state: validateState(form.state) ?? undefined,
      pincode: validatePincode(form.pincode) ?? undefined,
      phone: validatePhone(form.phone) ?? undefined,
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setSaving(true)
    try {
      const url = editingId ? `/api/addresses/${editingId}` : '/api/addresses'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: authHeaders(token),
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }

      await loadAddresses()
      setShowForm(false)
      setEditingId(null)
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this address?')) return
    await fetch(`/api/addresses/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
    await loadAddresses()
  }

  async function setDefault(id: number) {
    await fetch(`/api/addresses/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ isDefault: true }),
    })
    await loadAddresses()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={28} className="text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted text-sm">
          {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
        </p>
        {!showForm && (
          <button onClick={openAdd} className="btn-secondary text-sm py-2 px-4">
            <Plus size={16} />
            Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} noValidate className="card-surface p-5 sm:p-6 space-y-4">
          <h3 className="font-semibold">
            {editingId ? 'Edit Address' : 'New Address'}
          </h3>

          {error && <FormAlert>{error}</FormAlert>}

          <div className="grid sm:grid-cols-2 gap-4">
            {(
              [
                { key: 'label', label: 'Label', placeholder: 'Home, Office...' },
                { key: 'name', label: 'Full Name', placeholder: 'Recipient name' },
                { key: 'line1', label: 'Address Line 1', placeholder: 'Street address', full: true },
                { key: 'line2', label: 'Address Line 2', placeholder: 'Apt, suite (optional)', full: true, optional: true },
                { key: 'city', label: 'City', placeholder: 'City' },
                { key: 'state', label: 'State', placeholder: 'State' },
                { key: 'pincode', label: 'Pincode', placeholder: '560001' },
                { key: 'phone', label: 'Phone', placeholder: '9876543210' },
              ] as const
            ).map((field) => {
              const { key, label, placeholder } = field
              const full = 'full' in field && field.full
              const optional = 'optional' in field && field.optional
              return (
              <div key={key} className={full ? 'sm:col-span-2' : ''}>
                <FormField
                  label={label}
                  htmlFor={`addr-${key}`}
                  error={errors[key as keyof AddressFields]}
                  required={!optional}
                >
                  <input
                    id={`addr-${key}`}
                    value={form[key as keyof AddressInput] as string}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    className={inputClassName(!!errors[key as keyof AddressFields])}
                  />
                </FormField>
              </div>
              )
            })}
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm((f) => ({ ...f, isDefault: e.target.checked }))
              }
              className="rounded border-border"
            />
            Set as default address
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5">
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary px-6 py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="card-surface flex flex-col items-center py-16 text-center">
          <MapPin size={48} className="text-muted mb-4" />
          <h2 className="text-xl font-semibold mb-2">No addresses saved</h2>
          <p className="text-muted mb-6">Add a delivery address for faster checkout.</p>
          <button onClick={openAdd} className="btn-primary px-6 py-2.5">
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="card-surface p-5 relative">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-primary bg-accent-soft px-2 py-0.5 rounded-full">
                  <Star size={10} className="fill-primary" />
                  Default
                </span>
              )}
              <p className="font-semibold mb-1">{addr.label}</p>
              <p className="text-sm font-medium">{addr.name}</p>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                {addr.line1}
                {addr.line2 && `, ${addr.line2}`}
                <br />
                {addr.city}, {addr.state} {addr.pincode}
                <br />
                {addr.phone}
              </p>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => openEdit(addr)}
                  className="text-xs font-medium flex items-center gap-1 text-primary hover:underline"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr.id)}
                    className="text-xs font-medium text-muted hover:text-primary"
                  >
                    Set default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs font-medium flex items-center gap-1 text-red-500 hover:underline ml-auto"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
