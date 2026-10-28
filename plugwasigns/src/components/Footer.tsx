import { Link } from "react-router-dom";
import { BUSINESS_CONFIG, NAVIGATION } from "../data/config";
import { usePortfolio } from "../context/PortfolioContext";
import { formatCategoryTitle } from "../data/services";
import { Globe, Link2, MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { categories } = usePortfolio();

  return (
    <footer
      className="pt-20 pb-10 border-t border-blue/20"
      style={{ background: "linear-gradient(180deg, #09092E 0%, #07071A 100%)" }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-display font-bold tracking-tighter block">
              PLUGWA<span className="text-accent">SIGNS</span>
            </Link>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              {BUSINESS_CONFIG.tagline}
            </p>
            {/* Blue accent bar */}
            <div className="flex gap-2">
              <div className="h-1 w-8 bg-blue rounded-full" />
              <div className="h-1 w-4 bg-accent rounded-full" />
              <div className="h-1 w-2 bg-blue/40 rounded-full" />
            </div>
            <div className="flex space-x-3">
              <a href={BUSINESS_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-blue/30 flex items-center justify-center text-blue-light hover:bg-blue hover:text-white hover:border-blue transition-colors">
                <Globe size={18} />
              </a>
              <a href={BUSINESS_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-blue/30 flex items-center justify-center text-blue-light hover:bg-blue hover:text-white hover:border-blue transition-colors">
                <Link2 size={18} />
              </a>
              <a href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center text-accent hover:bg-accent hover:text-black hover:border-accent transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6 font-display tracking-widest text-sm flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue inline-block rounded-full" />
              COMPANY
            </h4>
            <ul className="space-y-3">
              {NAVIGATION.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-accent transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Categories / Services */}
          <div>
            <h4 className="text-white font-bold mb-6 font-display tracking-widest text-sm flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue inline-block rounded-full" />
              WHAT WE BUILD
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  to="/websites" 
                  className="text-blue-light hover:text-accent font-semibold transition-colors text-sm flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 bg-blue-light rounded-full" />
                  Website Design &amp; Dev
                </Link>
              </li>
              {categories.slice(0, 8).map(cat => (
                <li key={cat}>
                  <Link 
                    to={`/portfolio?category=${encodeURIComponent(cat)}`} 
                    className="text-gray-400 hover:text-accent transition-colors text-sm flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 bg-accent/60 rounded-full" />
                    {formatCategoryTitle(cat)}
                  </Link>
                </li>
              ))}
              {categories.length > 8 && (
                <li>
                  <Link to="/portfolio" className="text-xs font-bold text-accent hover:underline inline-block pt-1">
                    + View all categories →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 font-display tracking-widest text-sm flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue inline-block rounded-full" />
              CONTACT
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-light mt-0.5 shrink-0" />
                {BUSINESS_CONFIG.location}
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-light shrink-0" />
                {BUSINESS_CONFIG.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-light shrink-0" />
                {BUSINESS_CONFIG.email}
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I'd%20like%20to%20get%20a%20quote.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-black px-4 py-2 rounded-full font-bold text-xs tracking-wider transition-all"
                >
                  <MessageCircle size={14} />
                  CHAT ON WHATSAPP
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue/15 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} {BUSINESS_CONFIG.name}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 items-center">
            <Link to="/portfolio" className="hover:text-gray-300 transition-colors">Our Work</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
            <Link to="/admin" className="hover:text-accent transition-colors font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
