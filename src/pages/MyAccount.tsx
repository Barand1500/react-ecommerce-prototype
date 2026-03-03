import { useState } from 'react';
import { ShoppingBag, Heart, MapPin, CreditCard, Settings } from 'lucide-react';
import { Product, User } from '../types';

interface MyAccountProps {
  user: User;
  favorites: Product[];
  onAddToCart: (product: Product) => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function MyAccount({ user, favorites, onAddToCart, onNavigate, onLogout }: MyAccountProps) {
  const [accountTab, setAccountTab] = useState('Siparişlerim');

  return (
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
              <button onClick={onLogout} className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Çıkış Yap</button>
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
                <button onClick={() => onNavigate('home')} className="btn-primary px-10 py-4">Alışverişe Başla</button>
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
                      <button onClick={() => onAddToCart(p)} className="mt-2 text-xs font-bold text-blue-600 hover:underline">Sepete Ekle</button>
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
              <button onClick={() => onNavigate('faq')} className="px-8 py-3 bg-slate-800 text-white rounded-2xl text-xs font-bold hover:bg-slate-700 transition-all border border-white/10">Destek Al</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
