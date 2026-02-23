import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CheckCircle, ShieldCheck, Truck, RefreshCcw, Heart, BarChart2, Bell, X, Mail, MapPin, Store, ChevronLeft, ChevronRight, ChevronDown, CreditCard, Calculator } from 'lucide-react';
import { Product } from '../types';
import { STORE_AVAILABILITY } from '../constants';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleFav: (p: Product) => void;
  onToggleCompare: (p: Product) => void;
  isFavorite: boolean;
  isComparing: boolean;
}

// Taksit Seçenekleri
const INSTALLMENT_OPTIONS = [
  { bank: 'Ziraat Bankası', logo: '🏦', rates: { 3: 0, 6: 1.49, 9: 1.79, 12: 1.99 } },
  { bank: 'Garanti BBVA', logo: '💳', rates: { 3: 0, 6: 1.39, 9: 1.69, 12: 1.89 } },
  { bank: 'İş Bankası', logo: '🏛️', rates: { 3: 0, 6: 1.59, 9: 1.89, 12: 2.09 } },
  { bank: 'Yapı Kredi', logo: '🔷', rates: { 3: 0, 6: 1.49, 9: 1.79, 12: 1.99 } },
  { bank: 'Akbank', logo: '🔴', rates: { 3: 0, 6: 1.45, 9: 1.75, 12: 1.95 } },
  { bank: 'QNB Finansbank', logo: '🟣', rates: { 3: 0, 6: 1.55, 9: 1.85, 12: 2.05 } },
];

export default function ProductDetail({ product, onAddToCart, onToggleFav, onToggleCompare, isFavorite, isComparing }: ProductDetailProps) {
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isNotifySubmitted, setIsNotifySubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInstallments, setShowInstallments] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(6);
  const [expandedBank, setExpandedBank] = useState<string | null>(null);
  
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  // Ürün için görseller oluştur (picsum.photos ile farklı görüntüler)
  const productImages = product.images || [
    product.image,
    product.image.replace(/seed\/[^/]+/, `seed/${product.id}_angle1`),
    product.image.replace(/seed\/[^/]+/, `seed/${product.id}_angle2`),
    product.image.replace(/seed\/[^/]+/, `seed/${product.id}_detail`),
  ];

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail) {
      setIsNotifySubmitted(true);
      setTimeout(() => {
        setIsNotifyModalOpen(false);
        setIsNotifySubmitted(false);
        setNotifyEmail('');
      }, 2000);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Taksit hesaplama
  const calculateInstallment = (months: number, rate: number) => {
    const totalWithInterest = product.price * (1 + rate / 100);
    return Math.ceil(totalWithInterest / months);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-16 mb-24">
        {/* Görsel Galerisi */}
        <div className="flex-1">
          <div className="space-y-4">
            {/* Ana Görsel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 relative group"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={productImages[currentImageIndex]} 
                  alt={`${product.name} - Görsel ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {product.badge && (
                <div className="absolute top-8 left-8 px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-xl">
                  {product.badge}
                </div>
              )}
              
              <button 
                onClick={() => onToggleFav(product)}
                className={`absolute top-8 right-8 p-4 rounded-full shadow-xl transition-all ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-400 hover:text-red-500'
                }`}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-800"
                  >
                    <ChevronLeft size={24} className="text-slate-700 dark:text-slate-300" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-800"
                  >
                    <ChevronRight size={24} className="text-slate-700 dark:text-slate-300" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === index 
                      ? 'border-blue-600 ring-2 ring-blue-600/30' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bilgiler */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.4em] text-blue-600 mb-4 block">{product.brand}</span>
            <h1 className="text-5xl font-display font-bold mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <p className="text-4xl font-display font-bold text-blue-600">
                  {product.price.toLocaleString('tr-TR')} TL
                </p>
                {product.oldPrice && (
                  <p className="text-xl text-slate-400 line-through">
                    {product.oldPrice.toLocaleString('tr-TR')} TL
                  </p>
                )}
              </div>
              {discount && (
                <div className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-2xl">
                  %{discount} İNDİRİM
                </div>
              )}
            </div>
          </div>

          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Öne Çıkan Özellikler</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
            {product.inStock ? (
              <button 
                onClick={() => onAddToCart(product)}
                className="btn-primary flex-1 flex items-center justify-center gap-3"
              >
                <ShoppingBag size={20} /> Sepete Ekle
              </button>
            ) : (
              <button 
                onClick={() => setIsNotifyModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40"
              >
                <Bell size={20} /> Gelince Haber Ver
              </button>
            )}
            <button 
              onClick={() => onToggleCompare(product)}
              className={`btn-outline flex-1 flex items-center justify-center gap-3 ${isComparing ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-600' : ''}`}
            >
              <BarChart2 size={20} /> {isComparing ? 'Listeden Kaldır' : 'Karşılaştır'}
            </button>
          </div>
          
          {/* Stok Durumu Göstergesi */}
          {!product.inStock && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Bu ürün şu anda stokta yok</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center space-y-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <Truck size={24} className="mx-auto text-blue-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Ücretsiz Kargo</p>
            </div>
            <div className="text-center space-y-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <ShieldCheck size={24} className="mx-auto text-blue-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest">2 Yıl Garanti</p>
            </div>
            <div className="text-center space-y-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <RefreshCcw size={24} className="mx-auto text-blue-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest">14 Gün İade</p>
            </div>
          </div>

          {/* Mağaza Durumu - Kompakt */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
            <Store size={18} className="text-blue-600 flex-shrink-0" />
            <div className="flex-1 flex items-center gap-4 flex-wrap">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mağaza:</span>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-300">Antalya</span>
                {STORE_AVAILABILITY[product.id]?.antalya ? (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-600 text-[10px] font-bold rounded-full">✓ Mevcut</span>
                ) : (
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-500 text-[10px] font-bold rounded-full">Yok</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-300">Nevşehir</span>
                {STORE_AVAILABILITY[product.id]?.nevsehir ? (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-600 text-[10px] font-bold rounded-full">✓ Mevcut</span>
                ) : (
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-500 text-[10px] font-bold rounded-full">Yok</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teknik Özellikler Tablosu */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-2 block">Detaylı Bilgi</span>
          <h3 className="text-3xl font-display font-bold">Teknik Özellikler</h3>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {Object.entries(product.specs).map(([key, value], index) => (
              <div 
                key={key} 
                className={`flex items-center justify-between p-5 ${
                  index !== Object.entries(product.specs).length - 1 
                    ? 'border-b border-slate-100 dark:border-slate-800' 
                    : ''
                } hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="font-medium text-slate-600 dark:text-slate-400 text-sm">{key}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Taksit Hesaplayıcı - Accordion */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Calculator size={20} className="text-green-600" />
            <h4 className="font-bold text-slate-900 dark:text-white">Taksit Seçenekleri</h4>
          </div>

          <div className="space-y-2">
            {INSTALLMENT_OPTIONS.map((option) => {
              const isExpanded = expandedBank === option.bank;
              
              return (
                <div 
                  key={option.bank}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setExpandedBank(isExpanded ? null : option.bank)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.logo}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{option.bank}</span>
                      {option.rates[3] === 0 && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-bold rounded-full">
                          3 TAKSİT FAİZSİZ
                        </span>
                      )}
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                            {[3, 6, 9, 12].map((months) => {
                              const rate = option.rates[months as keyof typeof option.rates];
                              const monthlyPayment = calculateInstallment(months, rate);
                              const totalPrice = monthlyPayment * months;
                              const interestAmount = totalPrice - product.price;
                              const isSelected = selectedInstallment === months;
                              
                              return (
                                <button 
                                  key={months}
                                  onClick={() => setSelectedInstallment(months)}
                                  className={`rounded-xl p-4 border-2 transition-all text-left ${
                                    isSelected
                                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20' 
                                      : rate === 0 
                                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:border-green-400' 
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                  }`}
                                >
                                  <div className="text-center mb-3">
                                    <span className={`text-2xl font-black ${isSelected ? 'text-blue-600' : rate === 0 ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
                                      {months}x
                                    </span>
                                    {rate === 0 && !isSelected && (
                                      <span className="block text-[10px] font-bold text-green-600 mt-1">FAİZSİZ</span>
                                    )}
                                    {isSelected && (
                                      <span className="block text-[10px] font-bold text-blue-600 mt-1">SEÇİLİ ✓</span>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Aylık:</span>
                                      <span className={`font-bold ${isSelected ? 'text-blue-600' : 'text-green-600'}`}>{monthlyPayment.toLocaleString('tr-TR')} TL</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Toplam:</span>
                                      <span className="font-medium text-slate-700 dark:text-slate-300">{totalPrice.toLocaleString('tr-TR')} TL</span>
                                    </div>
                                    {rate > 0 && (
                                      <>
                                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                                        <div className="flex justify-between text-xs">
                                          <span className="text-slate-400">Faiz:</span>
                                          <span className="text-orange-500 font-medium">%{rate}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                          <span className="text-slate-400">Fark:</span>
                                          <span className="text-orange-500 font-medium">+{interestAmount.toLocaleString('tr-TR')} TL</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          
                          <p className="text-[10px] text-slate-400 mt-4 text-center">
                            * {option.bank} kartınızla bu taksit seçeneklerinden yararlanabilirsiniz.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 mt-4 text-center">
            * Taksit oranları güncel piyasa koşullarına göre değişiklik gösterebilir.
          </p>
        </div>
      </section>

      {/* Stok Bildirimi Modal */}
      <AnimatePresence>
        {isNotifyModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifyModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 z-[310] shadow-2xl rounded-3xl overflow-hidden"
            >
              {!isNotifySubmitted ? (
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                        <Bell size={24} className="text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Stok Bildirimi</h3>
                        <p className="text-sm text-slate-500">Ürün stoğa girince haber verelim</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsNotifyModalOpen(false)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <X size={20} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{product.brand}</p>
                      <p className="font-bold text-slate-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-sm font-bold text-slate-500">{product.price.toLocaleString('tr-TR')} TL</p>
                    </div>
                  </div>

                  <form onSubmit={handleNotifySubmit} className="space-y-4">
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="E-posta adresinizi girin"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white placeholder-slate-400"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
                    >
                      Beni Bilgilendir
                    </button>
                  </form>

                  <p className="text-xs text-slate-400 text-center">
                    Ürün stoğa girdiğinde size e-posta ile bildirim göndereceğiz.
                  </p>
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle size={40} className="text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Kaydınız Alındı!</h3>
                  <p className="text-slate-500">
                    <span className="font-bold text-slate-900 dark:text-white">{product.name}</span> stoğa girdiğinde size haber vereceğiz.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
