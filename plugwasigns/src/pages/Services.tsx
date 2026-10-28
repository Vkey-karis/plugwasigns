import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryServices } from '../data/services';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Layers } from 'lucide-react';

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
            From a simple sticker to a complete storefront transformation. We design, produce, and install.
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
      </div>
    </div>
  );
}
