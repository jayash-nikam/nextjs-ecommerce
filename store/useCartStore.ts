import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addToCart: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          const qty = Math.max(1, quantity)

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity: qty }],
          }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) }
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i,
            ),
          }
        }),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'ai-store-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
