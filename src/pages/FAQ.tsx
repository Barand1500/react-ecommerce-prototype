import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle, MessageCircle, Phone } from 'lucide-react';
import { FAQ_DATA } from '../constants';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center space-y-6 mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/20"
        >
          <HelpCircle size={40} />
        </motion.div>
        <h1 className="text-5xl font-display font-bold text-slate-900 dark:text-white">Sıkça Sorulan Sorular</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">Aklınıza takılan tüm soruların cevaplarını burada bulabilirsiniz. Aradığınız cevabı bulamazsanız bizimle iletişime geçmekten çekinmeyin.</p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, index) => (
          <div 
            key={index} 
            className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-8 flex items-center justify-between text-left"
            >
              <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}>
                {item.question}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8 text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-24 p-12 bg-blue-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-500/40">
        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-3xl font-display font-bold">Hala sorunuz mu var?</h3>
          <p className="text-blue-100 text-lg">Size yardımcı olmaktan mutluluk duyarız.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-50 transition-all">
            <MessageCircle size={20} /> Canlı Destek
          </button>
          <button className="px-8 py-4 bg-blue-700 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-800 transition-all border border-white/10">
            <Phone size={20} /> Bizi Arayın
          </button>
        </div>
      </div>
    </div>
  );
}
