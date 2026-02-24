import { Product, FAQItem } from './types';

// Mağaza stok durumu - Her ürün için hangi mağazalarda mevcut
export const STORE_AVAILABILITY: Record<number, { antalya: boolean; nevsehir: boolean }> = {
  1: { antalya: true, nevsehir: true },    // MacBook Pro M3 Max
  2: { antalya: true, nevsehir: true },    // iPhone 15 Pro Max
  3: { antalya: true, nevsehir: false },   // Sony WH-1000XM5
  4: { antalya: false, nevsehir: true },   // Samsung Galaxy Watch 6
  5: { antalya: true, nevsehir: true },    // Logitech MX Master 3S
  6: { antalya: true, nevsehir: false },   // Asus ROG Zephyrus G14
  7: { antalya: true, nevsehir: true },    // Samsung Galaxy S24 Ultra
  8: { antalya: false, nevsehir: true },   // iPad Pro
  9: { antalya: true, nevsehir: false },   // AirPods Max
  10: { antalya: true, nevsehir: true },   // PlayStation 5 Slim
  11: { antalya: false, nevsehir: true },  // Nintendo Switch OLED
  12: { antalya: true, nevsehir: false },  // DJI Mini 4 Pro
  13: { antalya: true, nevsehir: true },   // Apple Watch Ultra 2
  14: { antalya: false, nevsehir: false }, // Dell XPS 15 (online only)
  15: { antalya: true, nevsehir: false },  // Sony Alpha a7 IV
  16: { antalya: true, nevsehir: true },   // Keychron Q1 Pro
  17: { antalya: false, nevsehir: true },  // Samsung Galaxy Tab S9
  18: { antalya: true, nevsehir: true },   // Bose QuietComfort Ultra
  19: { antalya: true, nevsehir: false },  // Razer DeathAdder V3 Pro
  20: { antalya: false, nevsehir: true },  // Google Pixel 8 Pro
  21: { antalya: true, nevsehir: true },   // SteelSeries Arctis Nova Pro
  22: { antalya: true, nevsehir: false },  // MSI GeForce RTX 4090
  23: { antalya: false, nevsehir: true },  // Garmin Fenix 7X Pro
  24: { antalya: true, nevsehir: true },   // GoPro HERO12 Black
  25: { antalya: true, nevsehir: true },   // Marshall Emberton II
  26: { antalya: false, nevsehir: false }, // ASUS ProArt Display (online only)
  27: { antalya: true, nevsehir: false },  // Corsair Dominator Titanium
  28: { antalya: true, nevsehir: true },   // Elgato Stream Deck
  29: { antalya: false, nevsehir: true },  // WD Black SN850X
  30: { antalya: true, nevsehir: true },   // Philips Hue
  31: { antalya: true, nevsehir: false },  // Nothing Phone (2)
  32: { antalya: true, nevsehir: true },   // Anker 737 Power Bank
  33: { antalya: true, nevsehir: true },   // USB-C Kablo
  34: { antalya: true, nevsehir: true },   // Xiaomi Mi Band 8
  35: { antalya: true, nevsehir: true },   // JBL Go 3
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "MacBook Pro M3 Max",
    brand: "Apple",
    category: "Bilgisayar",
    price: 124999,
    oldPrice: 139999,
    image: "https://picsum.photos/seed/macbookpro/800/800",
    description: "En zorlu iş akışları için tasarlanmış, sınırları zorlayan performans.",
    features: ["M3 Max Çip", "32GB Birleşik Bellek", "1TB SSD", "16 inç Liquid Retina XDR"],
    specs: {
      "İşlemci": "Apple M3 Max (14 çekirdekli CPU)",
      "Grafik": "30 çekirdekli GPU",
      "Bellek": "32GB Birleşik Bellek",
      "Depolama": "1TB SSD",
      "Ekran": "16.2 inç Liquid Retina XDR (3456 x 2234)",
      "Pil": "22 saate kadar video oynatma"
    },
    color: "Uzay Grisi",
    inStock: true,
    stockCount: 12,
    rating: 5,
    badge: 'En Çok Satan',
    variants: [
      { id: 'mbp-silver', name: 'Gümüş', type: 'color', value: 'Gümüş', colorCode: '#C0C0C0', priceModifier: 0, inStock: true, stockCount: 8 },
      { id: 'mbp-spacegray', name: 'Uzay Grisi', type: 'color', value: 'Uzay Grisi', colorCode: '#4A4A4A', priceModifier: 0, inStock: true, stockCount: 12 },
      { id: 'mbp-512gb', name: '512GB', type: 'storage', value: '512GB', priceModifier: -15000, inStock: true, stockCount: 5 },
      { id: 'mbp-1tb', name: '1TB', type: 'storage', value: '1TB', priceModifier: 0, inStock: true, stockCount: 12 },
      { id: 'mbp-2tb', name: '2TB', type: 'storage', value: '2TB', priceModifier: 20000, inStock: false, stockCount: 0 }
    ]
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Telefon",
    price: 82999,
    image: "https://picsum.photos/seed/iphone15/800/800",
    description: "Titanyum tasarım, A17 Pro çip ve şimdiye kadarki en gelişmiş kamera sistemi.",
    features: ["A17 Pro Çip", "48MP Ana Kamera", "5x Optik Zoom", "USB-C"],
    specs: {
      "Ekran": "6.7 inç Super Retina XDR OLED",
      "İşlemci": "A17 Pro",
      "Kamera": "48MP Ana + 12MP Ultra Geniş + 12MP Telefoto",
      "Güvenlik": "Face ID",
      "Suya Dayanıklılık": "IP68 (30 dakikaya kadar 6 metre derinlik)"
    },
    color: "Naturel Titanyum",
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    badge: 'Trend',
    variants: [
      { id: 'ip15-natural', name: 'Naturel Titanyum', type: 'color', value: 'Naturel', colorCode: '#B8A99A', priceModifier: 0, inStock: true, stockCount: 25 },
      { id: 'ip15-blue', name: 'Mavi Titanyum', type: 'color', value: 'Mavi', colorCode: '#4A5568', priceModifier: 0, inStock: true, stockCount: 18 },
      { id: 'ip15-black', name: 'Siyah Titanyum', type: 'color', value: 'Siyah', colorCode: '#1A1A1A', priceModifier: 0, inStock: true, stockCount: 30 },
      { id: 'ip15-white', name: 'Beyaz Titanyum', type: 'color', value: 'Beyaz', colorCode: '#F5F5F5', priceModifier: 0, inStock: false, stockCount: 0 },
      { id: 'ip15-256', name: '256GB', type: 'storage', value: '256GB', priceModifier: 0, inStock: true, stockCount: 25 },
      { id: 'ip15-512', name: '512GB', type: 'storage', value: '512GB', priceModifier: 8000, inStock: true, stockCount: 15 },
      { id: 'ip15-1tb', name: '1TB', type: 'storage', value: '1TB', priceModifier: 20000, inStock: true, stockCount: 8 }
    ]
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Ses",
    price: 13499,
    oldPrice: 15999,
    image: "https://picsum.photos/seed/sonyheadphones/800/800",
    description: "Gürültü engelleme teknolojisinde yeni bir standart.",
    features: ["Sektör Lideri ANC", "30 Saat Pil Ömrü", "Hızlı Şarj", "Kristal Netliğinde Aramalar"],
    specs: {
      "Sürücü Ünitesi": "30 mm",
      "Frekans Tepkisi": "4 Hz - 40.000 Hz",
      "Bluetooth": "Sürüm 5.2",
      "Ağırlık": "250g"
    },
    color: "Siyah",
    inStock: true,
    stockCount: 45,
    rating: 4.8,
    badge: 'İndirim',
    variants: [
      { id: 'sony-black', name: 'Siyah', type: 'color', value: 'Siyah', colorCode: '#1A1A1A', priceModifier: 0, inStock: true, stockCount: 45 },
      { id: 'sony-silver', name: 'Gümüş', type: 'color', value: 'Gümüş', colorCode: '#E8E8E8', priceModifier: 0, inStock: true, stockCount: 22 },
      { id: 'sony-blue', name: 'Gece Mavisi', type: 'color', value: 'Mavi', colorCode: '#1E3A5F', priceModifier: 500, inStock: true, stockCount: 8 }
    ]
  },
  {
    id: 4,
    name: "Samsung Galaxy Watch 6 Classic",
    brand: "Samsung",
    category: "Giyilebilir",
    price: 8999,
    image: "https://picsum.photos/seed/galaxywatch/800/800",
    description: "Zamansız tasarım, gelişmiş sağlık takibi ve döner çerçeve.",
    features: ["Döner Çerçeve", "Safir Kristal Cam", "EKG ve Tansiyon Takibi", "Uyku Koçluğu"],
    specs: {
      "Ekran": "1.5 inç Super AMOLED",
      "İşlemci": "Exynos W930",
      "Pil": "425 mAh",
      "Dayanıklılık": "5ATM + IP68 / MIL-STD-810H"
    },
    color: "Gümüş",
    inStock: false,
    stockCount: 0,
    rating: 4.5,
    variants: [
      { id: 'gw6-silver', name: 'Gümüş', type: 'color', value: 'Gümüş', colorCode: '#C0C0C0', priceModifier: 0, inStock: false, stockCount: 0 },
      { id: 'gw6-black', name: 'Siyah', type: 'color', value: 'Siyah', colorCode: '#1A1A1A', priceModifier: 0, inStock: false, stockCount: 0 },
      { id: 'gw6-43mm', name: '43mm', type: 'size', value: '43mm', priceModifier: -500, inStock: false, stockCount: 0 },
      { id: 'gw6-47mm', name: '47mm', type: 'size', value: '47mm', priceModifier: 0, inStock: false, stockCount: 0 }
    ]
  },
  {
    id: 5,
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Aksesuar",
    price: 3999,
    image: "https://picsum.photos/seed/mxmaster/800/800",
    description: "Hız, hassasiyet ve sessizlik için tasarlanmış ikonik mouse.",
    features: ["8K DPI Sensör", "MagSpeed Kaydırma", "Sessiz Tıklama", "Ergonomik Tasarım"],
    specs: {
      "Sensör": "Darkfield yüksek hassasiyet",
      "Buton Sayısı": "7",
      "Bağlantı": "Bluetooth + Logi Bolt",
      "Şarj": "USB-C (70 güne kadar kullanım)"
    },
    color: "Grafit",
    inStock: true,
    stockCount: 67,
    rating: 4.7,
    variants: [
      { id: 'mx-graphite', name: 'Grafit', type: 'color', value: 'Grafit', colorCode: '#4A4A4A', priceModifier: 0, inStock: true, stockCount: 67 },
      { id: 'mx-white', name: 'Soluk Gri', type: 'color', value: 'Soluk Gri', colorCode: '#E8E8E8', priceModifier: 0, inStock: true, stockCount: 34 },
      { id: 'mx-pink', name: 'Pembe', type: 'color', value: 'Pembe', colorCode: '#FFB6C1', priceModifier: 200, inStock: true, stockCount: 12 }
    ]
  },
  {
    id: 6,
    name: "Asus ROG Zephyrus G14",
    brand: "Asus",
    category: "Bilgisayar",
    price: 64999,
    oldPrice: 74999,
    image: "https://picsum.photos/seed/rogzephyrus/800/800",
    description: "Dünyanın en güçlü 14 inç oyun dizüstü bilgisayarı.",
    features: ["Ryzen 9 İşlemci", "RTX 4060 GPU", "165Hz Nebula Ekran", "AniMe Matrix"],
    specs: {
      "İşlemci": "AMD Ryzen 9 7940HS",
      "Ekran Kartı": "NVIDIA GeForce RTX 4060 8GB",
      "Ekran": "14 inç QHD+ 165Hz",
      "Ağırlık": "1.65 kg"
    },
    color: "Beyaz",
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    badge: 'İndirim',
    variants: [
      { id: 'rog-white', name: 'Ay Işığı Beyaz', type: 'color', value: 'Beyaz', colorCode: '#FFFAF0', priceModifier: 0, inStock: true, stockCount: 8 },
      { id: 'rog-gray', name: 'Eclipse Gri', type: 'color', value: 'Gri', colorCode: '#4A4A4A', priceModifier: 0, inStock: true, stockCount: 5 }
    ]
  },
  {
    id: 7,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Telefon",
    price: 69999,
    image: "https://picsum.photos/seed/s24ultra/800/800",
    description: "Galaxy AI ile yapay zeka çağına adım atın.",
    features: ["Snapdragon 8 Gen 3", "200MP Kamera", "Titanyum Kasa", "S Pen"],
    specs: {
      "Ekran": "6.8 inç Dynamic AMOLED 2X",
      "İşlemci": "Snapdragon 8 Gen 3",
      "Kamera": "200MP + 50MP + 12MP + 10MP",
      "Pil": "5000 mAh"
    },
    color: "Titanyum Siyah",
    inStock: true,
    stockCount: 35,
    rating: 4.9,
    badge: 'Trend',
    variants: [
      { id: 's24-black', name: 'Titanyum Siyah', type: 'color', value: 'Siyah', colorCode: '#1A1A1A', priceModifier: 0, inStock: true, stockCount: 35 },
      { id: 's24-gray', name: 'Titanyum Gri', type: 'color', value: 'Gri', colorCode: '#808080', priceModifier: 0, inStock: true, stockCount: 20 },
      { id: 's24-violet', name: 'Titanyum Mor', type: 'color', value: 'Mor', colorCode: '#8B008B', priceModifier: 0, inStock: true, stockCount: 15 },
      { id: 's24-yellow', name: 'Titanyum Sarı', type: 'color', value: 'Sarı', colorCode: '#FFD700', priceModifier: 0, inStock: false, stockCount: 0 },
      { id: 's24-256', name: '256GB', type: 'storage', value: '256GB', priceModifier: 0, inStock: true, stockCount: 35 },
      { id: 's24-512', name: '512GB', type: 'storage', value: '512GB', priceModifier: 6000, inStock: true, stockCount: 18 },
      { id: 's24-1tb', name: '1TB', type: 'storage', value: '1TB', priceModifier: 15000, inStock: true, stockCount: 5 }
    ]
  },
  {
    id: 8,
    name: "iPad Pro 12.9 M2",
    brand: "Apple",
    category: "Bilgisayar",
    price: 45999,
    image: "https://picsum.photos/seed/ipadpro/800/800",
    description: "İnanılmaz performans ve gelişmiş ekran teknolojisi.",
    features: ["M2 Çip", "Liquid Retina XDR", "ProRes Video", "Apple Pencil Desteği"],
    specs: {
      "Ekran": "12.9 inç mini-LED",
      "İşlemci": "Apple M2",
      "Bellek": "8GB / 16GB",
      "Bağlantı": "Thunderbolt / USB 4"
    },
    color: "Gümüş",
    inStock: true,
    stockCount: 18,
    rating: 4.8,
    variants: [
      { id: 'ipad-silver', name: 'Gümüş', type: 'color', value: 'Gümüş', colorCode: '#C0C0C0', priceModifier: 0, inStock: true, stockCount: 18 },
      { id: 'ipad-space', name: 'Uzay Grisi', type: 'color', value: 'Uzay Grisi', colorCode: '#4A4A4A', priceModifier: 0, inStock: true, stockCount: 12 },
      { id: 'ipad-128', name: '128GB', type: 'storage', value: '128GB', priceModifier: -8000, inStock: true, stockCount: 10 },
      { id: 'ipad-256', name: '256GB', type: 'storage', value: '256GB', priceModifier: 0, inStock: true, stockCount: 18 },
      { id: 'ipad-512', name: '512GB', type: 'storage', value: '512GB', priceModifier: 8000, inStock: true, stockCount: 6 },
      { id: 'ipad-1tb', name: '1TB', type: 'storage', value: '1TB', priceModifier: 20000, inStock: false, stockCount: 0 }
    ]
  },
  {
    id: 9,
    name: "AirPods Max",
    brand: "Apple",
    category: "Ses",
    price: 24999,
    image: "https://picsum.photos/seed/airpodsmax/800/800",
    description: "Yüksek ses kalitesi ile kullanım kolaylığı arasındaki mükemmel denge.",
    features: ["Aktif Gürültü Engelleme", "Şeffaf Mod", "Uzamsal Ses", "20 Saat Pil Ömrü"],
    specs: {
      "Sürücü": "Dinamik Sürücü",
      "Mikrofon": "9 adet",
      "Sensörler": "Optik, Konum, İvmeölçer",
      "Ağırlık": "384g"
    },
    color: "Gök Mavisi",
    inStock: true,
    stockCount: 7,
    rating: 4.7,
    variants: [
      { id: 'apm-blue', name: 'Gök Mavisi', type: 'color', value: 'Mavi', colorCode: '#87CEEB', priceModifier: 0, inStock: true, stockCount: 7 },
      { id: 'apm-silver', name: 'Gümüş', type: 'color', value: 'Gümüş', colorCode: '#C0C0C0', priceModifier: 0, inStock: true, stockCount: 5 },
      { id: 'apm-space', name: 'Uzay Grisi', type: 'color', value: 'Uzay Grisi', colorCode: '#4A4A4A', priceModifier: 0, inStock: true, stockCount: 9 },
      { id: 'apm-green', name: 'Yeşil', type: 'color', value: 'Yeşil', colorCode: '#228B22', priceModifier: 0, inStock: false, stockCount: 0 },
      { id: 'apm-pink', name: 'Pembe', type: 'color', value: 'Pembe', colorCode: '#FFB6C1', priceModifier: 0, inStock: false, stockCount: 0 }
    ]
  },
  {
    id: 10,
    name: "PlayStation 5 Slim",
    brand: "Sony",
    category: "Bilgisayar",
    price: 19999,
    image: "https://picsum.photos/seed/ps5/800/800",
    description: "Oyunun sınırlarını zorlayan yeni nesil konsol.",
    features: ["Ultra Hızlı SSD", "Ray Tracing", "4K 120FPS", "DualSense Desteği"],
    specs: {
      "İşlemci": "AMD Ryzen Zen 2",
      "Grafik": "AMD Radeon RDNA 2",
      "Depolama": "1TB SSD",
      "Sürücü": "Ultra HD Blu-ray"
    },
    color: "Beyaz",
    inStock: true,
    rating: 4.9,
    badge: 'En Çok Satan'
  },
  {
    id: 11,
    name: "Nintendo Switch OLED",
    brand: "Nintendo",
    category: "Bilgisayar",
    price: 12999,
    image: "https://picsum.photos/seed/nintendo/800/800",
    description: "Canlı OLED ekran ile her yerde oyun keyfi.",
    features: ["7 inç OLED Ekran", "Geniş Ayarlanabilir Stand", "Kablolu LAN Portu", "64GB Depolama"],
    specs: {
      "Ekran": "7 inç OLED (1280x720)",
      "Depolama": "64GB",
      "Pil Ömrü": "4.5 - 9 saat",
      "Ağırlık": "320g"
    },
    color: "Neon",
    inStock: true,
    rating: 4.6
  },
  {
    id: 12,
    name: "DJI Mini 4 Pro",
    brand: "DJI",
    category: "Aksesuar",
    price: 34999,
    image: "https://picsum.photos/seed/dji/800/800",
    description: "Avucunuzun içindeki profesyonel kamera.",
    features: ["4K/60fps HDR", "Dikey Çekim", "Engel Algılama", "34 Dakika Uçuş"],
    specs: {
      "Ağırlık": "249g",
      "Kamera": "1/1.3 inç CMOS",
      "Menzil": "20 km",
      "Hız": "16 m/s"
    },
    color: "Gri",
    inStock: true,
    rating: 4.9,
    badge: 'Trend'
  },
  {
    id: 13,
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "Giyilebilir",
    price: 39999,
    image: "https://picsum.photos/seed/watchultra/800/800",
    description: "En zorlu sporcular ve maceracılar için tasarlanmış en yetenekli saat.",
    features: ["S9 SiP", "3000 Nit Ekran", "Hassas Çift Frekanslı GPS", "72 Saat Pil"],
    specs: { "Ekran": "49mm Safir Kristal", "Parlaklık": "3000 Nit", "Suya Dayanıklılık": "100m", "Kasa": "Havacılık Sınıfı Titanyum" },
    color: "Titanyum",
    inStock: true,
    rating: 4.9,
    badge: 'Trend'
  },
  {
    id: 14,
    name: "Dell XPS 15",
    brand: "Dell",
    category: "Bilgisayar",
    price: 89999,
    image: "https://picsum.photos/seed/dellxps/800/800",
    description: "Performans ve taşınabilirliğin mükemmel dengesi.",
    features: ["i9 İşlemci", "RTX 4070", "OLED Dokunmatik Ekran", "CNC Alüminyum"],
    specs: { "İşlemci": "Intel Core i9-13900H", "Ekran": "15.6 inç 3.5K OLED", "Bellek": "32GB DDR5", "Depolama": "1TB SSD" },
    color: "Platin Gümüş",
    inStock: true,
    rating: 4.7
  },
  {
    id: 15,
    name: "Sony Alpha a7 IV",
    brand: "Sony",
    category: "Aksesuar",
    price: 74999,
    image: "https://picsum.photos/seed/sonya7iv/800/800",
    description: "Yeni nesil hibrit aynasız kamera.",
    features: ["33MP Full Frame Sensör", "4K 60p Video", "Gerçek Zamanlı Takip", "Gelişmiş AF"],
    specs: { "Sensör": "Exmor R CMOS", "ISO": "50 - 204.800", "Video": "10-bit 4:2:2", "Ekran": "Değişken Açılı Dokunmatik" },
    color: "Siyah",
    inStock: true,
    rating: 4.9,
    badge: 'En Çok Satan'
  },
  {
    id: 16,
    name: "Keychron Q1 Pro",
    brand: "Keychron",
    category: "Aksesuar",
    price: 6499,
    image: "https://picsum.photos/seed/keychron/800/800",
    description: "Tamamen özelleştirilebilir kablosuz mekanik klavye.",
    features: ["Alüminyum Kasa", "QMK/VIA Desteği", "Gateron Jupiter Switch", "RGB Aydınlatma"],
    specs: { "Bağlantı": "Bluetooth 5.1 + Kablolu", "Polling Rate": "1000Hz", "Pil": "4000mAh", "Ağırlık": "1.7kg" },
    color: "Karbon Siyahı",
    inStock: true,
    rating: 4.8
  },
  {
    id: 17,
    name: "Samsung Galaxy Tab S9 Ultra",
    brand: "Samsung",
    category: "Bilgisayar",
    price: 32999,
    image: "https://picsum.photos/seed/tabs9/800/800",
    description: "En büyük ve en güçlü Galaxy tablet.",
    features: ["14.6 inç AMOLED", "Snapdragon 8 Gen 2", "IP68 Dayanıklılık", "S Pen Dahil"],
    specs: { "Ekran": "14.6 inç 120Hz", "İşlemci": "Snapdragon 8 Gen 2", "Pil": "11.200 mAh", "Kalınlık": "5.5 mm" },
    color: "Bej",
    inStock: true,
    rating: 4.8
  },
  {
    id: 18,
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "Ses",
    price: 15999,
    image: "https://picsum.photos/seed/boseqc/800/800",
    description: "Dünyanın en iyi gürültü engelleme performansı.",
    features: ["CustomTune Teknolojisi", "Sürükleyici Ses", "24 Saat Pil", "Üstün Konfor"],
    specs: { "Bluetooth": "5.3", "Codec": "aptX Adaptive", "Şarj": "USB-C", "Mikrofon": "Gürültü Reddetme" },
    color: "Kumtaşı",
    inStock: true,
    rating: 4.9,
    badge: 'Trend'
  },
  {
    id: 19,
    name: "Razer DeathAdder V3 Pro",
    brand: "Razer",
    category: "Aksesuar",
    price: 4999,
    image: "https://picsum.photos/seed/razer/800/800",
    description: "Profesyoneller için ultra hafif kablosuz mouse.",
    features: ["63g Ultra Hafif", "Focus Pro 30K Sensör", "90M Tıklama Ömrü", "90 Saat Pil"],
    specs: { "Sensör": "Optik 30.000 DPI", "Hızlanma": "70G", "Bağlantı": "HyperSpeed Wireless", "Ağırlık": "63g" },
    color: "Beyaz",
    inStock: true,
    rating: 4.8
  },
  {
    id: 20,
    name: "Google Pixel 8 Pro",
    brand: "Google",
    category: "Telefon",
    price: 42999,
    image: "https://picsum.photos/seed/pixel8/800/800",
    description: "Google'ın şimdiye kadarki en akıllı telefonu.",
    features: ["Google Tensor G3", "Gelişmiş AI Kamera", "7 Yıl Güncelleme Sözü", "Sıcaklık Sensörü"],
    specs: { "Ekran": "6.7 inç LTPO OLED", "İşlemci": "Tensor G3", "Kamera": "50MP + 48MP + 48MP", "Güvenlik": "Titan M2" },
    color: "Porselen",
    inStock: true,
    rating: 4.6
  },
  {
    id: 21,
    name: "SteelSeries Arctis Nova Pro",
    brand: "SteelSeries",
    category: "Ses",
    price: 11999,
    image: "https://picsum.photos/seed/steelseries/800/800",
    description: "Oyun sesinde yeni bir zirve.",
    features: ["Hi-Res Audio", "Aktif Gürültü Engelleme", "Çift Batarya Sistemi", "GameDAC Gen 2"],
    specs: { "Sürücü": "40mm Neodimyum", "Frekans": "10 - 40.000 Hz", "Bağlantı": "2.4GHz + Bluetooth", "Uyumluluk": "PC, PS5, Switch" },
    color: "Siyah",
    inStock: true,
    rating: 4.7
  },
  {
    id: 22,
    name: "MSI GeForce RTX 4090",
    brand: "MSI",
    category: "Aksesuar",
    price: 84999,
    image: "https://picsum.photos/seed/rtx4090/800/800",
    description: "Nihai grafik performansı.",
    features: ["24GB GDDR6X", "Ada Lovelace Mimarisi", "DLSS 3 Desteği", "Suprim X Soğutma"],
    specs: { "Bellek": "24GB", "Bus": "384-bit", "Saat Hızı": "2625 MHz", "Güç": "450W" },
    color: "Gümüş/Gri",
    inStock: true,
    rating: 5,
    badge: 'Trend'
  },
  {
    id: 23,
    name: "Garmin Fenix 7X Pro",
    brand: "Garmin",
    category: "Giyilebilir",
    price: 34999,
    image: "https://picsum.photos/seed/garmin/800/800",
    description: "Güneş enerjili multisport GPS saati.",
    features: ["Solar Şarj", "Dahili El Feneri", "Topografik Haritalar", "Gelişmiş Antrenman Metrikleri"],
    specs: { "Ekran": "1.4 inç Solar", "Pil": "37 güne kadar", "Su Geçirmezlik": "10 ATM", "Bellek": "32GB" },
    color: "Siyah",
    inStock: true,
    rating: 4.9
  },
  {
    id: 24,
    name: "GoPro HERO12 Black",
    brand: "GoPro",
    category: "Aksesuar",
    price: 15499,
    image: "https://picsum.photos/seed/gopro/800/800",
    description: "Şimdiye kadarki en iyi görüntü kalitesi ve stabilizasyon.",
    features: ["5.3K 60 Video", "HyperSmooth 6.0", "HDR Video", "Bluetooth Ses Desteği"],
    specs: { "Çözünürlük": "27MP", "Video": "5.3K 60fps", "Su Geçirmezlik": "10m", "Ekran": "Çift Ekran" },
    color: "Siyah",
    inStock: true,
    rating: 4.7,
    badge: 'İndirim'
  },
  {
    id: 25,
    name: "Marshall Emberton II",
    brand: "Marshall",
    category: "Ses",
    price: 6999,
    image: "https://picsum.photos/seed/marshall/800/800",
    description: "İkonik tasarım, güçlü taşınabilir ses.",
    features: ["30+ Saat Çalma Süresi", "IP67 Dayanıklılık", "Stack Modu", "True Stereophonic"],
    specs: { "Sürücü": "2x 10W", "Frekans": "60Hz - 20kHz", "Bluetooth": "5.1", "Ağırlık": "0.7kg" },
    color: "Siyah/Pirinç",
    inStock: true,
    rating: 4.8
  },
  {
    id: 26,
    name: "ASUS ProArt Display PA32UCG",
    brand: "Asus",
    category: "Aksesuar",
    price: 119999,
    image: "https://picsum.photos/seed/proart/800/800",
    description: "Profesyonel içerik üreticileri için dünyanın ilk 1600 nit monitörü.",
    features: ["4K HDR", "120Hz Yenileme", "1600 Nit Parlaklık", "Mini-LED Arka Aydınlatma"],
    specs: { "Ekran": "32 inç IPS", "Renk": "100% sRGB, 98% DCI-P3", "Bağlantı": "Thunderbolt 3", "HDR": "Dolby Vision" },
    color: "Siyah",
    inStock: true,
    rating: 4.9
  },
  {
    id: 27,
    name: "Corsair Dominator Titanium",
    brand: "Corsair",
    category: "Aksesuar",
    price: 8999,
    image: "https://picsum.photos/seed/corsair/800/800",
    description: "Üstün performanslı DDR5 bellek kiti.",
    features: ["7200MT/s Hız", "DHX Soğutma", "RGB Aydınlatma", "Özelleştirilebilir Üst Çubuklar"],
    specs: { "Kapasite": "32GB (2x16GB)", "Gecikme": "CL34", "Voltaj": "1.45V", "Yazılım": "iCUE Desteği" },
    color: "Beyaz",
    inStock: true,
    rating: 4.9
  },
  {
    id: 28,
    name: "Elgato Stream Deck MK.2",
    brand: "Elgato",
    category: "Aksesuar",
    price: 5499,
    image: "https://picsum.photos/seed/streamdeck/800/800",
    description: "Yayıncılar ve içerik üreticileri için kontrol merkezi.",
    features: ["15 Özelleştirilebilir LCD Tuş", "Değiştirilebilir Ön Plaka", "Geniş Eklenti Mağazası", "Tek Dokunuşla İşlem"],
    specs: { "Tuş Sayısı": "15", "Bağlantı": "USB 2.0", "Boyut": "118 x 84 x 25 mm", "Ağırlık": "145g" },
    color: "Siyah",
    inStock: true,
    rating: 4.8
  },
  {
    id: 29,
    name: "Western Digital Black SN850X",
    brand: "Western Digital",
    category: "Aksesuar",
    price: 4599,
    image: "https://picsum.photos/seed/wdblack/800/800",
    description: "Oyunlar için en yüksek hızda NVMe SSD.",
    features: ["7300MB/s Okuma", "Game Mode 2.0", "Düşük Gecikme", "Isı Emici Seçeneği"],
    specs: { "Kapasite": "2TB", "Arabirim": "PCIe Gen4 x4", "Yazma Hızı": "6600MB/s", "Form Faktörü": "M.2 2280" },
    color: "Siyah",
    inStock: true,
    rating: 4.9,
    badge: 'Trend'
  },
  {
    id: 30,
    name: "Philips Hue Akıllı Başlangıç Seti",
    brand: "Philips",
    category: "Aksesuar",
    price: 3999,
    image: "https://picsum.photos/seed/hue/800/800",
    description: "Evinizin atmosferini tek dokunuşla değiştirin.",
    features: ["16 Milyon Renk", "Sesle Kontrol", "Hue Bridge Dahil", "Zamanlama Özelliği"],
    specs: { "Lamba Sayısı": "3", "Duy": "E27", "Ömür": "25.000 Saat", "Güç": "9W" },
    color: "Beyaz",
    inStock: true,
    rating: 4.7
  },
  {
    id: 31,
    name: "Nothing Phone (2)",
    brand: "Nothing",
    category: "Telefon",
    price: 26999,
    image: "https://picsum.photos/seed/nothing/800/800",
    description: "Şeffaf tasarım, eşsiz Glyph arayüzü.",
    features: ["Glyph Arayüzü", "Snapdragon 8+ Gen 1", "Nothing OS 2.0", "50MP Çift Kamera"],
    specs: { "Ekran": "6.7 inç LTPO OLED", "İşlemci": "Snapdragon 8+ Gen 1", "Pil": "4700 mAh", "Hızlı Şarj": "45W" },
    color: "Koyu Gri",
    inStock: true,
    rating: 4.5
  },
  {
    id: 32,
    name: "Anker 737 Power Bank",
    brand: "Anker",
    category: "Aksesuar",
    price: 4299,
    image: "https://picsum.photos/seed/anker/800/800",
    description: "Laptop şarj edebilen ultra güçlü taşınabilir şarj cihazı.",
    features: ["140W Hızlı Şarj", "Akıllı Dijital Ekran", "24.000mAh Kapasite", "GaNPrime Teknolojisi"],
    specs: { "Kapasite": "24.000 mAh", "Çıkış": "2x USB-C, 1x USB-A", "Ekran": "Renkli TFT", "Ağırlık": "630g" },
    color: "Siyah",
    inStock: true,
    rating: 4.9,
    badge: 'En Çok Satan'
  },
  {
    id: 33,
    name: "USB-C Şarj Kablosu 2m",
    brand: "Anker",
    category: "Aksesuar",
    price: 99.99,
    oldPrice: 149.99,
    image: "https://picsum.photos/seed/usbcable/800/800",
    description: "Dayanıklı örgü kaplama, hızlı şarj destekli USB-C kablosu.",
    features: ["60W Hızlı Şarj", "Örgü Kaplama", "2 Metre Uzunluk", "10.000+ Bükülme Testi"],
    specs: { "Uzunluk": "2 metre", "Güç": "60W", "Veri Hızı": "480 Mbps", "Garanti": "18 ay" },
    color: "Siyah",
    inStock: true,
    rating: 4.7
  },
  {
    id: 34,
    name: "Xiaomi Mi Band 8",
    brand: "Xiaomi",
    category: "Giyilebilir",
    price: 499.99,
    oldPrice: 699.99,
    image: "https://picsum.photos/seed/miband8/800/800",
    description: "150'den fazla egzersiz modu, 16 gün pil ömrü ve şık tasarım.",
    features: ["AMOLED Ekran", "5ATM Su Dayanıklılık", "Uyku Takibi", "SpO2 Ölçümü"],
    specs: { "Ekran": "1.62 inç AMOLED", "Pil": "16 gün", "Ağırlık": "27g", "Sensörler": "PPG, İvmeölçer" },
    color: "Siyah",
    inStock: true,
    rating: 4.6,
    badge: 'Trend'
  },
  {
    id: 35,
    name: "JBL Go 3 Bluetooth Hoparlör",
    brand: "JBL",
    category: "Ses",
    price: 999.99,
    oldPrice: 1299.99,
    image: "https://picsum.photos/seed/jblgo3/800/800",
    description: "Kompakt boyutta güçlü JBL ses kalitesi, suya dayanıklı tasarım.",
    features: ["IP67 Su/Toz Geçirmez", "5 Saat Pil", "Bluetooth 5.1", "JBL Pro Sound"],
    specs: { "Çıkış Gücü": "4.2W", "Frekans": "110Hz - 20kHz", "Pil": "5 saat", "Ağırlık": "209g" },
    color: "Mavi",
    inStock: true,
    rating: 4.8
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: "Kargo ne kadar sürede ulaşır?",
    answer: "Siparişleriniz genellikle 24 saat içinde kargoya verilir ve bulunduğunuz bölgeye göre 1-3 iş günü içinde teslim edilir. İstanbul içi teslimatlarımızda aynı gün kargo seçeneği de mevcuttur."
  },
  {
    question: "İade politikanız nedir?",
    answer: "Ürünlerimizi teslim aldığınız tarihten itibaren 14 gün içinde orijinal kutusu ve faturasıyla birlikte ücretsiz olarak iade edebilirsiniz. Hijyenik ürünler (kulaklık vb.) kutusu açılmadığı sürece iade kapsamındadır."
  },
  {
    question: "Ürünleriniz garantili mi?",
    answer: "Evet, tüm ürünlerimiz en az 2 yıl resmi distribütör veya üretici garantisi altındadır. Bazı ürün gruplarında ek garanti paketleri satın alma imkanınız bulunmaktadır."
  },
  {
    question: "Taksit imkanı var mı?",
    answer: "Anlaşmalı bankaların kredi kartlarına 12 aya varan taksit seçenekleri sunuyoruz. Ayrıca alışveriş kredisi seçeneklerimizle 36 aya kadar vadelendirme yapabilirsiniz."
  },
  {
    question: "Ürünler orijinal mi?",
    answer: "Güzel Teknoloji olarak sadece yetkili satıcı ve distribütörlerden temin edilen %100 orijinal ürünlerin satışını yapıyoruz. Her ürünün orijinalliği garantimiz altındadır."
  },
  {
    question: "Mağazanız nerede?",
    answer: "Merkez mağazamız İstanbul Teknoloji Caddesi'nde bulunmaktadır. Ayrıca Ankara ve İzmir'de de deneyim mağazalarımız mevcuttur."
  },
  {
    question: "Kurumsal satış yapıyor musunuz?",
    answer: "Evet, şirketler için toplu alımlarda özel fiyatlandırma ve danışmanlık hizmeti sunuyoruz. Kurumsal talepleriniz için kurumsal@guzelteknoloji.com adresinden bize ulaşabilirsiniz."
  }
];

export const HERO_SLIDES = [
  {
    id: 1,
    title: "Geleceğin Teknolojisi",
    subtitle: "M3 Max Çipli Yeni MacBook Pro",
    image: "https://picsum.photos/seed/slide1/1920/1080",
    buttonText: "Hemen İncele",
    color: "bg-blue-600"
  },
  {
    id: 2,
    title: "Sınırları Zorlayın",
    subtitle: "iPhone 15 Pro Titanyum Tasarım",
    image: "https://picsum.photos/seed/slide2/1920/1080",
    buttonText: "Keşfet",
    color: "bg-slate-900"
  },
  {
    id: 3,
    title: "Müzik Hiç Bu Kadar Net Olmamıştı",
    subtitle: "Sony WH-1000XM5 ANC Kulaklık",
    image: "https://picsum.photos/seed/slide3/1920/1080",
    buttonText: "Satın Al",
    color: "bg-blue-500"
  }
];
