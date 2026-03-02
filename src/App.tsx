import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ShoppingBag, ChevronRight, Phone, Mail, MapPin, Heart, CreditCard, Settings, User as UserIcon, Plus, Home as HomeIcon, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { PRODUCTS, STORE_AVAILABILITY } from './constants';
import { Product, CartItem, User } from './types';
import Layout from './components/Layout';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Brands from './pages/Brands';
import FAQ from './pages/FAQ';
import Profile from './pages/Profile';

export default function App() {
  // --- State ---
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [selectedComparisonCategory, setSelectedComparisonCategory] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gt-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'choice' | 'login' | 'register'>('choice');
  
  // Dark Mode - Sistem tercihini de algıla
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gt-theme');
    if (saved) return saved === 'dark';
    // Sistem tercihini kontrol et
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [accountTab, setAccountTab] = useState('Siparişlerim');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gt-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gt-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Kayıtlı Sepetler
  const [savedCarts, setSavedCarts] = useState<{
    id: number;
    name: string;
    createdAt: string;
    items: { name: string; image: string; quantity: number; price: number; productId: number; }[];
  }[]>(() => {
    const saved = localStorage.getItem('gt-saved-carts');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Mağaza Seçimi
  const [selectedStore, setSelectedStore] = useState(() => {
    const saved = localStorage.getItem('gt-store');
    return saved || 'all';
  });

  // Toast Bildirimleri
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ show: false, type: 'info', title: '', message: '' });

  // Toast gösterme fonksiyonu
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // Fiyat Alarmları
  const [priceAlarms, setPriceAlarms] = useState<{
    productId: number;
    productName: string;
    productImage: string;
    currentPrice: number;
    targetPrice: number;
    createdAt: string;
  }[]>(() => {
    const saved = localStorage.getItem('gt-price-alarms');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('gt-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gt-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('gt-store', selectedStore);
  }, [selectedStore]);

  useEffect(() => {
    localStorage.setItem('gt-saved-carts', JSON.stringify(savedCarts));
  }, [savedCarts]);

  useEffect(() => {
    localStorage.setItem('gt-price-alarms', JSON.stringify(priceAlarms));
  }, [priceAlarms]);

  // Dark Mode Effect - Geliştirilmiş versiyon
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    
    localStorage.setItem('gt-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Sistem tema değişikliğini dinle
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Sadece kullanıcı manuel olarak tema seçmediyse sistem tercihini uygula
      const savedTheme = localStorage.getItem('gt-theme');
      if (!savedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // --- Calculations ---
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const favCount = favorites.length;
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Quick View için önerilen ürünler
  const suggestedProducts = useMemo(() => {
    if (!quickViewProduct) return [];
    // Aynı kategoriden veya markadan ürünler (mevcut ürün hariç)
    const similar = PRODUCTS.filter(p => 
      p.id !== quickViewProduct.id && 
      (p.category === quickViewProduct.category || p.brand === quickViewProduct.brand)
    );
    // Rastgele 3 ürün seç
    return similar.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [quickViewProduct]);

  // --- Actions ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  useEffect(() => {
    if (user) localStorage.setItem('gt-user', JSON.stringify(user));
    else localStorage.removeItem('gt-user');
  }, [user]);

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const isFav = prev.find(p => p.id === product.id);
      if (isFav) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const toggleComparison = (product: Product) => {
    setComparisonList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast('info', 'Kaldırıldı', `${product.name} karşılaştırma listesinden çıkarıldı.`);
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('warning', 'Limit Aşıldı!', 'En fazla 4 ürünü aynı anda karşılaştırabilirsiniz. Lütfen önce bir ürünü listeden çıkarın.');
        return prev;
      }
      showToast('success', 'Karşılaştırmaya Eklendi', `${product.name} karşılaştırma listesine eklendi.`);
      return [...prev, product];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const removeFromFav = (id: number) => setFavorites(prev => prev.filter(p => p.id !== id));
  
  // Sepet Kaydetme
  const saveCart = (name: string) => {
    if (cart.length === 0) return;
    
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newSavedCart = {
      id: Date.now(),
      name,
      createdAt: formattedDate,
      items: cart.map(item => ({
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        productId: item.id
      }))
    };
    
    setSavedCarts(prev => [newSavedCart, ...prev]);
  };
  
  // Kayıtlı Sepeti Yükle
  const loadCart = (savedCartId: number) => {
    const savedCart = savedCarts.find(c => c.id === savedCartId);
    if (!savedCart) return;
    
    // Kayıtlı sepetteki ürünleri mevcut ürünlerden bul ve sepete ekle
    savedCart.items.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (product) {
        setCart(prev => {
          const existing = prev.find(p => p.id === product.id);
          if (existing) {
            return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + item.quantity } : p);
          }
          return [...prev, { ...product, quantity: item.quantity }];
        });
      }
    });
    
    setIsCartOpen(true);
  };
  
  // Kayıtlı Sepeti Sil
  const deleteSavedCart = (cartId: number) => {
    setSavedCarts(prev => prev.filter(c => c.id !== cartId));
  };
  
  // Fiyat Alarmı Ekle
  const addPriceAlarm = (product: Product, targetPrice: number) => {
    if (targetPrice >= product.price) {
      alert('Hedef fiyat mevcut fiyattan düşük olmalıdır.');
      return;
    }
    
    const existing = priceAlarms.find(a => a.productId === product.id);
    if (existing) {
      // Güncelle
      setPriceAlarms(prev => prev.map(a => 
        a.productId === product.id 
          ? { ...a, targetPrice, currentPrice: product.price } 
          : a
      ));
    } else {
      // Yeni ekle
      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
      
      setPriceAlarms(prev => [...prev, {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        currentPrice: product.price,
        targetPrice,
        createdAt: formattedDate
      }]);
    }
  };
  
  // Fiyat Alarmı Sil
  const removePriceAlarm = (productId: number) => {
    setPriceAlarms(prev => prev.filter(a => a.productId !== productId));
  };
  
  // Ürün için alarm var mı kontrol et
  const getPriceAlarm = (productId: number) => {
    return priceAlarms.find(a => a.productId === productId);
  };
  
  const handleLogin = (email: string, name: string) => {
    setUser({ id: Math.random().toString(36).substr(2, 9), name, email });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  // --- Router ---
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            onAddToCart={addToCart} 
            onQuickView={setQuickViewProduct} 
            onNavigateToProduct={navigateToProduct} 
            onToggleFav={toggleFavorite}
            onToggleCompare={toggleComparison}
            favorites={favorites}
            comparisonList={comparisonList}
            selectedStore={selectedStore}
            getPriceAlarm={getPriceAlarm}
            onSetPriceAlarm={addPriceAlarm}
            onRemovePriceAlarm={removePriceAlarm}
          />
        );
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            onToggleFav={toggleFavorite}
            onToggleCompare={toggleComparison}
            isFavorite={favorites.some(p => p.id === selectedProduct.id)}
            isComparing={comparisonList.some(p => p.id === selectedProduct.id)}
            priceAlarm={getPriceAlarm(selectedProduct.id)}
            onSetPriceAlarm={addPriceAlarm}
            onRemovePriceAlarm={removePriceAlarm}
          />
        ) : (
          <Home 
            onAddToCart={addToCart} 
            onQuickView={setQuickViewProduct} 
            onNavigateToProduct={navigateToProduct} 
            onToggleFav={toggleFavorite}
            onToggleCompare={toggleComparison}
            favorites={favorites}
            comparisonList={comparisonList}
            selectedStore={selectedStore}
            getPriceAlarm={getPriceAlarm}
            onSetPriceAlarm={addPriceAlarm}
            onRemovePriceAlarm={removePriceAlarm}
          />
        );
      case 'comparison':
        // Kategorilere göre gruplandır
        const groupedByCategory = comparisonList.reduce((acc, product) => {
          const cat = product.category;
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(product);
          return acc;
        }, {} as Record<string, Product[]>);
        
        const categories = Object.keys(groupedByCategory);
        const activeCategory = selectedComparisonCategory && categories.includes(selectedComparisonCategory) 
          ? selectedComparisonCategory 
          : categories[0] || null;
        const activeProducts = activeCategory ? groupedByCategory[activeCategory] : [];
        
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-display font-bold mb-8 text-center">Ürün Karşılaştırma</h1>
            {comparisonList.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                <p className="text-slate-500 mb-6">Karşılaştırma listesinde ürün bulunmuyor.</p>
                <button onClick={() => setCurrentPage('home')} className="btn-primary">Ürünlere Göz At</button>
              </div>
            ) : (
              <>
                {/* Kategori Tab'ları */}
                {categories.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mb-8">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedComparisonCategory(cat)}
                        className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${
                          activeCategory === cat
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Bilgi Notu */}
                {categories.length > 1 && (
                  <p className="text-center text-sm text-slate-500 mb-6">
                    Sadece aynı kategorideki ürünler karşılaştırılabilir. Listede {categories.length} farklı kategori var.
                  </p>
                )}

                {/* Karşılaştırma Tablosu */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-2xl">Özellik</th>
                        {activeProducts.map(p => (
                          <th key={p.id} className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-w-[250px]">
                            <div className="flex flex-col items-center gap-4">
                              <img src={p.image} alt={p.name} className="w-32 h-32 object-cover rounded-xl" />
                              <span className="font-bold text-sm">{p.name}</span>
                              <button onClick={() => toggleComparison(p)} className="text-xs text-red-500 hover:underline">Kaldır</button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Fiyat</td>
                        {activeProducts.map(p => (
                          <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800 font-bold text-blue-600">{p.price.toLocaleString()} TL</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Marka</td>
                        {activeProducts.map(p => (
                          <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800">{p.brand}</td>
                        ))}
                      </tr>
                      {/* Dynamic Specs */}
                      {activeProducts.length > 0 && Object.keys(activeProducts[0].specs).map(specKey => (
                        <tr key={specKey}>
                          <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">{specKey}</td>
                          {activeProducts.map(p => (
                            <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800 text-sm">{p.specs[specKey] || '-'}</td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-bl-2xl">Eylem</td>
                        {activeProducts.map(p => (
                          <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800">
                            <button onClick={() => addToCart(p)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Sepete Ekle</button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Tüm Ürünlerin Listesi */}
                {categories.length > 1 && (
                  <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Karşılaştırma Listenizdeki Tüm Ürünler:</p>
                    <div className="flex flex-wrap gap-2">
                      {comparisonList.map(p => (
                        <span key={p.id} className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          p.category === activeCategory
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {p.name} ({p.category})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case 'checkout':
        return <Checkout cart={cart} total={cartTotal} onComplete={() => { setCart([]); setCurrentPage('home'); }} />;
      case 'brands':
        return <Brands />;
      case 'faq':
        return <FAQ />;
      case 'profile':
        return user ? (
          <Profile 
            user={user} 
            onNavigate={setCurrentPage} 
            onLogout={handleLogout} 
            savedCarts={savedCarts}
            onLoadCart={loadCart}
            onDeleteSavedCart={deleteSavedCart}
          />
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
            <p className="text-xl text-slate-500">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
            <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">Giriş Yap</button>
          </div>
        );
      case 'my-account':
        return user ? (
          <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Sidebar */}
              <div className="w-full lg:w-80 space-y-8 lg:sticky lg:top-32">
                <div className="relative p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center space-y-6 shadow-2xl shadow-slate-500/5 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-blue-800" />
                  <div className="relative pt-4">
                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] mx-auto flex items-center justify-center text-blue-600 text-3xl font-display font-bold shadow-xl border-4 border-white dark:border-slate-900">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{user.name}</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{user.email}</p>
                  </div>
                  <div className="pt-4">
                    <button onClick={handleLogout} className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Çıkış Yap</button>
                  </div>
                </div>

                <nav className="p-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-500/5 space-y-1">
                  {[
                    { name: 'Siparişlerim', icon: <ShoppingBag size={18} /> },
                    { name: 'Favorilerim', icon: <Heart size={18} /> },
                    { name: 'Adreslerim', icon: <MapPin size={18} /> },
                    { name: 'Ödeme Yöntemleri', icon: <CreditCard size={18} /> },
                    { name: 'Hesap Ayarları', icon: <Settings size={18} /> }
                  ].map(item => (
                    <button 
                      key={item.name} 
                      onClick={() => setAccountTab(item.name)}
                      className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all flex items-center gap-4 ${accountTab === item.name ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600'}`}
                    >
                      {item.icon} {item.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 w-full space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Aktif Sipariş', value: '0', color: 'bg-blue-500' },
                    { label: 'Toplam Harcama', value: '0 TL', color: 'bg-emerald-500' },
                    { label: 'Kazanılan Puan', value: '150', color: 'bg-orange-500' }
                  ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-500/5 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                      <h4 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{stat.value}</h4>
                      <div className={`h-1 w-12 rounded-full ${stat.color} opacity-50`} />
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{accountTab}</h2>
                  </div>
                  
                  {accountTab === 'Siparişlerim' && (
                    <div className="p-16 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-6">
                      <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                        <ShoppingBag size={48} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Henüz siparişiniz yok.</h4>
                        <p className="text-slate-500 max-w-xs mx-auto">En yeni teknoloji ürünlerini keşfederek ilk siparişinizi oluşturun.</p>
                      </div>
                      <button onClick={() => setCurrentPage('home')} className="btn-primary px-10 py-4">Alışverişe Başla</button>
                    </div>
                  )}

                  {accountTab === 'Favorilerim' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {favorites.length > 0 ? favorites.map(p => (
                        <div key={p.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-6 items-center">
                          <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-2xl" referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                            <p className="text-blue-600 font-bold">{p.price.toLocaleString()} TL</p>
                            <button onClick={() => addToCart(p)} className="mt-2 text-xs font-bold text-blue-600 hover:underline">Sepete Ekle</button>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-full p-16 text-center text-slate-500">Favori ürününüz bulunmuyor.</div>
                      )}
                    </div>
                  )}

                  {accountTab === 'Adreslerim' && (
                    <div className="grid grid-cols-1 gap-6">
                      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl"><MapPin size={24} /></div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Ev Adresim</h4>
                            <p className="text-sm text-slate-500">Kadıköy, İstanbul</p>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-blue-600 hover:underline">Düzenle</button>
                      </div>
                      <button className="w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold hover:border-blue-600 hover:text-blue-600 transition-all">+ Yeni Adres Ekle</button>
                    </div>
                  )}

                  {accountTab === 'Ödeme Yöntemleri' && (
                    <div className="grid grid-cols-1 gap-6">
                      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl"><CreditCard size={24} /></div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Visa **** 4242</h4>
                            <p className="text-sm text-slate-500">Son Kullanma: 12/25</p>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-red-500 hover:underline">Sil</button>
                      </div>
                      <button className="w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold hover:border-blue-600 hover:text-blue-600 transition-all">+ Yeni Kart Ekle</button>
                    </div>
                  )}

                  {accountTab === 'Hesap Ayarları' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ad Soyad</label>
                          <input type="text" defaultValue={user.name} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">E-posta</label>
                          <input type="email" defaultValue={user.email} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                      <button className="btn-primary px-8">Değişiklikleri Kaydet</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-blue-500/20">
                    <h3 className="text-2xl font-display font-bold">Premium Üyelik</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">Güzel Teknoloji Premium ile ücretsiz kargo, öncelikli destek ve özel indirimlerden yararlanın.</p>
                    <button className="px-8 py-3 bg-white text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-50 transition-all">Şimdi Katıl</button>
                  </div>
                  <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-slate-900/20">
                    <h3 className="text-2xl font-display font-bold">Yardım Merkezi</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Bir sorunuz mu var? Destek ekibimiz size yardımcı olmak için burada.</p>
                    <button onClick={() => setCurrentPage('faq')} className="px-8 py-3 bg-slate-800 text-white rounded-2xl text-xs font-bold hover:bg-slate-700 transition-all border border-white/10">Destek Al</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
              <p className="text-xl text-slate-500">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
              <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">Giriş Yap</button>
            </div>;
      case 'hakkimizda':
        return (
          <div className="space-y-0">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900">
              <img src="https://picsum.photos/seed/tech-about/1920/1080" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="About Hero" referrerPolicy="no-referrer" />
              <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-display font-bold text-white leading-tight">Geleceği Bugün <span className="text-blue-500">Tasarlıyoruz.</span></motion.h1>
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-300">Güzel Teknoloji, 15 yılı aşkın süredir teknoloji tutkunlarını en yeni ve en kaliteli ürünlerle buluşturuyor.</motion.p>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-white dark:bg-slate-950">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: 'Mutlu Müşteri', value: '500K+' },
                  { label: 'Yıllık Satış', value: '1M+' },
                  { label: 'Mağaza Sayısı', value: '25' },
                  { label: 'Yıllık Tecrübe', value: '15+' }
                ].map((stat, i) => (
                  <div key={i} className="text-center space-y-2">
                    <h3 className="text-5xl font-display font-bold text-blue-600">{stat.value}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                  <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Vizyonumuz & Misyonumuz</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">Sadece bir teknoloji mağazası değil, aynı zamanda bir yaşam tarzı sunuyoruz. Teknolojinin insan hayatını kolaylaştıran ve güzelleştiren bir araç olduğuna inanıyoruz.</p>
                  <div className="space-y-4">
                    {[
                      'Sürdürülebilir teknoloji çözümleri',
                      'Müşteri odaklı hizmet anlayışı',
                      'Yenilikçi ve öncü yaklaşım',
                      'Güvenilir ve şeffaf ticaret'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{i+1}</div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full" />
                  <img src="https://picsum.photos/seed/vision/800/600" className="relative rounded-[3rem] shadow-2xl" alt="Vision" referrerPolicy="no-referrer" />
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-white dark:bg-slate-950">
              <div className="max-w-7xl mx-auto px-4 text-center space-y-16">
                <div className="space-y-4">
                  <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Ekibimizle Tanışın</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">Başarımızın arkasındaki tutkulu ve uzman ekip.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { name: 'Ercan Güzel', role: 'CEO & Kurucu', img: 'https://picsum.photos/seed/p1/400/400' },
                    { name: 'Alği Köse', role: 'CTO', img: 'https://picsum.photos/seed/p2/400/400' },
                    { name: 'Semihcan Güzel', role: 'Pazarlama Müdürü', img: 'https://picsum.photos/seed/p3/400/400' },
                    { name: 'Nimet Demir', role: 'Müşteri İlişkileri', img: 'https://picsum.photos/seed/p4/400/400' }
                  ].map((member, i) => (
                    <div key={i} className="group space-y-4">
                      <div className="relative overflow-hidden rounded-[2rem] aspect-square">
                        <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" alt={member.name} referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h4>
                        <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );
      case 'iletisim':
        return (
          <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h1 className="text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight">Bize <span className="text-blue-600">Ulaşın.</span></h1>
                  <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">Sorularınız, önerileriniz veya iş birliği talepleriniz için her zaman buradayız. Ekibimiz size en kısa sürede dönüş yapacaktır.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <a href="https://wa.me/905000000000" target="_blank" rel="noreferrer" className="group p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] space-y-4 border border-emerald-100 dark:border-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><Phone size={28} /></div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">WhatsApp</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Anlık destek için bize WhatsApp üzerinden yazın.</p>
                    <p className="font-bold text-emerald-600">+90 500 000 00 00</p>
                  </a>
                  <a href="mailto:destek@guzelteknoloji.com" className="group p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] space-y-4 border border-blue-100 dark:border-blue-900/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><Mail size={28} /></div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">E-posta</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Resmi talepleriniz için bize e-posta gönderin.</p>
                    <p className="font-bold text-blue-600">destek@guzelteknoloji.com</p>
                  </a>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={32} /></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Merkez Ofis</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Teknoloji Cad. No:123, Levent, İstanbul</p>
                  </div>
                </div>
              </div>

              {/* Mobile Phone UI for Form */}
              <div className="relative mx-auto w-full max-w-[400px]">
                <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-50" />
                <div className="relative bg-slate-900 rounded-[3.5rem] p-4 shadow-2xl border-[8px] border-slate-800">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />
                  
                  <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden h-full min-h-[600px] flex flex-col">
                    <div className="p-8 pt-12 space-y-2">
                      <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Mesaj Gönder</h3>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Hızlı İletişim Formu</p>
                    </div>
                    
                    <form className="flex-1 p-8 space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ad Soyad</label>
                        <input type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm" placeholder="Adınız Soyadınız" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">E-posta</label>
                        <input type="email" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm" placeholder="ornek@mail.com" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Mesajınız</label>
                        <textarea rows={4} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white text-sm resize-none" placeholder="Nasıl yardımcı olabiliriz?"></textarea>
                      </div>
                      <button className="btn-primary w-full py-4 mt-4 shadow-blue-500/40">Gönder</button>
                    </form>
                    
                    <div className="p-6 text-center">
                      <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
          >
            {/* Animated Stars Background */}
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Floating Astronaut / Lost in Space Theme */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
              {/* Glowing Orbs */}
              <motion.div 
                animate={{ 
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
              />
              <motion.div 
                animate={{ 
                  y: [0, 40, 0],
                  x: [0, -30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
              />
              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 right-1/3 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl"
              />

              {/* Main Content */}
              <div className="relative text-center">
                {/* 404 Text with Glitch Effect */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="relative"
                >
                  {/* Glitch layers */}
                  <motion.h1 
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 text-[10rem] md:text-[14rem] lg:text-[18rem] font-display font-black text-cyan-500/30 select-none"
                    style={{ clipPath: 'inset(0 0 50% 0)' }}
                  >
                    404
                  </motion.h1>
                  <motion.h1 
                    animate={{ x: [2, -2, 2] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 text-[10rem] md:text-[14rem] lg:text-[18rem] font-display font-black text-pink-500/30 select-none"
                    style={{ clipPath: 'inset(50% 0 0 0)' }}
                  >
                    404
                  </motion.h1>
                  <h1 className="text-[10rem] md:text-[14rem] lg:text-[18rem] font-display font-black bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent select-none leading-none">
                    404
                  </h1>
                </motion.div>

                {/* Floating Planet */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-8 -right-8 md:right-0"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="relative w-20 h-20 md:w-28 md:h-28"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-amber-500 to-red-500 shadow-2xl shadow-orange-500/50" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-tl from-orange-300/50 to-transparent" />
                    {/* Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 md:w-44 h-4 md:h-6 border-2 border-orange-300/30 rounded-full -rotate-12" />
                  </motion.div>
                </motion.div>

                {/* Content */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Bağlantı Koptu
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                    Houston, bir sorunumuz var!
                  </h2>
                  <p className="text-lg text-slate-400 max-w-lg mx-auto">
                    Aradığınız sayfa uzayın derinliklerinde kaybolmuş görünüyor. 
                    Belki de bir kara deliğe düştü...
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage('home')} 
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl text-white font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <HomeIcon size={20} />
                      Ana Üsse Dön
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.history.back()} 
                    className="px-8 py-4 border border-white/20 backdrop-blur-sm rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    Geri Git
                  </motion.button>
                </motion.div>

                {/* Fun Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-8 mt-16 text-slate-500"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">∞</div>
                    <div className="text-xs">Işık Yılı Uzakta</div>
                  </div>
                  <div className="w-px h-8 bg-slate-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs">Sayfa Bulundu</div>
                  </div>
                  <div className="w-px h-8 bg-slate-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">🛸</div>
                    <div className="text-xs">UFO Görüldü</div>
                  </div>
                </motion.div>
              </div>

              {/* Floating Rocket */}
              <motion.div
                initial={{ x: -100, y: 100, opacity: 0 }}
                animate={{ 
                  x: [null, 0, 50, 0],
                  y: [null, 0, -20, 0],
                  opacity: 1,
                  rotate: [null, 0, 5, 0],
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-20 left-10 md:left-20 text-6xl md:text-8xl select-none"
              >
                🚀
              </motion.div>

              {/* Floating UFO */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-32 right-10 md:right-32 text-4xl md:text-5xl select-none"
              >
                🛸
              </motion.div>

              {/* Small Moon */}
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-40 right-20 md:right-40"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg">
                  <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-slate-400/50" />
                  <div className="absolute top-5 right-2 w-3 h-3 rounded-full bg-slate-400/50" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <Layout 
      cart={cart} 
      favorites={favorites}
      comparisonList={comparisonList}
      cartCount={cartCount} 
      favCount={favCount}
      compareCount={comparisonList.length}
      cartTotal={cartTotal}
      user={user}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      setIsCartOpen={setIsCartOpen}
      isCartOpen={isCartOpen}
      isFavOpen={isFavOpen}
      setIsFavOpen={setIsFavOpen}
      setIsAuthModalOpen={setIsAuthModalOpen}
      setAuthMode={setAuthMode}
      removeFromCart={removeFromCart}
      removeFromFav={removeFromFav}
      addToCart={addToCart}
      updateQuantity={updateQuantity}
      onNavigate={setCurrentPage}
      isNavSidebarOpen={isNavSidebarOpen}
      setIsNavSidebarOpen={setIsNavSidebarOpen}
      onLogout={handleLogout}
      selectedStore={selectedStore}
      setSelectedStore={setSelectedStore}
      onNavigateToProduct={navigateToProduct}
      onSaveCart={saveCart}
    >
      {renderPage()}

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuthModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white dark:bg-slate-950 z-[260] shadow-2xl rounded-2xl sm:rounded-[3rem] overflow-hidden p-6 sm:p-10 border border-slate-100 dark:border-slate-800 max-h-[calc(100vh-1.5rem)] overflow-y-auto">
              <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={24} /></button>
              
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                    {authMode === 'choice' ? 'Hoş Geldiniz' : authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                  </h2>
                  <p className="text-sm text-slate-500">Güzel Teknoloji dünyasına adım atın.</p>
                </div>

                {authMode === 'choice' && (
                  <div className="space-y-4">
                    <button onClick={() => setAuthMode('login')} className="btn-primary w-full py-5 flex items-center justify-center gap-3">
                      <UserIcon size={20} /> Giriş Yap
                    </button>
                    <button onClick={() => setAuthMode('register')} className="btn-outline w-full py-5 flex items-center justify-center gap-3">
                      <Plus size={20} /> Hesap Oluştur
                    </button>
                  </div>
                )}

                {authMode === 'login' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">E-posta</label>
                      <input id="login-email" type="email" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="ornek@mail.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Şifre</label>
                      <input id="login-pass" type="password" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="••••••••" />
                    </div>
                    <button 
                      onClick={() => {
                        const email = (document.getElementById('login-email') as HTMLInputElement).value;
                        if (email) handleLogin(email, 'Kullanıcı');
                      }}
                      className="btn-primary w-full py-5 shadow-blue-500/40"
                    >
                      Giriş Yap
                    </button>
                    <button onClick={() => setAuthMode('choice')} className="w-full text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">Geri Dön</button>
                  </div>
                )}

                {authMode === 'register' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ad Soyad</label>
                      <input id="reg-name" type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="Adınız Soyadınız" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">E-posta</label>
                      <input id="reg-email" type="email" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="ornek@mail.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Şifre</label>
                      <input id="reg-pass" type="password" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" placeholder="••••••••" />
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="terms" className="text-[10px] text-slate-500 leading-relaxed">
                        <span className="text-blue-600 font-bold cursor-pointer">Kullanım Koşulları</span> ve <span className="text-blue-600 font-bold cursor-pointer">Gizlilik Politikası</span>'nı okudum, kabul ediyorum.
                      </label>
                    </div>
                    <button 
                      onClick={() => {
                        const name = (document.getElementById('reg-name') as HTMLInputElement).value;
                        const email = (document.getElementById('reg-email') as HTMLInputElement).value;
                        const terms = (document.getElementById('terms') as HTMLInputElement).checked;
                        if (name && email && terms) handleLogin(email, name);
                        else if (!terms) alert('Lütfen kullanım koşullarını kabul edin.');
                      }}
                      className="btn-primary w-full py-5 shadow-blue-500/40"
                    >
                      Kayıt Ol ve Başla
                    </button>
                    <button onClick={() => setAuthMode('choice')} className="w-full text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">Geri Dön</button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickViewProduct(null)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-4xl bg-white dark:bg-slate-950 z-[110] shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[calc(100vh-2rem)] sm:max-h-[90vh]">
              <button onClick={() => setQuickViewProduct(null)} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/80 dark:bg-slate-900/80 rounded-full z-10"><X size={20} className="sm:hidden" /><X size={24} className="hidden sm:block" /></button>
              <div className="w-full md:w-1/2 aspect-[4/3] sm:aspect-square bg-slate-100 dark:bg-slate-900 shrink-0">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 flex flex-col justify-start md:justify-center space-y-4 sm:space-y-6 overflow-y-auto">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-600">{quickViewProduct.brand}</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">{quickViewProduct.name}</h2>
                <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">{quickViewProduct.price.toLocaleString('tr-TR')} TL</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">{quickViewProduct.description}</p>
                
                {/* Mağaza Stok Durumu */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 sm:p-4">
                  <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 sm:mb-3">Mağaza Durumu</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MapPin size={12} className="text-blue-600" />
                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Antalya / Merkez</span>
                      </div>
                      {STORE_AVAILABILITY[quickViewProduct.id]?.antalya ? (
                        <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Stokta</span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Stokta Yok</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MapPin size={12} className="text-blue-600" />
                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Nevşehir / Merkez</span>
                      </div>
                      {STORE_AVAILABILITY[quickViewProduct.id]?.nevsehir ? (
                        <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Stokta</span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Stokta Yok</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 sm:gap-4">
                  <button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }} className="btn-primary flex-1 text-xs sm:text-sm py-3 sm:py-4">Sepete Ekle</button>
                  <button onClick={() => { navigateToProduct(quickViewProduct); setQuickViewProduct(null); }} className="btn-outline flex-1 text-xs sm:text-sm py-3 sm:py-4">Detaylar</button>
                </div>

                {/* Önerilen Ürünler */}
                {suggestedProducts.length > 0 && (
                  <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 sm:mb-3">Bu ürünü alanlar bunları da aldı</h4>
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                      {suggestedProducts.map(sp => (
                        <button
                          key={sp.id}
                          onClick={() => {
                            setQuickViewProduct(sp);
                          }}
                          className="flex-shrink-0 w-20 sm:w-auto sm:flex-1 group/suggest bg-slate-50 dark:bg-slate-900 rounded-lg sm:rounded-xl p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left"
                        >
                          <img src={sp.image} alt={sp.name} className="w-full aspect-square object-cover rounded-md sm:rounded-lg mb-1 sm:mb-2" referrerPolicy="no-referrer" />
                          <p className="text-[9px] sm:text-[10px] font-bold text-slate-800 dark:text-white line-clamp-1 group-hover/suggest:text-blue-600 transition-colors">{sp.name}</p>
                          <p className="text-[9px] sm:text-[10px] font-bold text-blue-600">{sp.price.toLocaleString('tr-TR')} TL</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Bildirimleri */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[500] w-full max-w-md px-4"
          >
            <div className={`relative p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-4 ${
              toast.type === 'success' 
                ? 'bg-green-50/95 dark:bg-green-900/90 border-green-200 dark:border-green-800' 
                : toast.type === 'error'
                ? 'bg-red-50/95 dark:bg-red-900/90 border-red-200 dark:border-red-800'
                : toast.type === 'warning'
                ? 'bg-orange-50/95 dark:bg-orange-900/90 border-orange-200 dark:border-orange-800'
                : 'bg-blue-50/95 dark:bg-blue-900/90 border-blue-200 dark:border-blue-800'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                toast.type === 'success' 
                  ? 'bg-green-500 text-white' 
                  : toast.type === 'error'
                  ? 'bg-red-500 text-white'
                  : toast.type === 'warning'
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {toast.type === 'success' && <CheckCircle2 size={20} />}
                {toast.type === 'error' && <XCircle size={20} />}
                {toast.type === 'warning' && <AlertTriangle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm ${
                  toast.type === 'success' 
                    ? 'text-green-800 dark:text-green-200' 
                    : toast.type === 'error'
                    ? 'text-red-800 dark:text-red-200'
                    : toast.type === 'warning'
                    ? 'text-orange-800 dark:text-orange-200'
                    : 'text-blue-800 dark:text-blue-200'
                }`}>{toast.title}</h4>
                <p className={`text-xs mt-0.5 ${
                  toast.type === 'success' 
                    ? 'text-green-600 dark:text-green-300' 
                    : toast.type === 'error'
                    ? 'text-red-600 dark:text-red-300'
                    : toast.type === 'warning'
                    ? 'text-orange-600 dark:text-orange-300'
                    : 'text-blue-600 dark:text-blue-300'
                }`}>{toast.message}</p>
              </div>
              <button 
                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                className={`p-1.5 rounded-lg transition-colors ${
                  toast.type === 'success' 
                    ? 'hover:bg-green-200 dark:hover:bg-green-800 text-green-600' 
                    : toast.type === 'error'
                    ? 'hover:bg-red-200 dark:hover:bg-red-800 text-red-600'
                    : toast.type === 'warning'
                    ? 'hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-600'
                    : 'hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600'
                }`}
              >
                <X size={16} />
              </button>
              {/* Progress bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 rounded-bl-2xl ${
                  toast.type === 'success' 
                    ? 'bg-green-500' 
                    : toast.type === 'error'
                    ? 'bg-red-500'
                    : toast.type === 'warning'
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Chat */}
      <LiveChat />
    </Layout>
  );
}
