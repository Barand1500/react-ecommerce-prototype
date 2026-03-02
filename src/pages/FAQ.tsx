import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, HelpCircle, MessageCircle, Phone, Search, 
  Truck, RefreshCcw, CreditCard, Shield, MapPin, Building2,
  Sparkles, ArrowRight, CheckCircle2, Zap
} from 'lucide-react';
import { FAQ_DATA } from '../constants';

// Kategori tanımları
const CATEGORIES = [
  { id: 'all', name: 'Tümü', icon: <Sparkles size={18} />, color: 'from-blue-500 to-violet-500' },
  { id: 'shipping', name: 'Kargo & Teslimat', icon: <Truck size={18} />, color: 'from-emerald-500 to-teal-500' },
  { id: 'returns', name: 'İade & Değişim', icon: <RefreshCcw size={18} />, color: 'from-amber-500 to-orange-500' },
  { id: 'payment', name: 'Ödeme', icon: <CreditCard size={18} />, color: 'from-pink-500 to-rose-500' },
  { id: 'warranty', name: 'Garanti', icon: <Shield size={18} />, color: 'from-cyan-500 to-blue-500' },
  { id: 'store', name: 'Mağaza', icon: <MapPin size={18} />, color: 'from-violet-500 to-purple-500' },
];

// Genişletilmiş FAQ verisi (kategorili)
const EXTENDED_FAQ = [
  {
    category: 'shipping',
    question: "Kargo ne kadar sürede ulaşır?",
    answer: "Siparişleriniz genellikle 24 saat içinde kargoya verilir ve bulunduğunuz bölgeye göre 1-3 iş günü içinde teslim edilir. İstanbul içi teslimatlarımızda aynı gün kargo seçeneği de mevcuttur.",
    popular: true
  },
  {
    category: 'shipping',
    question: "Kargo ücretsiz mi?",
    answer: "500 TL ve üzeri siparişlerinizde kargo tamamen ücretsizdir. 500 TL altı siparişlerde standart kargo ücreti 29,90 TL'dir.",
    popular: false
  },
  {
    category: 'shipping',
    question: "Hangi kargo firmasıyla gönderim yapıyorsunuz?",
    answer: "Yurtiçi Kargo, Aras Kargo ve MNG Kargo ile anlaşmalıyız. Sipariş verirken tercih ettiğiniz kargo firmasını seçebilirsiniz.",
    popular: false
  },
  {
    category: 'returns',
    question: "İade politikanız nedir?",
    answer: "Ürünlerimizi teslim aldığınız tarihten itibaren 14 gün içinde orijinal kutusu ve faturasıyla birlikte ücretsiz olarak iade edebilirsiniz. Hijyenik ürünler (kulaklık vb.) kutusu açılmadığı sürece iade kapsamındadır.",
    popular: true
  },
  {
    category: 'returns',
    question: "İade sürecinde kargo ücreti ödüyor muyum?",
    answer: "Hayır, iade kargo ücreti tamamen tarafımıza aittir. Anlaşmalı kargo firmalarından ücretsiz iade kodu alabilirsiniz.",
    popular: false
  },
  {
    category: 'returns',
    question: "Değişim nasıl yapılır?",
    answer: "Ürün değişimi için müşteri hizmetlerimizi aramanız yeterlidir. Mevcut ürününüz teslim alındıktan sonra 24 saat içinde yeni ürününüz kargoya verilir.",
    popular: false
  },
  {
    category: 'warranty',
    question: "Ürünleriniz garantili mi?",
    answer: "Evet, tüm ürünlerimiz en az 2 yıl resmi distribütör veya üretici garantisi altındadır. Bazı ürün gruplarında ek garanti paketleri satın alma imkanınız bulunmaktadır.",
    popular: true
  },
  {
    category: 'warranty',
    question: "Garanti kapsamı dışında kalan durumlar nelerdir?",
    answer: "Kullanıcı kaynaklı fiziksel hasarlar, su teması, yetkisiz servis müdahaleleri ve doğal afet kaynaklı hasarlar garanti kapsamı dışındadır.",
    popular: false
  },
  {
    category: 'payment',
    question: "Taksit imkanı var mı?",
    answer: "Anlaşmalı bankaların kredi kartlarına 12 aya varan taksit seçenekleri sunuyoruz. Ayrıca alışveriş kredisi seçeneklerimizle 36 aya kadar vadelendirme yapabilirsiniz.",
    popular: true
  },
  {
    category: 'payment',
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer: "Kredi kartı, banka kartı, havale/EFT, kapıda ödeme (nakit veya kart) ve alışveriş kredisi seçeneklerimiz mevcuttur.",
    popular: false
  },
  {
    category: 'payment',
    question: "Kapıda ödeme yapabilir miyim?",
    answer: "Evet, kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz. Kapıda ödeme seçeneğinde 14,90 TL hizmet bedeli uygulanmaktadır.",
    popular: false
  },
  {
    category: 'warranty',
    question: "Ürünler orijinal mi?",
    answer: "Güzel Teknoloji olarak sadece yetkili satıcı ve distribütörlerden temin edilen %100 orijinal ürünlerin satışını yapıyoruz. Her ürünün orijinalliği garantimiz altındadır.",
    popular: true
  },
  {
    category: 'store',
    question: "Mağazanız nerede?",
    answer: "Antalya ve Nevşehir'de fiziksel mağazalarımız bulunmaktadır. Mağazalarımızda ürünleri deneyimleyebilir, uzman ekibimizden danışmanlık alabilirsiniz.",
    popular: false
  },
  {
    category: 'store',
    question: "Mağazadan sipariş verebilir miyim?",
    answer: "Evet, mağazalarımızda stokta olmayan ürünler için sipariş verebilir, kargosuz mağazadan teslim alabilirsiniz.",
    popular: false
  },
  {
    category: 'store',
    question: "Kurumsal satış yapıyor musunuz?",
    answer: "Evet, şirketler için toplu alımlarda özel fiyatlandırma ve danışmanlık hizmeti sunuyoruz. Kurumsal talepleriniz için kurumsal@guzelteknoloji.com adresinden bize ulaşabilirsiniz.",
    popular: false
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrelenmiş FAQ
  const filteredFAQ = useMemo(() => {
    return EXTENDED_FAQ.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Popüler sorular
  const popularQuestions = EXTENDED_FAQ.filter(item => item.popular);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 sm:space-y-6 md:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm"
            >
              <Zap size={14} className="text-yellow-400" />
              <span>7/24 Destek</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white">
              Nasıl{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                yardımcı
              </span>
              {' '}olabiliriz?
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Aklınıza takılan tüm soruların cevaplarını burada bulabilirsiniz
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                  <Search className="absolute left-6 text-slate-400" size={22} />
                  <input
                    type="text"
                    placeholder="Soru ara... (örn: kargo, iade, taksit)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-transparent rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 outline-none text-lg"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-6 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 md:pt-8"
            >
              {[
                { value: '15+', label: 'Soru Cevap' },
                { value: '24/7', label: 'Destek' },
                { value: '<1dk', label: 'Yanıt Süresi' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 pb-12 sm:pb-16 md:pb-24">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-6 sm:mb-8 md:mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`group relative px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'text-white shadow-xl scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:shadow-lg border border-slate-100 dark:border-slate-700'
              }`}
            >
              {selectedCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className={`absolute inset-0 bg-gradient-to-r ${cat.color} rounded-2xl`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative">{cat.icon}</span>
              <span className="relative">{cat.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Popular Questions (only show when 'all' is selected and no search) */}
        {selectedCategory === 'all' && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 sm:mb-8 md:mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popüler Sorular</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularQuestions.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const fullIndex = EXTENDED_FAQ.findIndex(f => f.question === item.question);
                    setOpenIndex(fullIndex);
                    // Scroll to FAQ section
                    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group p-5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 text-left hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.question}
                      </p>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.answer}</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ Accordion */}
        <div id="faq-section" className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white">
                <HelpCircle size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedCategory === 'all' ? 'Tüm Sorular' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-sm text-slate-500">{filteredFAQ.length} soru bulundu</p>
              </div>
            </div>
          </div>

          {filteredFAQ.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Search size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sonuç bulunamadı</h3>
              <p className="text-slate-500">Farklı anahtar kelimeler deneyin veya kategorilere göz atın</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {filteredFAQ.map((item, index) => {
                  const fullIndex = EXTENDED_FAQ.findIndex(f => f.question === item.question);
                  const isOpen = openIndex === fullIndex;
                  const categoryInfo = CATEGORIES.find(c => c.id === item.category);

                  return (
                    <motion.div
                      key={fullIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all duration-500 ${
                        isOpen 
                          ? 'shadow-2xl shadow-blue-500/10 ring-2 ring-blue-500/20' 
                          : 'shadow-lg hover:shadow-xl border border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {/* Gradient accent line */}
                      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${categoryInfo?.color || 'from-blue-500 to-violet-500'} transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

                      <button
                        onClick={() => setOpenIndex(isOpen ? null : fullIndex)}
                        className="w-full p-6 md:p-8 flex items-start gap-4 text-left"
                      >
                        {/* Number badge */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                          isOpen 
                            ? `bg-gradient-to-br ${categoryInfo?.color || 'from-blue-500 to-violet-500'} text-white` 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Category badge */}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${
                            isOpen
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {categoryInfo?.icon}
                            {categoryInfo?.name}
                          </span>
                          
                          <h3 className={`text-lg font-bold transition-colors ${
                            isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                          }`}>
                            {item.question}
                          </h3>
                        </div>

                        {/* Toggle icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isOpen 
                            ? 'bg-blue-600 text-white rotate-180' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                        }`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 md:px-8 pb-8 pl-20 md:pl-24">
                              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                  {item.answer}
                                </p>
                                {/* Helpful badge */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                  <CheckCircle2 size={16} className="text-emerald-500" />
                                  <span className="text-sm text-slate-500">Bu bilgi faydalı oldu mu?</span>
                                  <button className="ml-2 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                                    Evet
                                  </button>
                                  <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                    Hayır
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 md:mt-20"
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Background effects */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">
                  <MessageCircle size={16} />
                  <span>Destek Ekibi</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
                  Hala sorunuz mu var?
                </h3>
                <p className="text-xl text-slate-400 max-w-md">
                  Uzman ekibimiz size yardımcı olmak için hazır bekliyor
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl hover:shadow-white/20 transition-all"
                >
                  <MessageCircle size={22} />
                  <span>Canlı Destek</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold flex items-center justify-center gap-3 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Phone size={22} />
                  <span>0850 123 45 67</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
