import { PRODUCT_CATEGORIES } from '@/lib/constants'
import type { FieldErrors } from '@/lib/validation'

export interface ProductFormData {
  title: string
  brand: string
  price: string
  category: string
  rating: string
  stock: string
  description: string
  tags: string
  specs: string
  images: string
}

export function validateProductInput(
  body: Record<string, unknown>,
  partial = false,
): FieldErrors<ProductFormData> {
  const errors: FieldErrors<ProductFormData> = {}

  if (!partial || body.title !== undefined) {
    const title = String(body.title ?? '').trim()
    if (!title) errors.title = 'Title is required'
    else if (title.length < 3) errors.title = 'Title must be at least 3 characters'
  }

  if (!partial || body.brand !== undefined) {
    const brand = String(body.brand ?? '').trim()
    if (!brand) errors.brand = 'Brand is required'
  }

  if (!partial || body.price !== undefined) {
    const price = Number(body.price)
    if (Number.isNaN(price) || price <= 0) errors.price = 'Enter a valid price'
  }

  if (!partial || body.category !== undefined) {
    const category = String(body.category ?? '')
    if (!PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])) {
      errors.category = 'Select a valid category'
    }
  }

  if (!partial || body.rating !== undefined) {
    const rating = Number(body.rating)
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      errors.rating = 'Rating must be between 0 and 5'
    }
  }

  if (!partial || body.stock !== undefined) {
    const stock = Number(body.stock)
    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      errors.stock = 'Stock must be a whole number ≥ 0'
    }
  }

  if (!partial || body.description !== undefined) {
    const description = String(body.description ?? '').trim()
    if (!description) errors.description = 'Description is required'
    else if (description.length < 20) {
      errors.description = 'Description must be at least 20 characters'
    }
  }

  return errors
}

export function parseProductForm(body: Record<string, unknown>) {
  const tags = String(body.tags ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const specs: Record<string, string> = {}
  String(body.specs ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(':')
      if (key && rest.length) specs[key.trim()] = rest.join(':').trim()
    })

  const images = String(body.images ?? '')
    .split('\n')
    .map((u) => u.trim())
    .filter(Boolean)

  return { tags, specs, images }
}
