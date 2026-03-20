import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Timeline from './components/Timeline';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollStack from './components/ScrollStack';
import { motion, useSpring, useMotionValue } from 'framer-motion';

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
          backgroundColor: isHovering ? 'rgba(162, 210, 255, 0.2)' : 'transparent'
        }}
        style={{ 
          x: ringX, y: ringY, width: 32, height: 32, 
          translateX: '-50%', translateY: '-50%',
        }}
      />
    </div>
  );
};

const RevealSection: React.FC<{ children: React.ReactNode; id?: string; className?: string }> = ({ children, id, className = "" }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-design-cream dark:bg-[#0a0a0a] text-design-black dark:text-white font-sans selection:bg-design-blue selection:text-design-black transition-colors duration-300 relative overflow-x-hidden">
        <div className="bg-noise pointer-events-none opacity-[0.03] dark:opacity-[0.05]"></div>
              
        <CustomCursor />
        <Navbar />
        
        <main className="relative">
          <ScrollStack>
            {/* --- Hero Section --- */}
            <Hero />
            
            {/* --- About / Services Section --- */}
            <RevealSection id="about" className="scroll-mt-20">
              <Services />
            </RevealSection>

            {/* --- Portfolio / Archive Section --- */}
            <RevealSection id="portfolio" className="scroll-mt-20">
              <Portfolio />
            </RevealSection>

            {/* --- Timeline / Chronology Section --- */}
            <RevealSection id="timeline" className="scroll-mt-20">
              <Timeline />
            </RevealSection>
          </ScrollStack>
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
