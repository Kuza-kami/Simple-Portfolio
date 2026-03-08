
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

// --- 5. Scroll Reveal (Mask Reveal) ---
export const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)" }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }} 
            className={`${className} will-change-[clip-path]`}
        >
            {children}
        </motion.div>
    );
};

// --- 7. Fade In Slide (Simple Entry) ---
export const FadeInSlide: React.FC<{ children: React.ReactNode; direction?: 'up' | 'down' | 'left' | 'right'; delay?: number; className?: string }> = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className = "" 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : (direction === 'up' ? 20 : direction === 'down' ? -20 : 0),
      x: shouldReduceMotion ? 0 : (direction === 'left' ? 20 : direction === 'right' ? -20 : 0)
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.6, delay }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- 8. Parallax Image (Scroll Parallax) ---
export const ParallaxImage: React.FC<{ src: string; alt: string; className?: string; [key: string]: any }> = ({ 
  src, 
  alt, 
  className = "",
  ...props 
}) => {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative overflow-hidden w-full h-full bg-neutral-100 dark:bg-neutral-800">
      {/* Placeholder / Skeleton */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-10"
          />
        )}
      </AnimatePresence>

      <motion.div style={{ y: shouldReduceMotion ? 0 : y, scale: shouldReduceMotion ? 1 : 1.2 }} className="w-full h-full">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={src} 
          alt={alt} 
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          className={`block w-full h-full object-cover ${className}`}
          referrerPolicy="no-referrer"
          {...props}
        />
      </motion.div>
    </div>
  );
};

// --- 9. Typing Text (Typewriter Effect) ---
export const TypingText: React.FC<{ text: string; speed?: number; className?: string; delay?: number }> = ({ 
  text = "", 
  speed = 50,
  className = "",
  delay = 0
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedText(text);
      return;
    }
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay, shouldReduceMotion, text]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!started) return;
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [displayedText, text, speed, started, shouldReduceMotion]);

  return (
    <span className={className}>
      {displayedText}
      {!shouldReduceMotion && (
        <motion.span 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ duration: 0.8, repeat: Infinity }} 
          className="inline-block w-[2px] h-[1em] bg-current align-middle ml-1"
        />
      )}
    </span>
  );
};

// --- 11. Progressive Image (Lazy Load with Fade) ---
export const ProgressiveImage: React.FC<{ src: string; alt: string; className?: string; [key: string]: any }> = ({ 
  src, 
  alt, 
  className = "",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 animate-pulse z-10"
          />
        )}
      </AnimatePresence>
      
      <motion.img 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        src={src} 
        alt={alt} 
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        className={`block w-full h-full object-cover`}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
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

// --- 12. Text Reveal (Slide Up Mask) ---
export const TextReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// --- 13. Scroll Progress (Reading Progress Bar) ---
export const ScrollProgress: React.FC<{ containerRef: React.RefObject<HTMLElement>; className?: string }> = ({ 
  containerRef, 
  className = "fixed top-0 left-0 right-0" 
}) => {
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  return (
    <motion.div
      className={`h-1 bg-design-green origin-left z-overlay ${className}`}
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// --- 14. Staggered List (Children Stagger) ---
export const StaggeredList: React.FC<{ children: React.ReactNode; className?: string; stagger?: number }> = ({ 
  children, 
  className = "",
  stagger = 0.1
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : stagger
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <motion.div
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};



