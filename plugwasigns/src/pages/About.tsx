import { motion } from 'framer-motion';
import { BUSINESS_CONFIG } from '../data/config';
import { Target, PenTool, Lightbulb, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight"
          >
            WE BUILD BRANDS <br />
            <span className="text-accent">YOU CAN SEE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 leading-relaxed"
          >
            {BUSINESS_CONFIG.name} is a creative signage and branding studio. We don't just print signs; we manufacture visibility. From the first concept to the final installation, we focus on precision, quality, and impact.
          </motion.p>
        </div>

        {/* Visual Break */}
        <div className="h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden mb-24 relative">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
            alt="Studio Workshop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        </div>

        {/* Our Approach */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-display font-bold mb-6">OUR CRAFT</h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              We understand that your physical presence is often the first impression a customer has of your business. Whether it's a massive illuminated 3D sign or a simple window decal, it needs to reflect your standards.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              That's why we use high-quality materials and modern fabrication techniques. We combine creative design with practical manufacturing to ensure your brand stands out and stands the test of time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary-light p-8 rounded-2xl border border-white/5">
              <Target size={32} className="text-accent mb-4" />
              <h3 className="font-bold mb-2">Precision</h3>
              <p className="text-sm text-gray-400">Accurate cuts, perfect colors, and flawless finishes.</p>
            </div>
            <div className="bg-primary-light p-8 rounded-2xl border border-white/5 translate-y-8">
              <PenTool size={32} className="text-accent mb-4" />
              <h3 className="font-bold mb-2">Design-Led</h3>
              <p className="text-sm text-gray-400">Everything starts with strong, brand-aligned design.</p>
            </div>
            <div className="bg-primary-light p-8 rounded-2xl border border-white/5">
              <Lightbulb size={32} className="text-accent mb-4" />
              <h3 className="font-bold mb-2">Innovation</h3>
              <p className="text-sm text-gray-400">Using the latest in LED and 3D fabrication.</p>
            </div>
            <div className="bg-primary-light p-8 rounded-2xl border border-white/5 translate-y-8">
              <Users size={32} className="text-accent mb-4" />
              <h3 className="font-bold mb-2">Partnership</h3>
              <p className="text-sm text-gray-400">We work closely with you from start to finish.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-accent text-black rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Let's create something noticeable.</h2>
          <p className="text-lg mb-8 opacity-80">Ready to upgrade your physical branding?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors">
              START A PROJECT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
