import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth/admin'
import { adminUpdateProduct, adminDeleteProduct } from '@/lib/api/admin'
import { validateProductInput, parseProductForm } from '@/lib/validation/product'

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const admin = await getAdminFromRequest(
    request.headers.get('authorization'),
  )
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const errors = validateProductInput(body, true)
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 })
    }

    const { tags, specs, images } = parseProductForm(body)

    const product = await adminUpdateProduct(Number(id), {
      title: body.title?.trim(),
      brand: body.brand?.trim(),
      price: body.price !== undefined ? Number(body.price) : undefined,
      category: body.category,
      rating: body.rating !== undefined ? Number(body.rating) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      description: body.description?.trim(),
      tags: body.tags !== undefined ? tags : undefined,
      specs: body.specs !== undefined ? specs : undefined,
      images: body.images !== undefined ? images : undefined,
    })

    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const admin = await getAdminFromRequest(
    request.headers.get('authorization'),
  )
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await adminDeleteProduct(Number(id))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
