import { useRef, useCallback, useState, useEffect, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, ChevronRight, Box, Layout, Stamp, Car, Lightbulb, PenTool,
  Store, Building2, Package, Calendar, Settings, Ruler, Layers, Wrench, Zap, Palette
} from 'lucide-react';
import { SERVICES } from '../data/services';
import { PORTFOLIO } from '../data/portfolio';
import AnimatedSignText from '../components/AnimatedSignText';

const MARQUEE_ITEMS = [
  'STOREFRONT SIGNS', 'VEHICLE WRAPS', 'LED ILLUMINATION', '3D LETTERS',
  'OFFICE BRANDING', 'CUSTOM STICKERS', 'ACRYLIC LETTERS', 'WINDOW GRAPHICS',
];

const FLOATING_BADGES = [
  { label: 'LED Signs',     Icon: Lightbulb, style: { top: '6%',    left: '4%'   }, delay: 0   },
  { label: '3D Letters',    Icon: Box,       style: { top: '12%',   right: '3%'  }, delay: 0.4 },
  { label: 'Vehicle Wraps', Icon: Car,       style: { top: '44%',   left: '1%'   }, delay: 0.8 },
  { label: 'Branding',      Icon: PenTool,   style: { top: '40%',   right: '1%'  }, delay: 1.2 },
  { label: 'Stickers',      Icon: Stamp,     style: { bottom: '16%',left: '6%'   }, delay: 1.6 },
  { label: '2D Signage',    Icon: Layout,    style: { bottom: '20%',right: '4%'  }, delay: 2.0 },
];


const SAMPLE_IMAGES = [
  { src: '/work/raffine-sign.png', label: '3D LETTERS'    },
  { src: '/work/dazzle-3d.jpg', label: 'SHOP SIGNS'     },
  { src: '/work/neon-cocktail.jpg', label: 'LED SIGNS'      },
  { src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80', label: 'VEHICLE WRAPS'  },
];
export default function Home() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    if (!spotlightRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background =
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(227,255,0,0.07), transparent 40%)`;
  }, []);
  const [currentSample, setCurrentSample] = useState(0);
  const [signsCount, setSignsCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let n = 0;
      const iv = setInterval(() => { n += 3; if (n >= 120) { setSignsCount(120); clearInterval(iv); } else setSignsCount(n); }, 20);
      return () => clearInterval(iv);
    }, 900);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setCurrentSample(p => (p + 1) % SAMPLE_IMAGES.length), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[100vh] flex flex-col items-center justify-center pt-20 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(227,255,0,0.08) 0%, #09092E 45%), radial-gradient(ellipse at bottom left, rgba(37,71,216,0.15) 0%, transparent 60%)" }} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(37,71,216,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,71,216,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Cursor spotlight â€” updated via direct DOM ref (zero re-renders) */}
        <div ref={spotlightRef} className="absolute inset-0 pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >


            {/* Headline with scramble effect */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.0] tracking-tight">
              WE MAKE YOUR BRAND{' '}
              <br className="hidden md:block" />
              <AnimatedSignText />
            </h1>

            <p className="text-lg text-gray-400 max-w-xl">
              Professional branding, 2D &amp; 3D signage, stickers and custom visual solutions designed to make your business stand out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="btn-shine bg-accent text-black px-8 py-4 rounded-full font-bold text-center hover:bg-accent-hover transition-all flex items-center justify-center group hover:scale-105 active:scale-95"
              >
                GET A QUOTE â†’
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/portfolio"
                className="border border-blue/40 text-blue-light px-8 py-4 rounded-full font-bold text-center hover:bg-blue/10 hover:border-blue hover:text-white transition-colors"
              >
                VIEW OUR WORK
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-blue/20">
              {[
                { value: `${signsCount}+`, label: 'Signs Installed'     },
                { value: '2D & 3D', label: 'Signage Solutions'   },
                { value: '5 \u2605',     label: 'Client Satisfaction' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column - Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[600px] lg:h-[700px] hidden md:flex items-center justify-center"
          >
            {/* Ambient glows — yellow + blue */}
            <div className="absolute w-80 h-80 bg-accent/15 rounded-full blur-[90px] animate-pulse" />
            <div className="absolute w-64 h-64 bg-blue/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1.2s", top: "30%", right: "-10%" }} />

            {/* Decorative spinning rings */}
            <div
              className="absolute w-[480px] h-[480px] rounded-full border border-blue/20"
              style={{ animation: 'spin 22s linear infinite' }}
            />
            <div
              className="absolute w-[370px] h-[370px] rounded-full border border-accent/20"
              style={{ animation: 'spin 16s linear infinite reverse' }}
            />

            {/* Central showcase card */}
            <motion.div
              animate={{ rotateY: [0, 3, 0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
              className="relative z-10 bg-primary-light rounded-3xl border border-blue/30 shadow-2xl shadow-blue/20 backdrop-blur-sm overflow-hidden w-[400px]"
            >
              {/* Brand header */}
              <div className="px-8 pt-8 pb-6 border-b border-blue/15">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-6 h-0.5 bg-accent rounded-full" />
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-accent/60" />
                  </div>
                </div>
                <h2 className="text-4xl font-display font-bold text-white tracking-tighter leading-none">
                  PLUGWA<span className="text-accent text-glow">SIGNS</span>
                </h2>
                <p className="text-[10px] text-gray-400 mt-2 tracking-[0.35em] uppercase">
                  Nairobi· Kenya
                </p>
              </div>

              {/* Rotating sample image */}
              <div className="relative h-[260px] overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSample}
                    src={SAMPLE_IMAGES[currentSample].src}
                    alt={SAMPLE_IMAGES[currentSample].label}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                  />
                </AnimatePresence>

                {/* Dark overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Category label */}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-accent text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-full border border-accent/40">
                  {SAMPLE_IMAGES[currentSample].label}
                </div>

                {/* Progress dots */}
                <div className="absolute bottom-3.5 right-3 flex gap-1.5">
                  {SAMPLE_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSample(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === currentSample
                          ? 'w-4 h-1.5 bg-accent'
                          : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating service badges */}
            {FLOATING_BADGES.map(({ label, Icon, style, delay }, i) => (
              <motion.div
                key={label}
                className="absolute z-20 bg-primary-light/90 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-2 shadow-xl"
                style={style}
                whileHover={{ scale: 1.12 }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { delay: 0.6 + i * 0.12, duration: 0.4 },
                  scale:   { delay: 0.6 + i * 0.12, duration: 0.4 },
                  y: { repeat: Infinity, duration: 3 + i * 0.5, delay, ease: 'easeInOut' },
                }}
              >
                <Icon size={12} className="text-accent" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Marquee ticker strip */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-primary-light/40 backdrop-blur-sm overflow-hidden py-3">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 mx-8 text-[11px] font-bold tracking-[0.2em] text-white/35"
              >
              <span className="w-1.5 h-1.5 bg-blue rounded-full" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What Can We Build For You */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-display font-bold mb-16 text-center">WHAT CAN WE BUILD FOR YOU?</h2>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              { icon: Store, title: 'SHOP', items: ['Storefront signs', 'Window graphics', '3D letters'] },
              { icon: Building2, title: 'OFFICE', items: ['Reception signs', 'Wall branding', 'Directional signs'] },
              { icon: Car, title: 'VEHICLE', items: ['Car branding', 'Fleet branding', 'Stickers'] },
              { icon: Package, title: 'PRODUCT', items: ['Labels', 'Product stickers', 'Packaging'] },
              { icon: Calendar, title: 'EVENT', items: ['Event branding', 'Promotional signs', 'Backdrops'] },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div 
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-primary-light border border-white/5 rounded-2xl p-6 text-center hover:border-accent/30 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto bg-white/5 rounded-xl flex items-center justify-center mb-4 text-accent">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold mb-4 tracking-widest">{cat.title}</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    {cat.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-primary-light border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl font-display font-bold mb-4">WHAT WE DO</h2>
            <p className="text-gray-400 text-lg">From a simple sticker to a complete storefront transformation.</p>
          </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
              <Link to={`/services/${service.id}`} key={service.id} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-primary border border-white/5 rounded-2xl hover:border-accent/50 transition-colors group h-full overflow-hidden flex flex-col"
                >
                  {/* Service Image */}
                  <div className="relative aspect-video overflow-hidden bg-primary-light">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Accent overlay on hover */}
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
                  </div>

                  {/* Text content */}
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-400 mb-5 flex-1">{service.shortDescription}</p>
                    <span className="inline-flex items-center text-sm font-bold text-accent">
                      Explore <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 bg-primary-light border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-display font-bold mb-4">OUR WORK</h2>
              <p className="text-gray-400 text-lg">Ideas are nice. Finished work is better.</p>
            </div>
            <Link to="/portfolio" className="inline-flex items-center text-white hover:text-accent font-medium transition-colors">
              MAKE SOMETHING LIKE THIS 
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
            {PORTFOLIO.slice(0, 4).map((project, idx) => {
              const isLarge1 = idx === 0;
              const isLarge2 = idx === 3;
              const spanClass = (isLarge1 || isLarge2) ? "md:col-span-2" : "md:col-span-1";
              
              return (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                  className={`group relative rounded-2xl overflow-hidden bg-primary-light border border-white/10 ${spanClass}`}
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
                    <span className="text-xs font-bold tracking-wider text-accent mb-2 block">{project.category}</span>
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



            {/* 2D vs 3D */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-primary-light p-10 rounded-3xl border border-white/5">
              <h3 className="text-3xl font-display font-bold mb-4">2D SIGNAGE</h3>
              <p className="text-gray-400 mb-8">Clean, flat, cost-effective branding.</p>
              <div className="mb-4 font-bold text-sm text-accent tracking-widest">IDEAL FOR:</div>
              <ul className="space-y-3">
                {['Shop signs', 'Directional signs', 'Posters', 'Office signs', 'Promotional boards'].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="text-accent" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-primary-light p-10 rounded-3xl border border-accent/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Layers size={100} /></div>
              <h3 className="text-3xl font-display font-bold mb-4 relative z-10">3D SIGNAGE</h3>
              <p className="text-gray-400 mb-8 relative z-10">Dimensional branding that creates depth and visibility.</p>
              <div className="mb-4 font-bold text-sm text-accent tracking-widest relative z-10">IDEAL FOR:</div>
              <ul className="space-y-3 relative z-10">
                {['Storefronts', 'Reception areas', 'Corporate offices', 'Restaurants', 'Retail businesses'].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="text-accent" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">Not sure which one you need?</p>
            <Link to="/contact" className="inline-flex items-center text-accent font-bold hover:text-white transition-colors tracking-widest">
              LET US RECOMMEND THE RIGHT OPTION 
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-primary-light border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-display font-bold mb-16 text-center">WHY PLUGWASIGNS?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Settings, title: "CUSTOM", desc: "Designed around your brand." },
              { icon: Ruler, title: "BUILT TO FIT", desc: "Custom sizes, materials and finishes." },
              { icon: Layers, title: "2D + 3D", desc: "From simple signs to dimensional installations." },
              { icon: Wrench, title: "INSTALLATION", desc: "From production to final installation." },
              { icon: Zap, title: "FAST QUOTES", desc: "Easy quotation through WhatsApp." },
              { icon: Palette, title: "BRAND CONSISTENCY", desc: "Your signage matches your visual identity." }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(37,71,216,0.2)" }}
                  className="bg-primary p-8 rounded-2xl border border-blue/10 hover:border-blue/40 transition-colors group">
                  <div className="w-12 h-12 bg-blue/10 text-blue-light group-hover:bg-blue group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">READY TO MAKE YOUR BRAND STAND OUT?</h2>
          <p className="text-lg text-gray-400 mb-10">
            Tell us what you're building, where you need it, and what you have in mind. We'll help turn the idea into a finished sign.
          </p>
          <Link to="/contact" className="btn-shine inline-flex bg-accent text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-accent-hover transition-transform hover:scale-105 active:scale-95">
            GET YOUR QUOTE 
          </Link>
        </div>
      </section>
    </div>
  );
}








