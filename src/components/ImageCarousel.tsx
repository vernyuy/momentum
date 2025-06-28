import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';

export interface CarouselImage {
  url: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  isEditable?: boolean;
  onEditClick?: () => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  isEditable = false,
  onEditClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (images.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-heroHighlight to-success animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-gray-200 via-white to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/80 text-center">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-lg">Conference Images</p>
            <p className="text-sm opacity-80">Loading...</p>
          </div>
        </div>
        
        {/* Edit Button for Empty State */}
        {isEditable && onEditClick && (
          <motion.button
            onClick={onEditClick}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Edit Images"
          >
            <Settings size={20} />
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
      <div className="aspect-[4/3] relative">
        {/* Edit Button */}
        {isEditable && onEditClick && (
          <motion.button
            onClick={onEditClick}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Edit Images"
          >
            <Settings size={20} />
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-heroHighlight to-success animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-gray-200 via-white to-gray-200 flex items-center justify-center">
                <div className="text-white/80 text-center">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-lg">Loading Image...</p>
                </div>
              </div>
            )}
            
            {/* Image Caption */}
            {images[currentIndex].caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6"
              >
                <p className="text-white text-sm md:text-base font-medium">
                  {images[currentIndex].caption}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={20} />
            </motion.button>

            <motion.button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </>
        )}

        {/* Slide Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;