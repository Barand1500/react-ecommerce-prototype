import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img src="https://picsum.photos/seed/tech-about/1920/1080" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="About Hero" referrerPolicy="no-referrer" />
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-display font-bold text-white leading-tight">Geleceği Bugün <span className="text-blue-500">Tasarlıyoruz.</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-300">Güzel Teknoloji, 15 yılı aşkın süredir teknoloji tutkunlarını en yeni ve en kaliteli ürünlerle buluşturuyor.</motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Mutlu Müşteri', value: '500K+' },
            { label: 'Yıllık Satış', value: '1M+' },
            { label: 'Mağaza Sayısı', value: '25' },
            { label: 'Yıllık Tecrübe', value: '15+' }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <h3 className="text-5xl font-display font-bold text-blue-600">{stat.value}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Vizyonumuz & Misyonumuz</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">Sadece bir teknoloji mağazası değil, aynı zamanda bir yaşam tarzı sunuyoruz. Teknolojinin insan hayatını kolaylaştıran ve güzelleştiren bir araç olduğuna inanıyoruz.</p>
            <div className="space-y-4">
              {[
                'Sürdürülebilir teknoloji çözümleri',
                'Müşteri odaklı hizmet anlayışı',
                'Yenilikçi ve öncü yaklaşım',
                'Güvenilir ve şeffaf ticaret'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{i+1}</div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full" />
            <img src="https://picsum.photos/seed/vision/800/600" className="relative rounded-[3rem] shadow-2xl" alt="Vision" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Ekibimizle Tanışın</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Başarımızın arkasındaki tutkulu ve uzman ekip.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Ercan Güzel', role: 'CEO & Kurucu', img: 'https://picsum.photos/seed/p1/400/400' },
              { name: 'Alği Köse', role: 'CTO', img: 'https://picsum.photos/seed/p2/400/400' },
              { name: 'Semihcan Güzel', role: 'Pazarlama Müdürü', img: 'https://picsum.photos/seed/p3/400/400' },
              { name: 'Nimet Demir', role: 'Müşteri İlişkileri', img: 'https://picsum.photos/seed/p4/400/400' }
            ].map((member, i) => (
              <div key={i} className="group space-y-4">
                <div className="relative overflow-hidden rounded-[2rem] aspect-square">
                  <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" alt={member.name} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h4>
                  <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
