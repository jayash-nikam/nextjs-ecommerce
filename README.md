# NovaCart — AI Product Platform

A full-stack demo e-commerce app for premium tech and electronics. Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **SCSS**, **Zustand**, and **json-server** as a lightweight JSON API.

**Live storefront:** product catalog, filters, PDP with gallery, cart, and customer accounts.  
**Admin CMS:** dashboard analytics, product CRUD, order management, and customer insights.

---

## Features

### Storefront
- Product listing with search, category/brand/price/rating filters, and pagination
- Rich product detail pages (image gallery with hover zoom, specs, similar products)
- Shopping cart with toast notifications (Zustand + localStorage)
- Customer accounts: login, register, addresses, order history
- **Email OTP verification** for registration and forgot-password flows
- Static pages: About, Contact, Privacy, Terms
- SEO: metadata, Open Graph, `robots.txt`, `sitemap.xml`, JSON-LD on PDP
- Accessibility: skip links, ARIA on search/forms/nav, focus styles

### Admin panel (`/admin`)
- Analytics dashboard: revenue, orders by status, top sellers, low-stock alerts, category breakdown
- Product management: CRUD, filters, sort, quick stock adjust, view on store
- Order management: search, status filters, expandable line items and shipping details
- Customer management: order/spend stats, address & order history drawer, role editing
- Dark admin shell with responsive sidebar

### Styling
- Modular SCSS under `styles/` (variables, layout, components, utilities)
- Pure black header/footer chrome, glass cards, form validation UI

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, SCSS |
| State | Zustand (cart, auth, admin, toast) |
| API | Next.js Route Handlers → json-server (`db.json`) |
| Auth | SHA-256 passwords, HMAC session tokens, role-based admin |
| Icons | Lucide React |

---

## Prerequisites

- **Node.js** 20+
- **npm** (or pnpm/yarn)

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional — production email OTP (Resend)
# RESEND_API_KEY=re_...
# EMAIL_FROM=noreply@novacart.com

# Optional — auth secrets (defaults work for local dev)
# AUTH_SECRET=your-secret
# AUTH_SALT=your-salt
```

`NEXT_PUBLIC_API_URL` is **required** — the app proxies data through json-server.

### 3. Start the JSON API (terminal 1)

```bash
npm run backend
```

Runs json-server on [http://localhost:3001](http://localhost:3001) watching `db.json`.

### 4. Start Next.js (terminal 2)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

---

## Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | `demo@novacart.com` | `password123` |
| Admin | `admin@novacart.com` | `admin123` |

**OTP in development:** verification codes are logged to the server console and shown in a dev hint on the verify screen. No email provider is required locally.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run backend` | Start json-server API (port 3001) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |

---

## Project structure

```
app/                    # Next.js App Router pages & API routes
  account/              # Login, register, OTP, addresses, orders
  admin/                # Admin dashboard, products, orders, users
  api/                  # Auth, products, orders, admin, search, filters
  products/             # PLP & PDP
components/             # React components (layout, product, account, admin, ui)
lib/                    # API clients, auth, validation, SEO, OTP, email
store/                  # Zustand stores (cart, auth, admin, toast)
styles/                 # SCSS modules (globals, components, layout)
types/                  # TypeScript types
db.json                 # json-server database (products, users, orders, …)
```

---

## API overview

| Endpoint | Purpose |
|----------|---------|
| `GET /api/products` | Product list with filters |
| `GET /api/filters` | Filter metadata for PLP sidebar |
| `GET /api/search/suggestions` | Header search autocomplete |
| `POST /api/auth/login` | Customer login |
| `POST /api/auth/register/send-otp` | Send registration OTP |
| `POST /api/auth/register/verify` | Verify OTP & create account |
| `POST /api/auth/forgot-password` | Send password-reset OTP |
| `POST /api/auth/reset-password` | Reset password with OTP |
| `GET /api/admin/stats` | Admin dashboard analytics |
| `*` `/api/admin/*` | Products, orders, users, addresses (admin only) |

---

## Data model (`db.json`)

- **products** — 100 items across 5 categories (laptop, monitor, audio, accessories, storage)
- **users** — customers and admins (`role`: `user` \| `admin`)
- **orders** — order items, totals, status, shipping address snapshots
- **addresses** — saved customer addresses
- **otps** — hashed email verification codes (register / reset)

---

## License

Private — demo / learning project.
