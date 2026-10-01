import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*?";

/**
 * Scrambles `text` with random characters, then progressively resolves
 * each character left-to-right until the original string is revealed.
 */
export function useTextScramble(text: string, delay = 0): string {
  const [display, setDisplay] = useState<string>(() =>
    text
      .split("")
      .map((c) => (c === " " ? " " : CHARS[0]))
      .join("")
  );

  useEffect(() => {
    let iter = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((char, idx) => {
              if (char === " ") return " ";
              if (idx < Math.floor(iter)) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        iter += 0.35;

        if (iter >= text.length) {
          clearInterval(intervalId);
          setDisplay(text);
        }
      }, 35);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, delay]);

  return display;
}
