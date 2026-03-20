import React from 'react';

interface ScrollStackProps {
  children: React.ReactNode[];
}

const ScrollStack: React.FC<ScrollStackProps> = ({ children }) => {
  return (
    <div className="relative w-full">
      {React.Children.map(children, (child, index) => (
        <div 
          key={index} 
          className="sticky top-0 w-full z-[10]"
          style={{ 
            zIndex: index + 10,
            // Ensure each section has a minimum height to allow for the stacking effect
            minHeight: '100vh',
            // Stack distance 0px as requested
            marginTop: index === 0 ? 0 : '0px',
            // Ensure the background is opaque so it covers the previous section
            backgroundColor: 'inherit'
          }}
        >
          <div className="w-full h-full">
            {child}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollStack;
