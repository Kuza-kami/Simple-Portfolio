import React, { useEffect, useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Timeline from './components/Timeline';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import ErrorBoundary from './components/ErrorBoundary';
import ClickSpark from './components/ClickSpark';
import Loader from './components/Loader';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const mouseX = useSpring(cursorX, { stiffness: 1000, damping: 50 });
  const mouseY = useSpring(cursorY, { stiffness: 1000, damping: 50 });
  const ringX = useSpring(cursorX, { stiffness: 400, damping: 40 });
  const ringY = useSpring(cursorY, { stiffness: 400, damping: 40 });
  
  const [isHovering, setIsHovering] = React.useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      const isClickable = !!(target?.closest && target.closest('a, button, input, textarea, .cursor-pointer'));
      
      setIsHovering(prev => {
        if (prev !== isClickable) return isClickable;
        return prev;
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [cursorX, cursorY]);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-cursor">
      <motion.div 
        className="fixed top-0 left-0 w-2 h-2 bg-design-blue rounded-full mix-blend-difference"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div 
        className="fixed top-0 left-0 rounded-full border border-design-black dark:border-white opacity-40"
        animate={{ 
          scale: isHovering ? 2 : 1,
          borderWidth: isHovering ? 1 : 2,
          backgroundColor: isHovering ? 'rgba(52, 78, 65, 0.2)' : 'transparent'
        }}
        style={{ 
          x: ringX, y: ringY, width: 32, height: 32, 
          translateX: '-50%', translateY: '-50%',
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [loaderDone, setLoaderDone] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaderDone && contentRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(contentRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      });
      return () => ctx.revert();
    }
  }, [loaderDone]);

  return (
    <ErrorBoundary>
      {!loaderDone && <Loader onComplete={() => setLoaderDone(true)} />}
      
      <ClickSpark
        sparkColor='#89a178'
        sparkSize={60}
        sparkRadius={15}
        sparkCount={12}
        duration={600}
      >
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <CustomCursor />
        </div>
        
        <div 
          ref={contentRef} 
          style={{ opacity: loaderDone ? 1 : 0 }}
        >
          <Navbar />
          
          <SmoothScroll>
            <div className="min-h-screen bg-design-cream text-design-black dark:text-white font-sans selection:bg-design-blue selection:text-design-black transition-colors duration-300 relative">
              <div className="grain-overlay"></div>
              <div className="vignette"></div>
                    
              <main className="relative">
                {/* --- Hero Section --- */}
                <Hero />
                
                {/* --- About / Services Section --- */}
                <div id="about" className="scroll-mt-20">
                  <Services />
                </div>
    
                {/* --- Portfolio / Archive Section --- */}
                <div id="portfolio" className="scroll-mt-20">
                  <Portfolio />
                </div>
    
                {/* --- Timeline / Chronology Section --- */}
                <div id="timeline" className="scroll-mt-20">
                  <Timeline />
                </div>
              </main>
              
              <Footer />
            </div>
          </SmoothScroll>
        </div>
      </ClickSpark>
    </ErrorBoundary>
  );
};

export default App;
