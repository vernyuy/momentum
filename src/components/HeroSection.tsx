import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, MapPin, Clock, Edit, Settings, Save, RotateCcw } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import PinModal from './PinModal';
import HeroImageEditModal from './HeroImageEditModal';
import EditableCTAButton, { CTAButton } from './EditableCTAButton';

import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getUrl } from 'aws-amplify/storage';

const client = generateClient<Schema>();

interface HeroSectionProps {
  onScrollToNext: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToNext }: any) => {
  const conferenceDate = new Date('2025-09-19T09:00:00');
  
  const [timezone, setTimezone] = useState('MST');
  const [ctaButton, setCTAButton] = useState({
    id: 'hero-cta',
    text: 'Register Now',
    url: '',
    style: 'secondary',
    size: 'large'
  });

  const countdown = useCountdown(conferenceDate);
    useEffect(() => {
      // createTimezone({ name: 'MST' });
      // createButton();
      client.models.RegisterButton.observeQuery().subscribe({
        next: (data: any) =>{ 
          console.log('Timezone data:', data.items);
          setCTAButton(data.items[0]);
      }});
      const fetchTimezones = async () => {
        try {
          const timezones = await client.models.Timezone.get({
            id: "24f381e3-fdcb-48c6-852e-028eb2a47851",
          })
          setTimezone(timezones!.data!.name!);
        } catch (error) {
          console.error('Error fetching timezones:', error);
        }
      }
      fetchTimezones();
    }, []);
  // function createTimezone(data: { name: string }) {
  //     client.models.Timezone.create(data);
  //   }
  //   function createButton(data?: any) {
  //     client.models.RegisterButton.create({
  //       id: 'hero-cta',
  //   text: 'Register Now',
  //   url: '',
  //   style: 'secondary',
  //   size: 'large'
  // });
    // }
    function updateTimezone(data: any) {
      client.models.Timezone.update(data);
    }
    function updateButton(data: any) {
      client.models.RegisterButton.update(data);
    }
  const [isTimezoneEditable, setIsTimezoneEditable] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isEditingTimezone, setIsEditingTimezone] = useState(false);
  const [pendingAction, setPendingAction] = useState<'timezone' | 'background' | 'cta' | null>(null);
  
  // Background image state
  const initialBackgroundImage = 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
  const [backgroundImage, setBackgroundImage] = useState(initialBackgroundImage);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [isBackgroundEditable, setIsBackgroundEditable] = useState(false);
  
  // CTA Button state
  const initialCTAButton: CTAButton = {
    id: 'hero-cta',
    text: 'Register Now',
    url: '',
    style: 'primary',
    size: 'large'
  };
  const [isCTAEditable, setIsCTAEditable] = useState(false);
  
  // Track changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const timezones = [
    { value: 'MST', label: 'MST (Mountain Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'CST', label: 'CST (Central Standard Time)' },
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' }
  ];

  // Check for changes
  React.useEffect(() => {
    const fetchTimezones = async () => {
        try {
          const data = await client.models.Hero.get({
            id: "1",
          })
          setBackgroundImage(data.data.imageUrl)
        } catch (error) {
          console.error('Error fetching Hero Image:', error);
        }
      }
      fetchTimezones();
  }, [backgroundImage, ctaButton]);

  const handleTimezoneEditClick = () => {
    if (isTimezoneEditable) {
      setIsEditingTimezone(true);
    } else {
      setPendingAction('timezone');
      setShowPinModal(true);
    }
  };

  const handleBackgroundEditClick = () => {
    if (isBackgroundEditable) {
      setShowImageEditModal(true);
    } else {
      setPendingAction('background');
      setShowPinModal(true);
    }
  };

  const handleCTAEditClick = () => {
    setPendingAction('cta');
    setIsCTAEditable(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (pendingAction === 'timezone') {
      setIsTimezoneEditable(true);
      setIsEditingTimezone(true);
    } else if (pendingAction === 'background') {
      setIsBackgroundEditable(true);
      setShowImageEditModal(true);
    } else if (pendingAction === 'cta') {
      setIsCTAEditable(true);
    }
    setPendingAction(null);
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
    setIsEditingTimezone(false);
  };

  const handleBackgroundSave = (newImageUrl: string) => {
    setBackgroundImage(newImageUrl);
  };

  const handleCTASave = (newButton: any) => {
    // console.log('Saving CTA Button:', newButton);
    updateButton(newButton);
    setCTAButton(newButton);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Simulate saving to backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would save to your backend here
    console.log('Saving hero changes:', {
      backgroundImage,
      timezone,
      ctaButton
    });
    
    setIsSaving(false);
    setHasUnsavedChanges(false);
    
    // Show success feedback
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Hero section saved successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleResetChanges = () => {
    setBackgroundImage(initialBackgroundImage);
    setCTAButton(initialCTAButton as any);
    setHasUnsavedChanges(false);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden group">
        {/* Background Image - No overlay or blur */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Conference venue background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Subtle dark overlay only for text readability */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Edit Controls */}
        <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
          {/* Background Edit Button - Always visible with subtle styling */}
          <motion.button
            onClick={handleBackgroundEditClick}
            className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
              isBackgroundEditable 
                ? 'bg-success text-white' 
                : 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white/80 hover:text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isBackgroundEditable ? 'Edit Background Image' : 'Login to edit background'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <Settings size={20} />
          </motion.button>

          {/* Save/Reset Controls */}
          <AnimatePresence>
            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-orange-200"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-ctaOrange rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-gray-700">
                    Unsaved changes
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleResetChanges}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw size={14} />
                    Reset
                  </motion.button>
                  
                  <motion.button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-success hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    whileHover={{ scale: isSaving ? 1 : 1.02 }}
                    whileTap={{ scale: isSaving ? 1 : 0.98 }}
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Single Row Title - Maximum Size */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[8rem] font-extrabold text-white leading-none tracking-tight drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className=" text-white text-transparent drop-shadow-lg">
                Momentum 2025!
              </span>
            </motion.h1>

            {/* Date, Location, and Timezone Cards */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center items-stretch gap-4 sm:gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {/* Date Card */}
              <motion.div
                className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 border border-white/30 shadow-xl"
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  y: -2
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-ctaOrange/40 p-3 rounded-full flex-shrink-0">
                  <Calendar className="text-white" size={24} />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-1">Conference Dates</p>
                  <p className="text-white text-lg sm:text-xl font-bold leading-tight drop-shadow-lg">September 19-20, 2025</p>
                </div>
              </motion.div>

              {/* Location Card */}
              <motion.div
                className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 border border-white/30 shadow-xl"
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  y: -2
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-success/40 p-3 rounded-full flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-white text-lg sm:text-xl font-bold leading-tight drop-shadow-lg">Scottsdale, Arizona</p>
                </div>
              </motion.div>

              {/* Timezone Card */}
              <motion.div
                className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 border border-white/30 shadow-xl relative group"
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  y: -2
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-purple-500/40 p-3 rounded-full flex-shrink-0">
                  <Clock className="text-white" size={24} />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-1">Time Zone</p>
                  {isEditingTimezone ? (
                    <select
                      value={timezone}
                      onChange={(e) => {
                        updateTimezone({id: '24f381e3-fdcb-48c6-852e-028eb2a47851', name: e.target.value})
                        setTimezone(e.target.value);
                      }}
                      onBlur={() => setIsEditingTimezone(false)}
                      className="bg-white/20 text-white text-lg sm:text-xl font-bold leading-tight border-none outline-none rounded px-2 py-1"
                      autoFocus
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value} className="text-black">
                          {tz.value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-white text-lg sm:text-xl font-bold leading-tight drop-shadow-lg">{timezone}</p>
                  )}
                </div>
                
                {/* Edit Button */}
                <motion.button
                  onClick={handleTimezoneEditClick}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isTimezoneEditable 
                      ? 'bg-white/30 hover:bg-white/40 opacity-100' 
                      : 'bg-white/20 hover:bg-white/30 opacity-0 group-hover:opacity-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={isTimezoneEditable ? 'Edit timezone' : 'Login to edit timezone'}
                >
                  <Edit className="text-white" size={16} />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="text-center bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 min-w-[75px] sm:min-w-[85px] border border-white/30 shadow-xl"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -3,
                    backgroundColor: 'rgba(255, 255, 255, 0.25)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-none drop-shadow-lg">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm text-white/90 uppercase tracking-wide font-semibold mt-1">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <EditableCTAButton
                button={ctaButton as any}
                onSave={handleCTASave}
                isEditable={isCTAEditable}
                onEditClick={handleCTAEditClick}
                onClick={onScrollToNext}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={onScrollToNext}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30 shadow-xl group-hover:bg-white/30 transition-colors"
          >
            <ChevronDown size={28} />
          </motion.div>
        </motion.button>
      </section>

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

      {/* Hero Image Edit Modal */}
      <HeroImageEditModal
        isOpen={showImageEditModal}
        onClose={() => setShowImageEditModal(false)}
        onSave={handleBackgroundSave}
        currentImage={backgroundImage}
      />
    </>
  );
};

export default HeroSection;