import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CheckCircle, ShieldCheck, Truck, RefreshCcw, Heart, BarChart2, Bell, X, Mail } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleFav: (p: Product) => void;
  onToggleCompare: (p: Product) => void;
  isFavorite: boolean;
  isComparing: boolean;
}

export default function ProductDetail({ product, onAddToCart, onToggleFav, onToggleCompare, isFavorite, isComparing }: ProductDetailProps) {
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isNotifySubmitted, setIsNotifySubmitted] = useState(false);
  
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail) {
      // Simüle edilmiş kayıt
      setIsNotifySubmitted(true);
      setTimeout(() => {
        setIsNotifyModalOpen(false);
        setIsNotifySubmitted(false);
        setNotifyEmail('');
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-16 mb-24">
        {/* Görsel */}
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 relative group"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
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
          </motion.div>
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
        </div>
      </div>

      {/* Teknik Özellikler Tablosu */}
      <section className="space-y-12">
        <h3 className="text-3xl font-display font-bold text-center">Teknik Özellikler</h3>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="flex justify-between p-8 bg-white dark:bg-slate-950">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">{key}</span>
              <span className="font-medium text-sm">{value}</span>
            </div>
          ))}
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
