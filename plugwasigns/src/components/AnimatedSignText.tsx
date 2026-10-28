import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHRASES = [
  "IMPOSSIBLE TO MISS.",
  "STAND OUT BOLDLY.",
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
  const words = currentPhrase.split(" ");

  let charCounter = 0;

  return (
    <span className="inline-flex items-center whitespace-nowrap text-accent min-h-[1.2em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          className="inline-flex flex-nowrap items-center whitespace-nowrap gap-x-2 sm:gap-x-2.5"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            },
            exit: {
              opacity: 0,
              y: -12,
              filter: "blur(6px)",
              transition: { duration: 0.22, ease: "easeIn" }
            }
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {words.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-flex whitespace-nowrap">
              {word.split("").map((char) => {
                const charKey = `${wordIdx}-${charCounter++}`;
                return (
                  <motion.span
                    key={charKey}
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        rotateX: -90, 
                        y: 15, 
                        color: "#ffffff" 
                      },
                      visible: { 
                        opacity: 1, 
                        rotateX: 0, 
                        y: 0, 
                        color: "#E3FF00",
                        textShadow: "0 0 20px rgba(227, 255, 0, 0.75)",
                        transition: { type: "spring", damping: 10, stiffness: 200 }
                      }
                    }}
                    style={{ 
                      display: "inline-block", 
                      transformOrigin: "bottom"
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
