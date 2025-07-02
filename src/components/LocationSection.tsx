/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, AlertTriangle, Settings, Save, RotateCcw, Edit, X } from 'lucide-react';
import EditableCTAButton, { CTAButton } from './EditableCTAButton';
import ImageCarousel, { CarouselImage } from './ImageCarousel';
import ImageCarouselEditModal from './ImageCarouselEditModal';
import PinModal from './PinModal';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

interface HotelInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
}

const LocationSection: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [showHotelEditModal, setShowHotelEditModal] = useState(false);
  const [showNoticeEditModal, setShowNoticeEditModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'edit' | 'cta1' | 'cta2' | 'images' | 'hotel' | 'notice' | null>(null);

  // Section heading state
  const initialHeading = 'Conference Location';
  const [sectionHeading, setSectionHeading] = useState(initialHeading);

  // Hotel information state
  const initialHotelInfo: HotelInfo = {
    id: '1',
    name: 'The Westin Kierland Resort & Spa',
    address: '6902 E Greenway Pkwy\nScottsdale, AZ 85254',
    phone: '(480) 991-4000'
  };
  const initialCTAButton1: CTAButton = {
    id: 'location-cta-1',
    text: 'Westin Resort Registration',
    url: '',
    style: 'primary',
    size: 'medium'
  };

  const initialCTAButton2: CTAButton = {
    id: 'location-cta-2',
    text: 'Additional Hotel Choices',
    url: '',
    style: 'outline',
    size: 'medium'
  };
  const initialNoticeText = 'Hotel room block closes on August 19, 2025. Reserve your room early to secure conference rates!';
  const [noticeText, setNoticeText] = useState(initialNoticeText);
  const [noticeId, setNoticeId] = useState('');
  const [noticeEditForm, setNoticeEditForm] = useState(initialNoticeText);
  const [hotelInfo, setHotelInfo] = useState(initialHotelInfo);
  const [hotelEditForm, setHotelEditForm] = useState(initialHotelInfo);
  const [ctaButton1, setCTAButton1] = useState(initialCTAButton1);
  const [ctaButton2, setCTAButton2] = useState(initialCTAButton2);
  useEffect(() => {
    client.models.RegisterButton.observeQuery().subscribe({
      next: (data: any) => {
        setCTAButton1(data.items[2]);
        setCTAButton2(data.items[3]);
      }
    });
    client.models.Hotel.observeQuery().subscribe({
      next: (data: any) => {
        setHotelInfo(data.items[0]);
      }
    });
    client.models.Notice.observeQuery().subscribe({
      next: (data: any) => {
        setNoticeText(data.items[0].content);
        setNoticeId(data.items[0].id);
      }
    });
  }, [hotelInfo]);

  function updateHotel(data: any) {
    client.models.Hotel.update(data);
  }
  function updateNotice(data: any) {
    client.models.Notice.update(data);
  }

  function updateButton(data: any) {
    client.models.RegisterButton.update(data);
  }

  const initialResortImages: CarouselImage[] = [
    {
      url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Westin Kierland Resort exterior',
      caption: 'Beautiful resort exterior with desert landscape'
    },
    {
      url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Resort pool area',
      caption: 'Relaxing pool area with mountain views'
    },
    {
      url: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Golf course',
      caption: 'Championship golf course on-site'
    },
    {
      url: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Spa facilities',
      caption: 'Full-service spa and wellness center'
    }
  ];
  const [resortImages, setResortImages] = useState(initialResortImages);

  useEffect(() => {
    client.models.ResortImages.observeQuery().subscribe({
      next: (data: any) => {
        setResortImages(data.items);
      }
    });
  }, [hotelInfo]);

  const [isCTA1Editable, setIsCTA1Editable] = useState(false);
  const [isCTA2Editable, setIsCTA2Editable] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const headingChanged = sectionHeading !== initialHeading;
    const hotelChanged = JSON.stringify(hotelInfo) !== JSON.stringify(initialHotelInfo);
    const noticeChanged = noticeText !== initialNoticeText;
    const imagesChanged = JSON.stringify(resortImages) !== JSON.stringify(initialResortImages);
    const cta1Changed = JSON.stringify(ctaButton1) !== JSON.stringify(initialCTAButton1);
    const cta2Changed = JSON.stringify(ctaButton2) !== JSON.stringify(initialCTAButton2);

    setHasUnsavedChanges(headingChanged || hotelChanged || noticeChanged || imagesChanged || cta1Changed || cta2Changed);
  }, [sectionHeading, hotelInfo, noticeText, resortImages, ctaButton1, ctaButton2]);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (pendingAction === 'edit') {
      setIsEditMode(true);
    } else if (pendingAction === 'cta1') {
      setIsCTA1Editable(true);
    } else if (pendingAction === 'cta2') {
      setIsCTA2Editable(true);
    } else if (pendingAction === 'images') {
      setShowImageEditModal(true);
    } else if (pendingAction === 'hotel') {
      setShowHotelEditModal(true);
    } else if (pendingAction === 'notice') {
      setShowNoticeEditModal(true);
    }
    setPendingAction(null);
  };

  const handleEditClick = () => {
    setPendingAction('edit');
    setShowPinModal(true);
  };

  const handleCTA1EditClick = () => {
    setPendingAction('cta1');
    setIsCTA1Editable(true);
  };

  const handleCTA2EditClick = () => {
    setPendingAction('cta2');
    setIsCTA2Editable(true);
  };

  const handleImagesEditClick = () => {
    if (isEditMode) {
      setShowImageEditModal(true);
    } else {
      setPendingAction('images');
      setShowPinModal(true);
    }
  };

  const handleHotelEditClick = () => {
    if (isEditMode) {
      setHotelEditForm(hotelInfo);
      setShowHotelEditModal(true);
    } else {
      setPendingAction('hotel');
      setShowPinModal(true);
    }
  };

  const handleNoticeEditClick = () => {
    if (isEditMode) {
      setNoticeEditForm(noticeText);
      setShowNoticeEditModal(true);
    } else {
      setPendingAction('notice');
      setShowPinModal(true);
    }
  };

  const handleCTA1Save = (newButton: CTAButton) => {
    updateButton(newButton);
    setCTAButton1(newButton);
  };

  const handleCTA2Save = (newButton: CTAButton) => {
    updateButton(newButton);
    setCTAButton2(newButton);
  };

  const handleImagesSave = (images: CarouselImage[]) => {
    setResortImages(images);
  };

  const handleHotelSave = () => {
    updateHotel(hotelEditForm);
    setHotelInfo(hotelEditForm);
    setShowHotelEditModal(false);
  };

  const handleNoticeSave = () => {
    updateNotice({ id: noticeId, content: noticeEditForm });
    setNoticeText(noticeEditForm);
    setShowNoticeEditModal(false);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasUnsavedChanges(false);

    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Location section saved successfully!';
    document.body.appendChild(successMessage);

    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleResetChanges = () => {
    setSectionHeading(initialHeading);
    setHotelInfo(initialHotelInfo);
    setNoticeText(initialNoticeText);
    setResortImages(initialResortImages);
    setCTAButton1(initialCTAButton1);
    setCTAButton2(initialCTAButton2);
    setHasUnsavedChanges(false);
  };

  return (
    <>
      <section className="min-h-screen flex items-center py-20 bg-lightSection">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <h2 className="text-4xl md:text-6xl font-extrabold text-textDark">
                {sectionHeading}
              </h2>
              <motion.button
                onClick={handleEditClick}
                className={`p-3 rounded-full transition-all duration-300 ${isEditMode
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
            </div>

            {/* Save/Reset Controls */}
            <AnimatePresence>
              {hasUnsavedChanges && isEditMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-orange-200 mb-8 max-w-md mx-auto"
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg relative group">
                {/* Hotel Info Edit Button */}
                {isEditMode && (
                  <motion.button
                    onClick={handleHotelEditClick}
                    className="absolute top-4 right-4 p-2 rounded-full bg-heroHighlight text-white hover:bg-blue-700 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit hotel information"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Edit size={16} />
                  </motion.button>
                )}

                <div className="flex items-start gap-4 mb-6">
                  <MapPin className="text-heroHighlight mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-textDark mb-2">{hotelInfo.name}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed mb-2" style={{ whiteSpace: 'pre-line' }}>
                      {hotelInfo.address}
                    </p>
                    <a
                      href={`tel:${hotelInfo.phone.replace(/[^\d]/g, '')}`}
                      className="inline-flex items-center gap-2 text-heroHighlight hover:text-blue-700 transition-colors"
                    >
                      <Phone size={16} />
                      {hotelInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EditableCTAButton
                    button={ctaButton1}
                    onSave={handleCTA1Save}
                    isEditable={isCTA1Editable}
                    onEditClick={handleCTA1EditClick}
                    className="w-full"
                  />

                  <EditableCTAButton
                    button={ctaButton2}
                    onSave={handleCTA2Save}
                    isEditable={isCTA2Editable}
                    onEditClick={handleCTA2EditClick}
                    className="w-full"
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-ctaOrange rounded-r-xl p-6 relative group"
              >
                {/* Notice Edit Button */}
                {isEditMode && (
                  <motion.button
                    onClick={handleNoticeEditClick}
                    className="absolute top-4 right-4 p-2 rounded-full bg-heroHighlight text-white hover:bg-blue-700 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit notice"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Edit size={16} />
                  </motion.button>
                )}

                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-ctaOrange mt-1" size={24} />
                  <div className="flex-1">
                    <h4 className="font-bold text-textDark mb-2">Important Notice</h4>
                    <p className="text-gray-700">{noticeText}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-full">
                <div className="aspect-[4/3] relative">
                  <ImageCarousel
                    images={resortImages}
                    autoPlay={true}
                    autoPlayInterval={4000}
                    isEditable={isEditMode}
                    onEditClick={handleImagesEditClick}
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-textDark mb-2">Resort Amenities</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Championship Golf Course</li>
                    <li>• Full-Service Spa</li>
                    <li>• Multiple Dining Options</li>
                    <li>• Fitness Center & Pool</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hotel Edit Modal */}
      <AnimatePresence>
        {showHotelEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHotelEditModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              >
                <div className="relative bg-gradient-to-r from-heroHighlight to-success p-6 text-white rounded-t-2xl">
                  <motion.button
                    onClick={() => setShowHotelEditModal(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Edit Hotel Information</h2>
                      <p className="text-white/90">Update hotel details</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700 mb-2">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      id="hotelName"
                      value={hotelEditForm.name}
                      onChange={(e) => setHotelEditForm({ ...hotelEditForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter hotel name"
                    />
                  </div>

                  <div>
                    <label htmlFor="hotelAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      id="hotelAddress"
                      value={hotelEditForm.address}
                      onChange={(e) => setHotelEditForm({ ...hotelEditForm, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                      placeholder="Enter hotel address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label htmlFor="hotelPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="hotelPhone"
                      value={hotelEditForm.phone}
                      onChange={(e) => setHotelEditForm({ ...hotelEditForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowHotelEditModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleHotelSave}
                      className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={16} />
                      Save Hotel Info
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notice Edit Modal */}
      <AnimatePresence>
        {showNoticeEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNoticeEditModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              >
                <div className="relative bg-gradient-to-r from-ctaOrange to-yellow-500 p-6 text-white rounded-t-2xl">
                  <motion.button
                    onClick={() => setShowNoticeEditModal(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Edit Important Notice</h2>
                      <p className="text-white/90">Update notice text</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="noticeText" className="block text-sm font-medium text-gray-700 mb-2">
                      Notice Text
                    </label>
                    <textarea
                      id="noticeText"
                      value={noticeEditForm}
                      onChange={(e) => setNoticeEditForm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                      placeholder="Enter important notice"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowNoticeEditModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleNoticeSave}
                      className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={16} />
                      Save Notice
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
        onSave={handleImagesSave}
        images={resortImages}
        type="resort"
      />
    </>
  );
};

export default LocationSection;