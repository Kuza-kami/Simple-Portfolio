import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';

interface ScrollFloatProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  containerClassName?: string;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({ 
  children, 
  offset = 100, 
  className = "",
  containerClassName = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  
  // Add a spring for smoother motion
  const y = useSpring(yRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      ref={ref} 
      style={{ y: shouldReduceMotion ? 0 : y }} 
      className={`${className} ${containerClassName} will-change-transform`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollFloat;
