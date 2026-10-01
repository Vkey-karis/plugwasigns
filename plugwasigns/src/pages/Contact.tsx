import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import QuoteForm from '../components/QuoteForm';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">LET'S BUILD SOMETHING <span className="text-accent">VISIBLE.</span></h1>
          <p className="text-xl text-gray-400">Reach out for a quote, a consultation, or just to ask about what's possible for your brand.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-1 space-y-6">
            <a 
              href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="flex items-center p-6 bg-primary-light border border-white/5 rounded-2xl hover:border-accent/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent group-hover:text-black transition-colors">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">WhatsApp</p>
                <p className="font-bold">Chat with us</p>
              </div>
            </a>

            <a 
              href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
              className="flex items-center p-6 bg-primary-light border border-white/5 rounded-2xl hover:border-accent/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent group-hover:text-black transition-colors">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Phone</p>
                <p className="font-bold">{BUSINESS_CONFIG.phone}</p>
              </div>
            </a>

            <a 
              href={`mailto:${BUSINESS_CONFIG.email}`}
              className="flex items-center p-6 bg-primary-light border border-white/5 rounded-2xl hover:border-accent/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent group-hover:text-black transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="font-bold text-sm sm:text-base">{BUSINESS_CONFIG.email}</p>
              </div>
            </a>

            <div className="flex items-center p-6 bg-primary-light border border-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mr-4">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="font-bold">{BUSINESS_CONFIG.location}</p>
                <p className="text-xs text-gray-500 mt-1">{BUSINESS_CONFIG.hours}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <QuoteForm />
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I request a quote?", a: "Fill out the form on this page or send us a message on WhatsApp with your project details, size, and reference images if possible." },
              { q: "Do you install signs?", a: "Yes, we handle the full process from design to manufacturing and professional installation." },
              { q: "How long does a project take?", a: "Turnaround times vary based on the complexity and size of the project. A simple sticker order might take 24-48 hours, while a large 3D storefront sign could take 1-2 weeks." },
              { q: "Can I send you a reference image?", a: "Absolutely! Reference images are highly encouraged as they help us understand exactly what you're looking for." }
            ].map((faq, i) => (
              <div key={i} className="bg-primary-light border border-white/5 p-6 rounded-2xl">
                <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
