import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const scrollContainer = scrollRef.current;
    const content = contentRef.current;
    if (!scrollContainer || !content) return;

    // Set up the height of the body to match the content
    const setHeight = () => {
      document.body.style.height = `${content.getBoundingClientRect().height}px`;
    };

    // Update on resize
    window.addEventListener('resize', setHeight);
    
    // Initial height set
    // Use a small timeout to ensure all components are rendered
    const timer = setTimeout(setHeight, 100);

    // Smooth scroll logic
    const ctx = gsap.context(() => {
      let currentY = 0;
      let targetY = 0;
      const ease = 0.085; // Inertia factor (lower = smoother/slower)

      const update = () => {
        targetY = window.scrollY;
        currentY += (targetY - currentY) * ease;
        
        // Apply the transform
        if (Math.abs(targetY - currentY) > 0.01) {
          gsap.set(content, { y: -currentY });
        } else {
          gsap.set(content, { y: -targetY });
          currentY = targetY;
        }
        
        requestAnimationFrame(update);
      };

      update();

      // Tell ScrollTrigger to use this custom scroll behavior
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (arguments.length) {
            currentY = value!;
            window.scrollTo(0, value!);
          }
          return window.scrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
          };
        },
        pinType: "transform"
      });

      ScrollTrigger.addEventListener("refresh", setHeight);
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      window.removeEventListener('resize', setHeight);
      document.body.style.height = "";
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      ref={scrollRef} 
      className="smooth-scroll-wrapper fixed top-0 left-0 w-full h-full overflow-hidden"
    >
      <div ref={contentRef} className="smooth-scroll-content will-change-transform">
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;
