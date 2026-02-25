export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'storage';
  value: string;
  colorCode?: string; // renk için hex kodu
  priceModifier?: number; // fiyat farkı
  inStock: boolean;
  stockCount: number;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: 'Telefon' | 'Bilgisayar' | 'Ses' | 'Aksesuar' | 'Giyilebilir';
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[]; // Çoklu görsel desteği
  description: string;
  features?: string[]; // Opsiyonel - admin panelinden eklenebilir
  specs: Record<string, string>;
  color: string;
  inStock: boolean;
  stockCount?: number; // Stok sayısı
  rating: number;
  badge?: 'En Çok Satan' | 'Trend' | 'İndirim';
  storeAvailability?: {
    antalya: boolean;
    nevsehir: boolean;
  };
  variants?: ProductVariant[]; // Ürün varyantları
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant; // Seçilen varyant
}

export interface SavedCart {
  id: number;
  name: string;
  createdAt: string;
  items: {
    name: string;
    image: string;
    quantity: number;
    price: number;
    productId: number;
  }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
