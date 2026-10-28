import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getCategoryServices, SERVICES } from '../data/services';
import { usePortfolio } from '../context/PortfolioContext';
import { CheckCircle2, ArrowLeft, ArrowUpRight, FolderKanban } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';

export default function ServiceDetail() {
  const { id } = useParams();
  const { categories, categoryImages, items } = usePortfolio();

  const categoryServices = useMemo(() => {
    return getCategoryServices(categories, categoryImages, items);
  }, [categories, categoryImages, items]);

  const service = useMemo(() => {
    if (!id) return null;
    const cleanId = id.toLowerCase();
    // 1. Try finding by service id in dynamic categoryServices
    const match = categoryServices.find(s => s.id === cleanId || s.category.toLowerCase() === cleanId);
    if (match) return match;

    // 2. Try legacy SERVICES array
    const legacy = SERVICES.find(s => s.id === cleanId);
    if (legacy) {
      return {
        id: legacy.id,
        category: legacy.title.toUpperCase(),
        title: legacy.title,
        shortDescription: legacy.shortDescription,
        description: legacy.description,
        icon: legacy.icon,
        image: legacy.image,
        itemCount: items.filter(i => i.category.toLowerCase().includes(legacy.id.split('-')[0])).length,
        applications: legacy.applications,
        materials: legacy.materials
      };
    }

    return null;
  }, [id, categoryServices, items]);

  if (!service) {
    return <Navigate to="/404" />;
  }

  const Icon = service.icon;
  const relatedProjects = items.filter(
    i => i.category.toUpperCase() === service.category.toUpperCase()
  ).slice(0, 6);

  return (
    <div className="pt-24 pb-24 min-h-screen">
      {/* Hero */}
      <div className="h-[40vh] md:h-[50vh] relative mb-16">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 container mx-auto px-6 lg:px-12 flex flex-col justify-center">
          <Link to="/services" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors w-fit text-sm">
            <ArrowLeft size={18} className="mr-2" /> Back to Services
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-black mr-6 shrink-0 shadow-xl">
              <Icon size={32} />
            </div>
            <div>
              <span className="text-xs font-bold text-accent tracking-widest uppercase bg-accent/15 px-2.5 py-1 rounded mb-2 inline-block">
                {service.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white">{service.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">About this Service</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </section>

            <div className="grid sm:grid-cols-2 gap-8">
              <section className="bg-primary-light p-8 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold mb-6 text-white">Ideal Applications</h3>
                <ul className="space-y-4">
                  {service.applications.map(app => (
                    <li key={app} className="flex items-start">
                      <CheckCircle2 size={20} className="text-accent mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-300">{app}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-primary-light p-8 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold mb-6 text-white">Materials Used</h3>
                <ul className="space-y-4">
                  {service.materials.map(mat => (
                    <li key={mat} className="flex items-start">
                      <CheckCircle2 size={20} className="text-accent mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-300">{mat}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="relative">
            <div className="sticky top-32 bg-primary-light border border-white/10 p-8 rounded-2xl">
              <h3 className="text-2xl font-display font-bold mb-4">Ready to start?</h3>
              <p className="text-gray-400 mb-8 text-sm">
                Get a custom quote for your {service.title.toLowerCase()} project. We deliver within Nairobi and across Kenya.
              </p>
              
              <div className="space-y-4">
                <Link 
                  to="/contact" 
                  className="block w-full bg-accent text-black text-center font-bold py-4 rounded-xl hover:bg-accent-hover transition-colors text-sm"
                >
                  REQUEST QUOTE
                </Link>
                <a 
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I'd%20like%20to%20get%20a%20quote%20for%20${encodeURIComponent(service.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-white/20 text-center font-bold py-4 rounded-xl hover:bg-white/5 transition-colors text-sm"
                >
                  CHAT ON WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category Portfolio Gallery */}
        {relatedProjects.length > 0 && (
          <div className="pt-12 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-display font-bold">Recent {service.title} Projects</h2>
                <p className="text-gray-400 text-sm mt-1">Real signage projects completed for our clients.</p>
              </div>
              <Link
                to={`/portfolio?category=${encodeURIComponent(service.category)}`}
                className="inline-flex items-center text-accent font-bold hover:underline text-sm"
              >
                View all in Portfolio <ArrowUpRight size={18} className="ml-1" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map(proj => (
                <Link
                  key={proj.id}
                  to={`/portfolio?category=${encodeURIComponent(service.category)}`}
                  className="group bg-primary-light border border-white/10 rounded-2xl overflow-hidden hover:border-accent/40 transition-colors"
                >
                  <div className="aspect-square relative overflow-hidden bg-primary">
                    <img 
                      src={proj.image} 
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                        <FolderKanban size={14} /> View in Gallery
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-accent transition-colors">{proj.title}</h4>
                    <p className="text-gray-400 text-xs line-clamp-1 mt-1">{proj.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
