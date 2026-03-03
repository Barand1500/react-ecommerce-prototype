import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, MapPin, UserIcon, Plus, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
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
import Comparison from './pages/Comparison';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import MyAccount from './pages/MyAccount';

export default function App() {
  // --- State ---
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
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
      showToast('warning', 'Geçersiz Fiyat', 'Hedef fiyat mevcut fiyattan düşük olmalıdır.');
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
            setSelectedStore={setSelectedStore}
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
            setSelectedStore={setSelectedStore}
            getPriceAlarm={getPriceAlarm}
            onSetPriceAlarm={addPriceAlarm}
            onRemovePriceAlarm={removePriceAlarm}
          />
        );
      case 'comparison':
        return (
          <Comparison
            comparisonList={comparisonList}
            onToggleCompare={toggleComparison}
            onAddToCart={addToCart}
            onNavigate={setCurrentPage}
          />
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
          <MyAccount
            user={user}
            favorites={favorites}
            onAddToCart={addToCart}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
          />
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
            <p className="text-xl text-slate-500">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
            <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">Giriş Yap</button>
          </div>
        );
      case 'hakkimizda':
        return <About />;
      case 'iletisim':
        return <Contact />;
      default:
        return <NotFound onNavigate={setCurrentPage} />;
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
                        else if (!terms) showToast('warning', 'Koşullar', 'Lütfen kullanım koşullarını kabul edin.');
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
