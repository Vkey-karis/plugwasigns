import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHRASES = [
  "IMPOSSIBLE TO MISS.",
  "STAND OUT         BOLDLY.",
  "UNFORGETTABLE.",
  "SHINE BRIGHTER."
];

export default function AnimatedSignText() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % PHRASES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const currentPhrase = PHRASES[idx];

  return (
    <span className="inline-flex text-accent min-h-[1.2em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          className="flex flex-wrap"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            },
            exit: {
              opacity: 0,
              y: -20,
              filter: "blur(8px)",
              transition: { duration: 0.3, ease: "easeIn" }
            }
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentPhrase.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { 
                  opacity: 0, 
                  rotateX: -90, 
                  y: 20, 
                  color: "#ffffff" 
                },
                visible: { 
                  opacity: 1, 
                  rotateX: 0, 
                  y: 0, 
                  color: "#E3FF00",
                  textShadow: "0 0 22px rgba(227, 255, 0, 0.7)",
                  transition: { type: "spring", damping: 10, stiffness: 200 }
                }
              }}
              style={{ 
                display: char === " " ? "inline" : "inline-block", 
                whiteSpace: "pre",
                transformOrigin: "bottom"
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
