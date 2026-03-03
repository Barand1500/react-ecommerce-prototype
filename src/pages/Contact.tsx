import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
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
              
              <form className="flex-1 p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                <button type="submit" className="btn-primary w-full py-4 mt-4 shadow-blue-500/40">Gönder</button>
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
}
