import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth/admin'
import {
  adminGetProducts,
  adminCreateProduct,
} from '@/lib/api/admin'
import { validateProductInput, parseProductForm } from '@/lib/validation/product'

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const products = await adminGetProducts()
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const errors = validateProductInput(body)
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 })
    }

    const { tags, specs, images } = parseProductForm(body)

    const product = await adminCreateProduct({
      title: body.title.trim(),
      brand: body.brand.trim(),
      price: Number(body.price),
      category: body.category,
      rating: Number(body.rating),
      stock: Number(body.stock),
      description: body.description.trim(),
      tags,
      specs,
      images,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create product'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
