import { useRef, useCallback, useState, useEffect, useMemo, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, ChevronRight, Box, Layout, Stamp, Car, Lightbulb, PenTool,
  Store, Building2, Package, Calendar, Settings, Ruler, Layers, Wrench, Zap,
  MessageCircle, ShieldCheck, MapPin, Clock, Award, Globe, Monitor, Search, SmartphoneNfc
} from 'lucide-react';
import { getCategoryServices } from '../data/services';
import { usePortfolio } from '../context/PortfolioContext';
import { BUSINESS_CONFIG } from '../data/config';
import AnimatedSignText from '../components/AnimatedSignText';

const MARQUEE_ITEMS = [
  'STOREFRONT SIGNS', 'VEHICLE WRAPS', 'LED ILLUMINATION', '3D LETTERS',
  'OFFICE BRANDING', 'CUSTOM STICKERS', 'ACRYLIC LETTERS', 'WINDOW GRAPHICS', 'WEBSITES',
];

const TRUST_BRANDS = [
  'RAFFINE HARDWARE', 'THE GENTRY SPA', 'DAZZLE INTERIORS', 'GILEAD BARBERSHOP',
  'MAKAFRESH', 'KAYAKY RESORT', 'TKS APPAREL', 'YUMMY BUTCHERY', 'LUNA LOUNGE'
];

const FLOATING_BADGES = [
  { label: 'LED Signs',     Icon: Lightbulb, style: { top: '6%',    left: '2%'   }, delay: 0   },
  { label: '3D Letters',    Icon: Box,       style: { top: '10%',   right: '2%'  }, delay: 0.4 },
  { label: 'Vehicle Wraps', Icon: Car,       style: { top: '44%',   left: '-2%'  }, delay: 0.8 },
  { label: 'Branding',      Icon: PenTool,   style: { top: '42%',   right: '-2%' }, delay: 1.2 },
  { label: 'Stickers',      Icon: Stamp,     style: { bottom: '14%',left: '4%'   }, delay: 1.6 },
  { label: '2D Signage',    Icon: Layout,    style: { bottom: '16%',right: '2%'  }, delay: 2.0 },
];

const FALLBACK_SAMPLE_IMAGES = [
  { src: '/work/raffine-sign.png', label: '3D LETTERS'    },
  { src: '/work/dazzle-3d.jpg', label: 'SHOP SIGNS'     },
  { src: '/work/neon-cocktail.jpg', label: 'LED SIGNS'      },
  { src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80', label: 'VEHICLE WRAPS'  },
];

export default function Home() {
  const { items: portfolioItems, categories, categoryImages } = usePortfolio();

  const categoryServices = useMemo(() => {
    return getCategoryServices(categories, categoryImages, portfolioItems);
  }, [categories, categoryImages, portfolioItems]);

  const heroItems = useMemo(() => {
    const heroes = portfolioItems.filter(p => p.isHero);
    if (heroes.length > 0) {
      return heroes.map(p => ({ src: p.image, label: p.category }));
    }
    return FALLBACK_SAMPLE_IMAGES;
  }, [portfolioItems]);

  const featuredItems = useMemo(() => {
    const featured = portfolioItems.filter(p => p.isFeatured);
    if (featured.length >= 4) return featured.slice(0, 4);
    const nonFeatured = portfolioItems.filter(p => !p.isFeatured);
    return [...featured, ...nonFeatured].slice(0, 4);
  }, [portfolioItems]);

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
  const [isRotatingPaused, setIsRotatingPaused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      let n = 0;
      const iv = setInterval(() => { n += 3; if (n >= 180) { setSignsCount(180); clearInterval(iv); } else setSignsCount(n); }, 20);
      return () => clearInterval(iv);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isRotatingPaused) return;
    const id = setInterval(() => setCurrentSample(p => (p + 1) % heroItems.length), 3200);
    return () => clearInterval(id);
  }, [heroItems.length, isRotatingPaused]);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[100vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden"
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

        {/* Cursor spotlight */}
        <div ref={spotlightRef} className="absolute inset-0 pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center py-12 md:py-20">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Trust Micro-badge Above Title */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue/15 border border-blue/30 text-blue-light text-xs font-bold tracking-wider">
              <span className="flex text-accent text-xs">★★★★★</span>
              <span className="text-gray-300">Nairobi&apos;s Trusted Sign Makers</span>
            </div>

            {/* Headline with scramble effect */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.0] tracking-tight">
              WE MAKE YOUR BRAND{' '}
              <br className="hidden md:block" />
              <AnimatedSignText />
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Custom 3D letters, illuminated signage, vehicle wraps, and bold visual branding — plus professional websites that keep your brand visible online as well as on the street.
            </p>

            {/* CTAs with Direct WhatsApp option */}
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <Link
                to="/contact"
                className="btn-shine bg-accent text-black px-8 py-4 rounded-full font-bold text-center hover:bg-accent-hover transition-all flex items-center justify-center group hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(227,255,0,0.25)]"
              >
                GET A FREE QUOTE
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I'd%20like%20to%20inquire%20about%20a%20signage%20project.`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-blue/40 text-blue-light px-7 py-4 rounded-full font-bold text-center hover:bg-blue/10 hover:border-blue hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} className="text-accent" />
                CHAT ON WHATSAPP
              </a>
            </div>

            {/* Value / Trust Points Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-accent" />
                <span>In-House Fabrication</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-accent" />
                <span>Fast 48h Quotes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-accent" />
                <span>Countrywide Installation</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-blue/20">
              {[
                { value: `${signsCount}+`, label: 'Signs Installed' },
                { value: '2D & 3D', label: 'Custom Fabrication' },
                { value: '5.0 ★', label: 'Client Satisfaction' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column - Hero Visual with controls */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[550px] lg:h-[650px] hidden md:flex items-center justify-center"
            onMouseEnter={() => setIsRotatingPaused(true)}
            onMouseLeave={() => setIsRotatingPaused(false)}
          >
            {/* Ambient glows */}
            <div className="absolute w-80 h-80 bg-accent/15 rounded-full blur-[90px] animate-pulse" />
            <div className="absolute w-64 h-64 bg-blue/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1.2s", top: "30%", right: "-10%" }} />

            {/* Spinning decorative rings */}
            <div
              className="absolute w-[460px] h-[460px] rounded-full border border-blue/20 pointer-events-none"
              style={{ animation: 'spin 22s linear infinite' }}
            />
            <div
              className="absolute w-[360px] h-[360px] rounded-full border border-accent/20 pointer-events-none"
              style={{ animation: 'spin 16s linear infinite reverse' }}
            />

            {/* Central showcase card */}
            <motion.div
              animate={{ rotateY: [0, 3, 0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
              className="relative z-10 bg-primary-light rounded-3xl border border-blue/30 shadow-2xl shadow-blue/20 backdrop-blur-sm overflow-hidden w-[390px]"
            >
              {/* Brand header */}
              <div className="px-7 pt-7 pb-5 border-b border-blue/15">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-6 h-0.5 bg-accent rounded-full" />
                  <span className="text-[10px] text-accent/80 font-mono tracking-widest uppercase">
                    FEATURED PORTFOLIO
                  </span>
                </div>
                <h2 className="text-3xl font-display font-bold text-white tracking-tighter leading-none">
                  PLUGWA<span className="text-accent text-glow">SIGNS</span>
                </h2>
                <p className="text-[10px] text-gray-400 mt-1.5 tracking-[0.35em] uppercase">
                  Nairobi • Kenya
                </p>
              </div>

              {/* Rotating sample image */}
              <div className="relative h-[270px] overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSample}
                    src={heroItems[currentSample]?.src || heroItems[0]?.src}
                    alt={heroItems[currentSample]?.label || 'Signage'}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                  />
                </AnimatePresence>

                {/* Dark overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Category label */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-accent text-[9px] font-bold tracking-[0.2em] px-3 py-1 rounded-full border border-accent/40">
                  {heroItems[currentSample]?.label}
                </div>

                {/* Interactive dots with pause reminder */}
                <div className="absolute bottom-3.5 right-3 flex items-center gap-1.5">
                  {heroItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSample(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === currentSample
                          ? 'w-4 h-1.5 bg-accent'
                          : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/70'
                      }`}
                      title={`View sample ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating service badges (Hidden on smaller screens to avoid overlap) */}
            {FLOATING_BADGES.map(({ label, Icon, style, delay }, i) => (
              <motion.div
                key={label}
                className="hidden xl:flex absolute z-20 bg-primary-light/95 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 text-xs font-bold items-center gap-2 shadow-2xl"
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
        <div className="w-full border-t border-white/10 bg-primary-light/40 backdrop-blur-sm overflow-hidden py-3">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 mx-8 text-[11px] font-bold tracking-[0.2em] text-white/40"
              >
                <span className="w-1.5 h-1.5 bg-blue rounded-full" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos / Trusted By Nairobi Brands Bar */}
      <section className="py-10 bg-primary border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-gray-500 font-bold mb-6">
            TRUSTED BY BUSINESSES ACROSS NAIROBI &amp; KENYA
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-60">
            {TRUST_BRANDS.map(brand => (
              <div 
                key={brand}
                className="text-xs md:text-sm font-display font-bold tracking-widest text-gray-400 hover:text-accent transition-colors py-1 px-3 border border-white/5 rounded-lg bg-white/[0.02]"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Can We Build For You */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-3 inline-block">
              Custom Solutions
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold">WHAT CAN WE BUILD FOR YOU?</h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Store,    title: 'SHOP',    items: ['Storefront signs', 'Window graphics', '3D letters'],         link: '/services' },
              { icon: Building2,title: 'OFFICE',  items: ['Reception signs', 'Wall branding', 'Directional signs'],     link: '/services' },
              { icon: Car,      title: 'VEHICLE', items: ['Car branding', 'Fleet branding', 'Decals'],                  link: '/services' },
              { icon: Package,  title: 'PRODUCT', items: ['Labels', 'Product stickers', 'Packaging'],                   link: '/services' },
              { icon: Calendar, title: 'EVENT',   items: ['Event branding', 'Rollup banners', 'Teardrop flags'],        link: '/services' },
              { icon: Globe,    title: 'WEBSITE', items: ['Business website', 'Online portfolio', 'SEO & Google Maps'], link: '/websites' },
            ].map((cat, i) => {
              const Icon = cat.icon;
              const isWebsite = cat.title === 'WEBSITE';
              return (
                <motion.div 
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 md:p-8 rounded-2xl border transition-colors group flex flex-col justify-between ${
                    isWebsite
                      ? 'bg-blue/5 border-blue/25 hover:border-blue/50'
                      : 'bg-primary-light border-white/5 hover:border-accent/40'
                  }`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors text-white ${
                      isWebsite
                        ? 'bg-blue/15 group-hover:bg-blue group-hover:text-white'
                        : 'bg-white/5 group-hover:bg-accent group-hover:text-black'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 font-display">{cat.title}</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      {cat.items.map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isWebsite ? 'bg-blue-light' : 'bg-accent'}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link 
                    to={cat.link}
                    className={`mt-6 pt-4 border-t border-white/5 text-xs font-bold hover:underline inline-flex items-center ${
                      isWebsite ? 'text-blue-light' : 'text-accent'
                    }`}
                  >
                    {isWebsite ? 'Ask about websites →' : 'Explore samples →'}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Overview / WHAT WE DO */}
      <section className="py-24 bg-primary-light border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-3">
                <Layers size={13} /> Full Fabrication Capabilities
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">WHAT WE DO</h2>
              <p className="text-gray-400 text-lg">From a single sticker to complete corporate interior and exterior branding.</p>
            </div>
            <Link 
              to="/services" 
              className="inline-flex items-center text-accent font-bold hover:underline text-sm uppercase tracking-wider"
            >
              View Full Services Page →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryServices.map((service, index) => (
              <Link to={`/portfolio?category=${encodeURIComponent(service.category)}`} key={service.category} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.05, 0.4) }}
                  className="bg-primary border border-white/5 rounded-2xl hover:border-accent/50 transition-colors group h-full overflow-hidden flex flex-col shadow-lg"
                >
                  {/* Service Image */}
                  <div className="relative aspect-video overflow-hidden bg-primary-light">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
                    <div className="absolute top-3 right-3 bg-primary/85 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full text-[11px] font-bold text-accent shadow">
                      {service.itemCount} {service.itemCount === 1 ? 'project' : 'projects'}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="p-7 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-accent tracking-widest uppercase mb-1 block">
                        {service.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{service.title}</h3>
                      <p className="text-gray-400 mb-5 text-sm line-clamp-2 leading-relaxed">{service.shortDescription}</p>
                    </div>
                    <span className="inline-flex items-center text-sm font-bold text-accent pt-2 border-t border-white/5">
                      Explore Projects <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Bento Grid */}
      <section className="py-24 bg-primary border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-3 inline-block">
                Recent Highlights
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">OUR WORK</h2>
              <p className="text-gray-400 text-lg">Ideas are nice. Finished physical signage is better.</p>
            </div>
            <Link to="/portfolio" className="btn-shine bg-accent text-black font-bold px-6 py-3 rounded-full text-xs tracking-wider uppercase hover:bg-accent-hover transition-colors">
              SEE ALL 180+ PROJECTS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[360px]">
            {featuredItems.map((project, idx) => {
              const isLarge1 = idx === 0;
              const isLarge2 = idx === 3;
              const spanClass = (isLarge1 || isLarge2) ? "md:col-span-2" : "md:col-span-1";
              
              return (
                <Link
                  to={`/portfolio?category=${encodeURIComponent(project.category)}`}
                  key={project.id}
                  className={`group relative rounded-3xl overflow-hidden bg-primary-light border border-white/10 hover:border-accent/50 transition-all ${spanClass}`}
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-8">
                    <span className="text-xs font-bold tracking-wider text-accent mb-2 block uppercase">{project.category}</span>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-1">{project.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Physical + Digital Presence Section */}
      <section className="py-24 bg-primary-light border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-3 inline-block">
              Complete Brand Presence
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">WE SHOW UP FOR YOUR BRAND — EVERYWHERE</h2>
            <p className="text-gray-400 text-lg">
              A great sign stops traffic on the street. A great website captures them online. We build both.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Physical Presence */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primary rounded-3xl border border-white/10 p-8 md:p-10 flex flex-col"
            >
              <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6">
                <Store size={28} />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">Physical Presence</span>
              <h3 className="text-2xl font-display font-bold mb-3">YOUR BRAND ON THE STREET</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                From your shopfront sign to your vehicle fleet, we make sure every Nairobian who walks or drives past knows exactly who you are. Custom fabricated, professionally installed, built to last.
              </p>
              <ul className="space-y-2.5 text-sm text-gray-300 mb-8 flex-1">
                {['3D & 2D Signage', 'Vehicle & Fleet Branding', 'LED Illuminated Signs', 'Banners & Event Displays', 'Office Interior Branding', 'Stickers & Apparel'].map(item => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline mt-auto"
              >
                Explore all signage services <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Digital Presence */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-primary rounded-3xl border border-blue/25 p-8 md:p-10 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(37,71,216,0.08)]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue/5 rounded-full blur-2xl pointer-events-none" />
              <div className="w-14 h-14 bg-blue/15 border border-blue/30 rounded-2xl flex items-center justify-center text-blue-light mb-6 relative z-10">
                <Monitor size={28} />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-blue-light uppercase mb-2 relative z-10">Digital Presence</span>
              <h3 className="text-2xl font-display font-bold mb-3 relative z-10">YOUR BRAND ONLINE TOO</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 relative z-10">
                Your sign draws them in — your website seals the deal. We design and build fast, professional websites that represent your brand, rank on Google, and convert visitors into customers.
              </p>
              <ul className="space-y-2.5 text-sm text-gray-300 mb-8 flex-1 relative z-10">
                {[
                  { icon: Globe,          text: 'Business & portfolio websites' },
                  { icon: Search,         text: 'SEO & Google My Business setup' },
                  { icon: SmartphoneNfc,  text: 'Mobile-first, fast-loading' },
                  { icon: Monitor,        text: 'Modern, professional design' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <Icon size={14} className="text-blue-light shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 mt-auto relative z-10">
                <Link
                  to="/websites"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 hover:bg-accent hover:text-black border border-accent/20 px-4 py-2.5 rounded-full transition-colors"
                >
                  View Packages &amp; Pricing <ArrowRight size={14} />
                </Link>
                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I%27d%20like%20to%20enquire%20about%20getting%20a%20website%20for%20my%20business.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue/80 hover:bg-blue border border-blue/50 hover:border-blue px-4 py-2.5 rounded-full transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2D vs 3D Signage Comparison */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">CHOOSING THE RIGHT SIGNAGE</h2>
            <p className="text-gray-400 text-lg">We help you decide the most cost-effective and eye-catching approach.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary-light p-8 md:p-10 rounded-3xl border border-white/10">
              <h3 className="text-3xl font-display font-bold mb-3">2D SIGNAGE</h3>
              <p className="text-gray-400 mb-8 text-sm">Clean, flat, high-durability branding on Alucobond or Forex.</p>
              <div className="mb-4 font-bold text-xs text-accent tracking-widest uppercase">IDEAL FOR:</div>
              <ul className="space-y-3">
                {['Shop fascia boards', 'Directional signs', 'Posters & Menus', 'Office identification', 'Promotional boards'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="text-accent shrink-0" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-primary-light p-8 md:p-10 rounded-3xl border border-accent/30 relative overflow-hidden shadow-[0_0_30px_rgba(227,255,0,0.06)]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Layers size={100} /></div>
              <h3 className="text-3xl font-display font-bold mb-3 relative z-10">3D SIGNAGE</h3>
              <p className="text-gray-400 mb-8 relative z-10 text-sm">Dimensional letters and back-lit architectural signage that commands attention.</p>
              <div className="mb-4 font-bold text-xs text-accent tracking-widest uppercase relative z-10">IDEAL FOR:</div>
              <ul className="space-y-3 relative z-10">
                {['Storefront fascias', 'Reception logo walls', 'Corporate head offices', 'Bars & Restaurants', 'High-street retailers'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="text-accent shrink-0" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I'd%20like%20guidance%20on%20choosing%20between%202D%20and%203D%20signs.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-accent font-bold hover:underline tracking-widest text-sm"
            >
              CHAT ON WHATSAPP FOR RECOMMENDATIONS &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Why PlugWaSigns */}
      <section className="py-24 bg-primary-light border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">THE PLUGWASIGNS STANDARD</h2>
            <p className="text-gray-400 text-lg">Why commercial brands and storefront owners partner with us.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Settings,      title: "CUSTOM FABRICATION",    desc: "Built to your exact specs and pantone color palettes." },
              { icon: Ruler,         title: "PRECISION FIT",          desc: "Laser cutting, routering, and seamless corner assembly." },
              { icon: Layers,        title: "WEATHERPROOF MATERIALS", desc: "Alucobond, UV-treated acrylic, and cast vinyl for Kenyan climate." },
              { icon: Wrench,        title: "FULL INSTALLATION",      desc: "Turnkey service: site measurement, production, and safe mount." },
              { icon: Zap,           title: "FAST QUOTES",            desc: "Transparent pricing over WhatsApp within hours." },
              { icon: Award,         title: "BRAND CONSISTENCY",      desc: "Every sign reflects the high standards of your business." },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -6 }}
                  className="bg-primary p-8 rounded-2xl border border-blue/15 hover:border-accent/40 transition-colors group shadow-md"
                >
                  <div className="w-12 h-12 bg-blue/10 text-blue-light group-hover:bg-accent group-hover:text-black rounded-xl flex items-center justify-center mb-6 transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-primary to-[#060620]">
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-3xl">
          <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
            <Award size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            READY TO OWN YOUR STREET AND YOUR GOOGLE SEARCH?
          </h2>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            Tell us about your business. Whether you need a sign, a wrap, a full rebrand, or a website — we will make your brand impossible to miss, online and offline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="btn-shine bg-accent text-black px-10 py-5 rounded-full font-bold text-base hover:bg-accent-hover transition-transform hover:scale-105 active:scale-95 shadow-xl"
            >
              REQUEST A QUOTE
            </Link>
            <a 
              href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I'd%20like%20to%20get%20started%20on%20a%20sign.`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 hover:border-accent text-white hover:text-accent px-8 py-5 rounded-full font-bold text-base transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              CHAT WITH OUR TEAM
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
