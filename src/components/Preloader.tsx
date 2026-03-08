import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const roles = [
  "Designer",
  "Illustrator",
  "Strategist",
  "Innovator",
  "Simpson",
];

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index === roles.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 900); // Slightly longer than animation duration

    return () => clearTimeout(timer);
  }, [index, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-cursor bg-design-black flex items-center justify-center cursor-none"
      exit={{
        y: "-100%",
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      <div className="relative overflow-hidden h-16 sm:h-24 md:h-32 lg:h-48 flex items-center justify-center w-full px-4">
        <AnimatePresence mode="wait">
          {index < roles.length && (
            <motion.h1
              key={roles[index]}
              initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white uppercase tracking-tighter text-center w-full left-0 right-0 px-4"
            >
              {roles[index]}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Preloader;