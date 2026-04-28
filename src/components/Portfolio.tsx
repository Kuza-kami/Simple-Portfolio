import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '../types';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Search, ImageOff, Trash2, Edit2, Plus } from 'lucide-react';
import ProjectFilter from './ProjectFilter';
import ProjectUploadModal from './ProjectUploadModal';
import ProjectEditModal from './ProjectEditModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import AdminGuide from './AdminGuide';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioProjects } from '../data/content';
import { getHighResUrl } from '../utils/imageUtils';
import { moreProjects, getProjectDetails } from '../utils/projectUtils';
import { ParallaxFloat, DecryptedText, ThreeDTextReveal, SplitText } from './TextAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';

gsap.registerPlugin(ScrollTrigger);




const LazyImage: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string; 
  onClick?: (e: React.MouseEvent) => void;
  priority?: boolean;
  objectFit?: "cover" | "contain";
}> = ({ src, alt, className = "", onClick, priority = false, objectFit = "cover" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  
  // Parse aspect ratio from picsum URL if possible to prevent layout shift
  const aspectRatio = useMemo(() => {
    if (src.includes('picsum.photos')) {
      const parts = src.split('/');
      const last = parts[parts.length - 1];
      const secondLast = parts[parts.length - 2];
      
      // Handle cases where there might be query params
      const cleanLast = last.split('?')[0];
      const cleanSecondLast = secondLast.split('?')[0];
      
      if (!isNaN(Number(cleanLast)) && !isNaN(Number(cleanSecondLast))) {
          return `${cleanSecondLast} / ${cleanLast}`;
      }
    }
    return "auto";
  }, [src]);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setIsRemoved(true), 500); // match duration-500
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (hasError) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 ${className}`}>
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-mono uppercase tracking-wider">Image Unavailable</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Pulse Skeleton - Pinterest style */}
      {!isRemoved && (
        <div 
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse transition-opacity duration-500 z-10 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      
      {/* Real Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onClick={onClick}
        className={`w-full h-full object-${objectFit} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={priority ? "eager" : "lazy"}
        onError={() => setHasError(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const ProjectCard: React.FC<{ 
  project: Project; 
  onClick: () => void;
  editMode?: boolean;
  onEdit?: (e: React.MouseEvent, project: Project) => void;
  onRemove?: (e: React.MouseEvent, id: number | string) => void;
}> = ({ project, onClick, editMode, onEdit, onRemove }) => {

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
      className="break-inside-avoid block w-full mb-3 group cursor-default relative focus:outline-none transition-all duration-300"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      transition={{ 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <div className="relative rounded-[2rem] overflow-hidden bg-white border border-design-black/5 group-focus:ring-2 group-focus:ring-design-green transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(137,161,120,0.4)]">
          <div className="w-full overflow-hidden">
            <LazyImage 
                src={project.image} 
                alt={project.title} 
                className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.1] will-change-transform"
            />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex justify-end">
                  <span className="bg-design-green text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-all transform -translate-y-2 group-hover:translate-y-0">
                      Examine
                  </span>
              </div>
              <div className="flex justify-between items-center transform translate-y-2 group-hover:translate-y-0 relative z-10">
                   <div className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
                       <ArrowUpRight size={18} />
                   </div>
                   <div className="flex items-center gap-2">
                       {editMode && onEdit && onRemove && (
                         <>
                           <button 
                               onClick={(e) => onEdit(e, project)}
                               className="w-10 h-10 flex items-center justify-center bg-blue-500/80 backdrop-blur-md rounded-full text-white hover:bg-blue-600 transition-colors pointer-events-auto"
                               aria-label="Edit project"
                           >
                               <Edit2 size={16} />
                           </button>
                           <button 
                               onClick={(e) => onRemove(e, project.id)}
                               className="w-10 h-10 flex items-center justify-center bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-colors pointer-events-auto"
                               aria-label="Remove project"
                           >
                               <Trash2 size={16} />
                           </button>
                         </>
                       )}
                   </div>
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
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio_activeFilter') || 'All';
    }
    return 'All';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio_searchQuery') || '';
    }
    return '';
  });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewHighRes, setViewHighRes] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const highResModalRef = React.useRef<HTMLDivElement>(null);
  const lastFocusedElementRef = React.useRef<HTMLElement | null>(null);

  const [customProjects, setCustomProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_customProjects');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return []; }
      }
    }
    return [];
  });
  
  const [removedProjects, setRemovedProjects] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_removedProjects');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return []; }
      }
    }
    return [];
  });

  const [editedCustomProjects, setEditedCustomProjects] = useState<Record<number, Project>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_editedCustomProjects');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return {}; }
      }
    }
    return {};
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdminGuide, setShowAdminGuide] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | string | null>(null);
  
  const { user, isAdmin, signIn, logOut } = useAuth();
  const [firebaseProjects, setFirebaseProjects] = useState<Project[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projects: Project[] = [];
      snapshot.forEach(d => {
        projects.push({ id: d.id, ...d.data() } as Project);
      });
      setFirebaseProjects(projects);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_customProjects', JSON.stringify(customProjects));
    } catch (e) { console.warn('localStorage quota exceeded', e); }
  }, [customProjects]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_removedProjects', JSON.stringify(removedProjects));
    } catch (e) { console.warn('localStorage quota exceeded', e); }
  }, [removedProjects]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_editedCustomProjects', JSON.stringify(editedCustomProjects));
    } catch (e) { console.warn('localStorage quota exceeded', e); }
  }, [editedCustomProjects]);

  useEffect(() => {
    const handleEditOn = () => setEditMode(true);
    const handleEditOff = () => setEditMode(false);
    window.addEventListener('secret_edit_mode_on', handleEditOn);
    window.addEventListener('secret_edit_mode_off', handleEditOff);
    return () => {
      window.removeEventListener('secret_edit_mode_on', handleEditOn);
      window.removeEventListener('secret_edit_mode_off', handleEditOff);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.toUpperCase() === 'IWANTTOADDPROJECT') {
      setShowUploadModal(true);
      setSearchQuery('');
    } else if (value.toUpperCase() === 'IWANTTOREMOVEPROJECT' || value.toUpperCase() === 'IWANTTOREMOVETIMELINE') {
      window.dispatchEvent(new CustomEvent('secret_edit_mode_on'));
      setSearchQuery('');
    } else if (value.toUpperCase() === 'IWANTTOBEADMIN') {
      if (!user) signIn();
      setSearchQuery('');
    } else if (value.toUpperCase() === 'IWANTTOLEAVEADMIN') {
      if (user) logOut();
      setSearchQuery('');
    } else if (value.toUpperCase() === 'IWANTTOSEEGUIDE') {
      setShowAdminGuide(true);
      setSearchQuery('');
    } else if (value.toUpperCase() === 'IWANTTOADDTIMELINE') {
      window.dispatchEvent(new CustomEvent('secret_add_timeline'));
      setSearchQuery('');
    } else {
      setSearchQuery(value);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_activeFilter', activeFilter);
    } catch (e) { console.warn('localStorage quota exceeded', e); }
  }, [activeFilter]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_searchQuery', searchQuery);
    } catch (e) { console.warn('localStorage quota exceeded', e); }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !selectedProject && !viewHighRes) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, viewHighRes]);

  useEffect(() => {
    if (selectedProject) {
      setCurrentImageIndex(0);
      window.history.replaceState(null, '', `#project-${selectedProject.id}`);
    } else if (!viewHighRes) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [selectedProject, viewHighRes]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#project-')) {
      const projectId = parseInt(hash.replace('#project-', ''), 10);
      const project = portfolioProjects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setCurrentImageIndex(0);
      }
    }
  }, []);

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
    
    const images: string[] = [selectedProject.image];
    
    if (selectedProject.process && selectedProject.process.length > 0) {
      images.push(...selectedProject.process.map(p => p.image));
    } else if (selectedProject.images && selectedProject.images.length > 0) {
      images.push(...selectedProject.images);
    }
    
    // Remove duplicates if the main image is also in process/images
    return Array.from(new Set(images));
  }, [selectedProject]);

  const currentProcessStep = useMemo(() => {
    if (!selectedProject) return null;
    
    // Index 0 is the main image (usually doesn't have a specific process step desc unless handled)
    if (currentImageIndex === 0) return null;
    
    const processIndex = currentImageIndex - 1;
    if (selectedProject.process && selectedProject.process.length > processIndex) {
      return selectedProject.process[processIndex];
    }
    return null;
  }, [selectedProject, currentImageIndex]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd || projectImages.length <= 1) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
    }
    if (isRightSwipe) {
      setDirection(-1);
      setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
    }
  };

  useEffect(() => {
    if (selectedProject || viewHighRes) {
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

  // Focus management for Project Details Modal
  useEffect(() => {
    if (selectedProject && !viewHighRes) {
      lastFocusedElementRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }, 100);
      return () => {
        clearTimeout(timer);
        if (!viewHighRes && lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus();
        }
      };
    }
  }, [selectedProject, viewHighRes]);

  // Focus management for High Res Modal
  useEffect(() => {
    if (viewHighRes) {
      const prevFocus = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        const focusableElements = highResModalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }, 100);
      return () => {
        clearTimeout(timer);
        if (prevFocus) prevFocus.focus();
      };
    }
  }, [viewHighRes]);

  // Focus trap logic
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const activeModalRef = viewHighRes ? highResModalRef : (selectedProject ? modalRef : null);
      if (!activeModalRef?.current) return;

      const focusableElements = activeModalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [selectedProject, viewHighRes]);

  const allProjects = useMemo(() => {
    const baseProjects = showAll ? [...firebaseProjects, ...customProjects, ...portfolioProjects, ...moreProjects] : [...firebaseProjects, ...customProjects, ...portfolioProjects];
    return baseProjects
      .filter(p => !removedProjects.includes(typeof p.id === 'string' ? -1 : p.id))
      .map(p => typeof p.id === 'number' && editedCustomProjects[p.id] ? { ...p, ...editedCustomProjects[p.id] } : p);
  }, [showAll, firebaseProjects, customProjects, removedProjects, editedCustomProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = activeFilter === 'All' 
      ? allProjects 
      : allProjects.filter(p => p.category === activeFilter);
    
    if (debouncedSearchQuery) {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        (p.technologies && p.technologies.some(tech => tech.toLowerCase().includes(lowerQuery)))
      );
    }
    return filtered;
  }, [activeFilter, allProjects, debouncedSearchQuery]);

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

  const headerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1
          }
        });
      }
    }, headerRef);
    return () => ctx.revert();
  }, []);

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
  const displayDescription = currentProcessStep?.description || (currentImageIndex === 0 ? 'Main Artwork' : `Process Image ${currentImageIndex}`);

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-design-black relative text-white transition-colors duration-500 rounded-2xl border border-white/10">
      <div className="max-w-[1920px] 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 relative">
        
        {/* --- Website Code: Header Section --- */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-2 border-b border-white/10 pb-12 sticky top-20 z-40 bg-design-black/90 backdrop-blur-sm py-4 transition-all duration-300 will-change-transform">
            <div>
                 <span className="block text-xs font-mono uppercase tracking-widest mb-4 text-design-green">
                   <DecryptedText text="The Archive" speed={30} revealDelay={200} />
                 </span>
               <h2 className="text-[clamp(4rem,_10vw,_12rem)] font-display font-medium text-white uppercase tracking-tighter leading-[0.75] flex flex-col items-start">
                  <ThreeDTextReveal text="SIMPSON" className="block" />
                  <span className="italic font-serif font-light opacity-30 mt-2">
                    <SplitText text="Archive" delay={0.4} />
                  </span>
               </h2>
            </div>
            <div className="flex flex-col gap-4 items-end w-full md:w-auto">
                {isAdmin && (
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 bg-design-green text-design-black px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-design-black transition-colors shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                  >
                    <Plus size={14} /> Add Project
                  </button>
                )}
                <div className="relative w-full md:w-96 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <Search className="w-4 h-4 text-white/30 group-focus-within:text-design-green transition-colors" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/20 group-focus-within:hidden">Search</span>
                  </div>
                  <input 
                    ref={searchInputRef}
                    type="text"
                    placeholder="Title, description, or tech..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-white/5 border border-white/10 rounded-full pl-24 pr-12 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-design-green focus:bg-white/10 transition-all w-full"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {searchQuery ? (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-3 h-3 text-white/50" />
                      </button>
                    ) : (
                      <span className="hidden md:block px-1.5 py-0.5 rounded border border-white/10 text-[10px] font-mono text-white/20">/</span>
                    )}
                  </div>
                </div>
              <ProjectFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>
        </div>

        {/* --- Website Code: Project Grid --- */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 px-3 [column-fill:_balance] min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => {
                    setSelectedProject(project);
                    setCurrentImageIndex(0);
                  }} 
                  editMode={editMode || isAdmin}
                  onEdit={(e, p) => {
                    e.stopPropagation();
                    setProjectToEdit(p);
                  }}
                  onRemove={(e, id) => {
                    e.stopPropagation();
                    setProjectToDelete(id);
                  }}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-2xl font-display font-medium mb-2">No projects found</h3>
                <p className="text-white/50 max-w-md">
                  We couldn't find any projects matching "{debouncedSearchQuery}". 
                  Try adjusting your search or filter.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                  className="mt-8 text-design-green hover:underline font-mono text-sm uppercase tracking-widest"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* --- Website Code: Load More Button --- */}
        <div className="mt-12 flex justify-center">
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
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center px-4 p-0 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md" 
                onClick={() => {
                  setSelectedProject(null);
                }}
              />
              
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ 
                  scale: 0.95, 
                  opacity: 0,
                  transition: { duration: 0.35, ease: [0.77, 0, 0.175, 1] }
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                ref={modalRef}
                className="relative bg-[#f0f0f0] w-full max-w-[1400px] h-auto max-h-[90vh] max-h-[90dvh] overflow-y-auto shadow-2xl flex flex-col rounded-[22px] text-design-black z-[1010] my-0 md:my-8"
              >
                <button 
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close project details"
                  className="absolute top-4 right-4 md:top-6 md:right-6 z-[1020] w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md text-design-black rounded-full hover:rotate-90 transition-transform duration-500 shadow-md focus:outline-none focus:ring-2 focus:ring-design-blue"
                >
                  <X size={20} className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                  {/* --- Website Code: Modal Left Panel (Main Image) --- */}
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.1, duration: 0.4, ease: "circOut" }}
                     className="w-full md:w-[45%] h-auto min-h-[40vh] md:h-full shrink-0 bg-[#e0e0e0] relative group flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16"
                  >
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        custom={direction}
                                        variants={{
                                          enter: (direction: number) => ({
                                            x: direction > 0 ? 100 : -100,
                                            opacity: 0,
                                            scale: 0.95
                                          }),
                                          center: {
                                            zIndex: 1,
                                            x: 0,
                                            opacity: 1,
                                            scale: 1
                                          },
                                          exit: (direction: number) => ({
                                            zIndex: 0,
                                            x: direction < 0 ? 100 : -100,
                                            opacity: 0,
                                            scale: 0.95
                                          })
                                        }}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                          x: { type: "spring", stiffness: 300, damping: 30 },
                                          opacity: { duration: 0.2 }
                                        }}
                                        className="relative w-full h-full flex items-center justify-center"
                                    >
                                        <div 
                                            className="relative flex items-center justify-center w-fit h-fit max-w-full max-h-full min-w-0 min-h-0 group/image"
                                            onTouchStart={onTouchStart}
                                            onTouchMove={onTouchMove}
                                            onTouchEnd={onTouchEndHandler}
                                        >
                                            <LazyImage 
                                                src={projectImages[currentImageIndex]} 
                                                alt={`${selectedProject.title} - ${selectedProject.category} project featuring ${displayDescription}`} 
                                                className="w-full h-auto shadow-2xl cursor-default rounded-lg"
                                                objectFit="contain"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setViewHighRes(getHighResUrl(projectImages[currentImageIndex]));
                                                }}
                                                priority={true}
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

                                {/* --- Website Code: Main Image Navigation Arrows --- */}
                                {projectImages.length > 1 && (
                                  <>
                                    <button 
                                      onClick={prevImage}
                                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-design-black border border-white/30 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-30 focus:outline-none shadow-lg"
                                      aria-label="Previous image"
                                    >
                                      <ChevronLeft size={24} />
                                    </button>
                                    <button 
                                      onClick={nextImage}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-design-black border border-white/30 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-30 focus:outline-none shadow-lg"
                                      aria-label="Next image"
                                    >
                                      <ChevronRight size={24} />
                                    </button>
                                  </>
                                )}

                                {/* --- Website Code: Main Image Carousel Dots --- */}
                                {projectImages.length > 1 && (
                                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
                                    {projectImages.map((_, idx) => (
                                      <button
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDirection(idx > currentImageIndex ? 1 : -1);
                                          setCurrentImageIndex(idx);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                          idx === currentImageIndex ? 'bg-design-green w-6' : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                        aria-label={`Go to image ${idx + 1}`}
                                      />
                                    ))}
                                  </div>
                                )}
                      </div>
                  </motion.div>

                  {/* --- Website Code: Modal Right Panel (Content) --- */}
                  <motion.div 
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.4, ease: "circOut" }}
                      className="w-full md:w-[55%] flex-1 md:h-full bg-[#f4f5f6] p-5 sm:p-8 md:p-10 lg:p-16 flex flex-col md:overflow-y-auto"
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

                          <div className="flex justify-between items-start mb-4 sm:mb-6">
                              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-design-black leading-[1.1] sm:leading-[1] uppercase tracking-tight break-words flex-1">
                                  {selectedProject.title}
                              </h2>
                          </div>
                          
                          {/* --- Website Code: Project Description --- */}
                          <div className="mb-10">
                              <p className="text-gray-800 font-medium text-sm md:text-base leading-relaxed mb-4">
                                  {selectedProject.description}
                              </p>
                              
                              {selectedProject.extendedDescription && (
                                  <div className="text-gray-800 font-medium text-sm md:text-base leading-relaxed mb-6">
                                       <p>{selectedProject.extendedDescription}</p>
                                  </div>
                              )}

                              {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {selectedProject.technologies.map((tech, idx) => (
                                    <span 
                                      key={idx} 
                                      className="px-3 py-1 bg-design-black/5 text-design-black/60 text-[10px] font-mono uppercase tracking-wider rounded-md border border-design-black/5"
                                    >
                                      {tech}
                                    </span>
                                  ))}
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
                                                  <LazyImage 
                                                      src={img} 
                                                      alt={`${selectedProject.title} process step ${idx + 1}`} 
                                                      className="w-full h-full"
                                                  />
                                                  {idx === currentImageIndex && (
                                                    <div className="absolute inset-0 bg-design-green/10 border border-design-green/30 pointer-events-none" />
                                                  )}
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
        </AnimatePresence>,
        document.body
      )}

      {/* --- Website Code: High Res Image Viewer --- */}
      {createPortal(
        <AnimatePresence>
          {viewHighRes && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  ref={highResModalRef}
                  className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-default"
                  onClick={() => setViewHighRes(null)}
              >
                  <div className="absolute top-6 right-6 flex items-center gap-4 z-[2010]">
                    <button 
                        onClick={() => setViewHighRes(null)}
                        aria-label="Close high resolution image"
                        className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <X size={24} />
                    </button>
                  </div>

                  <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ 
                        scale: 0.9, 
                        opacity: 0,
                        transition: { duration: 0.35, ease: [0.77, 0, 0.175, 1] }
                      }}
                      className="max-w-full max-h-full"
                      onClick={(e) => e.stopPropagation()} 
                  >
                      <LazyImage 
                          src={viewHighRes} 
                          alt="High Resolution View" 
                          className="w-full h-auto object-cover shadow-2xl rounded-[22px]"
                          priority={true}
                      />
                  </motion.div>
              </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Secret Project Upload Modal */}
      <ProjectUploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={async (newProjects) => {
          if (user) {
            try {
              for (const p of newProjects) {
                const docRef = doc(collection(db, 'projects'));
                await setDoc(docRef, { ...p, userId: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
              }
            } catch (e) {
              handleFirestoreError(e, OperationType.CREATE, 'projects');
            }
          } else {
            console.warn("User not logged in, uploading locally.");
            setCustomProjects(prev => [
              ...newProjects.map((p, idx) => ({ ...p, id: Date.now() + idx })),
              ...prev
            ]);
          }
        }}
      />
      <ProjectEditModal
        isOpen={!!projectToEdit}
        onClose={() => setProjectToEdit(null)}
        project={projectToEdit}
        onSubmit={async (updatedProject) => {
          if (user && firebaseProjects.some(p => p.id === updatedProject.id)) {
            try {
              const docRef = doc(db, 'projects', String(updatedProject.id));
              await updateDoc(docRef, { ...updatedProject, updatedAt: serverTimestamp() });
            } catch (e) {
              handleFirestoreError(e, OperationType.UPDATE, `projects/${updatedProject.id}`);
            }
          } else {
            console.warn("Updating local static project or unauthenticated");
            setEditedCustomProjects(prev => ({
              ...prev,
              [updatedProject.id as number]: updatedProject
            }));
          }
        }}
      />
      <DeleteConfirmModal
        isOpen={projectToDelete !== null}
        onClose={() => setProjectToDelete(null)}
        onConfirm={async () => {
          if (projectToDelete !== null) {
            if (user && typeof projectToDelete === 'string') {
              try {
                await deleteDoc(doc(db, 'projects', projectToDelete));
              } catch (e) {
                handleFirestoreError(e, OperationType.DELETE, `projects/${projectToDelete}`);
              }
            } else {
              setRemovedProjects(prev => [...prev, projectToDelete as number]);
            }
          }
        }}
      />
      <AdminGuide 
        isOpen={showAdminGuide}
        onClose={() => setShowAdminGuide(false)}
      />
    </section>
  );
};

export default Portfolio;