import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Search, ChevronLeft, ChevronRight, MessageCircle, Sparkles, Filter } from 'lucide-react';
import { type PortfolioItem } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import { BUSINESS_CONFIG } from '../data/config';

export default function Portfolio() {
  const { items: portfolioItems, allDisplayCategories } = usePortfolio();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [filter, setFilter] = useState(() => {
    if (categoryParam) {
      const match = allDisplayCategories.find(c => c.toUpperCase() === categoryParam.toUpperCase());
      if (match) return match;
    }
    return 'ALL';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (categoryParam) {
      const match = allDisplayCategories.find(c => c.toUpperCase() === categoryParam.toUpperCase());
      if (match && match !== filter) {
        setFilter(match);
      }
    }
  }, [categoryParam, allDisplayCategories]);

  // Auto-scroll the active filter pill into the center of the ribbon
  useEffect(() => {
    const pill = activePillRef.current;
    const container = scrollContainerRef.current;
    if (!pill || !container) return;
    const pillLeft = pill.offsetLeft;
    const pillWidth = pill.offsetWidth;
    const containerWidth = container.offsetWidth;
    container.scrollTo({
      left: pillLeft - containerWidth / 2 + pillWidth / 2,
      behavior: 'smooth',
    });
  }, [filter]);

  const handleSelectFilter = (cat: string) => {
    setFilter(cat);
    if (cat === 'ALL') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProjects = useMemo(() => {
    let list = filter === 'ALL'
      ? portfolioItems
      : portfolioItems.filter(p => p.category.toUpperCase() === filter.toUpperCase());

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [filter, searchQuery, portfolioItems]);

  // Index of currently selected project in the filtered list
  const currentProjectIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return filteredProjects.findIndex(p => p.id === selectedProject.id);
  }, [selectedProject, filteredProjects]);

  const handlePrevProject = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentProjectIndex > 0) {
      setSelectedProject(filteredProjects[currentProjectIndex - 1]);
    } else {
      setSelectedProject(filteredProjects[filteredProjects.length - 1]);
    }
  };

  const handleNextProject = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentProjectIndex < filteredProjects.length - 1) {
      setSelectedProject(filteredProjects[currentProjectIndex + 1]);
    } else {
      setSelectedProject(filteredProjects[0]);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowLeft') handlePrevProject();
      if (e.key === 'ArrowRight') handleNextProject();
      if (e.key === 'Escape') setSelectedProject(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, currentProjectIndex, filteredProjects]);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles size={14} /> Real Projects Across Kenya
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">OUR WORK</h1>
          <p className="text-xl text-gray-400">
            Real-world branding built to stand out. Explore our recent signs, wraps, banners, and merchandise.
          </p>
        </div>

        {/* ── Sticky Search + Filter Toolbar ─────────────────────────────────── */}
        <div className="sticky top-[72px] z-40 -mx-6 lg:-mx-12 px-6 lg:px-12 pb-4 pt-3 bg-primary/90 backdrop-blur-md border-b border-white/5 mb-10 space-y-3">

          {/* Instant Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search e.g. 3D, salon, pharmacy, banner, gold letters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-primary-light border border-white/10 rounded-full pl-11 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Horizontally Scrollable Category Filter Ribbon with fade edges */}
          <div className="relative">
            {/* Left fade */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-primary to-transparent z-10" />
            {/* Right fade */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-primary to-transparent z-10" />

            <div
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
            >
              {allDisplayCategories.map(cat => {
                const isActive = filter === cat;
                const count = cat === 'ALL'
                  ? portfolioItems.length
                  : portfolioItems.filter(i => i.category.toUpperCase() === cat.toUpperCase()).length;

                return (
                  <button
                    key={cat}
                    ref={isActive ? activePillRef : null}
                    onClick={() => handleSelectFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all whitespace-nowrap shrink-0 border flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-accent text-black border-accent shadow-[0_0_15px_rgba(227,255,0,0.35)]'
                        : 'bg-primary-light/60 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active search query feedback */}
          {searchQuery && (
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Filter size={14} className="text-accent" />
              Showing results for &quot;<span className="text-white font-bold">{searchQuery}</span>&quot;
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-accent hover:underline ml-2"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-primary-light/40 border border-white/5 rounded-3xl">
            <p className="text-gray-400 text-base mb-4">No signage projects found matching your criteria.</p>
            <button
              onClick={() => {
                setFilter('ALL');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="px-6 py-2.5 rounded-full bg-accent text-black font-bold text-xs uppercase tracking-wider"
            >
              View All Work
            </button>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                  key={project.id}
                  whileHover={{ y: -6 }}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary-light border border-white/10 mb-3 shadow-lg">
                    {/* Hover Overlay Desktop */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:flex items-center justify-center">
                      <div className="bg-white/15 backdrop-blur-md p-4 rounded-full text-white shadow-xl group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={24} />
                      </div>
                    </div>

                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Mobile visible glass strip (avoids hover dependency on phones) */}
                    <div className="sm:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex flex-col justify-end pointer-events-none">
                      <span className="text-[10px] font-bold tracking-wider text-accent uppercase">
                        {project.category}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{project.title}</h4>
                    </div>

                    {/* Category pill indicator */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-accent shadow-sm">
                      {project.category}
                    </div>
                  </div>

                  {/* Desktop caption */}
                  <div className="hidden sm:block px-1">
                    <span className="text-xs font-bold tracking-wider text-accent mb-1 block">{project.category}</span>
                    <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox / Project Detail Modal with Next / Prev Navigation */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            {/* Prev Arrow Button */}
            {filteredProjects.length > 1 && (
              <button
                type="button"
                onClick={handlePrevProject}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-accent text-white hover:text-black border border-white/20 hover:border-accent flex items-center justify-center transition-all shadow-xl"
                title="Previous sign (Left Arrow)"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next Arrow Button */}
            {filteredProjects.length > 1 && (
              <button
                type="button"
                onClick={handleNextProject}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-accent text-white hover:text-black border border-white/20 hover:border-accent flex items-center justify-center transition-all shadow-xl"
                title="Next sign (Right Arrow)"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              className="bg-primary border border-white/15 w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col md:flex-row relative max-h-[92vh] shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-accent text-white hover:text-black p-2.5 rounded-full transition-colors border border-white/10"
                onClick={() => setSelectedProject(null)}
                title="Close (Esc)"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-3/5 h-[42vh] md:h-auto bg-black relative flex items-center justify-center overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-contain md:object-cover"
                />
                {/* Counter indicator */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-gray-300 border border-white/10">
                  {currentProjectIndex + 1} / {filteredProjects.length}
                </div>
              </div>

              <div className="w-full md:w-2/5 p-6 md:p-10 overflow-y-auto flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-2.5 py-0.5 rounded-md border border-accent/20">
                      {selectedProject.category}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-white leading-tight">
                    {selectedProject.title}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>

                  {selectedProject.services && selectedProject.services.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Services &amp; Features
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.services.map(s => (
                          <span key={s} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-gray-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <a
                    href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I%20saw%20your%20${encodeURIComponent(selectedProject.title)}%20project%20and%20I'd%20like%20a%20quote%20for%20something%20similar.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine w-full bg-accent text-black text-center font-bold py-3.5 px-4 rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 text-sm shadow-lg"
                  >
                    <MessageCircle size={18} />
                    GET QUOTE FOR THIS ON WHATSAPP
                  </a>
                  <p className="text-[11px] text-gray-400 text-center">
                    Share your measurements or logo for an instant quotation.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
