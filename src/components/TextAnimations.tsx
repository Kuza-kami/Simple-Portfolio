
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- 1. Rotating Words (Rolodex Effect) ---
interface RotatingWordsProps {
  words: string[];
  interval?: number;
  className?: string;
}

export const RotatingWords: React.FC<RotatingWordsProps> = ({ 
  words, 
  interval = 1500,
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
      className={`flex flex-wrap will-change-transform ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-flex whitespace-nowrap mr-[0.2em] will-change-transform">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              variants={{
                hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: "0.5em", rotateZ: 2 },
                visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateZ: 0 }
              }}
              transition={{ 
                duration: 0.4, 
                delay: delay + (i * 0.05) + (j * 0.02),
                ease: [0.16, 1, 0.3, 1]
              }}
              className="inline-block will-change-transform"
            >
              {char}
            </motion.span>
          ))}
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
      transition={{ duration: 0.4, ease: "easeOut", delay }}
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
  speed = 30,
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

// --- New Animations ---

export const ThreeDLetterSwap: React.FC<{ 
  text1: string; 
  text2: string; 
  className?: string;
  stagger?: number;
}> = ({ text1, text2, className = "", stagger = 0.05 }) => {
  const maxLength = Math.max(text1.length, text2.length);
  const t1 = text1.padEnd(maxLength, " ");
  const t2 = text2.padEnd(maxLength, " ");

  return (
    <div className={`flex ${className}`}>
      {t1.split("").map((char, i) => (
        <motion.div
          key={i}
          className="relative h-[1.2em] preserve-3d group cursor-default"
          initial="initial"
          whileHover="hover"
        >
          <motion.span
            variants={{
              initial: { rotateX: 0, y: 0 },
              hover: { rotateX: 90, y: "-50%" }
            }}
            transition={{ duration: 0.4, delay: i * stagger, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
          <motion.span
            variants={{
              initial: { rotateX: -90, y: "50%", opacity: 0 },
              hover: { rotateX: 0, y: 0, opacity: 1 }
            }}
            transition={{ duration: 0.4, delay: i * stagger, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 block text-design-blue"
          >
            {t2[i] === " " ? "\u00A0" : t2[i]}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

export const ThreeDTextReveal: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className = "", delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    
    const chars = containerRef.current.querySelectorAll('.char');
    
    const ctx = gsap.context(() => {
      gsap.fromTo(chars, 
        { 
          rotationX: -90, 
          opacity: 0, 
          y: 50,
          transformOrigin: "50% 50% -50"
        },
        {
          rotationX: 0,
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.8,
          delay: delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "top 60%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay]);

  return (
    <div ref={containerRef} className={`flex flex-wrap perspective-1000 will-change-transform ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-flex whitespace-nowrap mr-[0.2em] preserve-3d will-change-transform">
          {word.split("").map((char, j) => (
            <span key={j} className="char inline-block preserve-3d backface-hidden will-change-transform">
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

export const BlurHighlight: React.FC<{ 
  text: string; 
  highlightWords?: string[]; 
  className?: string;
  delay?: number;
}> = ({ text, highlightWords = [], className = "", delay = 0 }) => {
  const words = text.split(" ");
  return (
    <p className={`will-change-transform ${className}`}>
      {words.map((word, i) => {
        const isHighlighted = highlightWords.some(hw => 
          word.toLowerCase().includes(hw.toLowerCase())
        );
        return (
          <motion.span
            key={i}
            initial={{ filter: "blur(10px)", opacity: 0 }}
            whileInView={{ filter: "blur(0px)", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: delay + i * 0.02,
              ease: "easeOut"
            }}
            className={`inline-block mr-[0.25em] ${isHighlighted ? 'text-design-blue font-bold' : ''}`}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
};

export const StaggeredText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}> = ({ text, className = "", delay = 0, direction = 'up', distance = 20 }) => {
  const words = text.split(" ");
  
  const getInitial = () => {
    switch(direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };

  return (
    <div className={`flex flex-wrap will-change-transform ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] will-change-transform">
          <motion.span
            initial={getInitial()}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

// --- 5. Advanced Text Animation Component ---
export const TextAnimation: React.FC<{
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  segmentBy?: "chars" | "words" | "lines";
  separator?: string;
  delay?: number;
  duration?: number;
  easing?: any;
  threshold?: number;
  rootMargin?: string;
  direction?: "top" | "bottom" | "left" | "right";
  blur?: boolean;
  staggerDirection?: "forward" | "reverse" | "center";
  respectReducedMotion?: boolean;
  exitOnScrollOut?: boolean;
  from?: any;
  to?: any;
  onAnimationComplete?: () => void;
  segmentStyles?: Record<number, React.CSSProperties>;
  segmentClasses?: Record<number, string>;
}> = ({
  text = "",
  className = "",
  as: Component = "p",
  segmentBy = "words",
  separator,
  delay = 80,
  duration = 0.6,
  easing = "easeOut",
  threshold = 0.1,
  rootMargin: _rootMargin = "0px",
  direction = "top",
  blur = true,
  staggerDirection = "forward",
  respectReducedMotion = true,
  exitOnScrollOut = false,
  from,
  to,
  onAnimationComplete,
  segmentStyles,
  segmentClasses
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isReduced = respectReducedMotion && shouldReduceMotion;

  const segments = React.useMemo(() => {
    let baseSegments: string[] = [];
    if (separator) {
      baseSegments = text.split(separator);
    } else {
      baseSegments = [text];
    }

    if (segmentBy === "lines") return baseSegments;
    
    if (segmentBy === "words") {
      return baseSegments.flatMap(s => s.split(/\s+/));
    }

    if (segmentBy === "chars") {
      return baseSegments.flatMap(s => s.split(""));
    }

    return baseSegments;
  }, [text, segmentBy, separator]);

  const defaultFrom = React.useMemo(() => {
    if (from) return from;
    const initial: any = { opacity: 0 };
    if (blur) initial.filter = "blur(10px)";
    
    switch (direction) {
      case "top": initial.y = "100%"; break;
      case "bottom": initial.y = "-100%"; break;
      case "left": initial.x = "100%"; break;
      case "right": initial.x = "-100%"; break;
    }
    return initial;
  }, [from, direction, blur]);

  const defaultTo = React.useMemo(() => {
    if (to) return to;
    const target: any = { opacity: 1, x: 0, y: 0 };
    if (blur) target.filter = "blur(0px)";
    return target;
  }, [to, blur]);

  useEffect(() => {
    if (isReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const chars = containerRef.current?.querySelectorAll('.segment-inner');
      if (!chars || chars.length === 0) return;

      gsap.fromTo(chars, 
        defaultFrom, 
        {
          ...defaultTo,
          duration: duration,
          delay: delay / 1000,
          stagger: {
            each: 0.05,
            from: staggerDirection === "center" ? "center" : staggerDirection === "reverse" ? "end" : "start"
          },
          ease: typeof easing === 'string' ? easing : "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${100 - (threshold * 100)}%`,
            toggleActions: exitOnScrollOut ? "play reverse play reverse" : "play none none reverse",
            invalidateOnRefresh: true,
          },
          onComplete: onAnimationComplete
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReduced, segments, defaultFrom, defaultTo, duration, delay, staggerDirection, threshold, exitOnScrollOut, easing, onAnimationComplete]);

  return (
    <Component ref={containerRef} className={`flex justify-center ${className}`}>
      {segments.map((segment, i) => (
        <span key={i} className={`inline-block py-[0.1em] ${segmentClasses && i in segmentClasses ? segmentClasses[i] : 'overflow-hidden'}`}>
          <span
            className="segment-inner inline-block will-change-transform"
            style={{ 
              ...segmentStyles?.[i],
              opacity: isReduced ? 1 : 0 
            }}
          >
            {segment === " " ? "\u00A0" : segment}
          </span>
        </span>
      ))}
    </Component>
  );
};
