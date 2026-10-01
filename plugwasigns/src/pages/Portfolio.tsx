import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO, CATEGORIES } from '../data/portfolio';
import { BUSINESS_CONFIG } from '../data/config';

export default function Portfolio() {
  const [filter, setFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<typeof PORTFOLIO[0] | null>(null);

  const filteredProjects = filter === 'ALL' 
    ? PORTFOLIO 
    : PORTFOLIO.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">OUR WORK</h1>
          <p className="text-xl text-gray-400">Real-world branding built to stand out. Explore our recent projects across various industries.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold tracking-wider transition-colors border ${
                filter === cat 
                  ? 'bg-accent text-black border-accent' 
                  : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map(project => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 350, damping: 22 }}
                key={project.id}
                whileHover={{ y: -6 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary-light border border-white/10 mb-4">
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-2">
                  <span className="text-xs font-bold tracking-wider text-accent mb-1 block">{project.category}</span>
                  <h3 className="text-lg font-bold">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-primary border border-white/10 w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black p-2 rounded-full text-white transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-3/5 h-[40vh] md:h-auto bg-primary-light">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto">
                <span className="text-sm font-bold tracking-wider text-accent mb-4 block">{selectedProject.category}</span>
                <h2 className="text-3xl font-display font-bold mb-4">{selectedProject.title}</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="mb-10">
                  <h4 className="text-sm font-bold text-white mb-3">SERVICES PROVIDED</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.services.map(s => (
                      <span key={s} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm text-gray-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <a 
                    href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I%20saw%20your%20${encodeURIComponent(selectedProject.title)}%20project%20and%20I'd%20like%20something%20similar.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-accent text-black text-center font-bold py-4 rounded-xl hover:bg-accent-hover transition-colors"
                  >
                    GET SOMETHING LIKE THIS
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


