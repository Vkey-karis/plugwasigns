import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SERVICES } from '../data/services';
import { ArrowRight } from 'lucide-react';

export default function Services() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">OUR SERVICES</h1>
          <p className="text-xl text-gray-400">From a simple sticker to a complete storefront transformation. We design, produce, and install.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-primary-light border border-white/10 rounded-2xl overflow-hidden hover:border-accent/50 transition-colors"
              >
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 z-20 w-12 h-12 bg-accent/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-black">
                    <Icon size={24} />
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-display font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-8">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/services/${service.id}`} 
                      className="text-white font-bold hover:text-accent transition-colors flex items-center"
                    >
                      View Details <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
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
