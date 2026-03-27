import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} id="footer" className="bg-black py-24 border-4 border-design-blue text-center text-white relative overflow-hidden rounded-[22px]">
      <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(var(--color-design-blue) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
      }}></div>
      <div className="relative z-10 max-w-4xl 2xl:max-w-[90rem] mx-auto px-6">
          <h2 className="text-7xl font-display font-bold mb-4 tracking-tighter uppercase text-white">
              Simpson
          </h2>
          <div className="mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.4em] text-design-green mb-6">Available for Projects</p>
            <a 
              href="mailto:amy.simpson@gmail.com" 
              className="text-2xl md:text-4xl font-display font-medium hover:text-design-green transition-colors duration-300 border-b-2 border-transparent hover:border-design-green pb-2"
            >
              amy.simpson@gmail.com
            </a>
          </div>
          <div className="flex justify-center flex-wrap gap-8 md:gap-12 mb-16">
             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-design-green transition-all relative group text-white">
               Instagram
             </a>
             <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-design-green transition-all relative group text-white">
               LinkedIn
             </a>
             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-design-green transition-all relative group text-white">
               Twitter
             </a>
          </div>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Simpson Studio &bull; Built with Strength and Precision
          </p>
      </div>
    </footer>
  );
};

export default Footer;
