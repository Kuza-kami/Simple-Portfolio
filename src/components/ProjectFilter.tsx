import React from 'react';
import { motion } from 'framer-motion';

interface ProjectFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ activeFilter, onFilterChange }) => {
  const categories = ['All', 'Digital Art', 'Textile', 'Sketches', 'Design'];

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {categories.map((category) => {
        const isActive = activeFilter === category;
        return (
          <motion.button
            key={category}
            onClick={() => onFilterChange(category)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            animate={{ scale: isActive ? 1.1 : 1, opacity: isActive ? 1 : 0.7 }}
            className={`relative px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-design-blue ${
              isActive
                ? 'text-black border-transparent font-extrabold'
                : 'bg-transparent text-white border-white/20 hover:border-white/40 hover:bg-white/5 hover:opacity-100'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-design-green rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ProjectFilter;