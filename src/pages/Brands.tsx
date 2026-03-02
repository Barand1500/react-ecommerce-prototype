import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { 
  SiApple, SiSamsung, SiSony, SiLg, SiXiaomi, SiHuawei,
  SiDell, SiHp, SiLenovo, SiAsus,
  SiLogitech, SiRazer, SiCorsair, SiJbl, SiBose,
  SiNvidia, SiIntel, SiAmd
} from 'react-icons/si';
import { BsMicrosoft } from 'react-icons/bs';
import { IconType } from 'react-icons';

// Marka logoları ve renkleri
const BRAND_CONFIG: Record<string, { icon: IconType; color: string; productCount: string }> = {
  'Apple': { icon: SiApple, color: '#555555', productCount: '150+' },
  'Samsung': { icon: SiSamsung, color: '#1428A0', productCount: '160+' },
  'Sony': { icon: SiSony, color: '#000000', productCount: '90+' },
  'LG': { icon: SiLg, color: '#A50034', productCount: '100+' },
  'Xiaomi': { icon: SiXiaomi, color: '#FF6700', productCount: '120+' },
  'Huawei': { icon: SiHuawei, color: '#CF0A2C', productCount: '85+' },
  'Dell': { icon: SiDell, color: '#007DB8', productCount: '120+' },
  'HP': { icon: SiHp, color: '#0096D6', productCount: '135+' },
  'Lenovo': { icon: SiLenovo, color: '#E2231A', productCount: '110+' },
  'ASUS': { icon: SiAsus, color: '#000000', productCount: '145+' },
  'Microsoft': { icon: BsMicrosoft, color: '#00A4EF', productCount: '85+' },
  'Logitech': { icon: SiLogitech, color: '#00B8FC', productCount: '95+' },
  'Razer': { icon: SiRazer, color: '#44D62C', productCount: '75+' },
  'Corsair': { icon: SiCorsair, color: '#000000', productCount: '80+' },
  'JBL': { icon: SiJbl, color: '#FF6600', productCount: '70+' },
  'Bose': { icon: SiBose, color: '#000000', productCount: '55+' },
  'NVIDIA': { icon: SiNvidia, color: '#76B900', productCount: '40+' },
  'Intel': { icon: SiIntel, color: '#0071C5', productCount: '35+' },
  'AMD': { icon: SiAmd, color: '#ED1C24', productCount: '30+' },
};

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

  const getBrandConfig = (brandName: string) => {
    return BRAND_CONFIG[brandName] || null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="text-center space-y-4 sm:space-y-6 mb-10 sm:mb-14 md:mb-20">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {filteredBrands.map((brand, i) => {
          const config = getBrandConfig(brand.name);
          const BrandIcon = config?.icon;
          
          return (
            <motion.div 
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl text-center space-y-3 sm:space-y-5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
            >
              {/* Logo */}
              <div className="h-16 flex items-center justify-center transition-transform group-hover:scale-110">
                {BrandIcon ? (
                  <BrandIcon 
                    size={52} 
                    color={config?.color}
                  />
                ) : (
                  <span 
                    className="text-4xl font-display font-bold"
                    style={{ color: '#3b82f6' }}
                  >
                    {brand.name.charAt(0)}
                  </span>
                )}
              </div>
              
              {/* Brand Name & Count */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {brand.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {config?.productCount || brand.count}+ Ürün
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="py-32 text-center text-slate-400">
          <p className="text-xl">Aradığınız marka bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
