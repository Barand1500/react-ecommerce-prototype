import { motion } from 'motion/react';
import { Home as HomeIcon } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

export default function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Astronaut / Lost in Space Theme */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/3 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl"
        />

        {/* Main Content */}
        <div className="relative text-center">
          {/* 404 Text with Glitch Effect */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative"
          >
            {/* Glitch layers */}
            <motion.h1 
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 text-[10rem] md:text-[14rem] lg:text-[18rem] font-display font-black text-cyan-500/30 select-none"
              style={{ clipPath: 'inset(0 0 50% 0)' }}
            >
              404
            </motion.h1>
            <motion.h1 
              animate={{ x: [2, -2, 2] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 text-[10rem] md:text-[14rem] lg:text-[18rem] font-display font-black text-pink-500/30 select-none"
              style={{ clipPath: 'inset(50% 0 0 0)' }}
            >
              404
            </motion.h1>
            <h1 className="text-[10rem] md:text-[14rem] lg:text-[18rem] font-display font-black bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent select-none leading-none">
              404
            </h1>
          </motion.div>

          {/* Floating Planet */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-8 -right-8 md:right-0"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="relative w-20 h-20 md:w-28 md:h-28"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-amber-500 to-red-500 shadow-2xl shadow-orange-500/50" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-tl from-orange-300/50 to-transparent" />
              {/* Ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 md:w-44 h-4 md:h-6 border-2 border-orange-300/30 rounded-full -rotate-12" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Bağlantı Koptu
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Houston, bir sorunumuz var!
            </h2>
            <p className="text-lg text-slate-400 max-w-lg mx-auto">
              Aradığınız sayfa uzayın derinliklerinde kaybolmuş görünüyor. 
              Belki de bir kara deliğe düştü...
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('home')} 
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl text-white font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <HomeIcon size={20} />
                Ana Üsse Dön
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()} 
              className="px-8 py-4 border border-white/20 backdrop-blur-sm rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Geri Git
            </motion.button>
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 mt-16 text-slate-500"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">&#8734;</div>
              <div className="text-xs">Işık Yılı Uzakta</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs">Sayfa Bulundu</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">&#128760;</div>
              <div className="text-xs">UFO Görüldü</div>
            </div>
          </motion.div>
        </div>

        {/* Floating Rocket */}
        <motion.div
          initial={{ x: -100, y: 100, opacity: 0 }}
          animate={{ 
            x: [null, 0, 50, 0],
            y: [null, 0, -20, 0],
            opacity: 1,
            rotate: [null, 0, 5, 0],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-10 md:left-20 text-6xl md:text-8xl select-none"
        >
          &#128640;
        </motion.div>

        {/* Floating UFO */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-10 md:right-32 text-4xl md:text-5xl select-none"
        >
          &#128760;
        </motion.div>

        {/* Small Moon */}
        <motion.div
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-40 right-20 md:right-40"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg">
            <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-slate-400/50" />
            <div className="absolute top-5 right-2 w-3 h-3 rounded-full bg-slate-400/50" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
