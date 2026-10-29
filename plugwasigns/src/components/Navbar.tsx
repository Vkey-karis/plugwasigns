import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { Menu, X, MessageCircle } from "lucide-react";
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isLightNav = location.pathname === '/' && !isScrolled;

  const navClasses = twMerge(
    "fixed w-full z-50 transition-all duration-300 border-b border-transparent",
    isScrolled
      ? "bg-primary/95 backdrop-blur-md border-blue/20 py-4 shadow-[0_4px_30px_rgba(37,71,216,0.12)]"
      : "bg-transparent py-6"
  );

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-bold tracking-tighter">
          <span className={isLightNav ? "text-primary transition-colors" : "text-white transition-colors"}>PLUGWA</span>
          <span className={isLightNav ? "text-blue bg-blue/10 px-1 py-0.5 rounded ml-0.5 text-glow-none" : "text-accent"}>SIGNS</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {NAVIGATION.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={clsx(
                "relative transition-colors pb-0.5 font-semibold",
                isLightNav
                  ? location.pathname === item.href
                    ? "text-blue"
                    : "text-gray-800 hover:text-blue"
                  : location.pathname === item.href
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
            className="btn-shine bg-accent text-black px-6 py-2.5 rounded-full font-bold hover:bg-accent-hover transition-transform hover:scale-105 active:scale-95 shadow-md border border-black/10"
          >
            GET A QUOTE
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden p-2 transition-colors ${isLightNav ? "text-gray-900" : "text-white"}`} onClick={() => setIsOpen(true)} aria-label="Open menu">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu (Portaled to document.body to avoid navbar backdrop-blur containing-block clipping) */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Soft Translucent Backdrop */}
                <motion.div
                  key="mobile-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] md:hidden"
                  aria-hidden="true"
                />

                {/* Side Drawer with Frosted Glassmorphism */}
                <motion.div
                  key="mobile-drawer"
                  initial={{ opacity: 0, x: "100%" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 260 }}
                  className={clsx(
                    "fixed top-0 right-0 bottom-0 h-screen h-dvh w-[86%] max-w-sm z-[100] flex flex-col p-6 shadow-[-15px_0_50px_rgba(0,0,0,0.65)] md:hidden overflow-y-auto",
                    isLightNav
                      ? "border-l border-black/10 text-[#09092E]"
                      : "border-l border-blue/40 text-white"
                  )}
                  style={
                    isLightNav
                      ? {
                          background: "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 255, 0.92) 100%)",
                          backdropFilter: "blur(24px)",
                          WebkitBackdropFilter: "blur(24px)",
                        }
                      : {
                          background: "linear-gradient(165deg, rgba(12, 12, 45, 0.97) 0%, rgba(6, 6, 26, 0.98) 100%)",
                          backdropFilter: "blur(28px)",
                          WebkitBackdropFilter: "blur(28px)",
                        }
                  }
                >
                  <div className="flex justify-between items-center mb-8">
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-display font-bold tracking-tight">
                      <span className={isLightNav ? "text-primary" : "text-white"}>PLUGWA</span>
                      <span className={isLightNav ? "text-blue bg-blue/10 px-1 py-0.5 rounded ml-0.5" : "text-accent"}>SIGNS</span>
                    </Link>
                    <button
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "p-2 rounded-full transition-colors",
                        isLightNav
                          ? "text-gray-700 hover:text-black bg-black/5 hover:bg-black/10"
                          : "text-white hover:text-accent bg-white/10 hover:bg-white/20"
                      )}
                      aria-label="Close menu"
                    >
                      <X size={26} />
                    </button>
                  </div>

                  {/* Decorative accent line */}
                  <div className="w-12 h-1 bg-blue rounded-full mb-6" />

                  <div className="flex flex-col space-y-2 text-2xl font-display">
                    {NAVIGATION.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={clsx(
                            "transition-all py-2.5 px-3 rounded-xl flex items-center justify-between font-semibold",
                            isLightNav
                              ? isActive
                                ? "text-blue font-bold bg-blue/10 border border-blue/20"
                                : "text-gray-800 hover:text-blue hover:bg-black/5"
                              : isActive
                                ? "text-accent font-bold bg-accent/10 border border-accent/25 shadow-[0_0_15px_rgba(227,255,0,0.15)]"
                                : "text-gray-200 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <span>{item.label}</span>
                          {isActive && (
                            <span className={clsx("w-2 h-2 rounded-full", isLightNav ? "bg-blue shadow-[0_0_8px_rgba(37,71,216,0.6)]" : "bg-accent shadow-[0_0_8px_rgba(227,255,0,0.8)]")} />
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-auto pt-8 pb-4 flex flex-col gap-3">
                    <Link
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className="btn-shine w-full text-center bg-accent text-black py-3.5 rounded-xl font-bold text-lg shadow-md border border-black/10 hover:bg-accent-hover transition-all"
                    >
                      GET A FREE QUOTE
                    </Link>
                    <a
                      href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns,%20I'd%20like%20to%20inquire%20about%20a%20project.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "w-full text-center py-3.5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2",
                        isLightNav
                          ? "border-2 border-primary/20 text-primary hover:bg-primary hover:text-white bg-white/60 shadow-sm"
                          : "border border-blue/40 text-blue-light hover:bg-blue/10 bg-blue/5"
                      )}
                    >
                      <MessageCircle size={18} />
                      CHAT ON WHATSAPP
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </nav>
  );
}
