import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.4 2 7.8L.4 31.6l8-2c2.2 1.2 4.7 1.8 7.3 1.8h.1c8.5 0 15.5-6.9 15.5-15.4C31.3 7.5 24.5.4 16 .4zm0 28.3c-2.4 0-4.7-.6-6.8-1.8l-.5-.3-5 1.3 1.3-4.9-.3-.5C3.4 20.7 2.7 18.4 2.7 16 2.7 8.7 8.7 2.7 16 2.7S29.3 8.7 29.3 16 23.3 28.7 16 28.7zm8.4-9.9c-.5-.2-2.7-1.3-3.1-1.5-.4-.2-.7-.2-.9.2-.3.5-1 1.5-1.3 1.8-.2.3-.5.3-.9.1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.8-2.6-3.2-.3-.5 0-.7.2-.9l.6-.7c.2-.2.2-.4.4-.6.1-.2.1-.5 0-.7-.2-.2-1-2.4-1.3-3.2-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.8.1-1.2.5-.4.4-1.5 1.5-1.5 3.6s1.6 4.2 1.8 4.5c.2.3 3.1 4.7 7.5 6.5 1.1.5 1.9.7 2.5.9 1.1.3 2 .3 2.8.2.9-.1 2.7-1.1 3-2.1.4-1.1.4-2 .3-2.1-.1-.2-.4-.3-.9-.5z"/>
    </svg>
  );
}

const SCROLL_THRESHOLD = 400;

export default function FloatingWhatsApp() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const message = encodeURIComponent("Hi PlugWaSigns, I'd like to get a quote.");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-center gap-3">

      {/* WhatsApp — quiet icon circle, tooltip on hover */}
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Tooltip label — slides in from the left on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-white/10 pointer-events-none"
            >
              Chat on WhatsApp
            </motion.span>
          )}
        </AnimatePresence>

        <motion.a
          href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 220, damping: 22 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon />
        </motion.a>
      </div>

      {/* Scroll-to-top — appears only after user scrolls down */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ type: 'spring', damping: 18, stiffness: 260 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 text-gray-400 hover:text-white rounded-full flex items-center justify-center shadow-md transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
