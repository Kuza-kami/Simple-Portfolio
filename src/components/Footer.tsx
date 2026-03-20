import React from 'react';
import ScrollFloat from './ScrollFloat';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-design-cream dark:bg-design-black py-24 border-t-4 border-design-blue text-center text-design-black dark:text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(var(--color-design-blue) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
      }}></div>
      <div className="relative z-10 max-w-4xl mx-auto px-6">
          <ScrollFloat
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='center bottom+=50%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.06}
              containerClassName="text-7xl font-display font-bold mb-8 tracking-tighter uppercase text-design-black dark:text-white"
          >
              Simpson
          </ScrollFloat>
          <div className="flex justify-center flex-wrap gap-8 md:gap-12 mb-16">
             <a href="mailto:kuzashikami@gmail.com" className="text-xs font-bold uppercase tracking-widest hover:text-design-blue transition-all relative group text-design-black dark:text-white">
               Email
             </a>
             <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-design-blue transition-all relative group text-design-black dark:text-white">
               Instagram
             </a>
          </div>
          <p className="text-gray-600 text-[10px] font-mono uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Simpson Studio &bull; Built with Strength and Precision
          </p>
      </div>
    </footer>
  );
};

export default Footer;
