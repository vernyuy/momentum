/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Car, ChevronDown, Settings, Save, RotateCcw, Edit, X } from 'lucide-react';
import PinModal from './PinModal';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

interface TravelOption {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  content: {
    airportName?: string;
    airportDescription?: string;
    conferenceInfo?: string;
    tip?: string;
    rentalCars?: string;
    rideServices?: string;
    recommendation?: string;
  };
}

const TravelSection: React.FC = () => {
    const [airTravel, setairTravel] = useState<Array<Schema["AirTravel"]["type"]>>([]);
    const [groundTransport, setgroundTransport] = useState<Array<Schema["GroundTransport"]["type"]>>([]);
const [travelOptions, setTravelOptions] = useState<any[]>([])
  useEffect(() => {
    client.models.AirTravel.observeQuery().subscribe({
      next: (data) =>{ 
        setairTravel([...data.items])
      setTravelOptions([ ...travelOptions, {
        id: 'air',
        icon: Plane,
        title: data.items[0].title!,
        content: data.items[0]!
      }] )
      },
    });
    client.models.GroundTransport.observeQuery().subscribe({
      next: (data) => {
        setgroundTransport([...data.items])
      setTravelOptions([ ...travelOptions, {
        id: 'ground',
        icon: Car,
        title: data.items[0].title!,
        content: data.items[0]!
      } ])
      },
    });
  }, []);

  function createSpeaker(speaker: any) {
    client.models.Speaker.create(speaker);
  }
  async function deleteSpeaker(speakerId: string) {
    console.log("Deleting speaker with ID:", speakerId);
    await client.models.Speaker.delete({
      id: speakerId
    });
  }
  async function updateAirTravel(data: any) {
    const res = await client.models.AirTravel.update(data);
    console.log("Ground transport updated:", res);
  }
  async function updateGroundTransport(data: any) {
    const res = await client.models.GroundTransport.update(data);
    console.log("Ground transport updated:", res);
  }

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [editingOption, setEditingOption] = useState<string | null>(null);

  // Section content state
  const initialMainHeading = 'Getting to Scottsdale';
  const initialSubHeading = 'Multiple convenient options to reach the conference venue';

  const [mainHeading, setMainHeading] = useState(initialMainHeading);
  const [subHeading, setSubHeading] = useState(initialSubHeading);

  // Travel options content state
  const initialAirTravelContent = {
    title: 'Air Travel',
    airportName: 'Phoenix Sky Harbor International Airport (PHX)',
    airportDescription: 'Located 20 minutes from the resort. Most convenient option with numerous daily flights.',
    conferenceInfo: 'The annual conference will last two full days on September 19th & 20th. Please plan your flight to arrive at your leisure on Thursday, September 18th. Departures can be made at your leisure on Sunday, September 21st.',
    tip: 'Book early for better rates. Group discounts may be available through conference organizers.'
  };

  const initialGroundTransportContent = {
    title: 'Ground Transportation',
    rentalCars: 'Available at Phoenix Sky Harbor. Major brands include Hertz, Avis, Enterprise, and Budget.',
    rideServices: 'Uber and Lyft are readily available. Approximate cost from PHX: $25-40.',
    recommendation: 'Rent a car if you plan to explore Scottsdale\'s attractions during your stay.'
  };

  const [airTravelContent, setAirTravelContent] = useState(initialAirTravelContent);
  const [groundTransportContent, setGroundTransportContent] = useState(initialGroundTransportContent);

  // Edit forms
  const [airTravelEditForm, setAirTravelEditForm] = useState(initialAirTravelContent);
  const [groundTransportEditForm, setGroundTransportEditForm] = useState(initialGroundTransportContent);

  // Track if changes have been made
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check for changes whenever content changes
  // useEffect(() => {
  //   const headingChanged = mainHeading !== initialMainHeading;
  //   const subHeadingChanged = subHeading !== initialSubHeading;
  //   const airTravelChanged = JSON.stringify(airTravelContent) !== JSON.stringify(initialAirTravelContent);
  //   const groundTransportChanged = JSON.stringify(groundTransportContent) !== JSON.stringify(initialGroundTransportContent);
    
  //   setHasUnsavedChanges(headingChanged || subHeadingChanged || airTravelChanged || groundTransportChanged);
  // }, [mainHeading, subHeading, airTravelContent, groundTransportContent]);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setIsEditMode(true);
  };

  const handleEditClick = () => {
    setShowPinModal(true);
  };

  const handleOptionEditClick = (optionId: string) => {
    setEditingOption(optionId);
    if (optionId === 'air') {
      setAirTravelEditForm(airTravelContent);
    } else {
      setGroundTransportEditForm(groundTransportContent);
    }
  };

  const handleSaveOptionEdit = () => {
    if (editingOption === 'air') {
      setAirTravelContent(airTravelEditForm);
      updateAirTravel(airTravelEditForm);
    } else if (editingOption === 'ground') {
      setGroundTransportContent(groundTransportEditForm);
      updateGroundTransport(groundTransportEditForm);
    }
    setEditingOption(null);
  };

  const handleCancelOptionEdit = () => {
    setEditingOption(null);
    if (editingOption === 'air') {
      setAirTravelEditForm(airTravelContent);
    } else {
      setGroundTransportEditForm(groundTransportContent);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Simulate saving to backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would save to your backend here
    console.log('Saving travel section changes:', {
      mainHeading,
      subHeading,
      airTravelContent,
      groundTransportContent
    });
    
    setIsSaving(false);
    setHasUnsavedChanges(false);
    
    // Show success feedback
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Travel section saved successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleResetChanges = () => {
    setMainHeading(initialMainHeading);
    setSubHeading(initialSubHeading);
    setAirTravelContent(initialAirTravelContent);
    setGroundTransportContent(initialGroundTransportContent);
    setHasUnsavedChanges(false);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };


  return (
    <>
      <section className="min-h-screen flex items-center py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-4xl md:text-6xl font-extrabold text-textDark">
                {mainHeading}
              </h2>
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
            </div>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {subHeading}
            </p>

            {/* Save/Reset Controls */}
            <AnimatePresence>
              {hasUnsavedChanges && isEditMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-orange-200 mt-8 max-w-md mx-auto"
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

          <div className="max-w-4xl mx-auto space-y-4">
            {travelOptions.map((option, index) => {
              const IconComponent = option.icon;
              const isActive = activeAccordion === option.id;

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden relative group"
                >
                  {/* Edit Button */}
                  {isEditMode && (
                    <motion.button
                      onClick={() => handleOptionEditClick(option.id)}
                      className="absolute top-4 right-4 z-10 p-2 rounded-full bg-heroHighlight text-white hover:bg-blue-700 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit travel option"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Edit size={16} />
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => toggleAccordion(option.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-heroHighlight/10 p-3 rounded-full">
                        <IconComponent className="text-heroHighlight" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-textDark">{option.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="text-gray-400" size={24} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 border-t border-gray-100">
                          {option.id === 'air' ? (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-textDark mb-2">{option.content.airportName}</h4>
                                <p className="text-gray-700 mb-3">{option.content.airportDescription}</p>
                                <div className="bg-gradient-to-r from-heroHighlight/10 to-success/10 rounded-lg p-4">
                                  <p className="text-gray-700 font-medium">{option.content.conferenceInfo}</p>
                                </div>
                              </div>
                              <div className="bg-infoBlue rounded-lg p-4">
                                <p className="text-sm text-textDark">
                                  <strong>Tip:</strong> {option.content.tip}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-textDark mb-2">Rental Cars</h4>
                                <p className="text-gray-700">{option.content.rentalCars}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-textDark mb-2">Ride Services</h4>
                                <p className="text-gray-700">{option.content.rideServices}</p>
                              </div>
                              <div className="bg-infoBlue rounded-lg p-4">
                                <p className="text-sm text-textDark">
                                  <strong>Recommended:</strong> {option.content.recommendation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Travel Option Edit Modal */}
      <AnimatePresence>
        {editingOption && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelOptionEdit}
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
                    onClick={handleCancelOptionEdit}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      {editingOption === 'air' ? <Plane size={24} /> : <Car size={24} />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Edit Travel Option</h2>
                      <p className="text-white/90">Update travel information</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {editingOption === 'air' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={airTravelEditForm.title}
                          onChange={(e) => setAirTravelEditForm({ ...airTravelEditForm, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                          placeholder="Enter section title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Airport Name
                        </label>
                        <input
                          type="text"
                          value={airTravelEditForm.airportName}
                          onChange={(e) => setAirTravelEditForm({ ...airTravelEditForm, airportName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                          placeholder="Enter airport name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Airport Description
                        </label>
                        <textarea
                          value={airTravelEditForm.airportDescription}
                          onChange={(e) => setAirTravelEditForm({ ...airTravelEditForm, airportDescription: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                          placeholder="Enter airport description"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conference Information
                        </label>
                        <textarea
                          value={airTravelEditForm.conferenceInfo}
                          onChange={(e) => setAirTravelEditForm({ ...airTravelEditForm, conferenceInfo: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                          placeholder="Enter conference timing information"
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Travel Tip
                        </label>
                        <textarea
                          value={airTravelEditForm.tip}
                          onChange={(e) => setAirTravelEditForm({ ...airTravelEditForm, tip: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                          placeholder="Enter travel tip"
                          rows={2}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={groundTransportEditForm.title}
                          onChange={(e) => setGroundTransportEditForm({ ...groundTransportEditForm, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                          placeholder="Enter section title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rental Cars Information
                        </label>
                        <textarea
                          value={groundTransportEditForm.rentalCars}
                          onChange={(e) => setGroundTransportEditForm({ ...groundTransportEditForm, rentalCars: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                          placeholder="Enter rental car information"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ride Services Information
                        </label>
                        <textarea
                          value={groundTransportEditForm.rideServices}
                          onChange={(e) => setGroundTransportEditForm({ ...groundTransportEditForm, rideServices: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                          placeholder="Enter ride service information"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recommendation
                        </label>
                        <textarea
                          value={groundTransportEditForm.recommendation}
                          onChange={(e) => setGroundTransportEditForm({ ...groundTransportEditForm, recommendation: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                          placeholder="Enter recommendation"
                          rows={2}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancelOptionEdit}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleSaveOptionEdit}
                      className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={16} />
                      Save Changes
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
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        title="Admin Access Required"
      />
    </>
  );
};

export default TravelSection;