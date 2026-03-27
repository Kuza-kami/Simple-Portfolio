import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParallaxFloat } from './TextAnimations';
import gsap from 'gsap';

const Hero: React.FC = () => {
  const [saTime, setSaTime] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Johannesburg',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setSaTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 }); // Wait for navbar to start

      // 1. Location/Time text
      tl.fromTo('.hero-location', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // 2. PORTFOLIO text stagger
      tl.fromTo('.hero-char',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" },
        "-=0.4" // Overlap with previous animation
      );

      // 3. AMY SIMPSON badge
      tl.fromTo('.hero-badge',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.2"
      );

      // 4. Tagline
      tl.fromTo('.hero-tagline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-visible bg-design-white dark:bg-[#0a0a0a] transition-colors duration-500 pt-16 md:pt-12 pb-2 md:pb-4 px-4 sm:px-6 md:px-8"
    >
        <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto w-full relative">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-design-blue/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex justify-between items-start hero-location opacity-0">
            <div className="hidden md:block mt-20">
                <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest mb-2 text-design-blue">Location / Time</span>
                <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider">South Africa / {saTime}</span>
            </div>
        </div>

      <ParallaxFloat offset={30}>
        <div className="relative z-10 w-full text-center flex flex-col items-center justify-end pb-10">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 32 }}
              transition={{ duration: 0.5, ease: "circOut", delay: 1.5 }}
              className="w-[1px] bg-design-black dark:bg-white/30 mb-4"
            ></motion.div>

          <div className="relative w-full">
              <div className="pb-2 md:pb-4">
                 <h1 className="text-center font-display font-bold text-[clamp(5rem,_38vw,_11rem)] sm:whitespace-nowrap leading-none sm:leading-tight tracking-tighter text-design-black dark:text-design-white select-none px-6 md:px-0">
                   <span className="block sm:inline pb-2 sm:pb-0">
                     {"PORT".split('').map((char, i) => <span key={`p-${i}`} className="hero-char inline-block opacity-0">{char}</span>)}
                   </span>
                   <span className="block sm:inline">
                     {"FOLIO".split('').map((char, i) => <span key={`f-${i}`} className="hero-char inline-block opacity-0">{char}</span>)}
                   </span>
                 </h1>
              </div>

              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 hero-badge opacity-0">
                   <motion.div 
                     drag
                     dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                     whileHover={{ scale: 1.05 }}
                     whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                     className="inline-block pointer-events-auto cursor-grab touch-none select-none"
                   >
                     <div className="relative">
                        <span className="relative inline-block text-xl sm:text-3xl md:text-5xl font-display font-bold text-design-black uppercase bg-design-blue px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 border-2 border-design-black dark:border-white shadow-flat dark:shadow-flat-white whitespace-nowrap">
                           Amy Simpson
                        </span>
                     </div>
                   </motion.div>
              </div>
          </div>

            <div className="flex flex-col items-center gap-2 mt-2 md:mt-4 px-2 hero-tagline opacity-0">
             <div className="flex items-center gap-3 sm:gap-6">
                <div className="h-[1px] w-4 sm:w-8 md:w-12 bg-design-black/10 dark:bg-white/10"></div>
                <p className="font-mono text-[8px] sm:text-[9px] md:text-xs uppercase tracking-wider sm:tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  Precision Meets Performance
                </p>
                <div className="h-[1px] w-4 sm:w-8 md:w-12 bg-design-black/10 dark:bg-white/10"></div>
             </div>
          </div>
        </div>
      </ParallaxFloat>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.0 }}
        className="relative z-10 flex justify-center items-end"
      >
         <button 
            className="flex flex-col items-center group cursor-pointer bg-transparent border-none focus:outline-none hover:scale-105 active:scale-95 transition-transform duration-200"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            aria-label="Scroll down to discover more"
         >
             <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest mb-3 sm:mb-4 opacity-50">Discover</span>
             <ArrowDown size={24} className="text-design-blue animate-bounce" />
         </button>
      </motion.div>
      </div>
      </section>
  );
};

export default Hero;