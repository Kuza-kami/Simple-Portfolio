import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Instagram, Download, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotatingWords, SplitText, ParallaxFloat, ThreeDTextReveal } from './TextAnimations';
import { TextHighlight } from './TextHighlight';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showMissingFileModal, setShowMissingFileModal] = useState(false);
  const [missingFileName, setMissingFileName] = useState("");

  const handleDownload = (_url: string, filename: string) => {
    // In a real app, we'd check if the file exists. 
    // For this portfolio, we'll show the "missing" modal as requested.
    setMissingFileName(filename.replace('_', ' '));
    setShowMissingFileModal(true);
  };

  useEffect(() => {
    if (showMissingFileModal) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showMissingFileModal]);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      // Animate service section elements on scroll
      const elements = sectionRef.current!.querySelectorAll('[data-gsap-service]');
      elements.forEach((element, index) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
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
    <section ref={sectionRef} id="about" className="py-16 md:py-24 bg-white dark:bg-[#0f0f0f] relative transition-colors duration-500">
      {createPortal(
        <AnimatePresence>
          {showMissingFileModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowMissingFileModal(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-design-black p-8 rounded-[2rem] shadow-2xl max-w-sm w-full border border-neutral-200 dark:border-neutral-800 text-center relative z-10"
              >
                <button 
                  onClick={() => setShowMissingFileModal(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-design-black dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="w-16 h-16 bg-design-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-design-blue w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-display font-bold text-design-black dark:text-white mb-2 uppercase tracking-tight">File Not Found</h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                  The requested document <span className="font-mono text-design-blue font-bold">{missingFileName}</span> is currently being updated and is not available for download at this moment.
                </p>
                
                <button 
                  onClick={() => setShowMissingFileModal(false)}
                  className="w-full py-4 bg-design-black dark:bg-white text-white dark:text-design-black rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-flat dark:shadow-flat-white"
                >
                  Understood
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-start mb-12 md:mb-20 will-change-transform" data-gsap-service>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-design-blue mb-3 md:mb-4 block">About Me</span>
            
            <h2 className="text-[clamp(3rem,_8vw,_8rem)] font-display font-bold text-design-black dark:text-white uppercase leading-none flex flex-col items-start">
               <ThreeDTextReveal text="About" className="block" />
               <div className="relative inline-block mt-2">
                 <SplitText text="ME" className="font-bold relative z-10" delay={0.3} />
                 <motion.div 
                   initial={{ scaleX: 0 }}
                   whileInView={{ scaleX: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                   className="absolute bottom-2 left-0 w-full h-3 sm:h-4 md:h-4 bg-design-blue -z-10 origin-left opacity-50"
                 ></motion.div>
               </div>
            </h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
           
           {/* Left: Bio */}
           <ParallaxFloat offset={20}>
             <div 
               data-gsap-service
               className="will-change-transform"
             >
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-design-black dark:text-white font-light">
                  <TextHighlight
                    highlightedBits={["Aspiring designer"]}
                    highlightColor="transparent"
                    highlightBackgroundClassName="bg-design-green/40 dark:bg-design-green/50"
                    highlightClassName="rounded-[8px] px-2 py-0.5 text-design-black dark:text-white"
                    blurAmount={0}
                    inactiveOpacity={1}
                  >
                    Aspiring designer, muralist, and artist based in Pretoria.
                  </TextHighlight>
                </p>
                <p className="mt-6 md:mt-8 text-base sm:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  <TextHighlight
                    highlightedBits={["structure meets instinct", "communication", "honestly", "earn its place", "work already speaks"]}
                    highlightColor="transparent"
                    highlightBackgroundClassName="bg-design-green/40 dark:bg-design-green/50"
                    highlightClassName="rounded-[8px] px-2 py-0.5 text-design-black dark:text-white"
                    blurAmount={0}
                    inactiveOpacity={1}
                  >
                    I work across brand identity, large-scale murals, and visual art drawn to the spaces where structure meets instinct and design becomes something worth stopping for. For me, it has never been purely about aesthetics. It's about communication. The kind that makes someone look twice. Every project begins with one question: what should this actually say? Then comes the work of answering it honestly in colour, in form, in scale. I'm still  in the journey. But I build with intention, I move with purpose, and I hold every piece to a simple standard: it must earn its place. The work already speaks. I'm simply making sure it has something worth saying.
                  </TextHighlight>
                </p>
            </div>
           </ParallaxFloat>

           {/* Right: Role, Downloads, Contact */}
            <div className="flex flex-col space-y-8 md:space-y-12 md:pl-8 lg:pl-12 border-l border-neutral-200 dark:border-neutral-800">
             <div 
               data-gsap-service
               className="flex flex-col space-y-8 md:space-y-12 will-change-transform"
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
                  <div className="flex flex-row items-center gap-3 w-full">
                      <button 
                        onClick={() => handleDownload('/cv.pdf', 'Simpson_CV.pdf')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-design-black dark:bg-white text-white dark:text-design-black rounded-full font-bold uppercase text-[10px] tracking-wider shadow-flat dark:shadow-flat-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all whitespace-nowrap"
                      >
                          <FileText size={14} />
                          <span>Download CV</span>
                      </button>
                      <button 
                        onClick={() => handleDownload('/portfolio.pdf', 'Simpson_Portfolio.pdf')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white dark:bg-[#1a1a1a] text-design-black dark:text-white border-2 border-design-black dark:border-white rounded-full font-bold uppercase text-[10px] tracking-wider shadow-flat dark:shadow-flat-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group whitespace-nowrap"
                      >
                          <Download size={14} className="group-hover:text-design-blue transition-colors" />
                          <span>Portfolio PDF</span>
                      </button>
                  </div>
              </div>

              {/* Contact */}
              <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-500 mb-3 md:mb-4 block">Contact</span>
                  <div className="space-y-3 md:space-y-4">
                      <a href="mailto:amy.simpson@gmail.com" className="flex items-center gap-3 md:gap-4 group">
                          <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-design-blue group-hover:text-design-black transition-colors border border-transparent group-hover:border-design-black">
                              <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                          </div>
                          <span className="font-mono text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-design-black dark:group-hover:text-white transition-colors">amy.simpson@gmail.com</span>
                      </a>

                      <a href="#" className="flex items-center gap-3 md:gap-4 group">
                          <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-design-blue group-hover:text-design-black transition-colors border border-transparent group-hover:border-design-black">
                              <Instagram size={16} className="md:w-[18px] md:h-[18px]" />
                          </div>
                          <span className="font-mono text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-design-black dark:group-hover:text-white transition-colors">@amysimpson.design</span>
                      </a>
                  </div>
              </div>
             </div>
           </div>

        </div>
      </div>
    </section>
  );
};

export default Services;