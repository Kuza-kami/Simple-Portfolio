
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// --- 1. Rotating Words (Rolodex Effect) ---
interface RotatingWordsProps {
  words: string[];
  interval?: number;
  className?: string;
}

export const RotatingWords: React.FC<RotatingWordsProps> = ({ 
  words, 
  interval = 2500,
  className = "" 
}) => {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!words || words.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  if (!words || words.length === 0) return null;

  return (
    <div className={`relative overflow-hidden h-[1.2em] w-full inline-flex justify-start ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={shouldReduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0, rotateX: -45 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, rotateX: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0, rotateX: 45 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.16, 1, 0.3, 1],
          }}
          className="block whitespace-nowrap origin-center text-design-blue"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// --- 2. Split Text (Character by Character) ---
export const SplitText: React.FC<{ text: string; className?: string; delay?: number }> = ({ 
  text = "", 
  className = "", 
  delay = 0 
}) => {
  const words = text.split(" ");
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5%" }}
      className={`inline-block ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              variants={{
                hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, rotateZ: 2 },
                visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateZ: 0 }
              }}
              transition={{ 
                duration: 0.4, 
                delay: delay + (i * 0.1) + (j * 0.02),
                ease: "easeOut" 
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </motion.div>
  );
};

// --- 3. Blur Reveal (Blur to Sharp) ---
export const BlurReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(8px)", opacity: 0, y: 15 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { filter: "blur(0px)", opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  );
};

// --- 4. Parallax Float (Scroll Float) ---
export const ParallaxFloat: React.FC<{ children: React.ReactNode; offset?: number; className?: string }> = ({ 
  children, 
  offset = 50, 
  className = "" 
}) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y: shouldReduceMotion ? 0 : y, willChange: 'transform' }} className={className}>
      {children}
    </motion.div>
  );
};

export const DecryptedText: React.FC<{ text: string; speed?: number; className?: string; revealDelay?: number }> = ({ 
  text = "", 
  speed = 50,
  className = "",
  revealDelay = 0
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(text);
      return;
    }

    let interval: any;
    let iteration = 0;
    
    const animate = () => {
      interval = setInterval(() => {
        setDisplayText(() => 
          text
            .split("")
            .map((_, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, speed);
    };

    if (isHovered || revealDelay === 0) {
        if (revealDelay > 0) {
            setTimeout(animate, revealDelay);
        } else {
            animate();
        }
    }

    return () => clearInterval(interval);
  }, [text, speed, isHovered, revealDelay, shouldReduceMotion]);

  return (
    <span 
      className={`inline-block font-mono ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </span>
  );
};



