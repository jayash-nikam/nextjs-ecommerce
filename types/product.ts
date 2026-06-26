export interface Product {
  id: number
  title: string
  brand: string
  price: number
  category: string
  rating: number
  stock: number
  description: string
  tags: string[]
  specs: Record<string, string>
  images: string[]
}