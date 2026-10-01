import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NAVIGATION, BUSINESS_CONFIG } from "../data/config";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navClasses = twMerge(
    "fixed w-full z-50 transition-all duration-300 border-b border-transparent",
    isScrolled
      ? "bg-primary/90 backdrop-blur-md border-blue/20 py-4 shadow-[0_4px_30px_rgba(37,71,216,0.12)]"
      : "bg-transparent py-6"
  );

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-bold tracking-tighter">
          PLUGWA<span className="text-accent">SIGNS</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {NAVIGATION.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={clsx(
                "relative transition-colors pb-0.5",
                location.pathname === item.href
                  ? "text-accent"
                  : "text-gray-300 hover:text-white"
              )}
            >
              {item.label}
              {/* Blue underline on active */}
              {location.pathname === item.href && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue rounded-full"
                />
              )}
            </Link>
          ))}
          <Link
            to="/contact"
            className="btn-shine bg-accent text-black px-6 py-2.5 rounded-full font-bold hover:bg-accent-hover transition-transform hover:scale-105 active:scale-95"
          >
            GET A QUOTE
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(true)} aria-label="Open menu">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-primary z-50 flex flex-col p-6"
            style={{ background: "linear-gradient(135deg, #09092E 0%, #12124A 100%)" }}
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-display font-bold">PLUGWA<span className="text-accent">SIGNS</span></span>
              <button onClick={() => setIsOpen(false)} className="text-white p-2"><X size={28} /></button>
            </div>

            {/* Blue decorative line */}
            <div className="w-12 h-1 bg-blue rounded-full mb-8" />

            <div className="flex flex-col space-y-6 text-2xl font-display">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={clsx(
                    "hover:text-accent transition-colors",
                    location.pathname === item.href ? "text-accent" : "text-gray-300"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-8 flex flex-col gap-4">
              <Link to="/contact" className="btn-shine w-full text-center bg-accent text-black py-4 rounded-xl font-bold text-lg">
                GET A QUOTE
              </Link>
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center border border-blue/40 text-blue-light py-4 rounded-xl font-bold text-lg hover:bg-blue/10 transition-colors"
              >
                CHAT ON WHATSAPP
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

