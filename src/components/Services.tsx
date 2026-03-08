import React, { useEffect, useRef, useState } from 'react';
import { Mail, Instagram, Download, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurReveal, RotatingWords, SplitText, ParallaxFloat } from './TextAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDownload = (url: string, filename: string) => {
    // Directly trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      // Animate service section elements on scroll
      const elements = sectionRef.current!.querySelectorAll('[data-gsap-service]');
      elements.forEach((element, index) => {
        gsap.fromTo(
          element,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: index * 0.15,
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'top 60%',
              scrub: 0.5,
              markers: false
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const roles = [
    "Designer",
    "Artist",
    "Muralist"
  ];

  return (
    <section ref={sectionRef} id="about" className="py-16 md:py-24 bg-white dark:bg-[#0f0f0f] relative transition-colors duration-500 border-t border-neutral-200 dark:border-neutral-800">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 50 }}
            className="fixed top-24 right-8 z-50 bg-design-black text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 whitespace-nowrap"
          >
            <span className="text-lg font-medium">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="hover:text-gray-300">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-start mb-12 md:mb-20" data-gsap-service>
            <BlurReveal>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-design-blue mb-3 md:mb-4 block">About Me</span>
            </BlurReveal>
            
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-display font-bold text-design-black dark:text-white uppercase leading-none flex flex-col items-start">
               <SplitText text="About" className="block" />
               <div className="relative inline-block">
                 <SplitText text="ME" className="font-bold relative z-10" delay={0.2} />
                 <motion.div 
                   initial={{ scaleX: 0 }}
                   whileInView={{ scaleX: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                   className="absolute bottom-2 left-0 w-full h-3 sm:h-4 md:h-4 bg-design-blue -z-10 origin-left opacity-50"
                 ></motion.div>
               </div>
            </h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
           
           {/* Left: Bio */}
           <ParallaxFloat offset={20}>
             <motion.div 
               data-gsap-service
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
             >
              <BlurReveal delay={0.2}>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-design-black dark:text-white font-light">
                    I believe in the tactility of design. From the texture of raw fabric to the stroke of a charcoal pencil, my work is grounded in material reality.
                </p>
                <p className="mt-6 md:mt-8 text-base sm:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    My background in sewing and textile art allows me to construct garments that tell stories. I approach every project with a focus on structure, form, and the human experience.
                </p>
              </BlurReveal>
           </motion.div>
           </ParallaxFloat>

           {/* Right: Role, Downloads, Contact */}
           <div className="flex flex-col space-y-8 md:space-y-12 lg:pl-8 md:lg:pl-12 border-l border-neutral-200 dark:border-neutral-800">
             <motion.div 
               data-gsap-service
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1, delay: 0.2 }}
               className="flex flex-col space-y-8 md:space-y-12"
             >
              {/* Current Skills */}
              <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-design-blue mb-3 block">Current Skills</span>
                  <div className="font-bold font-display uppercase text-2xl sm:text-3xl md:text-3xl h-8 md:h-10 text-design-black dark:text-white">
                       <RotatingWords words={roles} />
                  </div>
              </div>

              {/* Download Buttons */}
              <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-500 mb-3 md:mb-4 block">Resources</span>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                      <button 
                        onClick={() => handleDownload('/cv.pdf', 'Simpson_CV.pdf')}
                        className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-design-black dark:bg-white text-white dark:text-design-black rounded-full font-bold uppercase text-[11px] md:text-xs tracking-wider md:tracking-widest shadow-flat dark:shadow-flat-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                      >
                          <FileText size={14} className="md:w-4 md:h-4" />
                          <span>Download CV</span>
                      </button>
                      <button 
                        onClick={() => handleDownload('/portfolio.pdf', 'Simpson_Portfolio.pdf')}
                        className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-white dark:bg-[#1a1a1a] text-design-black dark:text-white border-2 border-design-black dark:border-white rounded-full font-bold uppercase text-[11px] md:text-xs tracking-wider md:tracking-widest shadow-flat dark:shadow-flat-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
                      >
                          <Download size={14} className="md:w-4 md:h-4 group-hover:text-design-blue transition-colors" />
                          <span>Portfolio PDF</span>
                      </button>
                  </div>
              </div>

              {/* Contact */}
              <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-500 mb-3 md:mb-4 block">Contact</span>
                  <div className="space-y-3 md:space-y-4">
                      <a href="mailto:amy@example.com" className="flex items-center gap-3 md:gap-4 group">
                          <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-design-blue group-hover:text-design-black transition-colors border border-transparent group-hover:border-design-black">
                              <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                          </div>
                          <span className="font-mono text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-design-black dark:group-hover:text-white transition-colors">amy.simpson@design.com</span>
                      </a>

                      <a href="#" className="flex items-center gap-3 md:gap-4 group">
                          <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-design-blue group-hover:text-design-black transition-colors border border-transparent group-hover:border-design-black">
                              <Instagram size={16} className="md:w-[18px] md:h-[18px]" />
                          </div>
                          <span className="font-mono text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-design-black dark:group-hover:text-white transition-colors">@amysimpson.design</span>
                      </a>
                  </div>
              </div>
             </motion.div>
           </div>

        </div>
      </div>
    </section>
  );
};

export default Services;