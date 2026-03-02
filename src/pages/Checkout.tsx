import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, ChevronRight, Smartphone, MapPin, Lock, Tag, CheckCircle2, XCircle, FileText, Building2, Gift, Store, Banknote, Receipt, Package } from 'lucide-react';
import { CartItem } from '../types';

// Kupon kodları
const COUPONS: Record<string, { discount: number; type: 'percent' | 'fixed'; minTotal: number; description: string }> = {
  'HOSGELDIN10': { discount: 10, type: 'percent', minTotal: 0, description: '%10 Hoş Geldin İndirimi' },
  'YAZ2024': { discount: 15, type: 'percent', minTotal: 500, description: '%15 Yaz Kampanyası (Min 500 TL)' },
  'UCRETSIZ50': { discount: 50, type: 'fixed', minTotal: 200, description: '50 TL İndirim (Min 200 TL)' },
  'SUPER100': { discount: 100, type: 'fixed', minTotal: 1000, description: '100 TL İndirim (Min 1000 TL)' },
  'VIP20': { discount: 20, type: 'percent', minTotal: 2000, description: '%20 VIP İndirimi (Min 2000 TL)' },
};

// Kargo ücretleri (şehirlere göre)
const SHIPPING_COSTS: Record<string, number> = {
  'istanbul': 0,
  'ankara': 0,
  'izmir': 0,
  'antalya': 0,
  'nevşehir': 0,
  'bursa': 19.99,
  'adana': 24.99,
  'konya': 24.99,
  'gaziantep': 29.99,
  'kayseri': 24.99,
  // Varsayılan (diğer şehirler)
  'default': 34.99,
};

// Banka BIN numaraları (ilk 6 hane)
const BANK_BINS: Record<string, { name: string; logo: string; color: string; installments: number[] }> = {
  '454360': { name: 'İş Bankası', logo: '🏦', color: '#1D4ED8', installments: [2, 3, 6, 9, 12] },
  '540667': { name: 'Yapı Kredi', logo: '🔵', color: '#00447C', installments: [2, 3, 6, 9] },
  '492130': { name: 'Garanti BBVA', logo: '🟢', color: '#00854A', installments: [2, 3, 6, 9, 12] },
  '589004': { name: 'Vakıfbank', logo: '🟡', color: '#FFC107', installments: [2, 3, 6] },
  '406617': { name: 'Ziraat Bankası', logo: '🌿', color: '#16A34A', installments: [2, 3, 6, 9, 12] },
  '557829': { name: 'QNB Finansbank', logo: '🟣', color: '#7C3AED', installments: [2, 3, 6, 9] },
  '552096': { name: 'Akbank', logo: '🔴', color: '#DC2626', installments: [2, 3, 6, 9, 12] },
  '521332': { name: 'TEB', logo: '🟤', color: '#92400E', installments: [2, 3, 6] },
  '676700': { name: 'Halkbank', logo: '🔷', color: '#0284C7', installments: [2, 3, 6, 9] },
  '604256': { name: 'Denizbank', logo: '🌊', color: '#0369A1', installments: [2, 3, 6] },
};

// Mağazalar
const STORES = [
  { id: 'antalya', name: 'Antalya Mağazası', address: 'Konyaaltı Cad. No:123, Antalya', hours: '10:00 - 22:00' },
  { id: 'nevsehir', name: 'Nevşehir Mağazası', address: 'Göreme Yolu No:45, Nevşehir', hours: '09:00 - 21:00' },
];

// Ekstra ücretler
const EXTRA_FEES = {
  cashOnDelivery: 14.99, // Kapıda ödeme ücreti
  giftWrap: 29.99, // Hediye paketi ücreti
};

interface CheckoutProps {
  cart: CartItem[];
  total: number;
  onComplete: () => void;
}

export default function Checkout({ cart, total, onComplete }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  // Yeni state'ler
  const [city, setCity] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState('');
  const [selectedInstallment, setSelectedInstallment] = useState(1);
  
  // Yeni özellik state'leri
  const [deliveryType, setDeliveryType] = useState<'address' | 'store'>('address');
  const [selectedStore, setSelectedStore] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [invoiceType, setInvoiceType] = useState<'individual' | 'corporate'>('individual');
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    taxOffice: '',
    taxNumber: ''
  });

  // Banka tanıma
  const detectedBank = useMemo(() => {
    const cleanNumber = cardInfo.number.replace(/\s/g, '');
    if (cleanNumber.length >= 6) {
      const bin = cleanNumber.substring(0, 6);
      return BANK_BINS[bin] || null;
    }
    return null;
  }, [cardInfo.number]);

  // Kargo ücreti hesaplama
  const shippingCost = useMemo(() => {
    // Mağazadan teslim al seçiliyse kargo ücretsiz
    if (deliveryType === 'store') return 0;
    if (!city) return 0;
    const normalizedCity = city.toLowerCase().trim();
    // 1500 TL üzeri siparişlerde kargo ücretsiz
    if (total >= 1500) return 0;
    return SHIPPING_COSTS[normalizedCity] ?? SHIPPING_COSTS['default'];
  }, [city, total, deliveryType]);

  // Kapıda ödeme ücreti
  const cashOnDeliveryFee = paymentMethod === 'cash' ? EXTRA_FEES.cashOnDelivery : 0;
  
  // Hediye paketi ücreti
  const giftWrapFee = giftWrap ? EXTRA_FEES.giftWrap : 0;

  // Kupon indirimi hesaplama
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const coupon = COUPONS[appliedCoupon];
    if (!coupon) return 0;
    if (coupon.type === 'percent') {
      return (total * coupon.discount) / 100;
    }
    return coupon.discount;
  }, [appliedCoupon, total]);

  // Taksitli fiyat hesaplama
  const getInstallmentPrice = (months: number) => {
    const finalTotal = total - couponDiscount + shippingCost;
    // Taksit sayısına göre hafif bir komisyon
    const commission = months > 6 ? 1.02 : months > 3 ? 1.01 : 1;
    return (finalTotal * commission) / months;
  };

  // Kupon uygula
  const applyCoupon = () => {
    const upperCode = couponCode.toUpperCase().trim();
    const coupon = COUPONS[upperCode];
    
    if (!coupon) {
      setCouponError('Geçersiz kupon kodu');
      setAppliedCoupon(null);
      return;
    }
    
    if (total < coupon.minTotal) {
      setCouponError(`Bu kupon için minimum sepet tutarı ${coupon.minTotal} TL olmalıdır`);
      setAppliedCoupon(null);
      return;
    }
    
    setAppliedCoupon(upperCode);
    setCouponError(null);
  };

  // Kuponu kaldır
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  // Final toplam
  const finalTotal = total - couponDiscount + shippingCost + cashOnDeliveryFee + giftWrapFee;

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return v;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-16 lg:py-24">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Form Alanı */}
        <div className="flex-1 w-full space-y-8 sm:space-y-12">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-6 sm:mb-12">
            <div className={`flex items-center gap-1 sm:gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-300'}`}>
              <span className={`w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-300'}`}>1</span>
              <span className="hidden xs:inline">Teslimat</span>
            </div>
            <div className="h-px w-4 sm:w-12 bg-slate-100 dark:bg-slate-800" />
            <div className={`flex items-center gap-1 sm:gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-300'}`}>
              <span className={`w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-300'}`}>2</span>
              <span className="hidden xs:inline">Ödeme</span>
            </div>
            <div className="h-px w-4 sm:w-12 bg-slate-100 dark:bg-slate-800" />
            <div className={`flex items-center gap-1 sm:gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-300'}`}>
              <span className={`w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-300'}`}>3</span>
              <span className="hidden xs:inline">Onay</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 sm:space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">Teslimat Bilgileri</h2>
                  <p className="text-sm sm:text-base text-slate-500">Siparişinizin size ulaşması için bilgilerinizi girin.</p>
                </div>

                {/* Teslimat Türü Seçimi */}
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Teslimat Türü</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setDeliveryType('address')}
                      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-start gap-3 sm:gap-4 ${
                        deliveryType === 'address'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                        deliveryType === 'address' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Truck size={20} className="sm:hidden" />
                        <Truck size={24} className="hidden sm:block" />
                      </div>
                      <div>
                        <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Adrese Teslim</p>
                        <p className="text-xs text-slate-500 mt-1">Siparişiniz adresinize teslim edilir</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setDeliveryType('store')}
                      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-start gap-3 sm:gap-4 ${
                        deliveryType === 'store'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                        deliveryType === 'store' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Store size={20} className="sm:hidden" />
                        <Store size={24} className="hidden sm:block" />
                      </div>
                      <div>
                        <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Mağazadan Teslim Al</p>
                        <p className="text-xs text-slate-500 mt-1">Kargo ücretsiz! Mağazadan kendiniz alın</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Mağaza Seçimi (Mağazadan teslim al seçiliyse) */}
                <AnimatePresence>
                  {deliveryType === 'store' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 sm:space-y-4 overflow-hidden"
                    >
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Mağaza Seçin</label>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        {STORES.map(store => (
                          <button
                            key={store.id}
                            onClick={() => setSelectedStore(store.id)}
                            className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left ${
                              selectedStore === store.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{store.name}</p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">{store.address}</p>
                                <p className="text-xs text-slate-400 mt-2">🕐 Çalışma Saatleri: {store.hours}</p>
                              </div>
                              {selectedStore === store.id && (
                                <CheckCircle2 size={20} className="sm:hidden text-green-500 shrink-0" />
                              )}
                              {selectedStore === store.id && (
                                <CheckCircle2 size={24} className="hidden sm:block text-green-500 shrink-0" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Ad Soyad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ad</label>
                    <input type="text" className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm sm:text-base" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Soyad</label>
                    <input type="text" className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm sm:text-base" placeholder="Doe" />
                  </div>
                </div>

                {/* Adres Bilgileri (Sadece adrese teslimde) */}
                <AnimatePresence>
                  {deliveryType === 'address' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 sm:space-y-6 overflow-hidden"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Teslimat Adresi</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 sm:left-4 top-3 sm:top-4 text-slate-400" size={18} />
                          <textarea rows={4} className="w-full p-3 sm:p-4 pl-10 sm:pl-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none text-sm sm:text-base" placeholder="Mahalle, sokak, bina no, daire..."></textarea>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Şehir</label>
                          <input 
                            type="text" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm sm:text-base" 
                            placeholder="İstanbul" 
                          />
                          {city && (
                            <p className="text-xs text-slate-500 ml-1">
                              {shippingCost === 0 
                                ? total >= 1500 
                                  ? '🎉 1500 TL üzeri siparişlerde kargo ücretsiz!' 
                                  : '✅ Bu şehre kargo ücretsiz'
                                : `📦 Kargo ücreti: ${shippingCost.toFixed(2)} TL`}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Telefon</label>
                          <input type="tel" className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm sm:text-base" placeholder="05XX XXX XX XX" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Fatura Türü Seçimi */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                    <Receipt size={14} />
                    Fatura Türü
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setInvoiceType('individual')}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        invoiceType === 'individual'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-slate-900 dark:text-white">Bireysel</p>
                      <p className="text-xs text-slate-500">Kişisel fatura</p>
                    </button>
                    <button
                      onClick={() => setInvoiceType('corporate')}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        invoiceType === 'corporate'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-slate-900 dark:text-white">Kurumsal</p>
                      <p className="text-xs text-slate-500">Şirket faturası</p>
                    </button>
                  </div>
                </div>

                {/* Kurumsal Fatura Bilgileri */}
                <AnimatePresence>
                  {invoiceType === 'corporate' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Şirket Adı</label>
                        <input 
                          type="text"
                          value={companyInfo.name}
                          onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                          className="w-full p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm sm:text-base" 
                          placeholder="Örnek Teknoloji A.Ş." 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Vergi Dairesi</label>
                          <input 
                            type="text"
                            value={companyInfo.taxOffice}
                            onChange={(e) => setCompanyInfo({...companyInfo, taxOffice: e.target.value})}
                            className="w-full p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm sm:text-base" 
                            placeholder="Kadıköy" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Vergi Numarası</label>
                          <input 
                            type="text"
                            value={companyInfo.taxNumber}
                            onChange={(e) => setCompanyInfo({...companyInfo, taxNumber: e.target.value})}
                            className="w-full p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm sm:text-base" 
                            placeholder="1234567890" 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hediye Paketi Seçeneği */}
                <div className="space-y-4">
                  <button
                    onClick={() => setGiftWrap(!giftWrap)}
                    className={`w-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-start gap-3 sm:gap-4 ${
                      giftWrap
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                      giftWrap ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Gift size={20} className="sm:hidden" /><Gift size={24} className="hidden sm:block" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">Hediye Paketi</p>
                          <p className="text-xs text-slate-500 mt-1">Özel hediye paketi ve kurdele ile gönderilsin</p>
                        </div>
                        <span className="text-sm font-bold text-pink-600">+{EXTRA_FEES.giftWrap} TL</span>
                      </div>
                    </div>
                  </button>

                  {/* Hediye Notu */}
                  <AnimatePresence>
                    {giftWrap && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <textarea 
                          rows={2}
                          value={giftNote}
                          onChange={(e) => setGiftNote(e.target.value)}
                          className="w-full p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-slate-900 dark:text-white resize-none" 
                          placeholder="Hediye kartına yazılacak not (opsiyonel)..."
                          maxLength={200}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sipariş Notu */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                    <FileText size={14} />
                    Sipariş Notu (Opsiyonel)
                  </label>
                  <textarea 
                    rows={3} 
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none" 
                    placeholder="Kurye için özel talimatlar vb..."
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-400 ml-1">{orderNote.length}/500 karakter</p>
                </div>

                <button onClick={() => setStep(2)} className="btn-primary w-full py-4 sm:py-5 shadow-blue-500/40">Ödemeye Geç</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 sm:space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white">Ödeme Yöntemi</h2>
                  <p className="text-sm sm:text-base text-slate-500">Güvenli ödeme altyapımız ile işleminizi tamamlayın.</p>
                </div>

                {/* Ödeme Yöntemi Seçimi */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ödeme Tercihi</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-start gap-3 sm:gap-4 ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                        paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <CreditCard size={20} className="sm:hidden" /><CreditCard size={24} className="hidden sm:block" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Kredi / Banka Kartı</p>
                        <p className="text-xs text-slate-500 mt-1">Taksit imkanı ile ödeyin</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-start gap-3 sm:gap-4 ${
                        paymentMethod === 'cash'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                        paymentMethod === 'cash' ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Banknote size={20} className="sm:hidden" /><Banknote size={24} className="hidden sm:block" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Kapıda Ödeme</p>
                        <p className="text-xs text-slate-500 mt-1">Nakit veya kart ile kapıda +{EXTRA_FEES.cashOnDelivery} TL</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Kapıda Ödeme Bilgisi */}
                <AnimatePresence>
                  {paymentMethod === 'cash' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-green-50 dark:bg-green-900/20 border-2 border-green-500 space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <Banknote size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">Kapıda Ödeme Seçildi</p>
                            <p className="text-xs text-slate-500">Siparişiniz teslim anında ödeme yapılacaktır</p>
                          </div>
                        </div>
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Nakit veya kredi kartı ile ödeme yapabilirsiniz</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>POS cihazı ile güvenli işlem</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Package size={16} className="text-green-500" />
                            <span>Ürünü kontrol ettikten sonra ödeme</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                            +{EXTRA_FEES.cashOnDelivery} TL kapıda ödeme hizmet bedeli eklenecektir
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Kredi Kartı Formu */}
                <AnimatePresence>
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-10 overflow-hidden"
                    >
                {/* Interactive Card Visual */}
                <div className="relative w-full max-w-[320px] sm:max-w-[400px] h-[180px] sm:h-[240px] mx-auto perspective-1000 group">
                  <motion.div 
                    className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 text-white shadow-2xl border border-white/10 flex flex-col justify-between overflow-hidden relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="w-10 h-8 sm:w-12 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-inner" />
                      <CreditCard size={24} className="opacity-50 sm:hidden" /><CreditCard size={32} className="opacity-50 hidden sm:block" />
                    </div>
                    
                    <div className="space-y-3 sm:space-y-6 relative z-10">
                      <p className="text-lg sm:text-2xl font-mono tracking-[0.15em] sm:tracking-[0.2em] break-all">
                        {cardInfo.number || '**** **** **** ****'}
                      </p>
                      <div className="flex justify-between items-end">
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-[7px] sm:text-[8px] uppercase tracking-widest opacity-50">Kart Sahibi</p>
                          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest truncate max-w-[140px] sm:max-w-[200px]">
                            {cardInfo.name || 'AD SOYAD'}
                          </p>
                        </div>
                        <div className="space-y-0.5 sm:space-y-1 text-right">
                          <p className="text-[7px] sm:text-[8px] uppercase tracking-widest opacity-50">Son Kullanma</p>
                          <p className="text-xs sm:text-sm font-bold font-mono">
                            {cardInfo.expiry || 'MM/YY'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Kart Üzerindeki İsim</label>
                    <input 
                      type="text" 
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                      className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm sm:text-base" 
                      placeholder="JOHN DOE" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Kart Numarası</label>
                    <input 
                      type="text" 
                      maxLength={19}
                      value={cardInfo.number}
                      onChange={(e) => setCardInfo({...cardInfo, number: formatCardNumber(e.target.value)})}
                      className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white font-mono text-sm sm:text-base" 
                      placeholder="0000 0000 0000 0000" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Son Kullanma</label>
                      <input 
                        type="text" 
                        maxLength={5}
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                        className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white font-mono text-sm sm:text-base" 
                        placeholder="MM/YY" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">CVV</label>
                      <input 
                        type="password" 
                        maxLength={3}
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                        className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white font-mono text-sm sm:text-base" 
                        placeholder="***" 
                      />
                    </div>
                  </div>
                </div>

                {/* Banka Tanıma ve Taksit Seçenekleri */}
                <AnimatePresence>
                  {detectedBank && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Tanınan Banka */}
                      <div 
                        className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 flex items-center gap-3 sm:gap-4"
                        style={{ 
                          borderColor: detectedBank.color,
                          backgroundColor: `${detectedBank.color}10`
                        }}
                      >
                        <div 
                          className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0"
                          style={{ backgroundColor: `${detectedBank.color}20` }}
                        >
                          {detectedBank.logo}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 size={16} style={{ color: detectedBank.color }} />
                            {detectedBank.name}
                          </p>
                          <p className="text-xs text-slate-500">Kartınız tanındı</p>
                        </div>
                        <CheckCircle2 size={24} style={{ color: detectedBank.color }} />
                      </div>

                      {/* Taksit Seçenekleri */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                          Taksit Seçenekleri
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {/* Tek Çekim */}
                          <button
                            onClick={() => setSelectedInstallment(1)}
                            className={`p-4 rounded-2xl border-2 transition-all text-left ${
                              selectedInstallment === 1 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Tek Çekim</p>
                            <p className="text-lg font-display font-bold text-blue-600">
                              {finalTotal.toLocaleString('tr-TR')} TL
                            </p>
                          </button>
                          
                          {/* Taksit Seçenekleri */}
                          {detectedBank.installments.map((months) => (
                            <button
                              key={months}
                              onClick={() => setSelectedInstallment(months)}
                              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                                selectedInstallment === months 
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{months} Taksit</p>
                              <p className="text-lg font-display font-bold text-blue-600">
                                {getInstallmentPrice(months).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                              </p>
                              <p className="text-[10px] text-slate-500">x {months} ay</p>
                            </button>
                          ))}
                        </div>
                        {selectedInstallment > 1 && (
                          <p className="text-xs text-slate-500 ml-1">
                            Toplam: {(getInstallmentPrice(selectedInstallment) * selectedInstallment).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                            {selectedInstallment > 6 && ' (komisyon dahil)'}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 sm:gap-4">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 py-4 sm:py-5 text-sm sm:text-base">Geri Dön</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-[2] py-4 sm:py-5 shadow-blue-500/40 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                    <Lock size={16} className="sm:hidden" /><Lock size={18} className="hidden sm:block" /> Siparişi Tamamla
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center py-10 sm:py-20 space-y-6 sm:space-y-8"
              >
                <div className="w-20 h-20 sm:w-32 sm:h-32 bg-green-500/10 text-green-500 rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 sm:mb-8 shadow-2xl shadow-green-500/20">
                  <ShieldCheck size={40} className="sm:hidden" /><ShieldCheck size={64} className="hidden sm:block" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">Siparişiniz Alındı!</h2>
                  <p className="text-base sm:text-xl text-slate-500 max-w-md mx-auto px-4">Sipariş numaranız: <span className="font-bold text-blue-600">#GT-982341</span>. Onay e-postası adresinize gönderildi.</p>
                </div>
                <div className="pt-4 sm:pt-8">
                  <button onClick={onComplete} className="btn-primary px-8 sm:px-12 py-4 sm:py-5 text-sm sm:text-base">Alışverişe Devam Et</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sipariş Özeti */}
        <div className="w-full lg:w-[400px] lg:sticky lg:top-32">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-500/5 space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">Sipariş Özeti</h3>
            
            <div className="space-y-4 sm:space-y-6 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 sm:gap-4 items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.quantity} Adet</p>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white shrink-0">
                    {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                  </p>
                </div>
              ))}
            </div>

            {/* Kupon Kodu */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Tag size={12} />
                İndirim Kodu
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl sm:rounded-2xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-300 truncate">{appliedCoupon}</p>
                      <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 truncate">{COUPONS[appliedCoupon]?.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="p-1.5 sm:p-2 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-lg sm:rounded-xl transition-colors shrink-0"
                  >
                    <XCircle size={16} className="text-green-600" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    placeholder="Kupon kodunuz"
                    className="flex-1 p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-xs sm:text-sm min-w-0"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="px-4 sm:px-6 bg-blue-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition-colors shrink-0"
                  >
                    Uygula
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-500 ml-1 flex items-center gap-1">
                  <XCircle size={12} />
                  {couponError}
                </p>
              )}
              <p className="text-[10px] text-slate-400 ml-1">
                Örnek kodlar: HOSGELDIN10, YAZ2024, UCRETSIZ50
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ara Toplam</span>
                <span className="font-bold text-slate-900 dark:text-white">{total.toLocaleString('tr-TR')} TL</span>
              </div>
              
              {/* Kupon İndirimi */}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">İndirim ({appliedCoupon})</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">-{couponDiscount.toLocaleString('tr-TR')} TL</span>
                </div>
              )}
              
              {/* Teslimat Türü */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  {deliveryType === 'store' ? <Store size={14} /> : <Truck size={14} />}
                  {deliveryType === 'store' ? 'Mağazadan Teslim' : 'Kargo'}
                </span>
                {shippingCost === 0 ? (
                  <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Ücretsiz</span>
                ) : (
                  <span className="font-bold text-slate-900 dark:text-white">{shippingCost.toFixed(2)} TL</span>
                )}
              </div>

              {/* Hediye Paketi */}
              {giftWrap && (
                <div className="flex justify-between text-sm">
                  <span className="text-pink-600 dark:text-pink-400 flex items-center gap-1">
                    <Gift size={14} />
                    Hediye Paketi
                  </span>
                  <span className="text-pink-600 dark:text-pink-400 font-bold">+{EXTRA_FEES.giftWrap.toFixed(2)} TL</span>
                </div>
              )}

              {/* Kapıda Ödeme Ücreti */}
              {paymentMethod === 'cash' && (
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <Banknote size={14} />
                    Kapıda Ödeme
                  </span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">+{EXTRA_FEES.cashOnDelivery.toFixed(2)} TL</span>
                </div>
              )}
              
              <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-lg font-display font-bold text-slate-900 dark:text-white">Toplam</span>
                <div className="text-right">
                  {couponDiscount > 0 && (
                    <p className="text-sm text-slate-400 line-through">{total.toLocaleString('tr-TR')} TL</p>
                  )}
                  <p className="text-3xl font-display font-bold text-blue-600">{finalTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">KDV Dahil</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <Truck size={24} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Tahmini Teslimat: <strong className="text-slate-900 dark:text-white">22-24 Şubat</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
