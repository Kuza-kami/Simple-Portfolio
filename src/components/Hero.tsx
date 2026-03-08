import React from 'react';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParallaxFloat, BlurReveal } from './TextAnimations';

const Hero: React.FC = () => {
  return (
    <section 
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-design-white dark:bg-[#0a0a0a] transition-colors duration-500 pt-40 md:pt-32 pb-8 md:pb-12 px-4 sm:px-6 md:px-8"
    >
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-design-blue/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <BlurReveal>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex justify-between items-start"
          >
              <div className="hidden md:block">
                  <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest mb-2 text-design-blue">Location</span>
                  <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider">South Africa</span>
              </div>
          </motion.div>
        </BlurReveal>

      <ParallaxFloat offset={30}>
        <div className="relative z-10 w-full text-center flex flex-col items-center justify-center">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="w-[1px] bg-design-black dark:bg-white/30 mb-8"
          ></motion.div>

          <div className="relative w-full">
              <div className="overflow-hidden pb-4 md:pb-8">
                 <h1 className="text-[10vw] sm:text-[14vw] md:text-[20vw] lg:text-[23vw] font-display font-bold leading-[0.8] tracking-tighter text-design-black dark:text-design-white flex justify-center select-none">
                   {"PORTFOLIO".split("").map((char, i) => (
                     <motion.span 
                      key={i} 
                      initial={{ y: 200, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.2 + (i * 0.05), ease: "circOut" }}
                      className="inline-block"
                     >
                      {char}
                     </motion.span>
                   ))}
                 </h1>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-20">
                   <motion.div 
                     drag
                     dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                     whileHover={{ scale: 1.05 }}
                     whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ type: "spring", damping: 15, stiffness: 100, delay: 1 }}
                     className="inline-block pointer-events-auto cursor-grab touch-none select-none"
                   >
                     <div className="relative">
                        <span className="relative inline-block text-sm sm:text-lg md:text-2xl lg:text-3xl font-display font-bold text-design-black uppercase bg-design-blue px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 border-2 border-design-black dark:border-white shadow-flat dark:shadow-flat-white whitespace-nowrap">
                           Amy Simpson
                        </span>
                     </div>
                   </motion.div>
              </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex items-center gap-3 sm:gap-6 mt-6 md:mt-12 px-2"
          >
             <div className="h-[1px] w-4 sm:w-8 md:w-12 bg-design-black/10 dark:bg-white/10"></div>
             <p className="font-mono text-[8px] sm:text-[9px] md:text-xs uppercase tracking-wider sm:tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
               Precision Meets Performance
             </p>
             <div className="h-[1px] w-4 sm:w-8 md:w-12 bg-design-black/10 dark:bg-white/10"></div>
          </motion.div>
        </div>
      </ParallaxFloat>

      <BlurReveal delay={0.2}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="relative z-10 flex justify-center items-end"
        >
           <div 
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
           >
               <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest mb-3 sm:mb-4 opacity-50">Discover</span>
               <ArrowDown size={24} className="text-design-blue animate-bounce" />
           </div>
        </motion.div>
      </BlurReveal>
      </section>
  );
};

export default Hero;