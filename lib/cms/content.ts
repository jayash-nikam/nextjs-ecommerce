import {
  BRAND_NAME,
  BRAND_TAGLINE,
  PRIVACY_EMAIL,
  SUPPORT_EMAIL,
} from '@/lib/brand'
import type { CmsPageMeta, CmsSection, FaqItem } from '@/lib/cms/types'

export const CMS_LAST_UPDATED = 'June 26, 2026'

/** All CMS pages — single source of truth for routes, metadata, and footer nav. */
export const CMS_PAGES: CmsPageMeta[] = [
  {
    slug: 'about',
    href: '/about',
    title: 'About',
    description: `Learn about ${BRAND_NAME} and our mission.`,
    navLabel: 'About',
    footerGroup: 'company',
  },
  {
    slug: 'contact',
    href: '/contact',
    title: 'Contact',
    description: `Get in touch with ${BRAND_NAME} support.`,
    navLabel: 'Contact',
    footerGroup: 'company',
  },
  {
    slug: 'faq',
    href: '/faq',
    title: 'FAQ',
    description: `Frequently asked questions about shopping at ${BRAND_NAME}.`,
    navLabel: 'FAQ',
    footerGroup: 'support',
  },
  {
    slug: 'shipping',
    href: '/shipping',
    title: 'Shipping & Returns',
    description: `Delivery, returns, and warranty information for ${BRAND_NAME}.`,
    navLabel: 'Shipping & Returns',
    footerGroup: 'support',
  },
  {
    slug: 'privacy',
    href: '/privacy',
    title: 'Privacy Policy',
    description: `How ${BRAND_NAME} collects, uses, and protects your data.`,
    navLabel: 'Privacy',
    footerGroup: 'legal',
  },
  {
    slug: 'terms',
    href: '/terms',
    title: 'Terms of Service',
    description: `Terms and conditions for using ${BRAND_NAME}.`,
    navLabel: 'Terms',
    footerGroup: 'legal',
  },
  {
    slug: 'cookies',
    href: '/cookies',
    title: 'Cookie Policy',
    description: `How ${BRAND_NAME} uses cookies and similar technologies.`,
    navLabel: 'Cookies',
    footerGroup: 'legal',
  },
]

export function cmsPagesByGroup(group: CmsPageMeta['footerGroup']) {
  return CMS_PAGES.filter((p) => p.footerGroup === group)
}

export const aboutIntro = [
  `${BRAND_NAME} is a modern online tech store built to help you discover premium technology — from laptops and monitors to audio gear, storage, and desk accessories.`,
  `We combine a curated catalog of 100+ products with smart search, filters, and an AI shopping assistant so you can find exactly what you need, faster.`,
  `Our mission is to make tech shopping simple, transparent, and enjoyable for everyone.`,
]

export const aboutSections: CmsSection[] = [
  {
    id: 'values',
    title: 'What we stand for',
    paragraphs: [
      'Every product in our catalog is selected for quality, warranty coverage, and real-world value — not just spec-sheet hype.',
    ],
    bullets: [
      'Curated catalog across laptops, monitors, audio, accessories, and storage',
      'Transparent pricing in INR with no hidden fees at checkout',
      'Official manufacturer warranty on every item',
      'Responsive support and hassle-free returns',
    ],
  },
  {
    id: 'platform',
    title: 'Built for modern shopping',
    paragraphs: [
      `${BRAND_NAME} is a full-stack demo e-commerce platform showcasing best practices in search, accessibility, account management, and admin tooling — all wrapped in a fast, mobile-friendly experience.`,
    ],
  },
]

export const faqItems: FaqItem[] = [
  {
    id: 'place-order',
    question: 'How do I place an order?',
    answer:
      'Browse products, add items to your cart, and proceed to checkout. You need a free account to complete a purchase — registration takes under a minute with email OTP verification.',
  },
  {
    id: 'track-order',
    question: 'How can I track my order?',
    answer:
      'Sign in to your account and open Orders to see live status — placed, shipped, or delivered — along with tracking details and line items for each purchase.',
  },
  {
    id: 'shipping-time',
    question: 'How long does delivery take?',
    answer:
      'Standard delivery is 3–5 business days across India. Orders placed before 2 PM IST are dispatched the same day. You will receive a tracking link by email once your package ships.',
  },
  {
    id: 'free-shipping',
    question: 'Do you offer free shipping?',
    answer:
      'Yes — standard shipping is free on all orders. Express delivery may be available at checkout for select pin codes.',
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day hassle-free return policy. Unused items in original packaging can be returned from your Orders page. We arrange a free pickup and process refunds within 5–7 business days.',
  },
  {
    id: 'warranty',
    question: 'Are products covered by warranty?',
    answer:
      'Every product ships with the full manufacturer warranty (typically 1–2 years depending on the brand). If an item arrives damaged or defective, contact support and we will replace it promptly.',
  },
  {
    id: 'payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept major credit and debit cards, UPI, net banking, popular wallets, and cash on delivery. No-cost EMI is available on eligible orders above ₹5,000.',
  },
  {
    id: 'account',
    question: 'Do I need an account to shop?',
    answer:
      'You can browse and add to cart without signing in. An account is required at checkout so we can save your order history, addresses, and make returns easier.',
  },
  {
    id: 'price-change',
    question: 'Can prices change after I add to cart?',
    answer:
      'Prices are confirmed at checkout. If a product price changes while it is in your cart, you will see the updated price before you pay.',
  },
  {
    id: 'support',
    question: 'How do I contact customer support?',
    answer: `Email us at ${SUPPORT_EMAIL}, use the Contact page form, or ask Nova — our AI shopping assistant — for quick answers on orders, shipping, and returns.`,
  },
]

export const shippingSections: CmsSection[] = [
  {
    id: 'delivery',
    title: 'Delivery',
    paragraphs: [
      'We ship across India from our fulfilment partners. Once your order is confirmed, you will receive an email with order details and tracking information as soon as the package is dispatched.',
    ],
    bullets: [
      'Standard delivery: 3–5 business days (free on all orders)',
      'Same-day dispatch for orders placed before 2 PM IST',
      'Tracking link sent by email when your order ships',
      'Delivery updates available in your account Orders page',
    ],
  },
  {
    id: 'returns',
    title: 'Returns & refunds',
    paragraphs: [
      'Not satisfied? You are covered by our 30-day return policy. Start a return from your Orders page — we will arrange a free pickup and process your refund once the item is received and inspected.',
    ],
    bullets: [
      '30-day window from delivery date',
      'Item must be unused and in original packaging with all accessories',
      'Refunds to original payment method within 5–7 business days',
      'Exchanges available for defective or wrong items at no extra cost',
    ],
  },
  {
    id: 'warranty',
    title: 'Warranty & defects',
    paragraphs: [
      'All products include manufacturer warranty as stated on the product page. For warranty claims after the return window, we will help you reach the brand authorized service center.',
      `If something arrives damaged, contact ${SUPPORT_EMAIL} within 48 hours with photos — we will replace or refund immediately.`,
    ],
  },
]

export const privacySections: CmsSection[] = [
  {
    id: 'collect',
    title: 'Information we collect',
    paragraphs: [
      'We collect only what is needed to run the store and improve your experience.',
    ],
    bullets: [
      'Account details: name, email, and hashed password when you register',
      'Order and address information when you purchase or save addresses',
      'Cart contents stored locally in your browser until checkout',
      'Anonymous usage data (pages visited, search queries) to improve the platform',
    ],
  },
  {
    id: 'use',
    title: 'How we use your information',
    paragraphs: [
      'Your data is used to fulfil orders, provide customer support, send transactional emails (order confirmations, OTP codes), and improve our catalog and search. We do not sell your personal information to third parties.',
    ],
  },
  {
    id: 'storage',
    title: 'Storage & security',
    paragraphs: [
      'Passwords are stored using industry-standard hashing. Session tokens are signed and time-limited. Payment data is processed by certified payment partners and is never stored on our servers.',
    ],
  },
  {
    id: 'rights',
    title: 'Your rights',
    paragraphs: [
      'You may request access to, correction of, or deletion of your account data by contacting us. You can update saved addresses and profile details anytime from your account dashboard.',
      `Privacy questions: ${PRIVACY_EMAIL}`,
    ],
  },
]

export const termsSections: CmsSection[] = [
  {
    id: 'use',
    title: 'Use of the site',
    paragraphs: [
      `By accessing ${BRAND_NAME}, you agree to these terms. You must be 18 or older to make purchases. You are responsible for keeping your account credentials secure.`,
    ],
  },
  {
    id: 'orders',
    title: 'Orders & pricing',
    paragraphs: [
      'Product availability and prices are subject to change without notice until an order is confirmed. We reserve the right to cancel orders affected by pricing errors, stock issues, or suspected fraud.',
    ],
    bullets: [
      'Prices are listed in INR and include applicable taxes where shown',
      'Order confirmation is sent by email once payment is successful',
      'We may contact you if an item becomes unavailable after ordering',
    ],
  },
  {
    id: 'returns',
    title: 'Returns & warranty',
    paragraphs: [
      'Returns are accepted within 30 days of delivery for unused items in original packaging. Warranty terms vary by manufacturer and are described on each product page.',
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    paragraphs: [
      `${BRAND_NAME} is provided on an "as is" basis for demonstration and learning purposes. To the fullest extent permitted by law, we are not liable for indirect or consequential damages arising from use of the platform.`,
    ],
  },
]

export const cookieSections: CmsSection[] = [
  {
    id: 'what',
    title: 'What are cookies?',
    paragraphs: [
      'Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and keep you signed in.',
    ],
  },
  {
    id: 'how',
    title: 'How we use cookies',
    paragraphs: [`${BRAND_NAME} uses cookies and similar technologies for:`],
    bullets: [
      'Essential cookies — cart persistence, authentication sessions',
      'Preference cookies — recent searches and UI settings stored in localStorage',
      'Analytics cookies — anonymous page views to improve performance (when enabled)',
    ],
  },
  {
    id: 'control',
    title: 'Managing cookies',
    paragraphs: [
      'You can clear site data or disable cookies in your browser settings. Note that blocking essential cookies may prevent cart and sign-in features from working correctly.',
      `Questions about this policy: ${PRIVACY_EMAIL}`,
    ],
  },
]

export const aboutDescription = BRAND_TAGLINE
