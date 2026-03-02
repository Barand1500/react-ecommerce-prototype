import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye, Star, Heart, BarChart2, Bell, MapPin, BellRing, X } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: number | string;
  product: Product;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onNavigate: (p: Product) => void;
  onToggleFav: (p: Product) => void;
  onToggleCompare: (p: Product) => void;
  isFavorite: boolean;
  isComparing: boolean;
  otherStoreName?: string; // Başka mağazada ise hangi mağazada olduğu
  isOutOfStockEverywhere?: boolean; // Tüm mağazalarda stok yok
  priceAlarm?: { targetPrice: number } | null;
  onSetPriceAlarm?: (product: Product, targetPrice: number) => void;
  onRemovePriceAlarm?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart, onQuickView, onNavigate, onToggleFav, onToggleCompare, isFavorite, isComparing, otherStoreName, isOutOfStockEverywhere, priceAlarm, onSetPriceAlarm, onRemovePriceAlarm }: ProductCardProps) {
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState(Math.round(product.price * 0.9)); // Default: %10 indirim
  
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  // Border ve etiket durumu belirleme
  const hasSpecialBorder = otherStoreName || isOutOfStockEverywhere;
  const topLabelOffset = hasSpecialBorder ? 'top-12' : 'top-4';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1 ${
        isOutOfStockEverywhere 
          ? 'border-2 border-slate-400 dark:border-slate-600 opacity-75' 
          : otherStoreName 
            ? 'border-2 border-orange-400 dark:border-orange-500' 
            : 'border border-slate-200/50 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Diğer Mağaza Etiketi - Kargo Fırsatı */}
      {otherStoreName && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-1 sm:py-1.5 px-2 sm:px-3 text-[9px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5">
          <MapPin size={10} className="sm:w-3 sm:h-3" />
          <span className="truncate">{otherStoreName}'da mevcut</span>
        </div>
      )}

      {/* Stokta Yok Etiketi */}
      {isOutOfStockEverywhere && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-slate-500 text-white text-center py-1 sm:py-1.5 px-2 sm:px-3 text-[9px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5">
          Stokta Yok
        </div>
      )}

      {/* Badges */}
      <div className={`absolute left-2 sm:left-4 z-10 flex flex-col gap-1 sm:gap-2 ${topLabelOffset}`}>
        {product.badge && (
          <div className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg ${
            product.badge === 'En Çok Satan' ? 'bg-orange-500 text-white' :
            product.badge === 'Trend' ? 'bg-purple-600 text-white' :
            'bg-blue-600 text-white'
          }`}>
            {product.badge}
          </div>
        )}
        {discount && (
          <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
            -%{discount}
          </div>
        )}
        {/* Düşük Stok Uyarısı */}
        {product.inStock && product.stockCount && product.stockCount <= 10 && (
          <div className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg ${
            product.stockCount <= 3 
              ? 'bg-red-500 text-white animate-pulse' 
              : product.stockCount <= 5 
              ? 'bg-orange-500 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            {product.stockCount <= 3 ? `Son ${product.stockCount}!` : `Son ${product.stockCount}`}
          </div>
        )}
        {!product.inStock && (
          <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full">
            Tükendi
          </div>
        )}
      </div>
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-95 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        
        {/* Wishlist Button */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-x-0 sm:translate-x-4 sm:group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(product);
            }}
            className={`p-1.5 sm:p-2.5 backdrop-blur-md rounded-full transition-all ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart size={14} className="sm:w-[18px] sm:h-[18px]" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`p-1.5 sm:p-2.5 backdrop-blur-md rounded-full transition-all ${
              isComparing ? 'bg-orange-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-orange-500'
            }`}
          >
            <BarChart2 size={14} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          {/* Fiyat Alarm Butonu */}
          {onSetPriceAlarm && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (priceAlarm && onRemovePriceAlarm) {
                  onRemovePriceAlarm(product.id);
                } else {
                  setShowAlarmModal(true);
                }
              }}
              className={`p-1.5 sm:p-2.5 backdrop-blur-md rounded-full transition-all ${
                priceAlarm ? 'bg-green-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-green-500'
              }`}
              title={priceAlarm ? `Alarm: ${priceAlarm.targetPrice} TL (Kaldır)` : 'Fiyat alarmı kur'}
            >
              {priceAlarm ? <BellRing size={14} className="sm:w-[18px] sm:h-[18px]" /> : <Bell size={14} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-x-2 sm:inset-x-4 bottom-2 sm:bottom-4 flex gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={() => onQuickView(product)}
            className="flex-1 h-9 sm:h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-[10px] sm:text-xs hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg"
          >
            <Eye size={14} className="sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Hızlı Bakış</span>
          </button>
          {product.inStock ? (
            <button 
              onClick={() => onAddToCart(product)}
              className="w-9 h-9 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
            >
              <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          ) : (
            <button 
              onClick={() => onNavigate(product)}
              className="w-9 h-9 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg"
              title="Stok bildirimi al"
            >
              <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6">
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-blue-600">{product.brand}</span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Star size={8} className="sm:w-[10px] sm:h-[10px] text-yellow-400 fill-yellow-400" />
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400">{product.rating}</span>
          </div>
        </div>
        
        <h3 
          onClick={() => onNavigate(product)}
          className="text-xs sm:text-base font-bold mb-2 sm:mb-3 text-slate-800 dark:text-white group-hover:text-blue-600 cursor-pointer transition-colors line-clamp-2 sm:line-clamp-1 leading-tight"
        >
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm sm:text-lg font-display font-bold text-slate-800 dark:text-white">
              {product.price.toLocaleString('tr-TR')} <span className="text-[9px] sm:text-xs font-normal text-slate-400">TL</span>
            </p>
            {product.oldPrice && (
              <p className="text-[10px] sm:text-xs text-slate-400 line-through">
                {product.oldPrice.toLocaleString('tr-TR')} TL
              </p>
            )}
            {/* Fiyat Alarm Göstergesi */}
            {priceAlarm && (
              <p className="text-[8px] sm:text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1 mt-1">
                <BellRing size={8} className="sm:w-[10px] sm:h-[10px]" />
                {priceAlarm.targetPrice.toLocaleString('tr-TR')} TL
              </p>
            )}
          </div>
          <div className="hidden sm:flex gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
        </div>
      </div>

      {/* Fiyat Alarm Modalı */}
      <AnimatePresence>
        {showAlarmModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[1000]"
              onClick={() => setShowAlarmModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 z-[1001] sm:w-[90%] sm:max-w-md shadow-2xl max-h-[calc(100vh-1.5rem)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAlarmModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{product.name}</h4>
                  <p className="text-sm text-slate-500">Şu anki fiyat: <span className="font-bold text-blue-600">{product.price.toLocaleString('tr-TR')} TL</span></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                    Hedef Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    max={product.price - 1}
                    min={1}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Fiyat {targetPrice.toLocaleString('tr-TR')} TL'ye düşünce bildirim alacaksınız
                  </p>
                </div>
                
                {/* Hzılı Seçim Butonları */}
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => setTargetPrice(Math.round(product.price * (1 - percent / 100)))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        targetPrice === Math.round(product.price * (1 - percent / 100))
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      -%{percent}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    if (onSetPriceAlarm) {
                      onSetPriceAlarm(product, targetPrice);
                      setShowAlarmModal(false);
                    }
                  }}
                  disabled={targetPrice >= product.price}
                  className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Bell size={18} />
                  Fiyat Alarmı Kur
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
