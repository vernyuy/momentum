/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, RotateCcw, Edit, X } from 'lucide-react';
import ImageCarousel, { CarouselImage } from './ImageCarousel';
import ImageCarouselEditModal from './ImageCarouselEditModal';
import EditableCTAButton, { CTAButton } from './EditableCTAButton';
import PinModal from './PinModal';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const AboutSection: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'edit' | 'editImages' | 'cta' | 'content' | null>(null);

  // Section content state
  const initialMainHeading = 'Momentum 2025!';
  const initialSubHeading = 'The Premier Healthcare Conference Experience';
  const initialDescription = 'Join us for two transformative days in beautiful Scottsdale, Arizona. Momentum 2025! brings together industry leaders, innovative thinkers, and passionate professionals for an unforgettable learning experience. From cutting-edge medical insights to compliance best practices, our comprehensive program is designed to accelerate your professional growth and expand your network.';

  const [mainHeading, setMainHeading] = useState(initialMainHeading);
  const [subHeading, setSubHeading] = useState(initialSubHeading);
  const [description, setDescription] = useState(initialDescription);
  const [id, setId] = useState('about-section');  

    const [ctaButton, setCTAButton] = useState({
      id: 'about-cta',
      text: 'Register Now',
      url: '',
      style: 'secondary',
      size: 'large'
    });
    useEffect(() => {
      // createMomentum();
      client.models.RegisterButton.observeQuery().subscribe({
        next: (data: any) =>{ 
          console.log('Timezone data:', data.items);
          setCTAButton(data.items[0]);
      }});

      client.models.Momentum.observeQuery().subscribe({
        next: (data: any) =>{ 
          setCTAButton(data.items[1]);
          setId(data.items[0].id || 'about-section');
          setMainHeading(data.items[0].mainHeading || initialMainHeading);
          setSubHeading(data.items[0].subHeading || initialSubHeading);
          setDescription(data.items[0].description || initialDescription);
      }});

      // unsubscribe from the query when the component unmounts
      
    }, []);
  // function createMomentum(data?: any) {
  //     client.models.Momentum.create({
  //       mainHeading: initialMainHeading,
  //       subHeading: initialSubHeading,
  //       description: initialDescription
  //     });
  //   }

    function updateMomentum(data: any) {
      client.models.Momentum.update(data);
    }

    function updateButton(data: any) {
      client.models.RegisterButton.update(data);
    }
  // Edit form state
  const [contentEditForm, setContentEditForm] = useState({
    mainHeading: initialMainHeading,
    subHeading: initialSubHeading,
    description: initialDescription
  });
  console.log('contentEditForm:', contentEditForm);

  // Initial conference images
  const initialImages: CarouselImage[] = [
    {
      url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Conference attendees networking',
      caption: 'Connect with industry professionals and expand your network'
    },
    {
      url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Conference presentation',
      caption: 'Learn from expert speakers and thought leaders'
    },
    {
      url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Conference workshop session',
      caption: 'Participate in hands-on workshops and interactive sessions'
    },
    {
      url: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Scottsdale resort venue',
      caption: 'Beautiful Scottsdale venue with world-class amenities'
    },
    {
      url: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Conference dining experience',
      caption: 'Enjoy exceptional dining and social experiences'
    }
  ];

  // Local state for images
  const [localImages, setLocalImages] = useState<CarouselImage[]>(initialImages);
  useEffect(() => {
        client.models.CarouselImage.observeQuery().subscribe({
          next: (data: any) =>{ 
            console.log('carousel data:', data.items);
            setLocalImages(data.items);
        }});
      }, []);
  
  // CTA Button state
  const initialCTAButton: CTAButton = {
    id: 'about-cta',
    text: 'Register Now',
    url: '',
    style: 'primary',
    size: 'medium'
  };

  const [isCTAEditable, setIsCTAEditable] = useState(false);
  
  // Track if changes have been made
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check for changes whenever local content changes
  useEffect(() => {
    const headingChanged = mainHeading !== initialMainHeading;
    const subHeadingChanged = subHeading !== initialSubHeading;
    const descriptionChanged = description !== initialDescription;
    const imagesChanged = JSON.stringify(localImages) !== JSON.stringify(initialImages);
    const ctaChanged = JSON.stringify(ctaButton) !== JSON.stringify(initialCTAButton);
    setHasUnsavedChanges(headingChanged || subHeadingChanged || descriptionChanged || imagesChanged || ctaChanged);
  }, [mainHeading, subHeading, description, localImages, ctaButton]);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (pendingAction === 'edit') {
      setIsEditMode(true);
    } else if (pendingAction === 'editImages') {
      setShowImageEditModal(true);
    } else if (pendingAction === 'cta') {
      setIsCTAEditable(true);
    } else if (pendingAction === 'content') {
      setShowEditModal(true);
    }
    setPendingAction(null);
  };

  const handleEditClick = () => {
    setPendingAction('edit');
    setShowPinModal(true);
  };

  const handleContentEditClick = () => {
    if (isEditMode) {
      setContentEditForm({
        mainHeading,
        subHeading,
        description
      });
      setShowEditModal(true);
    } else {
      setPendingAction('content');
      setShowPinModal(true);
    }
  };

  const handleImagesEditClick = () => {
    if (isEditMode) {
      setShowImageEditModal(true);
    } else {
      setPendingAction('editImages');
      setShowPinModal(true);
    }
  };

  const handleCTAEditClick = () => {
    setPendingAction('cta');
    setIsCTAEditable(true);
  };

  const handleSaveImages = (images: CarouselImage[]) => {
    setLocalImages(images);
  };

  const handleCTASave = (newButton: any) => {
    updateButton(newButton);
    setCTAButton(newButton);
  };

  const handleContentSave = () => {
    updateMomentum({
      id: id,
      mainHeading: mainHeading,
      subHeading: subHeading,
      description: description
    });
    setShowEditModal(false);
  };

  const handleContentCancel = () => {
    setContentEditForm({
      mainHeading,
      subHeading,
      description
    });
    setShowEditModal(false);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Simulate saving to backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would save to your backend here
    console.log('Saving about section changes:', {
      mainHeading,
      subHeading,
      description,
      images: localImages,
      ctaButton
    });
    
    setIsSaving(false);
    setHasUnsavedChanges(false);
    
    // Show success feedback
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'About section saved successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleResetChanges = () => {
    setMainHeading(initialMainHeading);
    setSubHeading(initialSubHeading);
    setDescription(initialDescription);
    setLocalImages(initialImages);
    setCTAButton(initialCTAButton as any);
    setHasUnsavedChanges(false);
  };

  return (
    <>
      <section className="min-h-screen flex items-center py-20 bg-lightSection">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-6 relative group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="flex-1"
                >
                  <h2 className="text-4xl md:text-6xl font-extrabold text-textDark">
                    {mainHeading}
                  </h2>
                </motion.div>

                <motion.button
                  onClick={handleEditClick}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isEditMode 
                      ? 'bg-success text-white shadow-lg' 
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-heroHighlight'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={isEditMode ? 'Exit Edit Mode' : 'Edit Section'}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Settings size={20} />
                </motion.button>

                {/* Content Edit Button */}
                {isEditMode && (
                  <motion.button
                    onClick={handleContentEditClick}
                    className="p-2 rounded-full bg-heroHighlight text-white hover:bg-blue-700 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit content"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Edit size={16} />
                  </motion.button>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-heroHighlight mb-4">
                  {subHeading}
                </h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <EditableCTAButton
                  button={ctaButton as any}
                  onSave={handleCTASave}
                  isEditable={isCTAEditable}
                  onEditClick={handleCTAEditClick}
                />
              </motion.div>


              {/* Save/Reset Controls */}
              <AnimatePresence>
                {hasUnsavedChanges && isEditMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-orange-200"
                  >
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="w-2 h-2 bg-ctaOrange rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-gray-700">
                        You have unsaved changes
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.button
                        onClick={handleResetChanges}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RotateCcw size={16} />
                        Reset
                      </motion.button>
                      
                      <motion.button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 bg-success hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        whileHover={{ scale: isSaving ? 1 : 1.02 }}
                        whileTap={{ scale: isSaving ? 1 : 0.98 }}
                      >
                        {isSaving ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <ImageCarousel 
                images={localImages}
                autoPlay={true}
                autoPlayInterval={4000}
                isEditable={isEditMode}
                onEditClick={handleImagesEditClick}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleContentCancel}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="relative bg-gradient-to-r from-heroHighlight to-success p-6 text-white rounded-t-2xl">
                  <motion.button
                    onClick={handleContentCancel}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Edit size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Edit About Content</h2>
                      <p className="text-white/90">Update section heading and description</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="mainHeading" className="block text-sm font-medium text-gray-700 mb-2">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      id="mainHeading"
                      value={mainHeading}
                      onChange={(e) => setMainHeading(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter main heading"
                    />
                  </div>

                  <div>
                    <label htmlFor="subHeading" className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Heading
                    </label>
                    <input
                      type="text"
                      id="subHeading"
                      value={subHeading}
                      onChange={(e) => setSubHeading(e.target.value )}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter sub heading"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                      placeholder="Enter description"
                      rows={6}
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleContentCancel}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleContentSave}
                      className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={16} />
                      Save Content
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
          setPendingAction(null);
        }}
        onSuccess={handlePinSuccess}
        title="Admin Access Required"
      />

      {/* Image Edit Modal */}
      <ImageCarouselEditModal
        isOpen={showImageEditModal}
        onClose={() => setShowImageEditModal(false)}
        onSave={handleSaveImages}
        images={localImages}
        type='carousel'
      />
    </>
  );
};

export default AboutSection;