import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Default to light mode unless the user has explicitly set it to dark
    let isDarkMode = false;
    try {
      isDarkMode = localStorage.getItem('theme') === 'dark';
    } catch {
      // Fallback if localStorage unavailable
    }
    
    if (isDarkMode) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch {
        // Silently fail
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch {
        // Silently fail
      }
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Works', href: '#portfolio' },
    { name: 'Projects', href: '#timeline' },
    { name: 'Contacts', href: '#footer' },
  ];

  return (
    <>
      <div className="fixed top-3 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 md:px-0">
        <nav 
            className={`pointer-events-auto transition-all duration-500 ease-out border ${
                scrolled 
                ? 'w-full md:w-auto bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl border-black/20 dark:border-white/20 rounded-full px-2 py-2 shadow-lg' 
                : 'w-full bg-transparent border-transparent px-2 md:px-0 py-3 md:py-4'
            }`}
        >
          <div className="flex items-center justify-between md:justify-center md:gap-6 lg:gap-8 px-2 md:px-4">
            
            <a href="#" className={`text-lg sm:text-xl font-display font-bold tracking-tighter transition-colors uppercase ${scrolled ? 'mr-3 md:mr-4' : 'mr-auto'}`}>
               SIMPSON<span className="text-design-blue">.</span>
            </a>
            
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-[#111] rounded-full px-1 py-1 border border-gray-200 dark:border-gray-800">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-4 lg:px-5 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:text-design-blue transition-colors group overflow-hidden"
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-design-blue transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </a>
              ))}
            </div>

            <div className={`flex items-center gap-2 ${scrolled ? 'ml-2 md:ml-4' : 'ml-auto'}`}>
               <button 
                  onClick={toggleTheme}
                  className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gray-100 dark:bg-[#111] flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-design-blue transition-colors text-design-black dark:text-white"
               >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
               </button>
               
               <button 
                  onClick={() => setIsOpen(true)}
                  className="md:hidden w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-design-black dark:bg-white text-white dark:text-black flex items-center justify-center border border-transparent dark:border-white/10"
               >
                  <Menu size={18} />
               </button>
            </div>

          </div>
        </nav>
      </div>

      <div 
        className={`fixed inset-0 z-[60] bg-design-black text-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
         <div className="absolute top-6 right-6">
            <button 
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            >
                <X size={24} />
            </button>
         </div>

         <div className="h-full flex flex-col justify-center items-center gap-6">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter hover:text-design-blue transition-all duration-500 hover:italic ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${isOpen ? i * 100 + 300 : 0}ms` }}
              >
                {link.name}
              </a>
            ))}
         </div>
      </div>
    </>
  );
};

export default Navbar;