import { useParams, Link, Navigate } from 'react-router-dom';

import { SERVICES } from '../data/services';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';

export default function ServiceDetail() {
  const { id } = useParams();
  const service = SERVICES.find(s => s.id === id);

  if (!service) {
    return <Navigate to="/404" />;
  }

  const Icon = service.icon;

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
          <Link to="/services" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors w-fit">
            <ArrowLeft size={20} className="mr-2" /> Back to Services
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-black mr-6">
              <Icon size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white">{service.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-12">
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
              <p className="text-gray-400 mb-8">
                Get a custom quote for your {service.title.toLowerCase()} project.
              </p>
              
              <div className="space-y-4">
                <Link 
                  to="/contact" 
                  className="block w-full bg-accent text-black text-center font-bold py-4 rounded-xl hover:bg-accent-hover transition-colors"
                >
                  REQUEST QUOTE
                </Link>
                <a 
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I'd%20like%20to%20get%20a%20quote%20for%20${encodeURIComponent(service.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-white/20 text-center font-bold py-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  CHAT ON WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
