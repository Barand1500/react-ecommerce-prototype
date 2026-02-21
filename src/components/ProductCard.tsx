import { motion } from 'motion/react';
import { ShoppingBag, Eye, Star, Heart, BarChart2 } from 'lucide-react';
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
}

export default function ProductCard({ product, onAddToCart, onQuickView, onNavigate, onToggleFav, onToggleCompare, isFavorite, isComparing }: ProductCardProps) {
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.badge && (
          <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg ${
            product.badge === 'En Çok Satan' ? 'bg-orange-500 text-white' :
            product.badge === 'Trend' ? 'bg-purple-600 text-white' :
            'bg-blue-600 text-white'
          }`}>
            {product.badge}
          </div>
        )}
        {discount && (
          <div className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
            -%{discount} İndirim
          </div>
        )}
        {!product.inStock && (
          <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
            Tükendi
          </div>
        )}
      </div>
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-950">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        
        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(product);
            }}
            className={`p-2.5 backdrop-blur-md rounded-full transition-all ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`p-2.5 backdrop-blur-md rounded-full transition-all ${
              isComparing ? 'bg-orange-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-orange-500'
            }`}
          >
            <BarChart2 size={18} />
          </button>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={() => onQuickView(product)}
            className="flex-1 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg"
          >
            <Eye size={16} /> Hızlı Bakış
          </button>
          <button 
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold text-slate-400">{product.rating}</span>
          </div>
        </div>
        
        <h3 
          onClick={() => onNavigate(product)}
          className="text-base font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 cursor-pointer transition-colors line-clamp-1"
        >
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {product.price.toLocaleString('tr-TR')} <span className="text-xs font-normal text-slate-400">TL</span>
            </p>
            {product.oldPrice && (
              <p className="text-xs text-slate-400 line-through">
                {product.oldPrice.toLocaleString('tr-TR')} TL
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
