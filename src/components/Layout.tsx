import { useState, useEffect, useMemo } from 'react';
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, ShoppingBag, Search, Sun, Moon, 
  Instagram, Twitter, Facebook, Youtube,
  Phone, Mail, MapPin, ChevronRight, ChevronDown, ChevronUp,
  CreditCard, Smartphone, Heart, BarChart2, Trash2, Plus, Minus, Copy, Check, User as UserIcon, LogOut, Settings,
  MessageCircle, FileText, ArrowLeftRight, Lock, Power, Wallet, Bookmark,
  Laptop, Headphones, Watch, Mouse, Monitor, Cpu, HardDrive, Gamepad2, Camera, Speaker
} from 'lucide-react';
import { CartItem, Product, User } from '../types';
import { PRODUCTS } from '../constants';

// Kategoriler ve alt kategoriler
const MENU_CATEGORIES = [
  {
    id: 'bilgisayar',
    name: 'Bilgisayar',
    icon: Laptop,
    subCategories: [
      { id: 'laptop', name: 'Laptop & Notebook', icon: Laptop },
      { id: 'masaustu', name: 'Masaüstü Bilgisayar', icon: Monitor },
      { id: 'ekran-karti', name: 'Ekran Kartları', icon: Cpu },
      { id: 'depolama', name: 'Depolama Çözümleri', icon: HardDrive },
      { id: 'monitor', name: 'Monitörler', icon: Monitor },
    ]
  },
  {
    id: 'telefon',
    name: 'Telefon',
    icon: Smartphone,
    subCategories: [
      { id: 'akilli-telefon', name: 'Akıllı Telefonlar', icon: Smartphone },
      { id: 'tablet', name: 'Tabletler', icon: Smartphone },
      { id: 'telefon-aksesuar', name: 'Telefon Aksesuarları', icon: Smartphone },
    ]
  },
  {
    id: 'ses',
    name: 'Ses & Müzik',
    icon: Headphones,
    subCategories: [
      { id: 'kulaklik', name: 'Kulaklıklar', icon: Headphones },
      { id: 'hoparlor', name: 'Hoparlörler', icon: Speaker },
      { id: 'mikrofon', name: 'Mikrofonlar', icon: Headphones },
    ]
  },
  {
    id: 'giyilebilir',
    name: 'Giyilebilir Teknoloji',
    icon: Watch,
    subCategories: [
      { id: 'akilli-saat', name: 'Akıllı Saatler', icon: Watch },
      { id: 'fitness', name: 'Fitness Trackerlar', icon: Watch },
    ]
  },
  {
    id: 'aksesuar',
    name: 'Aksesuar',
    icon: Mouse,
    subCategories: [
      { id: 'klavye-mouse', name: 'Klavye & Mouse', icon: Mouse },
      { id: 'gaming', name: 'Gaming Aksesuarları', icon: Gamepad2 },
      { id: 'kamera', name: 'Kamera & Fotoğraf', icon: Camera },
      { id: 'kablo-adaptör', name: 'Kablo & Adaptörler', icon: CreditCard },
    ]
  },
];

interface LayoutProps {
  children: React.ReactNode;
  cart: CartItem[];
  favorites: Product[];
  comparisonList: Product[];
  cartCount: number;
  favCount: number;
  compareCount: number;
  cartTotal: number;
  user: User | null;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  setIsCartOpen: (val: boolean) => void;
  isCartOpen: boolean;
  isFavOpen: boolean;
  setIsFavOpen: (val: boolean) => void;
  setIsAuthModalOpen: (val: boolean) => void;
  setAuthMode: (val: 'choice' | 'login' | 'register') => void;
  removeFromCart: (id: number) => void;
  removeFromFav: (id: number) => void;
  addToCart: (p: Product) => void;
  updateQuantity: (id: number, delta: number) => void;
  onNavigate: (page: string) => void;
  isNavSidebarOpen: boolean;
  setIsNavSidebarOpen: (val: boolean) => void;
  onLogout: () => void;
  selectedStore: string;
  setSelectedStore: (val: string) => void;
  onNavigateToProduct: (p: Product) => void;
  onSaveCart: (name: string) => void;
}

export default function Layout({ 
  children, cart, favorites, comparisonList, cartCount, favCount, compareCount, cartTotal, user, isDarkMode, setIsDarkMode, 
  setIsCartOpen, isCartOpen, isFavOpen, setIsFavOpen, setIsAuthModalOpen, setAuthMode, removeFromCart, removeFromFav, 
  addToCart, updateQuantity, onNavigate, isNavSidebarOpen, setIsNavSidebarOpen, onLogout, selectedStore, setSelectedStore, onNavigateToProduct, onSaveCart
}: LayoutProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');  
  const [copied, setCopied] = useState(false);
  const [isUserBarOpen, setIsUserBarOpen] = useState(false);
  const [isSaveCartModalOpen, setIsSaveCartModalOpen] = useState(false);
  const [saveCartName, setSaveCartName] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const stores = [
    { id: 'all', name: 'Tüm Mağazalar' },
    { id: 'antalya', name: 'Antalya / Merkez' },
    { id: 'nevsehir', name: 'Nevşehir / Merkez' }
  ];

  // Arama sonuçları
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    ).slice(0, 6); // İlk 6 sonuç
  }, [searchQuery]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* --- Header --- */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setIsNavSidebarOpen(true)} className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Menu size={22} className="text-slate-700 dark:text-slate-200" />
            </button>
            <h1 
              onClick={() => onNavigate('home')}
              className="text-lg sm:text-2xl font-display font-bold tracking-tighter text-blue-600 cursor-pointer"
            >
              GÜZEL TEKNOLOJİ
            </h1>
            
            {/* Mağaza Seçici Dropdown */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <MapPin size={14} className="text-blue-600" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                  {stores.find(s => s.id === selectedStore)?.name || 'Mağaza'}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isStoreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isStoreDropdownOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      onClick={() => setIsStoreDropdownOpen(false)} 
                      className="fixed inset-0 z-40" 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Mağaza Seçin
                        </div>
                        {stores.map(store => (
                          <button
                            key={store.id}
                            onClick={() => {
                              setSelectedStore(store.id);
                              setIsStoreDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                              selectedStore === store.id 
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <MapPin size={14} className={selectedStore === store.id ? 'text-blue-600' : 'text-slate-400'} />
                            <span className="text-sm font-medium">{store.name}</span>
                            {selectedStore === store.id && (
                              <Check size={14} className="ml-auto text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            {[
              { name: 'Ana Sayfa', id: 'home' },
              { name: 'Markalar', id: 'brands' },
              { name: 'Hakkımızda', id: 'hakkimizda' },
              { name: 'İletişim', id: 'iletisim' },
              { name: 'SSS', id: 'faq' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => onNavigate(item.id)}
                className="hover:text-blue-600 transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => onNavigate('comparison')}
              className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <BarChart2 size={20} className="text-slate-700 dark:text-slate-300" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {compareCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsFavOpen(true)} className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <Heart size={20} className="text-slate-700 dark:text-slate-300" />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {favCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => {
                  if (user) {
                    setIsUserMenuOpen(!isUserMenuOpen);
                  } else {
                    setAuthMode('choice');
                    setIsAuthModalOpen(true);
                  }
                }} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
              >
                <UserIcon size={20} className={user ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'} />
                {user && <span className="hidden sm:inline text-xs font-bold text-slate-900 dark:text-white">{user.name.split(' ')[0]}</span>}
              </button>
              <AnimatePresence>
                {isUserMenuOpen && user && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50"
                    >
                      <button 
                        onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-all"
                      >
                        <UserIcon size={18} /> Hesabım
                      </button>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-all"
                      >
                        <Settings size={18} /> Ayarlar
                      </button>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                      <button 
                        onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <LogOut size={18} /> Çıkış Yap
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {/* Geliştirilmiş Dark Mode Toggle */}
            <div className="relative">
              <button 
                onClick={handleThemeToggle} 
                className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600' 
                    : 'bg-gradient-to-r from-amber-400 to-orange-400'
                }`}
                aria-label={isDarkMode ? 'Gündüz moduna geç' : 'Gece moduna geç'}
              >
                {/* Toggle Circle */}
                <motion.div 
                  initial={false}
                  animate={{ x: isDarkMode ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full shadow-lg flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-slate-900' 
                      : 'bg-white'
                  }`}
                >
                  {isDarkMode ? (
                    <Moon size={12} className="text-indigo-300" />
                  ) : (
                    <Sun size={12} className="text-amber-500" />
                  )}
                </motion.div>
              </button>
            </div>
            
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <ShoppingBag size={20} className="text-slate-700 dark:text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- Kullanıcı Bilgi Barı (Giriş yapılmışsa) --- */}
      {user && (
        <div className="fixed top-16 sm:top-20 left-0 right-0 z-30">
          {/* Kapalı Hali - Sadece İsim */}
          {!isUserBarOpen && (
            <button
              onClick={() => setIsUserBarOpen(true)}
              className="w-full bg-violet-600 hover:bg-violet-700 transition-colors py-2"
            >
              <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span className="text-sm font-medium text-white">{user.name}</span>
                <ChevronDown size={16} className="text-white/70" />
              </div>
            </button>
          )}

          {/* Açık Hali - Tüm Detaylar */}
          <AnimatePresence>
            {isUserBarOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                      {/* Kullanıcı Bilgileri */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-violet-500 flex items-center justify-center text-lg font-bold text-violet-600">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                          <p className="text-xs text-blue-600">{user.email}</p>
                          <p className="text-xs text-slate-500">530 411 21 50</p>
                        </div>
                      </div>

                      {/* Hesap Özeti */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium hidden sm:block">Hesap Özeti</span>
                        <div className="flex items-center gap-1">
                          <div className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-center">
                            <p className="text-[10px] text-violet-600 font-medium">Borç</p>
                            <p className="text-xs font-bold text-violet-600">-0,00 ₺</p>
                          </div>
                          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 font-medium">Alacak</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">0,00 ₺</p>
                          </div>
                          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 font-medium">Bakiye</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">0,00 ₺ (A)</p>
                          </div>
                        </div>
                      </div>

                      {/* Profil Menü İkonları */}
                      <div className="flex items-center gap-1">
                        {[
                          { icon: <UserIcon size={18} />, label: 'Profil', action: () => onNavigate('profile') },
                          { icon: <Wallet size={18} />, label: 'Hesap', action: () => onNavigate('profile') },
                          { icon: <MapPin size={18} />, label: 'Adresler', action: () => onNavigate('profile') },
                          { icon: <FileText size={18} />, label: 'Faturalar', action: () => onNavigate('profile') },
                          { icon: <ShoppingBag size={18} />, label: 'Siparişler', action: () => onNavigate('profile') },
                          { icon: <ArrowLeftRight size={18} />, label: 'İadeler', action: () => onNavigate('profile') },
                          { icon: <Lock size={18} />, label: 'Güvenlik', action: () => onNavigate('profile') },
                          { icon: <Power size={18} />, label: 'Çıkış', action: onLogout, isLogout: true }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={item.action}
                            className={`p-2.5 rounded-xl transition-all ${
                              item.isLogout 
                                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title={item.label}
                          >
                            {item.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Kapatma Butonu */}
                  <button
                    onClick={() => setIsUserBarOpen(false)}
                    className="w-full py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 border-t border-slate-100 dark:border-slate-700"
                  >
                    <ChevronUp size={14} className="text-slate-400" />
                    <span className="text-[10px] font-medium text-slate-400">Kapat</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* --- Navigation Sidebar --- */}
      <AnimatePresence>
        {isNavSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsNavSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[340px] bg-white dark:bg-slate-950 z-[110] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg sm:text-xl font-display font-bold text-blue-600">MENÜ</h2>
                <button onClick={() => setIsNavSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-900 dark:text-white">
                  <X size={22} />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Kategoriler Bölümü */}
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Kategoriler</p>
                  <div className="space-y-1">
                    {MENU_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      const isOpen = openCategory === category.id;
                      return (
                        <div key={category.id}>
                          {/* Ana Kategori */}
                          <button
                            onClick={() => setOpenCategory(isOpen ? null : category.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                              isOpen 
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              isOpen 
                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              <IconComponent size={20} />
                            </div>
                            <span className="flex-1 text-left font-semibold">{category.name}</span>
                            <ChevronDown 
                              size={18} 
                              className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          {/* Alt Kategoriler */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-6 pr-2 py-2 space-y-1">
                                  {category.subCategories.map((sub) => {
                                    const SubIcon = sub.icon;
                                    return (
                                      <button
                                        key={sub.id}
                                        onClick={() => {
                                          onNavigate('home');
                                          setIsNavSidebarOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-all group"
                                      >
                                        <SubIcon size={16} className="text-slate-400 group-hover:text-blue-500" />
                                        <span className="flex-1 text-left">{sub.name}</span>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                      </button>
                                    );
                                  })}
                                  {/* Tümünü Gör */}
                                  <button
                                    onClick={() => {
                                      onNavigate('home');
                                      setIsNavSidebarOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all mt-2"
                                  >
                                    Tüm {category.name} Ürünleri
                                    <ChevronRight size={14} />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm">
                      <Instagram size={18} />
                    </a>
                    <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm">
                      <Twitter size={18} />
                    </a>
                    <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm">
                      <Facebook size={18} />
                    </a>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">© 2026 Güzel Teknoloji</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <main className={`flex-1 transition-all duration-300 ${user && isUserBarOpen ? 'pt-36 sm:pt-44' : 'pt-16 sm:pt-20'}`}>
        {children}
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 text-slate-800 dark:text-white">
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display font-bold text-sm sm:text-base mb-4 sm:mb-6">İletişim Bilgileri</h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2 sm:gap-3"><MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" /> Teknoloji Cad. No:123, İstanbul</li>
              <li className="flex items-center gap-2 sm:gap-3"><Phone size={16} className="text-blue-600 shrink-0" /> 0850 123 45 67</li>
              <li className="flex items-center gap-2 sm:gap-3"><Mail size={16} className="text-blue-600 shrink-0" /> destek@guzelteknoloji.com</li>
            </ul>
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Instagram size={18} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
              <Twitter size={18} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
              <Facebook size={18} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
              <Youtube size={18} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm sm:text-base mb-4 sm:mb-6">Sık Kullanılanlar</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Yeni Gelenler</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Çok Satanlar</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Kampanyalar</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Markalar</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm sm:text-base mb-4 sm:mb-6">Sözleşmeler</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Mesafeli Satış Sözleşmesi</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">İptal ve İade Koşulları</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Gizlilik Politikası</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">KVKK Aydınlatma Metni</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm sm:text-base mb-4 sm:mb-6">Bilgi/İletişim</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li onClick={() => onNavigate('hakkimizda')} className="hover:text-blue-600 cursor-pointer transition-colors">Hakkımızda</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Mağazalarımız</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Kariyer</li>
              <li onClick={() => onNavigate('iletisim')} className="hover:text-blue-600 cursor-pointer transition-colors">Bize Ulaşın</li>
            </ul>
          </div>
        </div>

        {/* SATIŞ PLATFORMLARIMIZ Bantı */}
        <div className="bg-slate-100/50 dark:bg-slate-800/50 py-6 sm:py-8 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <h5 className="text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">SATIŞ PLATFORMLARIMIZ</h5>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
              {/* Hepsiburada */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10 transition-all cursor-pointer group">
                <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md sm:rounded-lg flex items-center justify-center text-white font-black text-[10px] sm:text-xs">H</div>
                <span className="font-bold text-[10px] sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-orange-500 transition-colors">Hepsiburada</span>
              </div>
              
              {/* Trendyol */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all cursor-pointer group">
                <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-600 to-red-500 rounded-md sm:rounded-lg flex items-center justify-center text-white font-black text-[10px] sm:text-xs">T</div>
                <span className="font-bold text-[10px] sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-orange-600 transition-colors">Trendyol</span>
              </div>
              
              {/* N11 */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer group">
                <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-purple-600 to-purple-700 rounded-md sm:rounded-lg flex items-center justify-center text-white font-black text-[8px] sm:text-[10px]">N11</div>
                <span className="font-bold text-[10px] sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-purple-600 transition-colors">N11</span>
              </div>
              
              {/* Amazon */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer group">
                <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-slate-800 to-slate-900 rounded-md sm:rounded-lg flex items-center justify-center text-amber-400 font-black text-[10px] sm:text-xs">a</div>
                <span className="font-bold text-[10px] sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-amber-600 transition-colors">Amazon</span>
              </div>
              
              {/* Çiçeksepeti */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/10 transition-all cursor-pointer group">
                <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-pink-500 to-rose-500 rounded-md sm:rounded-lg flex items-center justify-center text-white text-xs sm:text-sm">🌸</div>
                <span className="font-bold text-[10px] sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-pink-500 transition-colors">Çiçeksepeti</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banka Hesapları Bölümü (Gradyanlı) */}
        <div className="footer-gradient py-8 sm:py-12 md:py-16 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 sm:w-72 sm:h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-72 sm:h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="relative max-w-5xl mx-auto px-3 sm:px-4">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-3 sm:mb-4">
                <Wallet size={14} className="text-white/80" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80">Güvenli Ödeme</span>
              </div>
              <h5 className="text-lg sm:text-xl md:text-2xl font-display font-bold">Banka Hesaplarımız</h5>
              <p className="text-[10px] sm:text-xs text-white/50 mt-1 sm:mt-2">Havale/EFT ile güvenle ödeme yapabilirsiniz</p>
            </div>

            {/* Bank Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {[
                { name: 'QNB Finansbank', short: 'QNB', color: 'from-purple-500/20 to-purple-600/20', borderColor: 'border-purple-400/30', hoverBg: 'hover:bg-purple-500/20', logoGradient: 'from-purple-400 to-violet-500' },
                { name: 'Garanti BBVA', short: 'BBVA', color: 'from-green-500/20 to-emerald-600/20', borderColor: 'border-green-400/30', hoverBg: 'hover:bg-green-500/20', logoGradient: 'from-green-400 to-emerald-500' },
                { name: 'Akbank', short: 'Akbank', color: 'from-red-400/15 to-rose-500/15', borderColor: 'border-red-300/25', hoverBg: 'hover:bg-red-400/20', logoGradient: 'from-red-400 to-rose-500' },
                { name: 'İş Bankası', short: 'İşBank', color: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-blue-400/30', hoverBg: 'hover:bg-blue-500/20', logoGradient: 'from-blue-400 to-indigo-500' },
                { name: 'Ziraat Bankası', short: 'Ziraat', color: 'from-cyan-500/20 to-teal-600/20', borderColor: 'border-cyan-400/30', hoverBg: 'hover:bg-cyan-500/20', logoGradient: 'from-cyan-400 to-teal-500' },
              ].map((bank) => (
                <button 
                  key={bank.name} 
                  onClick={() => setSelectedBank(bank.name)}
                  className={`group relative bg-gradient-to-br ${bank.color} ${bank.hoverBg} backdrop-blur-sm rounded-xl sm:rounded-2xl border ${bank.borderColor} p-3 sm:p-4 md:p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-white/5`}
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${bank.logoGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white font-display font-black text-[10px] sm:text-sm tracking-tight">{bank.short}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-white/90 text-center leading-tight">{bank.name}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="bg-white dark:bg-slate-900 py-6 sm:py-8 border-t border-slate-200/50 dark:border-slate-800/50 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium text-center md:text-left">© 2026 GÜZEL TEKNOLOJİ. TÜM HAKLARI SAKLIDIR.</p>
            <div className="flex gap-2 sm:gap-4">
              <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-black text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-slate-900 transition-all shadow-lg">
                <Smartphone size={14} className="sm:hidden" />
                <Smartphone size={16} className="hidden sm:block" />
                App Store
              </button>
              <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-black text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-slate-900 transition-all shadow-lg">
                <CreditCard size={14} className="sm:hidden" />
                <CreditCard size={16} className="hidden sm:block" />
                Google Play
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Search Overlay --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 sm:top-24 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl bg-white dark:bg-slate-900 z-[310] shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Search Input */}
              <div className="relative border-b border-slate-100 dark:border-slate-800">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Ürün, marka veya kategori ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-4 pl-12 pr-12 text-base outline-none text-slate-900 dark:text-white placeholder-slate-400"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              
              {/* Arama Sonuçları */}
              {searchResults.length > 0 ? (
                <div className="p-4 max-h-80 overflow-y-auto">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                    {searchResults.length} sonuç bulundu
                  </p>
                  <div className="space-y-2">
                    {searchResults.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onNavigateToProduct(product);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-14 h-14 rounded-lg object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">{product.brand}</p>
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">{product.name}</p>
                          <p className="text-sm font-bold text-green-600">{product.price.toLocaleString('tr-TR')} TL</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim() ? (
                <div className="p-8 text-center">
                  <Search size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
                  <p className="text-slate-500 font-medium">"{searchQuery}" için sonuç bulunamadı</p>
                  <p className="text-sm text-slate-400 mt-1">Farklı kelimelerle aramayı deneyin</p>
                </div>
              ) : (
                /* Popular Searches */
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Popüler Aramalar</p>
                  <div className="flex flex-wrap gap-2">
                    {['iPhone 15', 'MacBook Pro', 'PlayStation 5', 'AirPods', 'Samsung'].map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium hover:bg-blue-600 hover:text-white transition-all text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Keyboard shortcut hint */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Aramak için yazın</span>
                <kbd className="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono text-[10px]">ESC</kbd>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Cart Drawer --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-950 z-[160] shadow-2xl flex flex-col"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white">Sepetim ({cartCount})</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-900 dark:text-white"><X size={22} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag size={64} className="mb-4 opacity-20" />
                    <p>Sepetiniz henüz boş.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-slate-900 dark:text-white">{item.name}</h4>
                        <p className="text-blue-600 font-bold text-sm">{item.price.toLocaleString('tr-TR')} TL</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-center text-slate-900 dark:text-white">-</button>
                          <span className="text-xs text-slate-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-center text-slate-900 dark:text-white">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500 text-xs">Kaldır</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-900 space-y-3">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Toplam</span>
                    <span>{cartTotal.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <button 
                    onClick={() => {
                      onNavigate('checkout');
                      setIsCartOpen(false);
                    }}
                    className="btn-primary w-full"
                  >
                    Ödemeye Geç
                  </button>
                  {user && (
                    <button 
                      onClick={() => setIsSaveCartModalOpen(true)}
                      className="w-full py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Bookmark size={16} /> Sepeti Kaydet
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Save Cart Modal --- */}
      <AnimatePresence>
        {isSaveCartModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSaveCartModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm bg-white dark:bg-slate-900 z-[210] shadow-2xl rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sepeti Kaydet</h3>
                <button onClick={() => setIsSaveCartModalOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">Sepet Adı</label>
                  <input
                    type="text"
                    value={saveCartName}
                    onChange={(e) => setSaveCartName(e.target.value)}
                    placeholder="Örn: Ofis Alışverişim"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-2">{cart.length} ürün kaydedilecek</p>
                  <div className="flex -space-x-2">
                    {cart.slice(0, 5).map((item, idx) => (
                      <img key={idx} src={item.image} alt="" className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-800 object-cover" />
                    ))}
                    {cart.length > 5 && (
                      <div className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        +{cart.length - 5}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setIsSaveCartModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={() => {
                      if (saveCartName.trim()) {
                        onSaveCart(saveCartName.trim());
                        setSaveCartName('');
                        setIsSaveCartModalOpen(false);
                      }
                    }}
                    disabled={!saveCartName.trim()}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Favorites Drawer --- */}
      <AnimatePresence>
        {isFavOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFavOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-950 z-[160] shadow-2xl flex flex-col"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-display font-bold text-red-500 flex items-center gap-2">
                  <Heart size={20} fill="currentColor" className="sm:hidden" /><Heart size={24} fill="currentColor" className="hidden sm:block" /> Favorilerim ({favCount})
                </h2>
                <div className="flex items-center gap-2">
                  {favorites.length > 0 && (
                    <button
                      onClick={async () => {
                        const text = `🛍️ Güzel Teknoloji - Favori Listem\n\n${favorites.map((p, i) => `${i + 1}. ${p.name} — ${p.price.toLocaleString('tr-TR')} TL`).join('\n')}\n\nToplam: ${favorites.length} ürün`;
                        
                        if (navigator.share) {
                          try {
                            await navigator.share({ title: 'Favori Listem - Güzel Teknoloji', text });
                          } catch { /* kullanıcı iptal etti */ }
                        } else {
                          await navigator.clipboard.writeText(text);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-lg text-xs font-bold hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors"
                      title="Favori listeni paylaş"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span className="hidden sm:inline">{copied ? 'Kopyalandı!' : 'Paylaş'}</span>
                    </button>
                  )}
                  <button onClick={() => setIsFavOpen(false)} className="text-slate-900 dark:text-white"><X size={22} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {favorites.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Heart size={64} className="mb-4 opacity-20" />
                    <p>Henüz favori ürününüz yok.</p>
                  </div>
                ) : (
                  <>
                    {favorites.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-slate-900 dark:text-white">{item.name}</h4>
                          <p className="text-blue-600 font-bold text-sm">{item.price.toLocaleString('tr-TR')} TL</p>
                          <div className="flex items-center gap-3 mt-4">
                            <button 
                              onClick={() => {
                                addToCart(item);
                                removeFromFav(item.id);
                              }}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              Sepete Ekle
                            </button>
                            <button 
                              onClick={() => removeFromFav(item.id)}
                              className="ml-auto text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Toplam + Tümünü Sepete Ekle */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{favorites.length} ürün</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {favorites.reduce((sum, p) => sum + p.price, 0).toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          favorites.forEach(p => addToCart(p));
                        }}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                      >
                        Tümünü Sepete Ekle
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Bank Modal --- */}
      <AnimatePresence>
        {selectedBank && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedBank(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white dark:bg-slate-900 z-[210] shadow-2xl rounded-2xl sm:rounded-[2.5rem] overflow-hidden overflow-y-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]"
            >
              {/* Card Header - Bank Brand */}
              <div className={`relative p-5 sm:p-8 pb-10 sm:pb-12 ${
                selectedBank === 'QNB Finansbank' ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800' :
                selectedBank === 'Garanti BBVA' ? 'bg-gradient-to-br from-green-600 via-green-700 to-emerald-800' :
                selectedBank === 'Akbank' ? 'bg-gradient-to-br from-red-600 via-red-700 to-rose-800' :
                selectedBank === 'İş Bankası' ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800' :
                'bg-gradient-to-br from-cyan-600 via-teal-700 to-teal-800'
              }`}>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-36 sm:h-36 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                </div>
                <div className="relative flex justify-between items-start">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Bank Logo */}
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                      <span className="text-white font-display font-black text-xs sm:text-base tracking-tight">
                        {selectedBank === 'QNB Finansbank' ? 'QNB' :
                         selectedBank === 'Garanti BBVA' ? 'BBVA' :
                         selectedBank === 'Akbank' ? 'Ak' :
                         selectedBank === 'İş Bankası' ? 'İş' : 'ZB'}
                      </span>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <h3 className="text-base sm:text-xl font-display font-bold text-white">{selectedBank}</h3>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/15 backdrop-blur-sm">
                        <CreditCard size={10} className="text-white/80 sm:hidden" /><CreditCard size={12} className="text-white/80 hidden sm:block" />
                        <span className="text-[8px] sm:text-[10px] font-bold text-white/80 uppercase tracking-wider">Hesap Bilgileri</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedBank(null)} className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white">
                    <X size={18} className="sm:hidden" /><X size={22} className="hidden sm:block" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-8 -mt-5 sm:-mt-6 relative">
                {/* Main Info Card */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                  {/* Alıcı Adı */}
                  <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-700/50">
                    <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                      <UserIcon size={12} className="text-slate-300 dark:text-slate-600" />
                      Alıcı Adı
                    </label>
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">ERCAN GÜZEL</p>
                  </div>

                  {/* Şube */}
                  <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-700/50">
                    <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                      <MapPin size={12} className="text-slate-300 dark:text-slate-600" />
                      Şube
                    </label>
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Merkez Şube</p>
                  </div>

                  {/* IBAN */}
                  <div className="p-3.5 sm:p-5">
                    <label className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                      <CreditCard size={12} className="text-slate-300 dark:text-slate-600" />
                      IBAN
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <p className="font-mono text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 break-all flex-1 leading-relaxed">TR00 0000 0000 0000 0000 0000 00</p>
                      <button 
                        onClick={() => copyToClipboard('TR00 0000 0000 0000 0000 0000 00')}
                        className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all shrink-0 ${
                          copied 
                            ? 'bg-green-50 dark:bg-green-500/10 text-green-500 shadow-sm shadow-green-500/10' 
                            : 'bg-white dark:bg-slate-700 text-slate-400 hover:text-blue-600 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    {copied && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] sm:text-xs text-green-500 font-medium mt-1.5 sm:mt-2 flex items-center gap-1"
                      >
                        <Check size={12} /> IBAN kopyalandı!
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Info Note */}
                <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-amber-50 dark:bg-amber-500/5 rounded-lg sm:rounded-xl border border-amber-100 dark:border-amber-500/10">
                  <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400 text-center leading-relaxed flex items-start sm:items-center justify-center gap-1.5 sm:gap-2">
                    <FileText size={14} className="shrink-0 mt-0.5 sm:mt-0" />
                    <span>Ödeme yaparken açıklama kısmına <strong>sipariş numaranızı</strong> yazmayı unutmayınız.</span>
                  </p>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setSelectedBank(null)} 
                  className="mt-4 sm:mt-5 btn-primary w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/905001234567?text=Merhaba,%20ürünleriniz%20hakkında%20bilgi%20almak%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 group"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-shadow">
            <MessageCircle size={22} className="text-white fill-white sm:hidden" />
            <MessageCircle size={26} className="text-white fill-white hidden sm:block" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp ile yazın
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-slate-900" />
          </div>
          
          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        </motion.div>
      </a>
    </div>
  );
}
