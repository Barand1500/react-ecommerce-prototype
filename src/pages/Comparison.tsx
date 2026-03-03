import { useState } from 'react';
import { Product } from '../types';

interface ComparisonProps {
  comparisonList: Product[];
  onToggleCompare: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: string) => void;
}

export default function Comparison({ comparisonList, onToggleCompare, onAddToCart, onNavigate }: ComparisonProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Kategorilere göre gruplandır
  const groupedByCategory = comparisonList.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categories = Object.keys(groupedByCategory);
  const activeCategory = selectedCategory && categories.includes(selectedCategory)
    ? selectedCategory
    : categories[0] || null;
  const activeProducts = activeCategory ? groupedByCategory[activeCategory] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-display font-bold mb-8 text-center">Ürün Karşılaştırma</h1>
      {comparisonList.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl">
          <p className="text-slate-500 mb-6">Karşılaştırma listesinde ürün bulunmuyor.</p>
          <button onClick={() => onNavigate('home')} className="btn-primary">Ürünlere Göz At</button>
        </div>
      ) : (
        <>
          {/* Kategori Tab'ları */}
          {categories.length > 1 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
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
                        <button onClick={() => onToggleCompare(p)} className="text-xs text-red-500 hover:underline">Kaldır</button>
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
                      <button onClick={() => onAddToCart(p)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Sepete Ekle</button>
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
}
