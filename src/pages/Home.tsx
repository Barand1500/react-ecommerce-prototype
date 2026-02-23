import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, Smartphone, Laptop, Headphones, Watch, MousePointer2, Check, X } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';

interface HomeProps {
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onNavigateToProduct: (p: Product) => void;
  onToggleFav: (p: Product) => void;
  onToggleCompare: (p: Product) => void;
  favorites: Product[];
  comparisonList: Product[];
}

const CATEGORY_ICONS = {
  'Telefon': <Smartphone size={18} />,
  'Bilgisayar': <Laptop size={18} />,
  'Ses': <Headphones size={18} />,
  'Giyilebilir': <Watch size={18} />,
  'Aksesuar': <MousePointer2 size={18} />
};

const ITEMS_PER_PAGE = 8;

export default function Home({ onAddToCart, onQuickView, onNavigateToProduct, onToggleFav, onToggleCompare, favorites, comparisonList }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [priceRange, setPriceRange] = useState(150000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Önerilen');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const brands = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.brand))), []);
  const colors = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.color))), []);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setCurrentPage(1);
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory;
      const matchesPrice = p.price <= priceRange;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(p.color);
      const matchesStock = !onlyInStock || p.inStock;
      return matchesCategory && matchesPrice && matchesBrand && matchesColor && matchesStock;
    });

    if (sortBy === 'Fiyat (Artan)') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Fiyat (Azalan)') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'Puan (Azalan)') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [selectedCategory, priceRange, selectedBrands, selectedColors, onlyInStock, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="space-y-0 pb-20">
      <HeroSlider />

      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Filter size={16} /> Filtrele
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <div className="flex items-center gap-2">
              {['Kategoriler', 'Fiyat', 'Renk', 'Puan', 'Stok'].map(item => (
                <button 
                  key={item}
                  onClick={() => setIsFilterOpen(true)}
                  className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 transition-all whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold transition-all text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Sırala: {sortBy} <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-[999]" onClick={() => setIsSortOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[1000]"
                    >
                      {['Önerilen', 'Fiyat (Artan)', 'Fiyat (Azalan)', 'Puan (Azalan)'].map(opt => (
                        <button 
                          key={opt}
                          onClick={() => {
                            setSortBy(opt);
                            setCurrentPage(1);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all ${sortBy === opt ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-slate-900 dark:text-white'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col gap-12">
          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                {selectedCategory} <span className="text-slate-300 dark:text-slate-700 ml-2 text-xl font-normal">({filteredProducts.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  onNavigate={onNavigateToProduct}
                  onToggleFav={onToggleFav}
                  onToggleCompare={onToggleCompare}
                  isFavorite={favorites.some(p => p.id === product.id)}
                  isComparing={comparisonList.some(p => p.id === product.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${
                      currentPage === i + 1 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:border-blue-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            
            {filteredProducts.length === 0 && (
              <div className="py-32 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter size={32} className="text-slate-300" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Sonuç Bulunamadı</h4>
                <p className="text-slate-500">Filtrelerinizi değiştirerek tekrar deneyebilirsiniz.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('Tümü');
                    setPriceRange(150000);
                    setSelectedBrands([]);
                    setSelectedColors([]);
                    setOnlyInStock(false);
                    setCurrentPage(1);
                  }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Tüm Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Advanced Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-950 z-[110] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Filtrele</h2>
                <button onClick={() => setIsFilterOpen(false)} className="text-slate-900 dark:text-white"><X size={28} /></button>
              </div>

              <div className="space-y-10">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Kategoriler</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => { setSelectedCategory('Tümü'); setCurrentPage(1); }}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === 'Tümü' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-white'}`}
                    >
                      Tümü
                    </button>
                    {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
                      <button 
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-white'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={selectedCategory === cat ? 'text-white' : 'text-blue-600'}>{icon}</span>
                          {cat}
                        </div>
                        <span className="text-[10px] opacity-50">{PRODUCTS.filter(p => p.category === cat).length}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Fiyat Aralığı</h4>
                  <input 
                    type="range" 
                    min="0" 
                    max="150000" 
                    step="5000"
                    value={priceRange}
                    onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs font-bold mt-4">
                    <span className="text-slate-400">0 TL</span>
                    <span className="text-blue-600">{priceRange.toLocaleString()} TL</span>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Markalar</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map(brand => (
                      <button 
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${selectedBrands.includes(brand) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-100 dark:border-slate-800 hover:border-blue-600 text-slate-900 dark:text-white'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Renkler</h4>
                  <div className="flex flex-wrap gap-3">
                    {colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColors.includes(color) ? 'border-blue-600 scale-110' : 'border-transparent'}`}
                        title={color}
                      >
                        <div className="w-7 h-7 rounded-full shadow-inner" style={{ backgroundColor: color === 'Beyaz' ? '#fff' : color === 'Siyah' ? '#000' : color === 'Uzay Grisi' ? '#4a4a4a' : color === 'Naturel Titanyum' ? '#bebebe' : color === 'Gümüş' ? '#c0c0c0' : color === 'Grafit' ? '#383838' : color === 'Titanyum Siyah' ? '#1a1a1a' : color === 'Neon' ? '#ff3e00' : color === 'Gök Mavisi' ? '#70b0ff' : color === 'Gri' ? '#808080' : '#ccc' }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Stok Durumu</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => { setOnlyInStock(!onlyInStock); setCurrentPage(1); }}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${onlyInStock ? 'bg-blue-600 border-blue-600' : 'border-slate-200 dark:border-slate-800 group-hover:border-blue-600'}`}
                      >
                        {onlyInStock && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Sadece Stoktakiler</span>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="btn-primary w-full mt-8"
                >
                  Sonuçları Göster
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
