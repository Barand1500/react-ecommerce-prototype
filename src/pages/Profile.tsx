import { useState, ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Share2, MapPin, FileText, ShoppingBag, ShoppingCart, 
  ArrowLeftRight, Lock, LogOut, ArrowLeft, Camera, Mail, Phone,
  Shield, ChevronDown, Check, Image, CreditCard, Calendar, ShieldCheck,
  Wallet, Search, TrendingUp, TrendingDown, Plus, Home, Building2, 
  Edit3, Trash2, X, Star, Briefcase, Hash, MapPinned, Package, Truck,
  CheckCircle2, Clock, XCircle, Eye, ChevronRight, Filter, AlertTriangle,
  ArrowRight, Tag, RotateCcw, RefreshCw, MessageSquare, FileQuestion,
  EyeOff, KeyRound, AlertCircle, Info
} from 'lucide-react';
import { User as UserType, SavedCart } from '../types';
import { PRODUCTS } from '../constants';

interface ProfileProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  savedCarts: SavedCart[];
  onLoadCart: (cartId: number) => void;
  onDeleteSavedCart: (cartId: number) => void;
}

const PROFILE_MENU_ITEMS = [
  { 
    id: 'profil', 
    name: 'Profil', 
    icon: <User size={28} strokeWidth={1.5} />,
    description: 'Kişisel bilgilerinizi düzenleyin',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'hesap-hareketleri', 
    name: 'Hesap Hareketlerim', 
    icon: <Share2 size={28} strokeWidth={1.5} />,
    description: 'İşlem geçmişinizi görüntüleyin',
    color: 'from-violet-500 to-violet-600'
  },
  { 
    id: 'adreslerim', 
    name: 'Adreslerim', 
    icon: <MapPin size={28} strokeWidth={1.5} />,
    description: 'Teslimat adreslerinizi yönetin',
    color: 'from-emerald-500 to-emerald-600'
  },
  { 
    id: 'fatura-bilgileri', 
    name: 'Fatura Bilgilerim', 
    icon: <FileText size={28} strokeWidth={1.5} />,
    description: 'Fatura bilgilerinizi düzenleyin',
    color: 'from-amber-500 to-amber-600'
  },
  { 
    id: 'siparislerim', 
    name: 'Siparişlerim', 
    icon: <ShoppingBag size={28} strokeWidth={1.5} />,
    description: 'Siparişlerinizi takip edin',
    color: 'from-rose-500 to-rose-600'
  },
  { 
    id: 'kayitli-sepetler', 
    name: 'Kayıtlı Sepetlerim', 
    icon: <ShoppingCart size={28} strokeWidth={1.5} />,
    description: 'Kaydettiğiniz sepetleri görün',
    color: 'from-cyan-500 to-cyan-600'
  },
  { 
    id: 'iade-degisim', 
    name: 'İade/Değişim Talepleri', 
    icon: <ArrowLeftRight size={28} strokeWidth={1.5} />,
    description: 'İade ve değişim talepleriniz',
    color: 'from-indigo-500 to-indigo-600'
  },
  { 
    id: 'sifre-degistir', 
    name: 'Şifre Değiştir', 
    icon: <Lock size={28} strokeWidth={1.5} />,
    description: 'Hesap güvenliğinizi yönetin',
    color: 'from-slate-500 to-slate-600'
  },
  { 
    id: 'cikis', 
    name: 'Çıkış Yap', 
    icon: <LogOut size={28} strokeWidth={1.5} />,
    description: 'Hesabınızdan çıkış yapın',
    color: 'from-red-500 to-red-600',
    isLogout: true
  }
];

export default function Profile({ user, onNavigate, onLogout, savedCarts, onLoadCart, onDeleteSavedCart }: ProfileProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: '',
    twoFactorAuth: false
  });
  const [is2FAOpen, setIs2FAOpen] = useState(false);

  // Hesap Hareketleri State'leri
  const [paymentData, setPaymentData] = useState({
    amount: '',
    description: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    agreementAccepted: false
  });
  const [transactionSearch, setTransactionSearch] = useState('');

  // Örnek hesap özeti verileri
  const accountSummary = {
    debt: 0,
    credit: 0,
    balance: 0
  };

  // Örnek hesap hareketleri (boş)
  const transactions: { id: number; date: string; description: string; amount: number; type: 'credit' | 'debit' }[] = [];

  // Adreslerim State'leri
  const [addressSearch, setAddressSearch] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<{
    id: number;
    title: string;
    type: 'home' | 'work' | 'other';
    fullName: string;
    phone: string;
    city: string;
    district: string;
    neighborhood: string;
    address: string;
    isDefault: boolean;
  }[]>([
    {
      id: 1,
      title: 'Ev Adresim',
      type: 'home',
      fullName: user.name,
      phone: '530 411 21 50',
      city: 'İstanbul',
      district: 'Kadıköy',
      neighborhood: 'Caferağa Mah.',
      address: 'Moda Caddesi No: 123 Daire: 5',
      isDefault: true
    }
  ]);
  const [newAddress, setNewAddress] = useState({
    title: '',
    type: 'home' as 'home' | 'work' | 'other',
    fullName: '',
    phone: '',
    city: '',
    district: '',
    neighborhood: '',
    address: ''
  });

  // Fatura Bilgileri State'leri
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<number | null>(null);
  const [invoices, setInvoices] = useState<{
    id: number;
    title: string;
    type: 'individual' | 'corporate';
    fullName: string;
    tcKimlik?: string;
    companyName?: string;
    taxOffice?: string;
    taxNumber?: string;
    address: string;
    isDefault: boolean;
  }[]>([
    {
      id: 1,
      title: 'Bireysel Fatura',
      type: 'individual',
      fullName: user.name,
      tcKimlik: '12345678901',
      address: 'İstanbul, Kadıköy',
      isDefault: true
    }
  ]);
  const [newInvoice, setNewInvoice] = useState({
    title: '',
    type: 'individual' as 'individual' | 'corporate',
    fullName: '',
    tcKimlik: '',
    companyName: '',
    taxOffice: '',
    taxNumber: '',
    address: ''
  });

  // Siparişlerim State'leri
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersFilter, setOrdersFilter] = useState<'all' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [orders] = useState<{
    id: number;
    orderNumber: string;
    date: string;
    status: 'preparing' | 'shipped' | 'delivered' | 'cancelled';
    items: { name: string; image: string; quantity: number; price: number }[];
    total: number;
    shippingAddress: string;
    trackingNumber?: string;
    deliveryDate?: string;
  }[]>([
    {
      id: 1,
      orderNumber: 'GT-2026-001234',
      date: '20 Şubat 2026',
      status: 'shipped',
      items: [
        { name: 'iPhone 15 Pro Max', image: 'https://picsum.photos/seed/iphone/100', quantity: 1, price: 74999 },
        { name: 'Apple AirPods Pro 2', image: 'https://picsum.photos/seed/airpods/100', quantity: 1, price: 8999 }
      ],
      total: 83998,
      shippingAddress: 'İstanbul, Kadıköy, Caferağa Mah. Moda Cad. No:123',
      trackingNumber: 'TR123456789',
      deliveryDate: '25 Şubat 2026'
    },
    {
      id: 2,
      orderNumber: 'GT-2026-001189',
      date: '15 Şubat 2026',
      status: 'delivered',
      items: [
        { name: 'Samsung Galaxy Watch 6', image: 'https://picsum.photos/seed/watch/100', quantity: 1, price: 12499 }
      ],
      total: 12499,
      shippingAddress: 'İstanbul, Kadıköy, Caferağa Mah. Moda Cad. No:123',
      deliveryDate: '18 Şubat 2026'
    },
    {
      id: 3,
      orderNumber: 'GT-2026-001156',
      date: '10 Şubat 2026',
      status: 'preparing',
      items: [
        { name: 'MacBook Air M3', image: 'https://picsum.photos/seed/macbook/100', quantity: 1, price: 54999 },
        { name: 'Magic Mouse', image: 'https://picsum.photos/seed/mouse/100', quantity: 1, price: 3499 },
        { name: 'USB-C Hub', image: 'https://picsum.photos/seed/hub/100', quantity: 2, price: 1299 }
      ],
      total: 61096,
      shippingAddress: 'İstanbul, Beşiktaş, Levent Mah. Plaza Cad. No:45'
    }
  ]);

  // Kayıtlı Sepetlerim State'leri
  const [savedCartsSearch, setSavedCartsSearch] = useState('');
  const [selectedCart, setSelectedCart] = useState<number | null>(null);

  // İade/Değişim Talepleri State'leri
  const [returnsSearch, setReturnsSearch] = useState('');
  const [returnsFilter, setReturnsFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [selectedReturn, setSelectedReturn] = useState<number | null>(null);
  const [returnRequests] = useState<{
    id: number;
    requestNumber: string;
    orderNumber: string;
    type: 'return' | 'exchange';
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    createdAt: string;
    reason: string;
    item: { name: string; image: string; quantity: number; price: number };
    refundAmount?: number;
    exchangeProduct?: string;
    adminNote?: string;
    timeline: { date: string; status: string; description: string }[];
  }[]>([
    {
      id: 1,
      requestNumber: 'RET-2026-00456',
      orderNumber: 'GT-2026-001189',
      type: 'return',
      status: 'pending',
      createdAt: '22 Şubat 2026',
      reason: 'Ürün beklediğim gibi değildi',
      item: { name: 'Samsung Galaxy Watch 6', image: 'https://picsum.photos/seed/watch/100', quantity: 1, price: 12499 },
      refundAmount: 12499,
      timeline: [
        { date: '22 Şubat 2026 14:30', status: 'Talep Oluşturuldu', description: 'İade talebiniz başarıyla oluşturuldu.' },
        { date: '22 Şubat 2026 14:31', status: 'İnceleniyor', description: 'Talebiniz müşteri hizmetleri tarafından inceleniyor.' }
      ]
    },
    {
      id: 2,
      requestNumber: 'EXC-2026-00123',
      orderNumber: 'GT-2026-001156',
      type: 'exchange',
      status: 'approved',
      createdAt: '18 Şubat 2026',
      reason: 'Yanlış renk gönderildi',
      item: { name: 'Magic Mouse', image: 'https://picsum.photos/seed/mouse/100', quantity: 1, price: 3499 },
      exchangeProduct: 'Magic Mouse - Space Gray',
      adminNote: 'Değişim talebiniz onaylandı. Kargo çalışması başlatıldı.',
      timeline: [
        { date: '18 Şubat 2026 10:00', status: 'Talep Oluşturuldu', description: 'Değişim talebiniz oluşturuldu.' },
        { date: '18 Şubat 2026 15:30', status: 'İncelendi', description: 'Talebiniz incelendi.' },
        { date: '19 Şubat 2026 09:00', status: 'Onaylandı', description: 'Talebiniz onaylandı, kargo bekleniyor.' }
      ]
    },
    {
      id: 3,
      requestNumber: 'RET-2026-00389',
      orderNumber: 'GT-2026-001098',
      type: 'return',
      status: 'completed',
      createdAt: '10 Şubat 2026',
      reason: 'Ürün arızalı geldi',
      item: { name: 'AirPods Pro 2', image: 'https://picsum.photos/seed/airpods/100', quantity: 1, price: 8999 },
      refundAmount: 8999,
      adminNote: 'İade işleminiz tamamlandı. Tutar hesabınıza yansıtıldı.',
      timeline: [
        { date: '10 Şubat 2026 11:00', status: 'Talep Oluşturuldu', description: 'İade talebiniz oluşturuldu.' },
        { date: '10 Şubat 2026 16:00', status: 'Onaylandı', description: 'Talebiniz onaylandı.' },
        { date: '12 Şubat 2026 10:00', status: 'Ürün Alındı', description: 'Ürün depoya ulaştı.' },
        { date: '13 Şubat 2026 14:00', status: 'İade Tamamlandı', description: '8.999 ₺ hesabınıza iade edildi.' }
      ]
    },
    {
      id: 4,
      requestNumber: 'RET-2026-00345',
      orderNumber: 'GT-2026-001050',
      type: 'return',
      status: 'rejected',
      createdAt: '5 Şubat 2026',
      reason: 'Fikrimi değiştirdim',
      item: { name: 'USB-C Hub', image: 'https://picsum.photos/seed/hub/100', quantity: 1, price: 1299 },
      adminNote: 'Ürün açılmış ve kullanılmış olduğundan iade kabul edilemedi.',
      timeline: [
        { date: '5 Şubat 2026 09:00', status: 'Talep Oluşturuldu', description: 'İade talebiniz oluşturuldu.' },
        { date: '6 Şubat 2026 11:00', status: 'Reddedildi', description: 'Ürün kullanılmış olduğundan iade kabul edilemedi.' }
      ]
    }
  ]);

  // Şifre Değiştir State'leri
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleMenuClick = (item: typeof PROFILE_MENU_ITEMS[0]) => {
    if (item.isLogout) {
      onLogout();
    } else {
      setActiveSection(item.id);
    }
  };

  const handleBack = () => {
    setActiveSection(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Profil Düzenleme Sayfası
  const renderProfilSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 sm:space-y-8"
    >
      {/* Başlık */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleBack}
          className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Profil</h1>
          <p className="text-sm text-slate-500">Kişisel bilgilerinizi düzenleyin</p>
        </div>
      </div>

      {/* Ana Kart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">{/* Profil Resmi */}<div className="p-4 sm:p-8 flex flex-col items-center border-b border-slate-100 dark:border-slate-800">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-display font-bold shadow-xl shadow-blue-500/25">
              {getInitials(profileData.name)}
            </div>
            <button className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={24} className="text-white" />
            </button>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer transition-colors flex items-center gap-2">
              <Image size={16} />
              Göz at...
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <span className="text-sm text-slate-400">Dosya seçilmedi.</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Profil Resmi</p>
        </div>

        {/* Form Alanları */}
        <div className="p-4 sm:p-8 space-y-6">
          {/* Ad Soyad */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <User size={14} />
              Ad Soyad *
            </label>
            <input 
              type="text" 
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Adınız Soyadınız"
            />
          </div>

          {/* E-Posta ve Telefon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Mail size={14} />
                E-Posta *
              </label>
              <input 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ornek@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Phone size={14} />
                Telefon *
              </label>
              <input 
                type="tel" 
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="5XX XXX XX XX"
              />
            </div>
          </div>

          {/* 2 Aşamalı Doğrulama */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Shield size={14} />
              2 Aşamalı Doğrulama *
            </label>
            <div className="relative">
              <button
                onClick={() => setIs2FAOpen(!is2FAOpen)}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition-all hover:border-slate-300 dark:hover:border-slate-600"
              >
                <span className={profileData.twoFactorAuth ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                  {profileData.twoFactorAuth ? 'AÇIK' : 'KAPALI'}
                </span>
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${is2FAOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {is2FAOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-10"
                  >
                    <button
                      onClick={() => { setProfileData(prev => ({ ...prev, twoFactorAuth: false })); setIs2FAOpen(false); }}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${!profileData.twoFactorAuth ? 'bg-slate-50 dark:bg-slate-700' : ''}`}
                    >
                      <span className="text-slate-700 dark:text-slate-300">KAPALI</span>
                      {!profileData.twoFactorAuth && <Check size={18} className="text-blue-600" />}
                    </button>
                    <button
                      onClick={() => { setProfileData(prev => ({ ...prev, twoFactorAuth: true })); setIs2FAOpen(false); }}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${profileData.twoFactorAuth ? 'bg-slate-50 dark:bg-slate-700' : ''}`}
                    >
                      <span className="text-emerald-600 font-medium">AÇIK</span>
                      {profileData.twoFactorAuth && <Check size={18} className="text-blue-600" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="p-4 sm:p-8 pt-0">
          <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5">
            <Check size={18} />
            Kaydet
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Hesap Hareketlerim Sayfası
  const renderHesapHareketleriSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 sm:space-y-8"
    >
      {/* Başlık */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleBack}
          className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Hesap Hareketlerim</h1>
          <p className="text-sm text-slate-500">Bakiye yükleyin ve işlem geçmişinizi görüntüleyin</p>
        </div>
      </div>

      {/* Üst Kısım: Kredi Yükle + Hesap Özeti */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kredi Yükle Formu */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-4 sm:p-8">
          <h2 className="text-lg font-bold text-blue-600 mb-6">Kredi Yükle</h2>
          
          <div className="space-y-5">
            {/* Ödeme Tutarı */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Wallet size={14} />
                Ödeme Tutarı *
              </label>
              <input 
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0,00 ₺"
              />
            </div>

            {/* Açıklama */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Açıklama</label>
              <textarea 
                value={paymentData.description}
                onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Açıklama yazın..."
              />
            </div>

            {/* Kart Üzerindeki İsim */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <User size={14} />
                Kart Üzerindeki İsim *
              </label>
              <input 
                type="text"
                value={paymentData.cardName}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ad Soyad"
              />
            </div>

            {/* Kart Numarası */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <CreditCard size={14} />
                Kart Numarası *
              </label>
              <input 
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="•••• •••• •••• ••••"
                maxLength={19}
              />
            </div>

            {/* Son Kullanım ve CVC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Calendar size={14} />
                  Son Kullanım Tarihi *
                </label>
                <input 
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="AA/YY"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <ShieldCheck size={14} />
                  Güvenlik Kodu (CVC) *
                </label>
                <input 
                  type="text"
                  value={paymentData.cvc}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cvc: e.target.value }))}
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="•••"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Sözleşme */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => setPaymentData(prev => ({ ...prev, agreementAccepted: !prev.agreementAccepted }))}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${paymentData.agreementAccepted ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${paymentData.agreementAccepted ? 'left-7' : 'left-1'}`} />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <span className="text-blue-600 hover:underline cursor-pointer">Tahsilat Sözleşmesi</span>'ni Okudum ve Onaylıyorum.
              </span>
            </label>

            {/* Ödeme Butonu */}
            <button 
              disabled={!paymentData.agreementAccepted}
              className="w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:shadow-none disabled:hover:translate-y-0"
            >
              <Check size={18} />
              Ödemeyi Tamamla
            </button>
          </div>
        </div>

        {/* Hesap Özeti Kartı */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-3xl p-6 text-white">
          <h3 className="text-center font-bold mb-6 text-violet-100">Hesap Özeti</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="font-bold">Borç:</span>
              <span className="text-xl font-display">
                <span className="text-violet-200">-</span> {accountSummary.debt.toFixed(2).replace('.', ',')} <span className="text-sm">₺</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-bold">Alacak:</span>
              <span className="text-xl font-display">
                {accountSummary.credit.toFixed(2).replace('.', ',')} <span className="text-sm">₺</span>
              </span>
            </div>
            
            <div className="h-px bg-white/20" />
            
            <div className="flex justify-between items-center">
              <span className="font-bold">Bakiye:</span>
              <span className="text-2xl font-display font-bold">
                {accountSummary.balance.toFixed(2).replace('.', ',')} <span className="text-sm">₺</span>
                <span className="text-sm ml-1 text-violet-200">(A)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hesap Hareketleri Listesi */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-blue-600">Hesap Hareketlerim</h2>
          
          {/* Arama */}
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={transactionSearch}
              onChange={(e) => setTransactionSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Arama"
            />
          </div>
        </div>

        {/* İşlem Listesi */}
        <div className="p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-6 sm:py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Share2 size={32} />
              </div>
              <p className="text-slate-500">Henüz hesap hareketi bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                      {tx.type === 'credit' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-slate-400">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{tx.amount.toFixed(2)} ₺
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sayfalama */}
        <div className="p-6 pt-0 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-blue-600 text-white rounded-xl font-bold text-sm">1</button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Adreslerim Sayfası
  const renderAdreslerimSection = () => {
    const filteredAddresses = addresses.filter(addr => 
      addr.title.toLowerCase().includes(addressSearch.toLowerCase()) ||
      addr.city.toLowerCase().includes(addressSearch.toLowerCase()) ||
      addr.district.toLowerCase().includes(addressSearch.toLowerCase())
    );

    const handleSaveAddress = () => {
      if (editingAddress !== null) {
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddress 
            ? { ...newAddress, id: addr.id, isDefault: addr.isDefault }
            : addr
        ));
      } else {
        setAddresses(prev => [...prev, { 
          ...newAddress, 
          id: Date.now(), 
          isDefault: prev.length === 0 
        }]);
      }
      setIsAddressModalOpen(false);
      setEditingAddress(null);
      setNewAddress({
        title: '',
        type: 'home',
        fullName: '',
        phone: '',
        city: '',
        district: '',
        neighborhood: '',
        address: ''
      });
    };

    const handleEditAddress = (addr: typeof addresses[0]) => {
      setEditingAddress(addr.id);
      setNewAddress({
        title: addr.title,
        type: addr.type,
        fullName: addr.fullName,
        phone: addr.phone,
        city: addr.city,
        district: addr.district,
        neighborhood: addr.neighborhood,
        address: addr.address
      });
      setIsAddressModalOpen(true);
    };

    const handleDeleteAddress = (id: number) => {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    const handleSetDefault = (id: number) => {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 sm:space-y-8"
      >
        {/* Başlık */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Adreslerim</h1>
            <p className="text-sm text-slate-500">Teslimat adreslerinizi yönetin</p>
          </div>
        </div>

        {/* Üst Bar: Başlık + Ekle + Arama */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-blue-600">Adreslerim</h2>
              <button 
                onClick={() => {
                  setEditingAddress(null);
                  setNewAddress({
                    title: '',
                    type: 'home',
                    fullName: '',
                    phone: '',
                    city: '',
                    district: '',
                    neighborhood: '',
                    address: ''
                  });
                  setIsAddressModalOpen(true);
                }}
                className="p-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30"
              >
                <Plus size={20} />
              </button>
            </div>
            
            {/* Arama */}
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={addressSearch}
                onChange={(e) => setAddressSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="Arama"
              />
            </div>
          </div>

          {/* Adres Listesi */}
          <div className="p-6">
            {filteredAddresses.length === 0 ? (
              <div className="text-center py-8 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-slate-400">
                  <MapPin size={32} className="sm:hidden" /><MapPin size={40} className="hidden sm:block" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Henüz adres eklenmemiş</h3>
                <p className="text-slate-500 mb-6">Teslimat için adres ekleyerek başlayın</p>
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                >
                  <Plus size={18} />
                  Yeni Adres Ekle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAddresses.map((addr) => (
                  <motion.div
                    key={addr.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      addr.isDefault 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Varsayılan Badge */}
                    {addr.isDefault && (
                      <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Varsayılan
                      </div>
                    )}

                    {/* İkon ve Başlık */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${
                          addr.type === 'home' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
                            : addr.type === 'work'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {addr.type === 'home' ? <Home size={20} /> : addr.type === 'work' ? <Building2 size={20} /> : <MapPin size={20} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{addr.title}</h4>
                          <p className="text-xs text-slate-500">{addr.fullName}</p>
                        </div>
                      </div>
                      
                      {/* Aksiyonlar */}
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditAddress(addr)}
                          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-slate-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Adres Detayları */}
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-600 dark:text-slate-400">
                        {addr.neighborhood}, {addr.address}
                      </p>
                      <p className="text-slate-500">
                        {addr.district} / {addr.city}
                      </p>
                      <p className="text-slate-500 flex items-center gap-2">
                        <Phone size={14} />
                        {addr.phone}
                      </p>
                    </div>

                    {/* Varsayılan Yap Butonu */}
                    {!addr.isDefault && (
                      <button 
                        onClick={() => handleSetDefault(addr.id)}
                        className="mt-4 w-full py-2 border border-blue-500 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        Varsayılan Yap
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sayfalama */}
          {filteredAddresses.length > 0 && (
            <div className="p-6 pt-0 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 bg-blue-600 text-white rounded-xl font-bold text-sm">1</button>
              </div>
            </div>
          )}
        </div>

        {/* Adres Ekleme/Düzenleme Modal */}
        <AnimatePresence>
          {isAddressModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddressModalOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl z-50 max-h-[calc(100vh-1.5rem)] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
                  </h3>
                  <button 
                    onClick={() => setIsAddressModalOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                  {/* Adres Tipi */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Adres Tipi</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'home', label: 'Ev', icon: <Home size={16} /> },
                        { value: 'work', label: 'İş', icon: <Building2 size={16} /> },
                        { value: 'other', label: 'Diğer', icon: <MapPin size={16} /> }
                      ].map(type => (
                        <button
                          key={type.value}
                          onClick={() => setNewAddress(prev => ({ ...prev, type: type.value as 'home' | 'work' | 'other' }))}
                          className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                            newAddress.type === type.value
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {type.icon}
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Adres Başlığı */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Adres Başlığı *</label>
                    <input 
                      type="text"
                      value={newAddress.title}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      placeholder="Örn: Ev Adresim"
                    />
                  </div>

                  {/* Ad Soyad ve Telefon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">Ad Soyad *</label>
                      <input 
                        type="text"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        placeholder="Ad Soyad"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">Telefon *</label>
                      <input 
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        placeholder="5XX XXX XX XX"
                      />
                    </div>
                  </div>

                  {/* İl ve İlçe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">İl *</label>
                      <input 
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        placeholder="İl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">İlçe *</label>
                      <input 
                        type="text"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        placeholder="İlçe"
                      />
                    </div>
                  </div>

                  {/* Mahalle */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Mahalle *</label>
                    <input 
                      type="text"
                      value={newAddress.neighborhood}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      placeholder="Mahalle"
                    />
                  </div>

                  {/* Açık Adres */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Açık Adres *</label>
                    <textarea 
                      value={newAddress.address}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                      placeholder="Sokak, Cadde, Bina No, Daire No..."
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 pt-0 flex gap-3">
                  <button 
                    onClick={() => setIsAddressModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={handleSaveAddress}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                  >
                    <Check size={18} />
                    {editingAddress ? 'Güncelle' : 'Kaydet'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Fatura Bilgileri Düzenleme Fonksiyonları
  const handleEditInvoice = (invoice: typeof invoices[0]) => {
    setNewInvoice({
      title: invoice.title,
      type: invoice.type,
      fullName: invoice.fullName,
      tcKimlik: invoice.tcKimlik || '',
      companyName: invoice.companyName || '',
      taxOffice: invoice.taxOffice || '',
      taxNumber: invoice.taxNumber || '',
      address: invoice.address
    });
    setEditingInvoice(invoice.id);
    setIsInvoiceModalOpen(true);
  };

  const handleDeleteInvoice = (id: number) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const handleSetDefaultInvoice = (id: number) => {
    setInvoices(invoices.map(inv => ({
      ...inv,
      isDefault: inv.id === id
    })));
  };

  const handleSaveInvoice = () => {
    if (editingInvoice) {
      setInvoices(invoices.map(inv => 
        inv.id === editingInvoice 
          ? { ...inv, ...newInvoice }
          : inv
      ));
    } else {
      const newId = Math.max(0, ...invoices.map(inv => inv.id)) + 1;
      setInvoices([...invoices, { 
        ...newInvoice, 
        id: newId, 
        isDefault: invoices.length === 0 
      }]);
    }
    setIsInvoiceModalOpen(false);
    setEditingInvoice(null);
    setNewInvoice({
      title: '',
      type: 'individual',
      fullName: '',
      tcKimlik: '',
      companyName: '',
      taxOffice: '',
      taxNumber: '',
      address: ''
    });
  };

  // Fatura Bilgilerim Sayfası
  const renderFaturaBilgilerimSection = () => {
    const filteredInvoices = invoices.filter(inv =>
      inv.title.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.fullName.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      (inv.companyName && inv.companyName.toLowerCase().includes(invoiceSearch.toLowerCase()))
    );

    const getInvoiceIcon = (type: string) => {
      return type === 'corporate' ? <Briefcase size={20} /> : <User size={20} />;
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 sm:space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Fatura Bilgilerim</h1>
            <p className="text-sm text-slate-500">Fatura profillerinizi yönetin</p>
          </div>
        </div>

        {/* Arama ve Yeni Ekle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Fatura bilgisi ara..."
              value={invoiceSearch}
              onChange={(e) => setInvoiceSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingInvoice(null);
              setNewInvoice({
                title: '',
                type: 'individual',
                fullName: '',
                tcKimlik: '',
                companyName: '',
                taxOffice: '',
                taxNumber: '',
                address: ''
              });
              setIsInvoiceModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl transition-shadow"
          >
            <Plus size={20} />
            <span>Yeni Fatura Bilgisi</span>
          </motion.button>
        </div>

        {/* Fatura Kartları */}
        <div className="grid gap-4">
          {filteredInvoices.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-amber-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Kayıtlı Fatura Bilgisi Yok</h3>
              <p className="text-slate-500 text-sm">Yeni bir fatura bilgisi ekleyerek başlayın</p>
            </div>
          ) : (
            filteredInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-slate-900 rounded-3xl border-2 p-6 relative overflow-hidden transition-all ${
                  invoice.isDefault 
                    ? 'border-amber-500 shadow-lg shadow-amber-500/10' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                {invoice.isDefault && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      <Star size={12} fill="currentColor" />
                      Varsayılan
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-2xl ${invoice.type === 'corporate' ? 'bg-violet-50 dark:bg-violet-500/10' : 'bg-amber-50 dark:bg-amber-500/10'}`}>
                    <span className={invoice.type === 'corporate' ? 'text-violet-500' : 'text-amber-500'}>
                      {getInvoiceIcon(invoice.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{invoice.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        invoice.type === 'corporate' 
                          ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400' 
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {invoice.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 mt-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        {invoice.fullName}
                      </p>
                      {invoice.type === 'individual' && invoice.tcKimlik && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <Hash size={14} className="text-slate-400" />
                          TC: {invoice.tcKimlik.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}
                        </p>
                      )}
                      {invoice.type === 'corporate' && (
                        <>
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <Building2 size={14} className="text-slate-400" />
                            {invoice.companyName}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <MapPinned size={14} className="text-slate-400" />
                            {invoice.taxOffice} - {invoice.taxNumber}
                          </p>
                        </>
                      )}
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        {invoice.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {!invoice.isDefault && (
                    <button
                      onClick={() => handleSetDefaultInvoice(invoice.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-colors"
                    >
                      <Star size={16} />
                      Varsayılan Yap
                    </button>
                  )}
                  <button
                    onClick={() => handleEditInvoice(invoice)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Edit3 size={16} />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors ml-auto"
                  >
                    <Trash2 size={16} />
                    Sil
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Fatura Modal */}
        <AnimatePresence>
          {isInvoiceModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsInvoiceModalOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {editingInvoice ? 'Fatura Bilgisi Düzenle' : 'Yeni Fatura Bilgisi'}
                  </h2>
                  <button
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1">
                  {/* Fatura Başlığı */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Fatura Başlığı *
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Kişisel Fatura, Şirket Faturası"
                      value={newInvoice.title}
                      onChange={(e) => setNewInvoice({...newInvoice, title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>

                  {/* Fatura Tipi */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Fatura Tipi *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewInvoice({...newInvoice, type: 'individual'})}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          newInvoice.type === 'individual'
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <User size={20} />
                        <span className="font-medium">Bireysel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewInvoice({...newInvoice, type: 'corporate'})}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          newInvoice.type === 'corporate'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <Briefcase size={20} />
                        <span className="font-medium">Kurumsal</span>
                      </button>
                    </div>
                  </div>

                  {/* Ad Soyad */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Ad Soyad *
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Ad Soyad"
                        value={newInvoice.fullName}
                        onChange={(e) => setNewInvoice({...newInvoice, fullName: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Bireysel: TC Kimlik No */}
                  {newInvoice.type === 'individual' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        T.C. Kimlik No *
                      </label>
                      <div className="relative">
                        <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="T.C. Kimlik Numarası"
                          value={newInvoice.tcKimlik}
                          onChange={(e) => setNewInvoice({...newInvoice, tcKimlik: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                          maxLength={11}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Kurumsal: Şirket Bilgileri */}
                  {newInvoice.type === 'corporate' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Şirket Adı *
                        </label>
                        <div className="relative">
                          <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Şirket Adı"
                            value={newInvoice.companyName}
                            onChange={(e) => setNewInvoice({...newInvoice, companyName: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Vergi Dairesi *
                          </label>
                          <input
                            type="text"
                            placeholder="Vergi Dairesi"
                            value={newInvoice.taxOffice}
                            onChange={(e) => setNewInvoice({...newInvoice, taxOffice: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Vergi No *
                          </label>
                          <input
                            type="text"
                            placeholder="Vergi Numarası"
                            value={newInvoice.taxNumber}
                            onChange={(e) => setNewInvoice({...newInvoice, taxNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                            maxLength={10}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Adres */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Fatura Adresi *
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                      <textarea
                        placeholder="Fatura adresi"
                        rows={3}
                        value={newInvoice.address}
                        onChange={(e) => setNewInvoice({...newInvoice, address: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={handleSaveInvoice}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all"
                  >
                    <Check size={18} />
                    {editingInvoice ? 'Güncelle' : 'Kaydet'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Siparişlerim Sayfası
  const renderSiparislerimSection = () => {
    const statusConfig = {
      preparing: { label: 'Hazırlanıyor', color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400', icon: <Clock size={16} /> },
      shipped: { label: 'Kargoda', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400', icon: <Truck size={16} /> },
      delivered: { label: 'Teslim Edildi', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', icon: <CheckCircle2 size={16} /> },
      cancelled: { label: 'İptal Edildi', color: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400', icon: <XCircle size={16} /> }
    };

    const filterOptions = [
      { value: 'all', label: 'Tümü' },
      { value: 'preparing', label: 'Hazırlanıyor' },
      { value: 'shipped', label: 'Kargoda' },
      { value: 'delivered', label: 'Teslim Edildi' },
      { value: 'cancelled', label: 'İptal Edildi' }
    ];

    const filteredOrders = orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(ordersSearch.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(ordersSearch.toLowerCase()));
      const matchesFilter = ordersFilter === 'all' || order.status === ordersFilter;
      return matchesSearch && matchesFilter;
    });

    const selectedOrderData = orders.find(o => o.id === selectedOrder);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 sm:space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Siparişlerim</h1>
            <p className="text-sm text-slate-500">{orders.length} sipariş bulundu</p>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Sipariş no veya ürün ara..."
              value={ordersSearch}
              onChange={(e) => setOrdersSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setOrdersFilter(option.value as typeof ordersFilter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  ordersFilter === option.value
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-500/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sipariş Kartları */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-rose-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Sipariş Bulunamadı</h3>
              <p className="text-slate-500 text-sm">Arama kriterlerine uygun sipariş yok</p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Sipariş Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
                        <Package size={24} className="text-rose-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{order.orderNumber}</p>
                        <p className="text-sm text-slate-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].icon}
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ürünler */}
                <div className="p-6">
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-sm text-slate-500">Adet: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {item.price.toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-slate-500 pl-20">
                        +{order.items.length - 2} ürün daha
                      </p>
                    )}
                  </div>

                  {/* Kargo Takip */}
                  {order.status === 'shipped' && order.trackingNumber && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Truck size={20} className="text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Kargo Takip No</p>
                            <p className="text-blue-600 dark:text-blue-400 font-mono">{order.trackingNumber}</p>
                          </div>
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Tahmini: {order.deliveryDate}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Teslim Bilgisi */}
                  {order.status === 'delivered' && order.deliveryDate && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          <span className="font-medium">{order.deliveryDate}</span> tarihinde teslim edildi
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Toplam</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {order.total.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    <Eye size={18} />
                    Detayları Gör
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Sipariş Detay Modal */}
        <AnimatePresence>
          {selectedOrder && selectedOrderData && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sipariş Detayı</h2>
                    <p className="text-sm text-slate-500">{selectedOrderData.orderNumber}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {/* Durum */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Sipariş Durumu</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedOrderData.status].color}`}>
                      {statusConfig[selectedOrderData.status].icon}
                      {statusConfig[selectedOrderData.status].label}
                    </span>
                  </div>

                  {/* Sipariş Bilgileri */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Sipariş Tarihi</p>
                      <p className="font-medium text-slate-900 dark:text-white">{selectedOrderData.date}</p>
                    </div>
                    {selectedOrderData.deliveryDate && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <p className="text-sm text-slate-500 mb-1">
                          {selectedOrderData.status === 'delivered' ? 'Teslim Tarihi' : 'Tahmini Teslim'}
                        </p>
                        <p className="font-medium text-slate-900 dark:text-white">{selectedOrderData.deliveryDate}</p>
                      </div>
                    )}
                  </div>

                  {/* Teslimat Adresi */}
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-3">Teslimat Adresi</h3>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-start gap-3">
                      <MapPin size={18} className="text-slate-400 mt-0.5" />
                      <p className="text-slate-600 dark:text-slate-300">{selectedOrderData.shippingAddress}</p>
                    </div>
                  </div>

                  {/* Ürünler */}
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-3">Ürünler ({selectedOrderData.items.length})</h3>
                    <div className="space-y-3">
                      {selectedOrderData.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                            <p className="text-sm text-slate-500">Adet: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {item.price.toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Özet */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-slate-600 dark:text-slate-400">Toplam Tutar</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {selectedOrderData.total.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800">
                  {selectedOrderData.status === 'delivered' && (
                    <button className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all">
                      <Star size={18} />
                      Değerlendir
                    </button>
                  )}
                  {selectedOrderData.status === 'preparing' && (
                    <button className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl transition-all">
                      <XCircle size={18} />
                      Siparişi İptal Et
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Kayıtlı Sepetlerim Sayfası
  const renderKayitliSepetlerimSection = () => {
    const filteredCarts = savedCarts.filter(cart =>
      cart.name.toLowerCase().includes(savedCartsSearch.toLowerCase()) ||
      cart.items.some(item => item.name.toLowerCase().includes(savedCartsSearch.toLowerCase()))
    );

    const selectedCartData = savedCarts.find(c => c.id === selectedCart);

    const calculateCartTotal = (items: typeof savedCarts[0]['items']) => {
      return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleDeleteCart = (cartId: number) => {
      onDeleteSavedCart(cartId);
      setSelectedCart(null);
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 sm:space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Kayıtlı Sepetlerim</h1>
            <p className="text-sm text-slate-500">{savedCarts.length} kayıtlı sepet</p>
          </div>
        </div>

        {/* Arama */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Sepet veya ürün ara..."
            value={savedCartsSearch}
            onChange={(e) => setSavedCartsSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Sepet Kartları */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCarts.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-cyan-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Kayıtlı Sepet Yok</h3>
              <p className="text-slate-500 text-sm">Henüz kaydedilmiş sepetiniz bulunmuyor.</p>
              <p className="text-slate-400 text-xs mt-2">Sepetinize ürün ekleyip "Sepeti Kaydet" butonuna tıklayarak sepetinizi kaydedebilirsiniz.</p>
            </div>
          ) : (
            filteredCarts.map((cart, index) => {
              const savedTotal = calculateCartTotal(cart.items);
              
              // Güncel fiyatları hesapla
              const currentTotal = cart.items.reduce((sum, item) => {
                const currentProduct = PRODUCTS.find(p => p.id === item.productId);
                const currentPrice = currentProduct?.price ?? item.price;
                return sum + (currentPrice * item.quantity);
              }, 0);
              
              const priceDiff = currentTotal - savedTotal;
              const outOfStockCount = cart.items.filter(item => {
                const product = PRODUCTS.find(p => p.id === item.productId);
                return !product || !product.inStock;
              }).length;
              
              return (
                <motion.div
                  key={cart.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative bg-white dark:bg-slate-900 rounded-3xl border overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${
                    outOfStockCount > 0 
                      ? 'border-amber-200 dark:border-amber-500/30 hover:border-amber-300 dark:hover:border-amber-500/50' 
                      : priceDiff !== 0 
                        ? 'border-slate-200 dark:border-slate-700 hover:border-cyan-200 dark:hover:border-cyan-500/30'
                        : 'border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-500/30'
                  }`}
                  onClick={() => setSelectedCart(cart.id)}
                >
                  {/* Fiyat Değişimi Badge */}
                  {priceDiff !== 0 && (
                    <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      priceDiff > 0 
                        ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' 
                        : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {priceDiff > 0 
                        ? <TrendingUp size={12} />
                        : <TrendingDown size={12} />
                      }
                      {priceDiff > 0 ? '+' : ''}{priceDiff.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                    </div>
                  )}

                  {/* Stokta Yok Badge */}
                  {outOfStockCount > 0 && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
                      <AlertTriangle size={12} />
                      {outOfStockCount} stokta yok
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-16">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">{cart.name}</h3>
                        <p className="text-sm text-slate-500">{cart.createdAt}</p>
                      </div>
                    </div>

                    {/* Ürün Thumbnailleri */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex -space-x-3">
                        {cart.items.slice(0, 4).map((item, idx) => {
                          const product = PRODUCTS.find(p => p.id === item.productId);
                          const isOutOfStock = !product || !product.inStock;
                          return (
                            <div key={idx} className="relative">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className={`w-10 h-10 rounded-lg border-2 border-white dark:border-slate-900 object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                              />
                              {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center border-2 border-white dark:border-slate-900">
                                  <XCircle size={14} className="text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {cart.items.length > 4 && (
                          <div className="w-10 h-10 rounded-lg border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">
                            +{cart.items.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-slate-500 ml-2">
                        {cart.items.length} Ürün, {cart.items.reduce((sum, i) => sum + i.quantity, 0)} Adet
                      </span>
                    </div>

                    {/* Fiyat */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-xs text-slate-500">
                          {priceDiff !== 0 ? 'Kaydedilen / Güncel' : 'Toplam'}
                        </p>
                        {priceDiff !== 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400 line-through">
                              {savedTotal.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                            </span>
                            <span className={`font-bold ${priceDiff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                              {currentTotal.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                            </span>
                          </div>
                        ) : (
                          <p className="font-bold text-slate-900 dark:text-white">
                            {savedTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20 transition-colors">
                          <Eye size={18} className="text-cyan-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Sepet Detay Modal */}
        <AnimatePresence>
          {selectedCart && selectedCartData && (() => {
            // Fiyat karşılaştırması hesapla
            const itemsWithCurrentPrices = selectedCartData.items.map(item => {
              const currentProduct = PRODUCTS.find(p => p.id === item.productId);
              const currentPrice = currentProduct?.price ?? item.price;
              const inStock = currentProduct ? currentProduct.inStock : false;
              return {
                ...item,
                savedPrice: item.price,
                currentPrice,
                inStock,
                priceDiff: currentPrice - item.price
              };
            });

            const savedTotal = itemsWithCurrentPrices.reduce((sum, i) => sum + (i.savedPrice * i.quantity), 0);
            const currentTotal = itemsWithCurrentPrices.reduce((sum, i) => sum + (i.currentPrice * i.quantity), 0);
            const totalDiff = currentTotal - savedTotal;
            const outOfStockItems = itemsWithCurrentPrices.filter(i => !i.inStock);
            const priceChangedItems = itemsWithCurrentPrices.filter(i => i.priceDiff !== 0);

            return (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedCart(null)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                >
                  {/* Modal Header */}
                  <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <ShoppingCart size={20} className="text-cyan-500" />
                          {selectedCartData.name}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Kaydedilme: {selectedCartData.createdAt} • {selectedCartData.items.length} Ürün, {selectedCartData.items.reduce((sum, i) => sum + i.quantity, 0)} Adet
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedCart(null)}
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <X size={20} className="text-slate-500" />
                      </button>
                    </div>

                    {/* Stok Uyarısı */}
                    {outOfStockItems.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-xl flex items-start gap-3"
                      >
                        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          <span className="font-medium">{outOfStockItems.length} ürün</span> stokta bulunmuyor. Bu ürünler sepete eklenmeyecektir.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Modal Content - Ürün Listesi */}
                  <div className="p-6 space-y-3 overflow-y-auto flex-1">
                    {itemsWithCurrentPrices.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          !item.inStock 
                            ? 'bg-red-50/50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' 
                            : item.priceDiff !== 0 
                              ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' 
                              : 'bg-slate-50 dark:bg-slate-800/50 border-transparent'
                        }`}
                      >
                        {/* Ürün Görseli */}
                        <div className="relative flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className={`w-16 h-16 rounded-xl object-cover ${!item.inStock ? 'opacity-50 grayscale' : ''}`}
                          />
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                              <XCircle size={20} className="text-white" />
                            </div>
                          )}
                          {item.inStock && item.priceDiff !== 0 && (
                            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                              item.priceDiff > 0 
                                ? 'bg-red-500' 
                                : 'bg-emerald-500'
                            }`}>
                              {item.priceDiff > 0 
                                ? <TrendingUp size={12} className="text-white" />
                                : <TrendingDown size={12} className="text-white" />
                              }
                            </div>
                          )}
                        </div>

                        {/* Ürün Bilgileri */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${
                            !item.inStock 
                              ? 'text-slate-400 line-through' 
                              : 'text-slate-900 dark:text-white'
                          }`}>
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-slate-500">
                              {item.savedPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ x {item.quantity}
                            </span>
                            {!item.inStock && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                Stokta Yok
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Fiyat Bilgileri */}
                        <div className="text-right flex-shrink-0">
                          {item.priceDiff !== 0 ? (
                            <>
                              <p className="text-xs text-slate-400 line-through">
                                {(item.savedPrice * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                              </p>
                              <p className={`font-bold ${
                                item.priceDiff > 0 
                                  ? 'text-red-500' 
                                  : 'text-emerald-500'
                              }`}>
                                {(item.currentPrice * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                              </p>
                              <span className={`text-xs font-medium ${
                                item.priceDiff > 0 
                                  ? 'text-red-400' 
                                  : 'text-emerald-400'
                              }`}>
                                {item.priceDiff > 0 ? '+' : ''}{(item.priceDiff * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                              </span>
                            </>
                          ) : (
                            <p className="font-bold text-slate-900 dark:text-white">
                              {(item.currentPrice * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Fiyat Özeti */}
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    {/* Kaydedilen vs Güncel Tutar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 mb-1">Kaydedilen Tutar</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {savedTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 mb-1">Güncel Tutar</p>
                        <p className={`font-bold ${
                          totalDiff > 0 
                            ? 'text-red-500' 
                            : totalDiff < 0 
                              ? 'text-emerald-500' 
                              : 'text-slate-900 dark:text-white'
                        }`}>
                          {currentTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </p>
                      </div>
                    </div>

                    {/* Fiyat Değişimi Bildirimi */}
                    {totalDiff !== 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-xl flex items-center gap-3 ${
                          totalDiff > 0 
                            ? 'bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20' 
                            : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          totalDiff > 0 
                            ? 'bg-red-100 dark:bg-red-500/20' 
                            : 'bg-emerald-100 dark:bg-emerald-500/20'
                        }`}>
                          {totalDiff > 0 
                            ? <TrendingUp size={18} className="text-red-500" />
                            : <TrendingDown size={18} className="text-emerald-500" />
                          }
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${
                            totalDiff > 0 
                              ? 'text-red-700 dark:text-red-400' 
                              : 'text-emerald-700 dark:text-emerald-400'
                          }`}>
                            Toplam tutar {Math.abs(totalDiff).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ 
                            {totalDiff > 0 ? 'artmış' : 'azalmış'}!
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {priceChangedItems.length} üründe fiyat değişikliği
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <button 
                      onClick={() => handleDeleteCart(selectedCartData.id)}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-semibold text-sm transition-all group"
                    >
                      <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                      Sil
                    </button>
                    <button 
                      onClick={() => {
                        onLoadCart(selectedCartData.id);
                        setSelectedCart(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all"
                    >
                      <ArrowRight size={18} />
                      Sepete Aktar
                    </button>
                  </div>
                </motion.div>
              </>
            );
          })()}
        </AnimatePresence>
      </motion.div>
    );
  };

  // İade/Değişim Talepleri Sayfası
  const renderIadeDegisimSection = () => {
    const statusConfig = {
      pending: { label: 'Beklemede', color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400', icon: <Clock size={16} /> },
      approved: { label: 'Onaylandı', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400', icon: <CheckCircle2 size={16} /> },
      rejected: { label: 'Reddedildi', color: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400', icon: <XCircle size={16} /> },
      completed: { label: 'Tamamlandı', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', icon: <Check size={16} /> }
    };

    const filterOptions = [
      { value: 'all', label: 'Tümü' },
      { value: 'pending', label: 'Beklemede' },
      { value: 'approved', label: 'Onaylandı' },
      { value: 'rejected', label: 'Reddedildi' },
      { value: 'completed', label: 'Tamamlandı' }
    ];

    const filteredRequests = returnRequests.filter(req => {
      const matchesSearch = req.requestNumber.toLowerCase().includes(returnsSearch.toLowerCase()) ||
        req.item.name.toLowerCase().includes(returnsSearch.toLowerCase());
      const matchesFilter = returnsFilter === 'all' || req.status === returnsFilter;
      return matchesSearch && matchesFilter;
    });

    const selectedRequestData = returnRequests.find(r => r.id === selectedReturn);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 sm:space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">İade / Değişim Talepleri</h1>
            <p className="text-sm text-slate-500">{returnRequests.length} talep bulundu</p>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Talep no veya ürün ara..."
              value={returnsSearch}
              onChange={(e) => setReturnsSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setReturnsFilter(option.value as typeof returnsFilter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  returnsFilter === option.value
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Yeni Talep Butonu */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-shadow"
        >
          <Plus size={20} />
          <span>Yeni Talep Oluştur</span>
        </motion.button>

        {/* Talep Kartları */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight size={32} className="text-indigo-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Talep Bulunamadı</h3>
              <p className="text-slate-500 text-sm">Arama kriterlerine uygun talep yok</p>
            </div>
          ) : (
            filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${request.type === 'return' ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-violet-50 dark:bg-violet-500/10'}`}>
                        {request.type === 'return' ? (
                          <RotateCcw size={24} className="text-indigo-500" />
                        ) : (
                          <RefreshCw size={24} className="text-violet-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 dark:text-white">{request.requestNumber}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            request.type === 'return' 
                              ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                              : 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400'
                          }`}>
                            {request.type === 'return' ? 'İade' : 'Değişim'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{request.createdAt} • Sipariş: {request.orderNumber}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[request.status].color}`}>
                      {statusConfig[request.status].icon}
                      {statusConfig[request.status].label}
                    </span>
                  </div>

                  {/* Ürün Bilgisi */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl mb-4">
                    <img 
                      src={request.item.image} 
                      alt={request.item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{request.item.name}</p>
                      <p className="text-sm text-slate-500">Adet: {request.item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {request.item.price.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>

                  {/* Sebep */}
                  <div className="flex items-start gap-2 mb-4">
                    <FileQuestion size={16} className="text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Sebep:</span> {request.reason}
                    </p>
                  </div>

                  {/* Admin Notu */}
                  {request.adminNote && (
                    <div className={`p-3 rounded-xl mb-4 ${request.status === 'rejected' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-blue-50 dark:bg-blue-500/10'}`}>
                      <div className="flex items-start gap-2">
                        <MessageSquare size={16} className={request.status === 'rejected' ? 'text-red-500' : 'text-blue-500'} />
                        <p className={`text-sm ${request.status === 'rejected' ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
                          {request.adminNote}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* İade/Değişim Detay */}
                  {request.type === 'return' && request.refundAmount && request.status !== 'rejected' && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                      <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">İade Tutarı</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{request.refundAmount.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  )}
                  {request.type === 'exchange' && request.exchangeProduct && (
                    <div className="flex items-center justify-between p-3 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
                      <span className="text-sm text-violet-700 dark:text-violet-300 font-medium">Değişim Ürünü</span>
                      <span className="font-bold text-violet-600 dark:text-violet-400">{request.exchangeProduct}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end">
                  <button
                    onClick={() => setSelectedReturn(request.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    <Eye size={18} />
                    Detayları Gör
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Detay Modal */}
        <AnimatePresence>
          {selectedReturn && selectedRequestData && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedReturn(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Talep Detayı</h2>
                    <p className="text-sm text-slate-500">{selectedRequestData.requestNumber}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReturn(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {/* Durum ve Tip */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      selectedRequestData.type === 'return' 
                        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                        : 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400'
                    }`}>
                      {selectedRequestData.type === 'return' ? <RotateCcw size={16} /> : <RefreshCw size={16} />}
                      {selectedRequestData.type === 'return' ? 'İade Talebi' : 'Değişim Talebi'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedRequestData.status].color}`}>
                      {statusConfig[selectedRequestData.status].icon}
                      {statusConfig[selectedRequestData.status].label}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-4">Talep Geçmişi</h3>
                    <div className="space-y-4">
                      {selectedRequestData.timeline.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${idx === selectedRequestData.timeline.length - 1 ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            {idx < selectedRequestData.timeline.length - 1 && (
                              <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-slate-900 dark:text-white text-sm">{step.status}</p>
                            <p className="text-xs text-slate-500 mb-1">{step.date}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ürün */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-4">
                    <img 
                      src={selectedRequestData.item.image} 
                      alt={selectedRequestData.item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{selectedRequestData.item.name}</p>
                      <p className="text-sm text-slate-500">{selectedRequestData.item.price.toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800">
                  {selectedRequestData.status === 'pending' && (
                    <button className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl transition-all">
                      <XCircle size={18} />
                      Talebi İptal Et
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedReturn(null)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Şifre Değiştir Sayfası
  const renderSifreDegistirSection = () => {
    const getPasswordStrength = (password: string) => {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return strength;
    };

    const strength = getPasswordStrength(passwordData.newPassword);
    const strengthLabels = ['', 'Çok Zayıf', 'Zayıf', 'Orta', 'Güçlü', 'Çok Güçlü'];
    const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500'];

    const handlePasswordChange = () => {
      setPasswordError('');
      setPasswordSuccess(false);

      if (!passwordData.currentPassword) {
        setPasswordError('Mevcut şifrenizi girin');
        return;
      }
      if (passwordData.newPassword.length < 8) {
        setPasswordError('Yeni şifre en az 8 karakter olmalıdır');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Şifreler eşleşmiyor');
        return;
      }
      if (strength < 3) {
        setPasswordError('Şifreniz daha güçlü olmalıdır');
        return;
      }

      // Başarılı simulasüyon
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 sm:space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Şifre Değiştir</h1>
            <p className="text-sm text-slate-500">Hesap güvenliğinizi yönetin</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-4 sm:p-8">
          <div className="max-w-md mx-auto space-y-6">
            {/* Güvenlik İkonu */}
            <div className="flex justify-center mb-4 sm:mb-8">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <KeyRound size={40} className="text-slate-500" />
              </div>
            </div>

            {/* Başarı Mesajı */}
            {passwordSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center gap-3"
              >
                <CheckCircle2 size={20} className="text-emerald-500" />
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Şifreniz başarıyla değiştirildi!</p>
              </motion.div>
            )}

            {/* Hata Mesajı */}
            {passwordError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-3"
              >
                <AlertCircle size={20} className="text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{passwordError}</p>
              </motion.div>
            )}

            {/* Mevcut Şifre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Eski Şifre *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  placeholder="Mevcut şifrenizi girin"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Yeni Şifre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Yeni Şifre *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Yeni şifrenizi girin"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Şifre Güçlülük Göstergesi */}
              {passwordData.newPassword && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          level <= strength ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength <= 2 ? 'text-red-500' : strength <= 3 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    Şifre Gücü: {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Yeni Şifre Tekrar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Yeni Şifre Tekrar *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Yeni şifrenizi tekrar girin"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className={`w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword
                      ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
                      : passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword
                        ? 'border-emerald-300 dark:border-emerald-500/50 focus:ring-emerald-500/20 focus:border-emerald-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-slate-500/20 focus:border-slate-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                <p className="text-xs text-red-500 mt-2">Şifreler eşleşmiyor</p>
              )}
              {passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword && (
                <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                  <Check size={12} />
                  Şifreler eşleşiyor
                </p>
              )}
            </div>

            {/* Kurallar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Şifre Gereksinimleri</p>
              <ul className="space-y-2">
                {[
                  { check: passwordData.newPassword.length >= 8, text: 'En az 8 karakter' },
                  { check: /[A-Z]/.test(passwordData.newPassword), text: 'En az 1 büyük harf' },
                  { check: /[a-z]/.test(passwordData.newPassword), text: 'En az 1 küçük harf' },
                  { check: /[0-9]/.test(passwordData.newPassword), text: 'En az 1 rakam' },
                  { check: /[^A-Za-z0-9]/.test(passwordData.newPassword), text: 'En az 1 özel karakter' }
                ].map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    {rule.check ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                    <span className={rule.check ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      {rule.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kaydet Butonu */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handlePasswordChange}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Check size={18} />
              Kaydet
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Diğer Sayfalar (Şimdilik placeholder)
  const renderPlaceholderSection = (title: string, description: string, icon: ReactNode) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 sm:space-y-8"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={handleBack}
          className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 sm:p-16 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-slate-400">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Yakında</h3>
        <p className="text-slate-500 max-w-md mx-auto">Bu bölüm şu anda geliştirme aşamasındadır. Çok yakında hizmetinizde olacak!</p>
      </div>
    </motion.div>
  );

  // Aktif section'a göre içerik render et
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profil':
        return renderProfilSection();
      case 'hesap-hareketleri':
        return renderHesapHareketleriSection();
      case 'adreslerim':
        return renderAdreslerimSection();
      case 'fatura-bilgileri':
        return renderFaturaBilgilerimSection();
      case 'siparislerim':
        return renderSiparislerimSection();
      case 'kayitli-sepetler':
        return renderKayitliSepetlerimSection();
      case 'iade-degisim':
        return renderIadeDegisimSection();
      case 'sifre-degistir':
        return renderSifreDegistirSection();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-16 lg:py-24 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeSection ? (
            <div key="section">{renderActiveSection()}</div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 sm:space-y-12"
            >
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 sm:space-y-6"
              >
                <div className="relative inline-block">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white text-2xl sm:text-4xl font-display font-bold shadow-2xl shadow-blue-500/30">
                    {getInitials(user.name)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Check size={12} className="sm:hidden text-white" />
                    <Check size={16} className="hidden sm:block text-white" />
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h1 className="text-xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                    Hoş geldin, {user.name.split(' ')[0]}!
                  </h1>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </motion.div>

              {/* Menu Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
              >
                {PROFILE_MENU_ITEMS.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleMenuClick(item)}
                    className={`group relative p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-left overflow-hidden ${item.isLogout ? 'col-span-2 sm:col-span-1' : ''}`}
                  >
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center space-y-2 sm:space-y-4">
                      <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${item.isLogout ? 'bg-red-50 dark:bg-red-900/20 text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}>
                        <div className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-7 sm:[&>svg]:h-7">
                          {item.icon}
                        </div>
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <h3 className={`font-bold text-xs sm:text-sm md:text-base transition-colors duration-300 ${item.isLogout ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                          {item.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors duration-300 hidden md:block">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-2 sm:gap-4"
              >
                {[
                  { label: 'Aktif Sipariş', value: '0', color: 'text-blue-600' },
                  { label: 'Toplam Harcama', value: '0 TL', color: 'text-emerald-600' },
                  { label: 'Puan', value: '150', color: 'text-amber-600' }
                ].map((stat, i) => (
                  <div key={i} className="p-3 sm:p-6 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <p className={`text-lg sm:text-2xl md:text-3xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5 sm:mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Promo Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
              >
                <div className="relative p-5 sm:p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl sm:rounded-[2rem] text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-display font-bold">Premium Üyelik</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">Ücretsiz kargo ve özel indirimlerden yararlanın.</p>
                    <button className="px-4 sm:px-6 py-2 bg-white text-blue-600 rounded-full text-xs font-bold hover:bg-blue-50 transition-all">
                      Şimdi Katıl
                    </button>
                  </div>
                </div>
                
                <div className="relative p-5 sm:p-8 bg-slate-900 dark:bg-slate-800 rounded-2xl sm:rounded-[2rem] text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-display font-bold">Yardım Merkezi</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">Sorularınız için destek ekibimiz burada.</p>
                    <button className="px-4 sm:px-6 py-2 bg-slate-700 text-white rounded-full text-xs font-bold hover:bg-slate-600 transition-all border border-white/10">
                      Destek Al
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
