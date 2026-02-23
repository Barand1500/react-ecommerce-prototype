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
  features: string[];
  specs: Record<string, string>;
  color: string;
  inStock: boolean;
  rating: number;
  badge?: 'En Çok Satan' | 'Trend' | 'İndirim';
  storeAvailability?: {
    antalya: boolean;
    nevsehir: boolean;
  };
}

export interface CartItem extends Product {
  quantity: number;
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
