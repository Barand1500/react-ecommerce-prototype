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
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 transition-colors duration-500">
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
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-white/95 via-white/70 to-white/30 sm:from-white/90 sm:via-white/60 sm:to-transparent dark:from-slate-950/95 dark:via-slate-950/70 dark:to-slate-950/30 sm:dark:from-slate-950/90 sm:dark:via-slate-950/60 sm:dark:to-transparent transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-[90%] sm:max-w-xl md:max-w-2xl"
              >
                <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-2 sm:mb-4 text-slate-800 dark:text-white transition-colors duration-500">
                  {HERO_SLIDES[current].title}
                </h2>
                <p className="text-sm xs:text-base sm:text-xl md:text-2xl mb-4 sm:mb-8 opacity-80 text-slate-600 dark:text-slate-300 transition-colors duration-500 line-clamp-2 sm:line-clamp-none">
                  {HERO_SLIDES[current].subtitle}
                </p>
                <button className={`px-4 sm:px-8 py-2.5 sm:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-xl ${HERO_SLIDES[current].color}`}>
                  {HERO_SLIDES[current].buttonText}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 flex gap-2 sm:gap-4 z-10">
        <button 
          onClick={prev}
          className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-white bg-white/50 dark:bg-transparent backdrop-blur-sm"
        >
          <ChevronLeft size={18} className="sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={next}
          className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-white bg-white/50 dark:bg-transparent backdrop-blur-sm"
        >
          <ChevronRight size={18} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 flex gap-1.5 sm:gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all rounded-full ${current === i ? 'w-8 sm:w-12 bg-blue-600' : 'w-3 sm:w-4 bg-slate-400/50 dark:bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
}
