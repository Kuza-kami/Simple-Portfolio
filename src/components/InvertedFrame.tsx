import React from 'react';
import { motion } from 'framer-motion';

interface InvertedFrameProps {
  children: React.ReactNode;
  title?: string;
  onExamine?: () => void;
  className?: string;
}

const InvertedFrame: React.FC<InvertedFrameProps> = ({ children, title, onExamine, className = "" }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* The main container with the inverted corners effect */}
      <div 
        className="relative overflow-hidden bg-[#595959] border border-[#FF2056] shadow-xl transition-all duration-500 group-hover:shadow-2xl"
        style={{
          // We'll use a mask-image to create the inverted corners
          // This is a more accurate version of the tool's output
          maskImage: `
            radial-gradient(circle at 0 0, transparent 20px, black 21px),
            radial-gradient(circle at 100% 100%, transparent 20px, black 21px)
          `,
          maskComposite: 'intersect',
          WebkitMaskImage: `
            radial-gradient(circle at 0 0, transparent 20px, black 21px),
            radial-gradient(circle at 100% 100%, transparent 20px, black 21px)
          `,
          WebkitMaskComposite: 'source-in',
        }}
      >
        {/* Content */}
        <div className="w-full h-full">
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Examine Button - Top Left */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#FF2056' }}
        whileTap={{ scale: 0.95 }}
        onClick={onExamine}
        className="absolute -top-3 -left-3 z-20 bg-[#FF2056] text-white px-5 py-2 font-bold uppercase tracking-widest text-[10px] shadow-lg transition-all duration-300 border border-[#FF2056]"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 85% 100%, 0% 100%)"
        }}
      >
        Examine
      </motion.button>

      {/* Title of Work - Bottom Right */}
      {title && (
        <div 
          className="absolute -bottom-3 -right-3 z-20 bg-[#FF2056] text-white px-5 py-2 font-bold uppercase tracking-widest text-[10px] shadow-lg border border-[#FF2056]"
          style={{
            clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 30%)"
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export default InvertedFrame;
