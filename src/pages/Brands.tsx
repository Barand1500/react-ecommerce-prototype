import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../constants';

export default function Brands() {
  const [searchTerm, setSearchTerm] = useState('');

  const brandStats = useMemo(() => {
    const stats: Record<string, number> = {};
    PRODUCTS.forEach(p => {
      stats[p.brand] = (stats[p.brand] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }, []);

  const filteredBrands = brandStats.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center space-y-6 mb-20">
        <h1 className="text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          Tüm <span className="text-blue-600">Markalar</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Dünyanın en iyi teknoloji markalarını tek bir çatı altında keşfedin.
        </p>
        
        <div className="max-w-md mx-auto relative pt-8">
          <Search className="absolute left-4 top-[calc(2rem+1.25rem)] text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Marka ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-500/5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredBrands.map((brand, i) => (
          <motion.div 
            key={brand.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] text-center space-y-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] mx-auto flex items-center justify-center text-blue-600 font-display font-bold text-2xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
              {brand.name.charAt(0)}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {brand.name}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {brand.count} Ürün
              </p>
            </div>

            <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="inline-flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                Ürünleri Gör <ArrowRight size={14} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="py-32 text-center text-slate-400">
          <p className="text-xl">Aradığınız marka bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
