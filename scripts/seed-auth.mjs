import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SALT = 'ai-store-dev-salt'

function hashPassword(password) {
  return createHash('sha256').update(`${SALT}:${password}`).digest('hex')
}

const dbPath = join(__dirname, '..', 'db.json')
const db = JSON.parse(readFileSync(dbPath, 'utf-8'))

db.users = [
  {
    id: 1,
    name: 'Demo User',
    email: 'demo@novacart.com',
    password: hashPassword('password123'),
    role: 'user',
    createdAt: '2025-06-01T10:00:00.000Z',
  },
  {
    id: 3,
    name: 'Store Admin',
    email: 'admin@novacart.com',
    password: hashPassword('admin123'),
    role: 'admin',
    createdAt: '2025-06-01T10:00:00.000Z',
  },
]

db.addresses = [
  {
    id: 1,
    userId: 1,
    label: 'Home',
    name: 'Demo User',
    line1: '42 Tech Park, Koramangala',
    line2: 'Block B, Apt 301',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    phone: '+91 9876543210',
    isDefault: true,
  },
  {
    id: 2,
    userId: 1,
    label: 'Office',
    name: 'Demo User',
    line1: '91 Springboard, Residency Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560025',
    phone: '+91 9876543210',
    isDefault: false,
  },
]

db.orders = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        productId: 1,
        title: 'MacBook Pro 14" M4 Pro',
        price: 219900,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200',
      },
    ],
    total: 219900,
    status: 'delivered',
    createdAt: '2025-05-10T14:30:00.000Z',
    shippingAddress: {
      name: 'Demo User',
      line1: '42 Tech Park, Koramangala',
      line2: 'Block B, Apt 301',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      phone: '+91 9876543210',
    },
  },
  {
    id: 2,
    userId: 1,
    items: [
      {
        productId: 41,
        title: 'Sony WH-1000XM5',
        price: 29990,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200',
      },
      {
        productId: 61,
        title: 'Logitech MX Master 3S',
        price: 9995,
        quantity: 2,
        image:
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200',
      },
    ],
    total: 49980,
    status: 'shipped',
    createdAt: '2025-06-15T09:00:00.000Z',
    shippingAddress: {
      name: 'Demo User',
      line1: '91 Springboard, Residency Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560025',
      phone: '+91 9876543210',
    },
  },
]

writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n')
console.log('Seeded users, addresses, and orders in db.json')
console.log('Demo login: demo@novacart.com / password123')
console.log('Admin login: admin@novacart.com / admin123')
