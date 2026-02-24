import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, ChevronRight, Smartphone, MapPin, Lock, Tag, CheckCircle2, XCircle, FileText, Building2 } from 'lucide-react';
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
    if (!city) return 0;
    const normalizedCity = city.toLowerCase().trim();
    // 1500 TL üzeri siparişlerde kargo ücretsiz
    if (total >= 1500) return 0;
    return SHIPPING_COSTS[normalizedCity] ?? SHIPPING_COSTS['default'];
  }, [city, total]);

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
  const finalTotal = total - couponDiscount + shippingCost;

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
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Form Alanı */}
        <div className="flex-1 w-full space-y-12">
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-[0.2em] mb-12">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-300'}`}>1</span>
              Teslimat
            </div>
            <div className="h-px w-12 bg-slate-100 dark:bg-slate-800" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-300'}`}>2</span>
              Ödeme
            </div>
            <div className="h-px w-12 bg-slate-100 dark:bg-slate-800" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-300'}`}>3</span>
              Onay
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Teslimat Bilgileri</h2>
                  <p className="text-slate-500">Siparişinizin size ulaşması için adres bilgilerinizi girin.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ad</label>
                    <input type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Soyad</label>
                    <input type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Teslimat Adresi</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
                    <textarea rows={4} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none" placeholder="Mahalle, sokak, bina no, daire..."></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Şehir</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" 
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
                    <input type="tel" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="05XX XXX XX XX" />
                  </div>
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
                    placeholder="Kurye için özel talimatlar, hediye paketi isteği vb..."
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-400 ml-1">{orderNote.length}/500 karakter</p>
                </div>

                <button onClick={() => setStep(2)} className="btn-primary w-full py-5 shadow-blue-500/40">Ödemeye Geç</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Ödeme Yöntemi</h2>
                  <p className="text-slate-500">Güvenli ödeme altyapımız ile işleminizi tamamlayın.</p>
                </div>

                {/* Interactive Card Visual */}
                <div className="relative w-full max-w-[400px] h-[240px] mx-auto perspective-1000 group">
                  <motion.div 
                    className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2rem] p-8 text-white shadow-2xl border border-white/10 flex flex-col justify-between overflow-hidden relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-inner" />
                      <CreditCard size={32} className="opacity-50" />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      <p className="text-2xl font-mono tracking-[0.2em] break-all">
                        {cardInfo.number || '**** **** **** ****'}
                      </p>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[8px] uppercase tracking-widest opacity-50">Kart Sahibi</p>
                          <p className="text-sm font-bold uppercase tracking-widest truncate max-w-[200px]">
                            {cardInfo.name || 'AD SOYAD'}
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[8px] uppercase tracking-widest opacity-50">Son Kullanma</p>
                          <p className="text-sm font-bold font-mono">
                            {cardInfo.expiry || 'MM/YY'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Kart Üzerindeki İsim</label>
                    <input 
                      type="text" 
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" 
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
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white font-mono" 
                      placeholder="0000 0000 0000 0000" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Son Kullanma</label>
                      <input 
                        type="text" 
                        maxLength={5}
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white font-mono" 
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
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white font-mono" 
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
                        className="p-6 rounded-3xl border-2 flex items-center gap-4"
                        style={{ 
                          borderColor: detectedBank.color,
                          backgroundColor: `${detectedBank.color}10`
                        }}
                      >
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
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

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 py-5">Geri Dön</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-[2] py-5 shadow-blue-500/40 flex items-center justify-center gap-3">
                    <Lock size={18} /> Siparişi Tamamla
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center py-20 space-y-8"
              >
                <div className="w-32 h-32 bg-green-500/10 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                  <ShieldCheck size={64} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-display font-bold text-slate-900 dark:text-white">Siparişiniz Alındı!</h2>
                  <p className="text-xl text-slate-500 max-w-md mx-auto">Sipariş numaranız: <span className="font-bold text-blue-600">#GT-982341</span>. Onay e-postası adresinize gönderildi.</p>
                </div>
                <div className="pt-8">
                  <button onClick={onComplete} className="btn-primary px-12 py-5">Alışverişe Devam Et</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sipariş Özeti */}
        <div className="w-full lg:w-[400px] lg:sticky lg:top-32">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-500/5 space-y-8">
            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Sipariş Özeti</h3>
            
            <div className="space-y-6 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.quantity} Adet</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
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
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <div>
                      <p className="text-sm font-bold text-green-700 dark:text-green-300">{appliedCoupon}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">{COUPONS[appliedCoupon]?.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="p-2 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-xl transition-colors"
                  >
                    <XCircle size={18} className="text-green-600" />
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
                    className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="px-6 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors"
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
              
              {/* Kargo */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Kargo</span>
                {shippingCost === 0 ? (
                  <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Ücretsiz</span>
                ) : (
                  <span className="font-bold text-slate-900 dark:text-white">{shippingCost.toFixed(2)} TL</span>
                )}
              </div>
              
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
