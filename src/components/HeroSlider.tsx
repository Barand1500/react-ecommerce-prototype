import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../constants';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  const prev = () => setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="relative h-[60vh] md:h-[75vh] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 transition-colors duration-500">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_SLIDES[current].image} 
            alt={HERO_SLIDES[current].title}
            className="w-full h-full object-cover opacity-30 dark:opacity-40 transition-opacity duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-slate-950/90 dark:via-slate-950/60 dark:to-transparent transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-2xl"
              >
                <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-4 text-slate-800 dark:text-white transition-colors duration-500">
                  {HERO_SLIDES[current].title}
                </h2>
                <p className="text-xl md:text-2xl mb-8 opacity-80 text-slate-600 dark:text-slate-300 transition-colors duration-500">
                  {HERO_SLIDES[current].subtitle}
                </p>
                <button className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl ${HERO_SLIDES[current].color}`}>
                  {HERO_SLIDES[current].buttonText}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-10">
        <button 
          onClick={prev}
          className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-white bg-white/50 dark:bg-transparent backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next}
          className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-white bg-white/50 dark:bg-transparent backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-8 flex gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all rounded-full ${current === i ? 'w-12 bg-blue-600' : 'w-4 bg-slate-400/50 dark:bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
}
