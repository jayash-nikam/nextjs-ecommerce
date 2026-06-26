import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const categoryImagePools = {
  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200',
    'https://images.unsplash.com/photo-1602080858427-d2a947ce6cbb?q=80&w=1200',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200',
    'https://images.unsplash.com/photo-1629131726962-d12612cb4058?q=80&w=1200',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200',
  ],
  monitor: [
    'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1200',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200',
    'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?q=80&w=1200',
    'https://images.unsplash.com/photo-1556155092-8707de7f9c92?q=80&w=1200',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=1200',
    'https://images.unsplash.com/photo-1633511091886-3d5b2a18c8f4?q=80&w=1200',
    'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?q=80&w=1200',
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1200',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1200',
    'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=1200',
    'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=1200',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1200',
    'https://images.unsplash.com/photo-1615663243237-a53ac7d5c3eb?q=80&w=1200',
    'https://images.unsplash.com/photo-1625948515291-69613efd202f?q=80&w=1200',
    'https://images.unsplash.com/photo-1593642632559-268c975a9fcc?q=80&w=1200',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200',
    'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=1200',
  ],
  storage: [
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=1200',
    'https://images.unsplash.com/photo-1611174743420-3d7df880ce32?q=80&w=1200',
    'https://images.unsplash.com/photo-1531492746076-161ca9bc6b53?q=80&w=1200',
    'https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=1200',
    'https://images.unsplash.com/photo-1601737487795-dab272f52420?q=80&w=1200',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200',
  ],
}

function pickProductImages(category, productId) {
  const pool = categoryImagePools[category]
  const count = 3 + (productId % 5) // 3 to 7 images
  const offset = productId % pool.length
  const images = []
  for (let i = 0; i < count; i++) {
    images.push(pool[(offset + i * 2) % pool.length])
  }
  return [...new Set(images)]
}

const catalog = [
  // Laptops (20)
  { brand: 'Apple', title: 'MacBook Pro 14" M4 Pro', category: 'laptop', price: 219900, rating: 4.9, tags: ['laptop', 'apple', 'pro', 'm4'] },
  { brand: 'Apple', title: 'MacBook Air 15" M3', category: 'laptop', price: 134900, rating: 4.8, tags: ['laptop', 'apple', 'ultrabook'] },
  { brand: 'Dell', title: 'XPS 15 9530', category: 'laptop', price: 164999, rating: 4.7, tags: ['laptop', 'dell', 'creator'] },
  { brand: 'Dell', title: 'XPS 13 Plus', category: 'laptop', price: 139990, rating: 4.6, tags: ['laptop', 'dell', 'portable'] },
  { brand: 'Lenovo', title: 'ThinkPad X1 Carbon Gen 12', category: 'laptop', price: 178999, rating: 4.8, tags: ['laptop', 'lenovo', 'business'] },
  { brand: 'Lenovo', title: 'Legion Pro 7i', category: 'laptop', price: 199990, rating: 4.7, tags: ['laptop', 'gaming', 'lenovo'] },
  { brand: 'HP', title: 'Spectre x360 14', category: 'laptop', price: 149999, rating: 4.6, tags: ['laptop', 'hp', '2-in-1'] },
  { brand: 'HP', title: 'Omen 16', category: 'laptop', price: 124999, rating: 4.5, tags: ['laptop', 'gaming', 'hp'] },
  { brand: 'ASUS', title: 'ROG Zephyrus G16', category: 'laptop', price: 189999, rating: 4.8, tags: ['laptop', 'gaming', 'asus'] },
  { brand: 'ASUS', title: 'Zenbook 14 OLED', category: 'laptop', price: 89990, rating: 4.6, tags: ['laptop', 'asus', 'oled'] },
  { brand: 'MSI', title: 'Stealth 16 Studio', category: 'laptop', price: 209990, rating: 4.7, tags: ['laptop', 'msi', 'creator'] },
  { brand: 'Acer', title: 'Swift Go 14', category: 'laptop', price: 64990, rating: 4.4, tags: ['laptop', 'acer', 'budget'] },
  { brand: 'Microsoft', title: 'Surface Laptop 6', category: 'laptop', price: 129999, rating: 4.7, tags: ['laptop', 'microsoft', 'surface'] },
  { brand: 'Razer', title: 'Blade 16', category: 'laptop', price: 279999, rating: 4.8, tags: ['laptop', 'gaming', 'razer'] },
  { brand: 'Samsung', title: 'Galaxy Book4 Pro', category: 'laptop', price: 119999, rating: 4.5, tags: ['laptop', 'samsung', 'amoled'] },
  { brand: 'Framework', title: 'Laptop 16', category: 'laptop', price: 169999, rating: 4.7, tags: ['laptop', 'modular', 'repairable'] },
  { brand: 'LG', title: 'Gram 17', category: 'laptop', price: 134990, rating: 4.6, tags: ['laptop', 'lg', 'lightweight'] },
  { brand: 'Huawei', title: 'MateBook X Pro', category: 'laptop', price: 114999, rating: 4.5, tags: ['laptop', 'huawei', 'premium'] },
  { brand: 'Gigabyte', title: 'Aero 16 OLED', category: 'laptop', price: 194990, rating: 4.6, tags: ['laptop', 'creator', 'oled'] },
  { brand: 'Apple', title: 'MacBook Pro 16" M4 Max', category: 'laptop', price: 349900, rating: 4.9, tags: ['laptop', 'apple', 'flagship'] },

  // Monitors (20)
  { brand: 'Apple', title: 'Studio Display 27"', category: 'monitor', price: 159900, rating: 4.8, tags: ['monitor', 'apple', '5k'] },
  { brand: 'LG', title: 'UltraFine 32UN880', category: 'monitor', price: 54990, rating: 4.6, tags: ['monitor', 'lg', 'ergonomic'] },
  { brand: 'Samsung', title: 'Odyssey G9 49"', category: 'monitor', price: 129999, rating: 4.7, tags: ['monitor', 'gaming', 'ultrawide'] },
  { brand: 'Samsung', title: 'ViewFinity S8 32"', category: 'monitor', price: 42990, rating: 4.5, tags: ['monitor', '4k', 'samsung'] },
  { brand: 'Dell', title: 'UltraSharp U2723QE', category: 'monitor', price: 58990, rating: 4.7, tags: ['monitor', 'dell', '4k'] },
  { brand: 'Dell', title: 'Alienware AW3423DW', category: 'monitor', price: 99990, rating: 4.9, tags: ['monitor', 'oled', 'gaming'] },
  { brand: 'ASUS', title: 'ROG Swift PG27UCDM', category: 'monitor', price: 119999, rating: 4.8, tags: ['monitor', 'oled', '4k'] },
  { brand: 'ASUS', title: 'ProArt PA32UCX', category: 'monitor', price: 289990, rating: 4.8, tags: ['monitor', 'creator', 'mini-led'] },
  { brand: 'BenQ', title: 'MOBIUZ EX321UX', category: 'monitor', price: 74990, rating: 4.6, tags: ['monitor', 'gaming', '4k'] },
  { brand: 'LG', title: 'UltraGear 27GR95QE', category: 'monitor', price: 64990, rating: 4.7, tags: ['monitor', 'oled', 'gaming'] },
  { brand: 'MSI', title: 'MAG 321UPX', category: 'monitor', price: 89990, rating: 4.6, tags: ['monitor', '4k', 'gaming'] },
  { brand: 'Acer', title: 'Predator X34 V', category: 'monitor', price: 79990, rating: 4.5, tags: ['monitor', 'ultrawide', 'gaming'] },
  { brand: 'HP', title: 'E45c G5 Curved', category: 'monitor', price: 54999, rating: 4.4, tags: ['monitor', 'ultrawide', 'business'] },
  { brand: 'ViewSonic', title: 'VP2786-4K', category: 'monitor', price: 48990, rating: 4.5, tags: ['monitor', 'color-accurate'] },
  { brand: 'Gigabyte', title: 'M32U', category: 'monitor', price: 39990, rating: 4.6, tags: ['monitor', '4k', 'value'] },
  { brand: 'Philips', title: 'Evnia 49M2C8900', category: 'monitor', price: 109990, rating: 4.7, tags: ['monitor', 'qd-oled', 'gaming'] },
  { brand: 'Lenovo', title: 'ThinkVision P32p-30', category: 'monitor', price: 62990, rating: 4.5, tags: ['monitor', 'business', '4k'] },
  { brand: 'Samsung', title: 'Smart Monitor M8', category: 'monitor', price: 44990, rating: 4.4, tags: ['monitor', 'smart', 'streaming'] },
  { brand: 'ASUS', title: 'ZenScreen MB16AC', category: 'monitor', price: 24990, rating: 4.3, tags: ['monitor', 'portable', 'usb-c'] },
  { brand: 'LG', title: 'DualUp 28MQ780', category: 'monitor', price: 69990, rating: 4.6, tags: ['monitor', 'ergonomic', 'productivity'] },

  // Audio (20)
  { brand: 'Sony', title: 'WH-1000XM5', category: 'audio', price: 29990, rating: 4.9, tags: ['audio', 'headphones', 'anc'] },
  { brand: 'Sony', title: 'WF-1000XM5', category: 'audio', price: 24990, rating: 4.8, tags: ['audio', 'earbuds', 'anc'] },
  { brand: 'Apple', title: 'AirPods Pro 2', category: 'audio', price: 24900, rating: 4.8, tags: ['audio', 'earbuds', 'apple'] },
  { brand: 'Apple', title: 'AirPods Max', category: 'audio', price: 59900, rating: 4.6, tags: ['audio', 'headphones', 'apple'] },
  { brand: 'Bose', title: 'QuietComfort Ultra', category: 'audio', price: 34900, rating: 4.8, tags: ['audio', 'headphones', 'bose'] },
  { brand: 'Bose', title: 'QuietComfort Earbuds II', category: 'audio', price: 27900, rating: 4.7, tags: ['audio', 'earbuds', 'bose'] },
  { brand: 'Sennheiser', title: 'Momentum 4 Wireless', category: 'audio', price: 32990, rating: 4.7, tags: ['audio', 'headphones', 'audiophile'] },
  { brand: 'Sennheiser', title: 'HD 660S2', category: 'audio', price: 44990, rating: 4.9, tags: ['audio', 'headphones', 'wired'] },
  { brand: 'JBL', title: 'Tour One M2', category: 'audio', price: 24999, rating: 4.5, tags: ['audio', 'headphones', 'jbl'] },
  { brand: 'JBL', title: 'Charge 5 Speaker', category: 'audio', price: 14999, rating: 4.6, tags: ['audio', 'speaker', 'portable'] },
  { brand: 'Bang & Olufsen', title: 'Beoplay H95', category: 'audio', price: 79990, rating: 4.8, tags: ['audio', 'luxury', 'headphones'] },
  { brand: 'Marshall', title: 'Motif II ANC', category: 'audio', price: 17999, rating: 4.5, tags: ['audio', 'earbuds', 'marshall'] },
  { brand: 'Audio-Technica', title: 'ATH-M50xBT2', category: 'audio', price: 18990, rating: 4.7, tags: ['audio', 'headphones', 'studio'] },
  { brand: 'Beyerdynamic', title: 'Amiron 300', category: 'audio', price: 22990, rating: 4.6, tags: ['audio', 'earbuds', 'german'] },
  { brand: 'Sonos', title: 'Era 300', category: 'audio', price: 44999, rating: 4.7, tags: ['audio', 'speaker', 'spatial'] },
  { brand: 'Sonos', title: 'Arc Gen 2', category: 'audio', price: 89999, rating: 4.8, tags: ['audio', 'soundbar', 'dolby-atmos'] },
  { brand: 'Nothing', title: 'Ear (2)', category: 'audio', price: 8999, rating: 4.4, tags: ['audio', 'earbuds', 'budget'] },
  { brand: 'Samsung', title: 'Galaxy Buds3 Pro', category: 'audio', price: 17999, rating: 4.6, tags: ['audio', 'earbuds', 'samsung'] },
  { brand: 'Shure', title: 'AONIC 50 Gen 2', category: 'audio', price: 39990, rating: 4.7, tags: ['audio', 'headphones', 'pro'] },
  { brand: 'Focal', title: 'Bathys', category: 'audio', price: 69990, rating: 4.8, tags: ['audio', 'headphones', 'hi-fi'] },

  // Accessories (20)
  { brand: 'Logitech', title: 'MX Master 3S', category: 'accessories', price: 9995, rating: 4.8, tags: ['accessories', 'mouse', 'productivity'] },
  { brand: 'Logitech', title: 'MX Keys S', category: 'accessories', price: 10995, rating: 4.7, tags: ['accessories', 'keyboard', 'wireless'] },
  { brand: 'Keychron', title: 'Q1 Pro', category: 'accessories', price: 16999, rating: 4.7, tags: ['accessories', 'keyboard', 'mechanical'] },
  { brand: 'Keychron', title: 'K3 Pro', category: 'accessories', price: 11999, rating: 4.6, tags: ['accessories', 'keyboard', 'compact'] },
  { brand: 'Razer', title: 'DeathAdder V3 Pro', category: 'accessories', price: 12999, rating: 4.7, tags: ['accessories', 'mouse', 'gaming'] },
  { brand: 'Razer', title: 'BlackWidow V4 Pro', category: 'accessories', price: 22999, rating: 4.6, tags: ['accessories', 'keyboard', 'gaming'] },
  { brand: 'Apple', title: 'Magic Keyboard', category: 'accessories', price: 10900, rating: 4.5, tags: ['accessories', 'keyboard', 'apple'] },
  { brand: 'Apple', title: 'Magic Trackpad', category: 'accessories', price: 12500, rating: 4.6, tags: ['accessories', 'trackpad', 'apple'] },
  { brand: 'Anker', title: '737 Power Bank 240W', category: 'accessories', price: 14999, rating: 4.6, tags: ['accessories', 'charger', 'power-bank'] },
  { brand: 'Belkin', title: 'BoostCharge Pro 3-in-1', category: 'accessories', price: 18999, rating: 4.5, tags: ['accessories', 'charger', 'magsafe'] },
  { brand: 'Elgato', title: 'Stream Deck MK.2', category: 'accessories', price: 14999, rating: 4.8, tags: ['accessories', 'streaming', 'creator'] },
  { brand: 'Wacom', title: 'Intuos Pro M', category: 'accessories', price: 32990, rating: 4.7, tags: ['accessories', 'tablet', 'design'] },
  { brand: 'CalDigit', title: 'TS4 Thunderbolt Dock', category: 'accessories', price: 39990, rating: 4.8, tags: ['accessories', 'dock', 'thunderbolt'] },
  { brand: 'HyperX', title: 'Cloud III Wireless', category: 'accessories', price: 14999, rating: 4.5, tags: ['accessories', 'headset', 'gaming'] },
  { brand: 'SteelSeries', title: 'Apex Pro TKL', category: 'accessories', price: 19999, rating: 4.7, tags: ['accessories', 'keyboard', 'gaming'] },
  { brand: 'Peak Design', title: 'Tech Pouch', category: 'accessories', price: 5999, rating: 4.6, tags: ['accessories', 'organizer', 'travel'] },
  { brand: 'Twelve South', title: 'Curve Flex Stand', category: 'accessories', price: 6999, rating: 4.5, tags: ['accessories', 'stand', 'laptop'] },
  { brand: 'UGREEN', title: 'Revodok Pro 209', category: 'accessories', price: 8999, rating: 4.4, tags: ['accessories', 'dock', 'usb-c'] },
  { brand: 'Logitech', title: 'Brio 4K Webcam', category: 'accessories', price: 19995, rating: 4.6, tags: ['accessories', 'webcam', '4k'] },
  { brand: 'Secretlab', title: 'Magnus Pro Desk', category: 'accessories', price: 79999, rating: 4.7, tags: ['accessories', 'desk', 'ergonomic'] },

  // Storage (20)
  { brand: 'Samsung', title: '990 Pro 2TB NVMe', category: 'storage', price: 18999, rating: 4.9, tags: ['storage', 'ssd', 'nvme'] },
  { brand: 'Samsung', title: 'T7 Shield 2TB', category: 'storage', price: 16999, rating: 4.8, tags: ['storage', 'portable', 'ssd'] },
  { brand: 'WD', title: 'Black SN850X 2TB', category: 'storage', price: 17499, rating: 4.8, tags: ['storage', 'ssd', 'gaming'] },
  { brand: 'WD', title: 'My Passport 5TB', category: 'storage', price: 12999, rating: 4.5, tags: ['storage', 'hdd', 'portable'] },
  { brand: 'SanDisk', title: 'Extreme PRO 2TB', category: 'storage', price: 21999, rating: 4.7, tags: ['storage', 'portable', 'rugged'] },
  { brand: 'Crucial', title: 'T700 2TB Gen5', category: 'storage', price: 24999, rating: 4.8, tags: ['storage', 'ssd', 'gen5'] },
  { brand: 'Seagate', title: 'FireCuda 530 2TB', category: 'storage', price: 19999, rating: 4.7, tags: ['storage', 'ssd', 'ps5'] },
  { brand: 'Kingston', title: 'KC3000 2TB', category: 'storage', price: 15999, rating: 4.6, tags: ['storage', 'ssd', 'value'] },
  { brand: 'Sabrent', title: 'Rocket 4 Plus 4TB', category: 'storage', price: 34999, rating: 4.7, tags: ['storage', 'ssd', 'high-capacity'] },
  { brand: 'LaCie', title: 'Rugged SSD Pro5 2TB', category: 'storage', price: 42999, rating: 4.6, tags: ['storage', 'portable', 'creator'] },
  { brand: 'G-Technology', title: 'ArmorATD 4TB', category: 'storage', price: 14999, rating: 4.4, tags: ['storage', 'hdd', 'rugged'] },
  { brand: 'Synology', title: 'DS923+ NAS', category: 'storage', price: 64999, rating: 4.8, tags: ['storage', 'nas', 'network'] },
  { brand: 'QNAP', title: 'TS-464 NAS', category: 'storage', price: 54990, rating: 4.6, tags: ['storage', 'nas', 'home-server'] },
  { brand: 'Lexar', title: 'NM790 2TB', category: 'storage', price: 13999, rating: 4.5, tags: ['storage', 'ssd', 'budget'] },
  { brand: 'TeamGroup', title: 'T-Force Cardea Z540 2TB', category: 'storage', price: 22999, rating: 4.6, tags: ['storage', 'ssd', 'gen5'] },
  { brand: 'Corsair', title: 'MP700 2TB', category: 'storage', price: 21499, rating: 4.7, tags: ['storage', 'ssd', 'gaming'] },
  { brand: 'ADATA', title: 'Legend 960 Max 2TB', category: 'storage', price: 16990, rating: 4.5, tags: ['storage', 'ssd', 'heatsink'] },
  { brand: 'SanDisk', title: 'Extreme PRO SD 512GB', category: 'storage', price: 8999, rating: 4.7, tags: ['storage', 'sd-card', 'camera'] },
  { brand: 'Samsung', title: 'PRO Ultimate microSD 1TB', category: 'storage', price: 12999, rating: 4.6, tags: ['storage', 'microsd', 'mobile'] },
  { brand: 'OWC', title: 'Envoy Pro FX 2TB', category: 'storage', price: 28999, rating: 4.6, tags: ['storage', 'portable', 'thunderbolt'] },
]

const descriptions = {
  laptop: (b, t) =>
    `${t} delivers exceptional performance for work and play. ${b}'s latest engineering ensures fast multitasking, vivid displays, and all-day battery life for modern professionals.`,
  monitor: (b, t) =>
    `${t} offers stunning visuals with accurate colors and smooth refresh rates. Ideal for gaming, creative work, and productivity setups from ${b}.`,
  audio: (b, t) =>
    `${t} brings immersive sound with premium drivers and smart features. Experience rich audio quality crafted by ${b} for music lovers and commuters alike.`,
  accessories: (b, t) =>
    `${t} elevates your desk setup with thoughtful design and reliable performance. A must-have accessory from ${b} for everyday productivity.`,
  storage: (b, t) =>
    `${t} provides blazing-fast speeds and dependable storage for your files, games, and projects. Trusted ${b} technology for expanding your digital workspace.`,
}

const specTemplates = {
  laptop: () => ({
    processor: 'Latest Gen',
    ram: '16GB',
    storage: '512GB SSD',
    display: 'High Resolution',
    warranty: '1 Year',
  }),
  monitor: () => ({
    panel: 'IPS/OLED',
    resolution: '4K/QHD',
    refresh_rate: '120Hz+',
    connectivity: 'USB-C, HDMI',
    warranty: '3 Years',
  }),
  audio: () => ({
    type: 'Wireless',
    battery: '30+ hours',
    connectivity: 'Bluetooth 5.3',
    features: 'ANC',
    warranty: '1 Year',
  }),
  accessories: () => ({
    connectivity: 'Wireless/USB-C',
    compatibility: 'Multi-platform',
    color: 'Black',
    warranty: '2 Years',
  }),
  storage: () => ({
    capacity: '2TB',
    interface: 'NVMe/USB 3.2',
    read_speed: '7000 MB/s',
    form_factor: 'M.2/Portable',
    warranty: '5 Years',
  }),
}

const products = catalog.map((item, index) => {
  const id = index + 1
  const stock = 5 + Math.floor(Math.random() * 95)
  const images = pickProductImages(item.category, id)

  return {
    id,
    title: item.title,
    brand: item.brand,
    price: item.price,
    category: item.category,
    rating: item.rating,
    stock,
    tags: item.tags,
    description: descriptions[item.category](item.brand, item.title),
    specs: {
      ...specTemplates[item.category](),
      model_number: `${item.brand.slice(0, 3).toUpperCase()}-${String(id).padStart(3, '0')}`,
      release_year: '2025',
    },
    images,
  }
})

const output = { products }
const outPath = join(__dirname, '..', 'db.json')
writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n')
console.log(`Generated ${products.length} products -> ${outPath}`)
