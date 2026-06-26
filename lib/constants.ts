export const PRODUCT_CATEGORIES = [
  'laptop',
  'accessories',
  'audio',
  'monitor',
  'storage',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const CATEGORY_META: Record<
  ProductCategory,
  { label: string; description: string; icon: string }
> = {
  laptop: {
    label: 'Laptops',
    description: 'Powerful notebooks for work & play',
    icon: '💻',
  },
  monitor: {
    label: 'Monitors',
    description: 'Stunning displays for every setup',
    icon: '🖥️',
  },
  audio: {
    label: 'Audio',
    description: 'Headphones, earbuds & speakers',
    icon: '🎧',
  },
  accessories: {
    label: 'Accessories',
    description: 'Keyboards, mice & desk essentials',
    icon: '⌨️',
  },
  storage: {
    label: 'Storage',
    description: 'SSDs, NAS & portable drives',
    icon: '💾',
  },
}

export const PRICE_MIN = 1
export const PRICE_MAX = 300000

export const POPULAR_SEARCHES = [
  'MacBook',
  'Sony headphones',
  'Samsung SSD',
  'Logitech',
  'Gaming monitor',
  'AirPods',
]
