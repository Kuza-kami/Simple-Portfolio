import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  duration?: number;
  blur?: string;
  yOffset?: number;
  once?: boolean;
  baseOpacity?: number;
  enableBlur?: boolean;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  id,
  delay = 0,
  duration = 0.8,
  blur = "10px",
  yOffset = 20,
  once = true,
  containerClassName = "",
  textClassName = ""
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      initial={shouldReduceMotion ? { opacity: 0 } : { 
        filter: `blur(${blur})`, 
        opacity: 0, 
        y: yOffset 
      }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { 
        filter: "blur(0px)", 
        opacity: 1, 
        y: 0 
      }}
      viewport={{ once, margin: "-10%" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={`${className} ${containerClassName} ${textClassName} will-change-[transform,filter,opacity]`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
