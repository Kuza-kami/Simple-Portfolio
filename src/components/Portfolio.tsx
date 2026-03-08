import React, { useState, useMemo, useEffect } from 'react';
import { Project } from '../types';
import { ArrowUpRight, X, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectFilter from './ProjectFilter';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { portfolioProjects } from '../data/content';
import { handleImageError, getHighResUrl } from '../utils/imageUtils';
import { moreProjects, getProjectDetails } from '../utils/projectUtils';
import { ParallaxFloat, DecryptedText } from './TextAnimations';



const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div 
      layout
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      className="break-inside-avoid mb-6 group cursor-zoom-in relative focus:outline-none"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      <div ref={ref} className="relative rounded-[2rem] overflow-hidden bg-white border border-design-black/5 group-focus:ring-2 group-focus:ring-design-green" style={{ aspectRatio: 'auto' }}>
          <motion.img 
              style={{ y, scale: 1.2 }}
              src={project.image} 
              alt={project.title} 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              loading="lazy"
              onError={handleImageError}
              referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex justify-end">
                  <span className="bg-design-green text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-all transform -translate-y-2 group-hover:translate-y-0">
                      Examine
                  </span>
              </div>
              <div className="flex justify-between items-center transform translate-y-2 group-hover:translate-y-0">
                   <div className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
                       <ArrowUpRight size={18} />
                   </div>
                   <button 
                       onClick={(e) => {
                           e.stopPropagation();
                           if (navigator.share) {
                               navigator.share({
                                   title: project.title,
                                   text: project.description,
                                   url: window.location.href
                               }).catch(console.error);
                           } else {
                               // Fallback or toast
                               console.log('Web Share API not supported');
                           }
                       }}
                       className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 hover:bg-white hover:text-black transition-colors"
                       aria-label="Share project"
                   >
                       <Share2 size={16} />
                   </button>
              </div>
          </div>
      </div>
      <div className="mt-4 px-2">
         <h3 className="text-base font-bold text-white mb-1 uppercase tracking-tight">{project.title}</h3>
         <div className="flex items-center justify-between opacity-50">
            <p className="text-[10px] font-mono uppercase tracking-widest">{project.category}</p>
            <span className="text-[10px] font-mono">{project.year}</span>
         </div>
      </div>
    </motion.div>
  );
};

const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewHighRes, setViewHighRes] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedProject) {
      setCurrentImageIndex(0);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (carouselRef.current) {
        const activeElement = carouselRef.current.children[currentImageIndex] as HTMLElement;
        if (activeElement) {
            const containerWidth = carouselRef.current.clientWidth;
            const elementOffset = activeElement.offsetLeft;
            const elementWidth = activeElement.clientWidth;
            
            carouselRef.current.scrollTo({
                left: elementOffset - (containerWidth / 2) + (elementWidth / 2),
                behavior: 'smooth'
            });
        }
    }
  }, [currentImageIndex]);

  const projectImages = useMemo(() => {
    if (!selectedProject) return [];
    if (selectedProject.process && selectedProject.process.length > 0) {
      return selectedProject.process.map(p => p.image);
    }
    return selectedProject.images && selectedProject.images.length > 0 
      ? selectedProject.images 
      : [selectedProject.image];
  }, [selectedProject]);

  const currentProcessStep = useMemo(() => {
    if (!selectedProject) return null;
    if (selectedProject.process && selectedProject.process.length > currentImageIndex) {
      return selectedProject.process[currentImageIndex];
    }
    return null;
  }, [selectedProject, currentImageIndex]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  useEffect(() => {
    document.body.style.overflow = selectedProject || viewHighRes ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject, viewHighRes]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewHighRes) setViewHighRes(null);
        else if (selectedProject) setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedProject, viewHighRes]);

  const allProjects = useMemo(() => {
    return showAll ? [...portfolioProjects, ...moreProjects] : portfolioProjects;
  }, [showAll]);

  const filteredProjects = useMemo(() => {
    return activeFilter === 'All' 
      ? allProjects 
      : allProjects.filter(p => p.category === activeFilter);
  }, [activeFilter, allProjects]);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
        setShowAll(true);
        setLoading(false);
    }, 400); 
  };

  const handleCloseArchive = () => {
    setShowAll(false);
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Website Code: Project Details Memoization ---
  const details = useMemo(() => 
    selectedProject ? getProjectDetails(selectedProject) : { measurement: '', concept: '', media: '' },
    [selectedProject]
  );

  const displaySize = currentProcessStep?.size || details.measurement || selectedProject?.size || 'Unknown';
  
  // Parse dimensions for accurate rulers
  const sizeParts = displaySize.split(/[xX]/).map(s => s.trim());
  const unitMatch = displaySize.match(/[a-zA-Z]+$/);
  const unit = unitMatch ? unitMatch[0] : '';
  const hasUnit = (str: string) => /[a-zA-Z]/.test(str);
  
  const widthDisplay = sizeParts.length > 1 
    ? (hasUnit(sizeParts[0]) ? sizeParts[0] : `${sizeParts[0]} ${unit}`)
    : displaySize;
  const heightDisplay = sizeParts.length > 1 ? sizeParts[1] : displaySize;

  const displayDate = currentProcessStep?.date || selectedProject?.year || 'Unknown';
  const displayMedium = currentProcessStep?.medium || details.media || selectedProject?.medium || selectedProject?.category || 'Unknown';
  const displayDescription = currentProcessStep?.description || (currentImageIndex === 0 ? 'First sketch' : `Process Image ${currentImageIndex + 1}`);

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-design-black relative text-white transition-colors duration-500">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 relative">
        
        {/* --- Website Code: Header Section --- */}
        <div className="flex flex-col xl:flex-row justify-between items-end mb-16 gap-8 px-2 border-b border-white/10 pb-12 sticky top-20 z-40 bg-design-black/90 backdrop-blur-sm py-4 transition-all duration-300">
            <div>
               <span className="block text-xs font-mono uppercase tracking-widest mb-4 text-design-green">
                 <DecryptedText text="The Archive" speed={30} revealDelay={200} />
               </span>
               <h2 className="text-6xl md:text-7xl lg:text-9xl font-display font-medium text-white uppercase tracking-tighter leading-[0.75]">
                  SIMPSON <br/><span className="italic font-serif font-light opacity-30">Archive</span>
               </h2>
            </div>
           <ProjectFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* --- Website Code: Project Grid --- */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6 w-full mx-auto px-2">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* --- Website Code: Load More Button --- */}
        <div className="mt-32 flex justify-center">
            <ParallaxFloat offset={-20}>
              <button 
                  onClick={showAll ? handleCloseArchive : handleLoadMore}
                  disabled={loading}
                  className="group relative px-12 py-5 bg-transparent border-2 border-white/20 overflow-hidden rounded-full transition-all hover:border-white focus:outline-none focus:ring-2 focus:ring-design-blue"
              >
                  <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-white group-hover:text-design-black transition-colors">
                      {loading ? "Warming Up..." : showAll ? "Close Complete Archive" : "Load Complete Archive"}
                  </span>
                  <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
            </ParallaxFloat>
        </div>
      </div>

      {/* --- Website Code: Project Modal --- */}
      <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-0 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => {
              setSelectedProject(null);
            }}
          />
          
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 180, mass: 0.8 }}
            className="relative bg-[#f0f0f0] w-full max-w-[1400px] h-full md:h-[90vh] shadow-2xl flex flex-col overflow-hidden rounded-[16px] text-design-black"
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-modal-close w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md text-design-black rounded-full hover:rotate-90 transition-transform duration-500 shadow-md focus:outline-none focus:ring-2 focus:ring-design-blue"
            >
              <X size={20} className="w-5 h-5" />
            </button>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
              {/* --- Website Code: Modal Left Panel (Main Image) --- */}
              <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2, duration: 0.8, ease: "circOut" }}
                 className="w-full lg:w-[45%] h-[35vh] sm:h-[45vh] md:h-[50vh] lg:h-full shrink-0 bg-[#e0e0e0] relative group flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 overflow-hidden"
              >
                  <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                            >
                                <div className="relative flex items-center justify-center w-fit h-fit max-w-[calc(100%-5rem)] max-h-[calc(100%-5rem)] md:max-w-[calc(100%-7rem)] md:max-h-[calc(100%-7rem)] min-w-0 min-h-0">
                                    <img 
                                        src={projectImages[currentImageIndex]} 
                                        alt={`${selectedProject.title} - ${selectedProject.category} project featuring ${displayDescription}`} 
                                        className="max-w-full max-h-full object-contain shadow-2xl cursor-zoom-in rounded-lg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewHighRes(getHighResUrl(projectImages[currentImageIndex]));
                                        }}
                                        onError={handleImageError}
                                        referrerPolicy="no-referrer"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    
                                    {/* --- Website Code: Dimensions Indicators --- */}
                                    <div className="absolute -right-6 md:-right-10 top-4 bottom-4 flex flex-row items-center justify-center z-20 pointer-events-none hidden sm:flex">
                                        <div className="h-full flex flex-col items-center relative w-2 md:w-3">
                                          <div className="w-full h-[1px] bg-design-black/50"></div>
                                          <div className="h-full w-[1px] bg-design-black/30"></div>
                                          <div className="w-full h-[1px] bg-design-black/50"></div>
                                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-[#e0e0e0] px-3 py-1.5 whitespace-nowrap rounded-full border border-design-black/10 shadow-sm">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-design-black/70">
                                                H: {heightDisplay}
                                            </span>
                                          </div>
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-6 md:-bottom-10 left-4 right-4 flex flex-col items-center justify-center z-20 pointer-events-none hidden sm:flex">
                                        <div className="w-full flex flex-row items-center relative h-2 md:h-3">
                                          <div className="h-full w-[1px] bg-design-black/50"></div>
                                          <div className="w-full h-[1px] bg-design-black/30"></div>
                                          <div className="h-full w-[1px] bg-design-black/50"></div>
                                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e0e0e0] px-3 py-1.5 whitespace-nowrap rounded-full border border-design-black/10 shadow-sm">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-design-black/70">
                                                W: {widthDisplay}
                                            </span>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                  </div>
              </motion.div>

              {/* --- Website Code: Modal Right Panel (Content) --- */}
              <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "circOut" }}
                  className="w-full lg:w-[55%] flex-1 lg:h-full bg-[#f4f5f6] p-5 sm:p-8 md:p-10 lg:p-16 flex flex-col overflow-y-auto"
              >
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                  >
                      <div className="mb-4 sm:mb-6">
                          <span className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#9bbbd2] text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full inline-block">
                              {selectedProject.category}
                          </span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-design-black leading-[1.1] sm:leading-[1] mb-4 sm:mb-6 uppercase tracking-tight break-words">
                          {selectedProject.title}
                      </h2>
                      
                      {/* --- Website Code: Project Description --- */}
                      <div className="mb-10">
                          <p className="text-gray-800 font-medium text-sm md:text-base leading-relaxed mb-4">
                              {selectedProject.description}
                          </p>
                          
                          {selectedProject.extendedDescription && (
                              <div className="text-gray-800 font-medium text-sm md:text-base leading-relaxed">
                                   <p>{selectedProject.extendedDescription}</p>
                              </div>
                          )}
                      </div>

                      {/* --- Website Code: Process Section --- */}
                      {selectedProject.process && selectedProject.process.length > 0 && (
                          <div className="mb-12">
                              <div className="flex items-center gap-4 mb-8">
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-design-black/50">Process</span>
                                  <div className="h-px flex-1 bg-design-black/10"></div>
                              </div>

                              <div className="relative flex items-center justify-between gap-2 md:gap-4 mb-4 w-full">
                                  <button 
                                      onClick={prevImage}
                                      className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-full border-2 border-design-black text-design-black hover:bg-design-black hover:text-white transition-all focus:outline-none"
                                      aria-label="Previous image"
                                  >
                                      <ChevronLeft size={20} />
                                  </button>

                                  <div 
                                      ref={carouselRef}
                                      className="flex-1 min-w-0 flex gap-3 md:gap-4 overflow-x-auto py-2 px-1 scroll-smooth snap-x snap-mandatory" 
                                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                  >
                                      {projectImages.map((img, idx) => (
                                          <div 
                                              key={idx}
                                              onClick={() => setCurrentImageIndex(idx)}
                                              className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 cursor-pointer transition-all duration-300 snap-center ${
                                                  idx === currentImageIndex ? 'ring-2 sm:ring-4 ring-design-black scale-100' : 'opacity-70 hover:opacity-100 scale-95'
                                              }`}
                                          >
                                              <img 
                                                  src={img} 
                                                  alt={`${selectedProject.title} process step ${idx + 1}`} 
                                                  className="w-full h-full object-cover"
                                                  onError={handleImageError}
                                                  referrerPolicy="no-referrer"
                                                  loading="lazy"
                                                  decoding="async"
                                              />
                                          </div>
                                      ))}
                                  </div>

                                  <button 
                                      onClick={nextImage}
                                      className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-full border-2 border-design-black text-design-black hover:bg-design-black hover:text-white transition-all focus:outline-none"
                                      aria-label="Next image"
                                  >
                                      <ChevronRight size={20} />
                                  </button>
                              </div>
                              
                              <div className="text-center mb-4">
                                  <span className="text-xs font-bold text-gray-600">
                                      {displayDescription}
                                  </span>
                              </div>

                              {/* --- Website Code: Carousel Dots --- */}
                              {projectImages.length > 1 && (
                                  <div className="flex justify-center gap-2">
                                      <div className="flex gap-2">
                                          {projectImages.map((_, idx) => (
                                              <button
                                                  key={idx}
                                                  onClick={() => setCurrentImageIndex(idx)}
                                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                                      idx === currentImageIndex ? 'bg-design-black w-6' : 'bg-design-black/20 w-1.5 hover:bg-design-black/40'
                                                  }`}
                                              />
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}
                  </motion.div>

                  {/* --- Website Code: Project Stats (Bottom) --- */}
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                     className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 border-t border-design-black/10 mt-auto pt-6 sm:pt-8"
                  >
                          <div className="flex flex-col items-start justify-center sm:border-r border-design-black/10 sm:pr-4">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-design-black/50 mb-1">Size</span>
                              <span className="font-bold text-sm md:text-base text-design-black">{displaySize}</span>
                          </div>
                          
                          <div className="flex flex-col items-start justify-center sm:border-r border-design-black/10 sm:px-4">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-design-black/50 mb-1">Date</span>
                              <span className="font-bold text-sm md:text-base text-design-black">{displayDate}</span>
                          </div>

                          <div className="flex flex-col items-start justify-center sm:pl-4">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-design-black/50 mb-1">Medium</span>
                              <span className="font-bold text-sm md:text-base text-design-black">{displayMedium}</span>
                          </div>
                  </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* --- Website Code: High Res Image Viewer --- */}
      <AnimatePresence>
        {viewHighRes && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-overlay bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                onClick={() => setViewHighRes(null)}
            >
                <button 
                    onClick={() => setViewHighRes(null)}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-50 focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <X size={24} />
                </button>

                <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    src={viewHighRes}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                />
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;