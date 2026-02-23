import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ShoppingBag, ChevronRight, Phone, Mail, MapPin, Heart, CreditCard, Settings, User as UserIcon, Plus, Home as HomeIcon } from 'lucide-react';
import { PRODUCTS } from './constants';
import { Product, CartItem, User } from './types';
import Layout from './components/Layout';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Brands from './pages/Brands';
import FAQ from './pages/FAQ';

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
  
  const [accountTab, setAccountTab] = useState('Siparişlerim');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gt-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gt-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('gt-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gt-favorites', JSON.stringify(favorites));
  }, [favorites]);

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
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) {
        alert("En fazla 4 ürünü karşılaştırabilirsiniz.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const removeFromFav = (id: number) => setFavorites(prev => prev.filter(p => p.id !== id));
  
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
          />
        );
      case 'comparison':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-display font-bold mb-12 text-center">Ürün Karşılaştırma</h1>
            {comparisonList.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[3rem]">
                <p className="text-slate-500 mb-6">Karşılaştırma listesinde ürün bulunmuyor.</p>
                <button onClick={() => setCurrentPage('home')} className="btn-primary">Ürünlere Göz At</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-3xl">Özellik</th>
                      {comparisonList.map(p => (
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
                      {comparisonList.map(p => (
                        <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800 font-bold text-blue-600">{p.price.toLocaleString()} TL</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Marka</td>
                      {comparisonList.map(p => (
                        <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800">{p.brand}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Kategori</td>
                      {comparisonList.map(p => (
                        <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800">{p.category}</td>
                      ))}
                    </tr>
                    {/* Dynamic Specs */}
                    {Object.keys(comparisonList[0].specs).map(specKey => (
                      <tr key={specKey}>
                        <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">{specKey}</td>
                        {comparisonList.map(p => (
                          <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800 text-sm">{p.specs[specKey] || '-'}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-bl-3xl">Eylem</td>
                      {comparisonList.map(p => (
                        <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-800">
                          <button onClick={() => addToCart(p)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Sepete Ekle</button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'checkout':
        return <Checkout cart={cart} total={cartTotal} onComplete={() => { setCart([]); setCurrentPage('home'); }} />;
      case 'brands':
        return <Brands />;
      case 'faq':
        return <FAQ />;
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
            className="min-h-[70vh] flex flex-col items-center justify-center px-4"
          >
            <div className="relative">
              {/* Floating elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -left-12 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl"
              />
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-8 w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-xl"
              />
              
              {/* 404 Number */}
              <motion.h1 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-[12rem] md:text-[16rem] font-display font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 select-none"
              >
                404
              </motion.h1>
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-4 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-white">
                Sayfa Bulunamadı
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mt-8"
            >
              <button 
                onClick={() => setCurrentPage('home')} 
                className="btn-primary flex items-center gap-2"
              >
                <HomeIcon size={18} />
                Ana Sayfaya Dön
              </button>
              <button 
                onClick={() => window.history.back()} 
                className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
              >
                Geri Git
              </button>
            </motion.div>
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
    >
      {renderPage()}

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuthModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-950 z-[260] shadow-2xl rounded-[3rem] overflow-hidden p-10 border border-slate-100 dark:border-slate-800">
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
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white dark:bg-slate-950 z-[110] shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
              <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-slate-900/80 rounded-full z-10"><X size={24} /></button>
              <div className="w-full md:w-1/2 aspect-square bg-slate-100 dark:bg-slate-900">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="w-full md:w-1/2 p-12 flex flex-col justify-center space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{quickViewProduct.brand}</span>
                <h2 className="text-3xl font-display font-bold">{quickViewProduct.name}</h2>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{quickViewProduct.price.toLocaleString('tr-TR')} TL</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">{quickViewProduct.description}</p>
                <div className="flex gap-4">
                  <button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }} className="btn-primary flex-1">Sepete Ekle</button>
                  <button onClick={() => { navigateToProduct(quickViewProduct); setQuickViewProduct(null); }} className="btn-outline flex-1">Detaylar</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Live Chat */}
      <LiveChat />
    </Layout>
  );
}
