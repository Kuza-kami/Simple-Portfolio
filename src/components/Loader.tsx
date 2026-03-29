import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (loaderRef.current) {
            gsap.to(loaderRef.current, {
              opacity: 0,
              duration: 0.8,
              ease: "power2.inOut",
              onComplete: () => {
                if (loaderRef.current) {
                  loaderRef.current.style.display = "none";
                }
                onComplete();
              }
            });
          }
        }
      });

      // Initial state
      gsap.set(logoRef.current, { y: 20, opacity: 0 });
      gsap.set(barRef.current, { scaleX: 0 });

      // Animation sequence
      tl.to(logoRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
      })
      .to(barRef.current, {
        scaleX: 1,
        duration: 1.5,
        ease: "power1.inOut"
      }, "-=0.2")
      .to(logoRef.current, {
        y: -10,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in"
      }, "+=0.2");
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-design-cream transition-colors duration-300"
    >
      <div className="flex flex-col items-center gap-6">
        <div ref={logoRef} className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase dark:text-white">
          SIMPSON<span className="text-design-blue">.</span>
        </div>
        
        <div ref={progressRef} className="w-48 md:w-64 h-[1px] bg-design-black/10 dark:bg-white/10 relative overflow-hidden">
          <div 
            ref={barRef} 
            className="absolute inset-0 bg-design-blue origin-left"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
