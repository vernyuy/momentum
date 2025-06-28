import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Edit, Trash2, GripVertical, Save, RotateCcw } from 'lucide-react';
import { speakers as initialSpeakers, Speaker } from '../data/conference';
import SpeakerModal from './SpeakerModal';
import SpeakerEditModal from './SpeakerEditModal';
import EditableCTAButton, { CTAButton } from './EditableCTAButton';
import PinModal from './PinModal';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();
const SpeakersSection: React.FC = () => {
  const [speakers, setSpeakers] = useState<Array<Schema["Speaker"]["type"]>>([]);

  useEffect(() => {
    client.models.Speaker.observeQuery().subscribe({
      next: (data) => setSpeakers([...data.items]),
    });
  }, []);

  function createSpeaker(speaker: Speaker) {
    client.models.Speaker.create(speaker);
  }
  async function deleteSpeaker(speakerId: string) {
    console.log("Deleting speaker with ID:", speakerId);
    await client.models.Speaker.delete({
      id: speakerId
    });
  }
  async function updateSpeaker(speaker: Speaker) {
    await client.models.Speaker.update(speaker);
  }
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | undefined>();
  const [pendingAction, setPendingAction] = useState<'edit' | 'add' | 'cta' | null>(null);

  // Local state for speakers
  const [localSpeakers, setLocalSpeakers] = useState(initialSpeakers);
  const [draggedSpeaker, setDraggedSpeaker] = useState<Speaker | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // CTA Button state
  const initialCTAButton: CTAButton = {
    id: 'speakers-cta',
    text: 'Register Now',
    url: '',
    style: 'primary',
    size: 'medium'
  };
  const [ctaButton, setCTAButton] = useState(initialCTAButton);
  const [isCTAEditable, setIsCTAEditable] = useState(false);

  // Track if changes have been made
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check for changes whenever local speakers or CTA change
  useEffect(() => {
    const speakersChanged = JSON.stringify(localSpeakers) !== JSON.stringify(initialSpeakers);
    const ctaChanged = JSON.stringify(ctaButton) !== JSON.stringify(initialCTAButton);
    setHasUnsavedChanges(speakersChanged || ctaChanged);
  }, [localSpeakers, ctaButton]);

  const handleSpeakerClick = (speaker: Speaker) => {
    if (!isEditMode) {
      setSelectedSpeaker(speaker);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (pendingAction === 'edit') {
      setIsEditMode(true);
    } else if (pendingAction === 'add') {
      setShowEditModal(true);
    } else if (pendingAction === 'cta') {
      setIsCTAEditable(true);
    }
    setPendingAction(null);
  };

  const handleEditClick = () => {
    setPendingAction('edit');
    setShowPinModal(true);
  };

  const handleAddClick = () => {
    console.log("speakers", speakers);
    setPendingAction('add');
    setEditingSpeaker(undefined);
    setShowPinModal(true);
  };

  const handleCTAEditClick = () => {
    setPendingAction('cta');
    setIsCTAEditable(true);
  };

  const handleEditSpeaker = (speaker: Speaker) => {
    console.log("Editing speaker:", speaker);
    setEditingSpeaker(speaker);
    setShowEditModal(true);
  };

  const handleDeleteSpeaker = (speakerId: string) => {
    deleteSpeaker(speakerId);
    setLocalSpeakers(prev => prev.filter(speaker => speaker.id !== speakerId));
  };

  const handleSaveSpeaker = (speaker: Speaker, originalId?: boolean) => {
    console.log("Saving speaker:", speaker, "Original ID:", originalId);
    if (!originalId) {
      updateSpeaker(speaker);
    } else {
      createSpeaker(speaker);
    }
  };

  const handleCTASave = (newButton: CTAButton) => {
    setCTAButton(newButton);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    // Simulate saving to backend
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would save to your backend here
    console.log('Saving speaker changes:', {
      speakers: localSpeakers,
      ctaButton
    });

    setIsSaving(false);
    setHasUnsavedChanges(false);

    // Show success feedback
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Speakers saved successfully!';
    document.body.appendChild(successMessage);

    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleResetChanges = () => {
    setLocalSpeakers(initialSpeakers);
    setCTAButton(initialCTAButton);
    setHasUnsavedChanges(false);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, speaker: Speaker) => {
    setDraggedSpeaker(speaker);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (!draggedSpeaker) return;

    const dragIndex = localSpeakers.findIndex(s => s.id === draggedSpeaker.id);
    if (dragIndex === dropIndex) return;

    const newSpeakers = [...localSpeakers];
    const [removed] = newSpeakers.splice(dragIndex, 1);
    newSpeakers.splice(dropIndex, 0, removed);

    setLocalSpeakers(newSpeakers);
    setDraggedSpeaker(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedSpeaker(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <section className="min-h-screen flex flex-col py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-textDark">
                Momentum 2025! Speakers
              </h2>
              <div className="flex gap-2">
                <motion.button
                  onClick={handleEditClick}
                  className={`p-3 rounded-full transition-all duration-300 ${isEditMode
                      ? 'bg-success text-white shadow-lg'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-heroHighlight'
                    }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={isEditMode ? 'Exit Edit Mode' : 'Edit Speakers'}
                >
                  <Settings size={20} />
                </motion.button>
                {isEditMode && (
                  <motion.button
                    onClick={handleAddClick}
                    className="p-3 rounded-full bg-ctaOrange text-white hover:bg-orange-600 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Add New Speaker"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Plus size={20} />
                  </motion.button>
                )}
              </div>
            </div>

            <motion.span
              className="block w-48 h-1 bg-gradient-to-r from-ctaOrange to-heroHighlight mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 192 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />

            {isEditMode && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600 mt-4 bg-blue-50 px-4 py-2 rounded-lg inline-block"
              >
                💡 Drag speakers to reorder • Click to edit • Use controls to add/delete
              </motion.p>
            )}
          </motion.div>

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

          {/* Speakers Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 content-start">
            {speakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: isEditMode ? 0 : -5, scale: isEditMode ? 1 : 1.02 }}
                onClick={() => handleSpeakerClick(speaker)}
                className={`bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 text-center group flex flex-col relative ${isEditMode ? 'cursor-grab' : 'cursor-pointer'
                  } ${dragOverIndex === index ? 'ring-2 ring-heroHighlight bg-blue-50' : ''
                  } ${draggedSpeaker?.id === speaker.id ? 'opacity-50 scale-95' : ''
                  }`}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, speaker)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                {/* Drag Handle */}
                {isEditMode && (
                  <motion.div
                    className="absolute top-2 left-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <GripVertical size={16} />
                  </motion.div>
                )}

                {/* Edit Controls */}
                {isEditMode && (
                  <motion.div
                    className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSpeaker(speaker);
                      }}
                      className="p-1 bg-heroHighlight text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit Speaker"
                    >
                      <Edit size={12} />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSpeaker(speaker.id);
                      }}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete Speaker"
                    >
                      <Trash2 size={12} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Speaker Image */}
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                  whileHover={{ scale: isEditMode ? 1 : 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {speaker.image ? (
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-heroHighlight to-success flex items-center justify-center rounded-full">
                      <span className="text-lg sm:text-xl text-white/80">👤</span>
                    </div>
                  )}
                </motion.div>

                {/* Speaker Name */}
                <motion.h3
                  className="text-xs sm:text-sm font-bold text-textDark mb-1 group-hover:text-heroHighlight transition-colors leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {speaker.name}
                </motion.h3>

                {/* Speaker Title */}
                <motion.p
                  className="text-xs text-gray-600 font-medium mb-2 leading-tight line-clamp-2 min-h-[2rem] flex items-center justify-center flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {speaker.title}
                </motion.p>

                {speaker.title === 'TBA' && (
                  <motion.div
                    className="bg-gradient-to-r from-ctaOrange/10 to-heroHighlight/10 rounded-lg p-2 mt-1"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <p className="text-xs font-medium text-heroHighlight">
                      🎉 Coming Soon!
                    </p>
                  </motion.div>
                )}

                {/* Click indicator */}
                {!isEditMode && (
                  <motion.div
                    className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                    initial={{ y: 5 }}
                    whileHover={{ y: 0 }}
                  >
                    Click →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mt-6 pt-6 border-t border-gray-200"
          >
            <p className="text-base text-gray-700 mb-4">
              Ready to learn from these industry experts?
            </p>
            <EditableCTAButton
              button={ctaButton}
              onSave={handleCTASave}
              isEditable={isCTAEditable}
              onEditClick={handleCTAEditClick}
            />
          </motion.div>
        </div>
      </section>

      {/* Speaker Detail Modal */}
      <SpeakerModal
        speaker={selectedSpeaker}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

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

      {/* Speaker Edit Modal */}
      <SpeakerEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingSpeaker(undefined);
        }}
        onSave={handleSaveSpeaker}
        speaker={editingSpeaker}
      />
    </>
  );
};

export default SpeakersSection;