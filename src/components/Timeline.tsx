import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { X, Award, FileText, Fingerprint, MapPin, ShieldCheck } from 'lucide-react';
import { timelineEvents } from '../data/content';
import { ParallaxFloat, BlurReveal } from './TextAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<typeof timelineEvents[0] | null>(null);

  // Generate a stable random ID for the selected event
  const archiveId = useMemo(() => {
    if (!selectedEvent) return null;
    return Math.floor(Math.random() * 8999) + 1000;
  }, [selectedEvent]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Animate timeline event cards on scroll
      const events = containerRef.current!.querySelectorAll('[data-gsap-timeline]');
      events.forEach((element, index) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: (index % 2) * 0.2,
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 0.3,
              markers: false
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  
  // Track scroll progress of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 75%"]
  });

  // Smooth spring physics for the line drawing
  const scaleY = useSpring(scrollYProgress, {
      stiffness: 60,
      damping: 20,
      restDelta: 0.001
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEvent]);

  return (
    <section ref={containerRef} id="timeline" className="py-16 md:py-24 lg:py-32 bg-white dark:bg-[#0f0f0f] relative overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 relative">
          
          {/* Header */}
          <ParallaxFloat offset={15}>
            <BlurReveal>
              <div className="text-center mb-16 md:mb-24 relative z-10">
                   <span className="block text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-2 md:mb-2 text-design-blue">The Process</span>
                   <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display uppercase font-bold text-design-black dark:text-white">
                      Awards & <br /><span className="italic font-serif font-light text-gray-400">Experience</span>
                   </h2>
              </div>
            </BlurReveal>
          </ParallaxFloat>

        {/* Animated Central Thread Line */}
        <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-2 md:-translate-x-1/2 pointer-events-none z-0">
             
             {/* Decorative Loop at top (Static Anchor) */}
             <div className="absolute top-32 left-1/2 -translate-x-1/2 -translate-y-full">
                 <svg width="60" height="80" viewBox="0 0 60 80" className="text-design-black dark:text-white stroke-current fill-none stroke-[2px] overflow-visible">
                     <path d="M 30,80 L 30,50 C 30,50 30,20 10,20 C -10,20 -10,50 30,50 C 70,50 70,20 50,20 C 30,20 30,50 30,50" />
                 </svg>
             </div>

             {/* The Drawing Line Container */}
             <div className="absolute top-32 bottom-0 left-1/2 -translate-x-[3px] w-[6px]">
                {/* Background Guide (Faint) */}
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 w-full rounded-full opacity-30" />
                
                {/* Active Thread Line */}
                <motion.div 
                    className="absolute top-0 left-0 w-full bg-design-black dark:bg-white origin-top"
                    style={{ scaleY }}
                />

                {/* Needle Tip */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-6 h-12"
                    style={{ 
                        top: useTransform(scaleY, (v) => `${v * 100}%`),
                    }}
                >
                    {/* Needle Graphic */}
                    <div className="-translate-y-[85%] filter drop-shadow-md">
                        <svg width="24" height="48" viewBox="0 0 24 48" fill="none" className="text-design-black dark:text-white">
                            {/* Needle Body */}
                            <path d="M12 48L15 6C15.5 3 13.5 0 12 0C10.5 0 8.5 3 9 6L12 48Z" fill="currentColor"/>
                            {/* Eye of Needle (Hole) */}
                            <path d="M12 2L12 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-black"/>
                        </svg>
                    </div>
                </motion.div>
             </div>
        </div>
        <div className="space-y-12 md:space-y-24 lg:space-y-32 relative z-10 pb-16 md:pb-32">
           {timelineEvents.map((event, index) => {
               const isEven = index % 2 === 0;
               return (
                   <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-center group`}
                        onClick={() => setSelectedEvent(event)}
                   >
                         {/* Dot on line */}
                        <div 
                            className="absolute left-1 sm:left-4 md:left-1/2 w-6 md:w-8 h-6 md:h-8 bg-design-white border-4 md:border-6 border-design-black rounded-full md:-translate-x-1/2 z-10 transform md:-translate-x-[50%] mt-6 md:mt-0 group-hover:scale-125 transition-transform duration-300"
                        ></div>

                        {/* Content Side */}
                        <div className={`w-full md:w-1/2 pl-12 sm:pl-16 md:pl-0 ${isEven ? 'md:pl-24 text-left' : 'md:pr-24 md:text-right'}`}>
                            <div className={`inline-block border border-design-black rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-white mb-2 md:mb-4 shadow-sm group-hover:bg-design-blue group-hover:text-black transition-colors ${!isEven && 'md:ml-auto'}`}>
                                {event.year}
                            </div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display uppercase font-bold mb-2 md:mb-3 text-design-black group-hover:text-design-blue transition-colors cursor-pointer">{event.title}</h3>
                            <p className={`text-gray-600 font-medium text-xs sm:text-sm leading-relaxed max-w-sm mx-auto md:mx-0 ${!isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                                {event.desc}
                            </p>
                        </div>

                        {/* Image Side */}
                        <div className={`w-full md:w-1/2 pl-12 sm:pl-16 md:pl-0 mt-6 md:mt-0 cursor-pointer ${isEven ? 'md:pr-24' : 'md:pl-24'}`}>
                             <div className={`relative aspect-[16/10] w-full max-w-md mx-auto transform group-hover:scale-105 transition-transform duration-500 ease-out ${isEven ? 'mr-auto md:mr-0' : 'mr-auto'}`}>
                                 {/* Shadow Box */}
                                 <div className="absolute inset-0 bg-design-black translate-x-2 md:translate-x-3 translate-y-2 md:translate-y-3 rounded-xl group-hover:translate-x-3 md:group-hover:translate-x-4 group-hover:translate-y-3 md:group-hover:translate-y-4 transition-transform duration-500"></div>
                                 <img 
                                    src={event.image} 
                                    alt={`Timeline event: ${event.title}`} 
                                    className="relative w-full h-full object-cover border-2 border-design-black rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500 bg-gray-200"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    decoding="async"
                                 />
                                 
                                 {/* View Indicator */}
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                     <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-black shadow-lg">
                                         View Archive
                                     </div>
                                 </div>
                             </div>
                        </div>
                   </motion.div>
               );
           })}
           
           {/* Final Knot/End */}
           <div className="relative flex justify-center pt-12 pl-8 md:pl-0">
             <div className="bg-design-cream border-2 border-design-black px-6 py-2 z-10 font-mono text-xs uppercase tracking-widest rounded-full shadow-flat">
                   MORE COMING SOON
               </div>
           </div>
        </div>

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={() => setSelectedEvent(null)}
             />
             
             <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-6xl bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl z-[1010] max-h-[90vh]"
             >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-6 right-6 z-50 w-10 h-10 bg-black/20 text-white backdrop-blur-md rounded-full flex items-center justify-center hover:bg-design-blue hover:text-black transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Side: Image & Certificate Visual */}
                <div className="w-full md:w-3/5 relative h-[30vh] md:h-auto bg-neutral-900 overflow-hidden group">
                    <img 
                        src={selectedEvent.image} 
                        alt={`Timeline event details: ${selectedEvent.title}`} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                    
                    {/* Certificate Badge Overlay */}
                    <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 max-w-xs">
                        <div className="flex items-center gap-3 mb-2 md:mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-design-green rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(180,197,168,0.4)]">
                                <Award size={20} className="md:w-6 md:h-6" />
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                                <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-white">Verified Achievement</span>
                            </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold uppercase text-white mb-2 leading-none">
                            Certificate of <br/>Excellence
                        </h3>
                        <p className="text-white/60 text-[10px] md:text-xs leading-relaxed border-l-2 border-design-green pl-3 hidden sm:block">
                            This document certifies the successful completion and recognition of the aforementioned milestone in the Simpson Archives.
                        </p>
                    </div>
                </div>

                 {/* Right Side: Details & Archive Data */}
                <div className="w-full md:w-2/5 bg-white text-design-black flex flex-col flex-1 overflow-y-auto">
                    <div className="p-6 md:p-12">
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <span className="px-4 py-1.5 bg-design-black text-white rounded-full text-xs font-bold uppercase tracking-widest">
                                Year {selectedEvent.year}
                            </span>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4 md:mb-6 leading-[0.9] tracking-tight text-design-black">
                            {selectedEvent.title}
                        </h2>

                        <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed mb-8 md:mb-10">
                            {selectedEvent.extendedDesc || selectedEvent.desc}
                        </p>

                        {/* Archive Data Block */}
                        <div className="bg-neutral-50 rounded-2xl p-4 md:p-6 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4 md:mb-6 border-b border-gray-200 pb-4">
                                <FileText size={18} className="text-design-green" />
                                <span className="text-xs font-bold uppercase tracking-widest">Archive Metadata</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
                                        <Fingerprint size={16} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Record ID</span>
                                        <span className="font-mono text-sm">ARCH-{selectedEvent.year}-{archiveId}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Origin</span>
                                        <span className="font-mono text-sm">New York, NY / Global</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Verification</span>
                                        <span className="font-mono text-sm text-design-green">Authenticated</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer in Modal */}
                    <div className="mt-auto p-4 md:p-6 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-[10px] font-mono uppercase text-gray-400">
                            Simpson Studio Archives &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Timeline;                  