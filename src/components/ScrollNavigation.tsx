import React from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  sections: string[];
  activeSection: number;
  onSectionClick: (index: number) => void;
}

const ScrollNavigation: React.FC<NavigationProps> = ({
  sections,
  activeSection,
  onSectionClick,
}) => {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:fixed md:right-8 md:top-1/2 md:-translate-y-1/2 md:z-50 md:flex md:flex-col md:gap-4">
        {sections.map((section, index) => (
          <div key={section} className="relative group">
            <motion.button
              onClick={() => onSectionClick(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? 'bg-gradient-to-r from-success to-heroHighlight scale-125'
                  : 'bg-gray-300 hover:bg-heroHighlight hover:scale-110'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Tooltip - Shows on hover */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-2 bg-textDark text-white text-sm rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 shadow-lg">
              {section}
              {/* Arrow pointing to dot */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-textDark border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
        <div className="flex gap-3">
          {sections.map((section, index) => (
            <div key={index} className="relative group">
              <motion.button
                onClick={() => onSectionClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSection === index
                    ? 'bg-gradient-to-r from-success to-heroHighlight scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileTap={{ scale: 0.8 }}
              />
              
              {/* Mobile tooltip - appears above the dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-textDark text-white text-xs rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-lg">
                {section}
                {/* Arrow pointing down to dot */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-t-[4px] border-t-textDark border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScrollNavigation;