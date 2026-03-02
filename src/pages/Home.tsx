import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, Smartphone, Laptop, Headphones, Watch, MousePointer2, Check, X } from 'lucide-react';
import { PRODUCTS, STORE_AVAILABILITY } from '../constants';
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
  selectedStore: string;
  // Fiyat Alarmı
  getPriceAlarm?: (productId: number) => { targetPrice: number } | undefined;
  onSetPriceAlarm?: (product: Product, targetPrice: number) => void;
  onRemovePriceAlarm?: (productId: number) => void;
}

const CATEGORY_ICONS = {
  'Telefon': <Smartphone size={18} />,
  'Bilgisayar': <Laptop size={18} />,
  'Ses': <Headphones size={18} />,
  'Giyilebilir': <Watch size={18} />,
  'Aksesuar': <MousePointer2 size={18} />
};

const ITEMS_PER_PAGE = 8;

export default function Home({ onAddToCart, onQuickView, onNavigateToProduct, onToggleFav, onToggleCompare, favorites, comparisonList, selectedStore, getPriceAlarm, onSetPriceAlarm, onRemovePriceAlarm }: HomeProps) {
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

  // Ürünün stok durumunu belirle: 'inStore' | 'otherStore' | 'outOfStock'
  const getProductStockStatus = (product: Product): 'inStore' | 'otherStore' | 'outOfStock' => {
    const availability = STORE_AVAILABILITY[product.id];
    
    if (selectedStore === 'nevsehir') {
      if (availability?.nevsehir) return 'inStore';
      if (availability?.antalya) return 'otherStore';
      return 'outOfStock';
    }
    if (selectedStore === 'antalya') {
      if (availability?.antalya) return 'inStore';
      if (availability?.nevsehir) return 'otherStore';
      return 'outOfStock';
    }
    // 'all' seçili - genel stok durumuna bak
    if (availability?.nevsehir || availability?.antalya) return 'inStore';
    return 'outOfStock';
  };

  // Ürünün diğer mağazada olup olmadığını ve stok durumunu kontrol et
  const getOtherStoreInfo = (product: Product): { storeName?: string; isOutOfStock?: boolean } => {
    if (selectedStore === 'all') return {};
    const availability = STORE_AVAILABILITY[product.id];
    
    if (selectedStore === 'nevsehir') {
      if (!availability?.nevsehir && availability?.antalya) {
        return { storeName: 'Antalya' };
      }
      if (!availability?.nevsehir && !availability?.antalya) {
        return { isOutOfStock: true };
      }
    }
    if (selectedStore === 'antalya') {
      if (!availability?.antalya && availability?.nevsehir) {
        return { storeName: 'Nevşehir' };
      }
      if (!availability?.antalya && !availability?.nevsehir) {
        return { isOutOfStock: true };
      }
    }
    return {};
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

    // "Tümü" seçiliyken rastgele sıralama
    if (selectedStore === 'all') {
      // Sabit bir seed ile rastgele sıralama (her render'da aynı kalması için)
      result = [...result].sort(() => Math.random() - 0.5);
      
      // Sonra fiyat/puan sıralaması uygula (varsa)
      if (sortBy === 'Fiyat (Artan)') result.sort((a, b) => a.price - b.price);
      else if (sortBy === 'Fiyat (Azalan)') result.sort((a, b) => b.price - a.price);
      else if (sortBy === 'Puan (Azalan)') result.sort((a, b) => b.rating - a.rating);
    } else {
      // Mağaza seçiliyken: Seçili mağazada stokta > Diğer mağazada stokta > Stokta yok
      result.sort((a, b) => {
        const aStatus = getProductStockStatus(a);
        const bStatus = getProductStockStatus(b);
        
        // Öncelik sırası: inStore (0) > otherStore (1) > outOfStock (2)
        const priorityMap = { 'inStore': 0, 'otherStore': 1, 'outOfStock': 2 };
        const aPriority = priorityMap[aStatus];
        const bPriority = priorityMap[bStatus];
        
        if (aPriority !== bPriority) return aPriority - bPriority;
        
        // Aynı öncelik grubundaysalar, seçilen sıralama kriterine göre
        if (sortBy === 'Fiyat (Artan)') return a.price - b.price;
        if (sortBy === 'Fiyat (Azalan)') return b.price - a.price;
        if (sortBy === 'Puan (Azalan)') return b.rating - a.rating;
        
        return 0;
      });
    }

    return result;
  }, [selectedCategory, priceRange, selectedBrands, selectedColors, onlyInStock, sortBy, selectedStore]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="space-y-0 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <HeroSlider />

      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-3 md:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-2.5 bg-blue-600 text-white rounded-full text-[11px] md:text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 shrink-0"
            >
              <Filter size={14} className="md:w-4 md:h-4" /> <span className="hidden xs:inline">Filtrele</span>
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 md:mx-2 hidden sm:block" />
            <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['Kategoriler', 'Fiyat', 'Renk', 'Puan', 'Stok'].map(item => (
                <button 
                  key={item}
                  onClick={() => setIsFilterOpen(true)}
                  className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[11px] md:text-xs font-bold transition-all text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="hidden sm:inline">Sırala:</span> <span className="max-w-[60px] sm:max-w-none truncate">{sortBy}</span> <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
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

      <section className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-16">
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 md:mb-10">
              <h3 className="text-xl md:text-3xl font-display font-bold tracking-tight text-slate-800 dark:text-white">
                {selectedCategory} <span className="text-slate-400 dark:text-slate-600 ml-2 text-sm md:text-xl font-normal">({filteredProducts.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {paginatedProducts.map(product => {
                const storeInfo = getOtherStoreInfo(product);
                return (
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
                    otherStoreName={storeInfo.storeName}
                    isOutOfStockEverywhere={storeInfo.isOutOfStock}
                    priceAlarm={getPriceAlarm ? getPriceAlarm(product.id) : null}
                    onSetPriceAlarm={onSetPriceAlarm}
                    onRemovePriceAlarm={onRemovePriceAlarm}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 md:mt-20 flex justify-center items-center gap-1.5 md:gap-2 flex-wrap">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all duration-300 ${
                      currentPage === i + 1 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            
            {filteredProducts.length === 0 && (
              <div className="py-32 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter size={32} className="text-slate-400 dark:text-slate-500" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Sonuç Bulunamadı</h4>
                <p className="text-slate-500 dark:text-slate-400">Filtrelerinizi değiştirerek tekrar deneyebilirsiniz.</p>
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
              className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-full sm:w-80 bg-white dark:bg-slate-900 z-[110] shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-semibold text-slate-800 dark:text-white">Filtrele</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-medium text-slate-400 mb-2">Kategori</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <button 
                      onClick={() => { setSelectedCategory('Tümü'); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === 'Tümü' ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      Tümü
                    </button>
                    {Object.entries(CATEGORY_ICONS).map(([cat]) => (
                      <button 
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="text-xs font-medium text-slate-400 mb-2">Marka</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {brands.map(brand => (
                      <button 
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedBrands.includes(brand) ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-medium text-slate-400">Fiyat</h4>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{priceRange.toLocaleString()} ₺</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="150000" 
                    step="5000"
                    value={priceRange}
                    onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-slate-800 dark:accent-white"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0 ₺</span>
                    <span>150.000 ₺</span>
                  </div>
                </div>

                {/* Colors - Compact */}
                <div>
                  <h4 className="text-xs font-medium text-slate-400 mb-2">Renk</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {colors.map(color => {
                      const colorMap: Record<string, string> = {
                        'Beyaz': '#ffffff', 'Siyah': '#1a1a1a', 'Uzay Grisi': '#4a4a4a', 
                        'Naturel Titanyum': '#bebebe', 'Gümüş': '#c0c0c0', 'Grafit': '#383838',
                        'Titanyum Siyah': '#1a1a1a', 'Neon': '#ff3e00', 'Gök Mavisi': '#70b0ff', 'Gri': '#808080'
                      };
                      const bgColor = colorMap[color] || '#ccc';
                      const isSelected = selectedColors.includes(color);
                      return (
                        <button 
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${isSelected ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                          <span 
                            className="w-3 h-3 rounded-full border border-slate-200 dark:border-slate-600 flex-shrink-0" 
                            style={{ backgroundColor: bgColor }}
                          />
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stock Toggle */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Sadece Stoktakiler</span>
                  <button 
                    onClick={() => { setOnlyInStock(!onlyInStock); setCurrentPage(1); }}
                    className={`w-10 h-5 rounded-full transition-all relative ${onlyInStock ? 'bg-slate-800 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-900 shadow absolute top-0.5 transition-all ${onlyInStock ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-2.5 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
                >
                  Uygula
                </button>
                <button 
                  onClick={() => { 
                    setSelectedCategory('Tümü'); 
                    setSelectedBrands([]); 
                    setSelectedColors([]); 
                    setPriceRange(150000); 
                    setOnlyInStock(false);
                    setCurrentPage(1);
                  }}
                  className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
