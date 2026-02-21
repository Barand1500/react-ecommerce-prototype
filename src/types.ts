export interface Product {
  id: number;
  name: string;
  brand: string;
  category: 'Telefon' | 'Bilgisayar' | 'Ses' | 'Aksesuar' | 'Giyilebilir';
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  color: string;
  inStock: boolean;
  rating: number;
  badge?: 'En Çok Satan' | 'Trend' | 'İndirim';
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
