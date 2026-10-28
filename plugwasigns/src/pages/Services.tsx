import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryServices } from '../data/services';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Layers, Globe, Monitor, MessageCircle, Search, SmartphoneNfc, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';

export default function Services() {
  const { categories, categoryImages, items } = usePortfolio();

  const categoryServices = useMemo(() => {
    return getCategoryServices(categories, categoryImages, items);
  }, [categories, categoryImages, items]);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-4">
            <Layers size={14} /> What We Do
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">OUR SERVICES</h1>
          <p className="text-xl text-gray-400">
            From a simple sticker to a complete storefront transformation — and websites to back them up online. We design, produce, install, and go digital.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {categoryServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.08, 0.5) }}
                className="group relative bg-primary-light border border-white/10 rounded-2xl overflow-hidden hover:border-accent/50 transition-colors flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 z-20 w-12 h-12 bg-accent/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-black shadow-lg">
                    <Icon size={24} />
                  </div>
                  {/* Category & Project Count Badge */}
                  <div className="absolute top-6 right-6 z-20 bg-primary/85 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-accent">
                    {service.itemCount} {service.itemCount === 1 ? 'Project' : 'Projects'}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-accent tracking-widest uppercase bg-accent/10 px-2 py-0.5 rounded">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed">{service.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <Link 
                        to={`/portfolio?category=${encodeURIComponent(service.category)}`} 
                        className="text-white font-bold hover:text-accent transition-colors flex items-center text-sm"
                      >
                        View Projects ({service.itemCount}) <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link 
                        to={`/services/${service.id}`} 
                        className="text-gray-400 hover:text-white transition-colors text-xs"
                      >
                        Details
                      </Link>
                    </div>

                    <Link 
                      to="/contact" 
                      className="bg-white/5 hover:bg-accent hover:text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Website Service Card — Links to dedicated /websites page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 group relative bg-primary-light border border-blue/30 rounded-2xl overflow-hidden hover:border-blue/60 transition-colors flex flex-col md:flex-row shadow-[0_0_35px_rgba(37,71,216,0.08)]"
        >
          {/* Left: Visual */}
          <div className="h-56 md:h-auto md:w-2/5 overflow-hidden relative bg-gradient-to-br from-[#09092E] to-[#0d0d3a] flex items-center justify-center p-8">
            <div className="relative text-center">
              <div className="w-28 h-28 mx-auto bg-blue/15 rounded-3xl border border-blue/30 flex items-center justify-center mb-3">
                <Monitor size={52} className="text-blue-light" />
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-accent font-bold uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-white/10">
                <Sparkles size={13} /> 6 Tailored Packages
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-primary/85 backdrop-blur-sm border border-blue/20 px-3 py-1 rounded-full text-xs font-bold text-blue-light">
              DIGITAL SOLUTIONS
            </div>
          </div>

          {/* Right: Content */}
          <div className="p-8 md:p-10 flex flex-col flex-1 justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-light tracking-widest uppercase bg-blue/10 px-2.5 py-0.5 rounded border border-blue/20">
                  WEBSITES • FROM 25,000 KSH
                </span>
                <span className="text-xs text-accent font-bold">
                  Starter • Business • E-Commerce
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 text-white">
                Website Design &amp; Development
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Your sign stops them at the door — your website brings them in from Google. We design and build fast, mobile-friendly websites that strengthen your brand online, help you rank locally, and turn visitors into paying customers.
              </p>

              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 mb-8 text-xs text-gray-300">
                {[
                  { icon: Globe,          text: 'Starter Landing Page (25k)' },
                  { icon: Search,         text: 'Business Website (40k)' },
                  { icon: Monitor,        text: 'E-Commerce Stores (90k)' },
                  { icon: SmartphoneNfc,  text: 'Mobile & M-Pesa Ready' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2">
                    <Icon size={14} className="text-blue-light shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-5 border-t border-white/5">
              <Link
                to="/websites"
                className="btn-shine bg-accent text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md hover:bg-accent-hover transition-colors"
              >
                VIEW PACKAGES &amp; PRICING <ArrowRight size={15} />
              </Link>
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I'd%20like%20to%20enquire%20about%20getting%20a%20website%20for%20my%20business.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-blue/40 hover:bg-blue/10 text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors"
              >
                <MessageCircle size={15} className="text-accent" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
