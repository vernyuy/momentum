/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, RotateCcw, Edit, X } from 'lucide-react';
import { whyAttendItems as initialWhyAttendItems } from '../data/conference';
import EditableHeading from './EditableHeading';
import PinModal from './PinModal';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

interface WhyAttendItem {
  icon: string;
  title: string;
  description: string;
}

const WhyAttendSection: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  const initialHeading = 'Why Attend';
  const [sectionHeading, setSectionHeading] = useState(initialHeading);
  const [isHeadingEditable, setIsHeadingEditable] = useState(false);

  const [whyAttendItems, setWhyAttendItems] = useState<WhyAttendItem[]>(initialWhyAttendItems);

      useEffect(() => {
        client.models.WhyAttend.observeQuery().subscribe({
          next: (data: any) =>{ 
            setWhyAttendItems(data.items);
        }});
      }, [whyAttendItems]);

      function updateWhyAttend(data: any) {
        client.models.WhyAttend.update(data);
      }
  
  const [editForm, setEditForm] = useState<any>({
    icon: '',
    title: '',
    description: ''
  });

  // Track if changes have been made
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check for changes whenever content changes
  useEffect(() => {
    const headingChanged = sectionHeading !== initialHeading;
    const itemsChanged = JSON.stringify(whyAttendItems) !== JSON.stringify(initialWhyAttendItems);
    setHasUnsavedChanges(headingChanged || itemsChanged);
  }, [sectionHeading, whyAttendItems]);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setIsEditMode(true);
    setIsHeadingEditable(true);
  };

  const handleEditClick = () => {
    setShowPinModal(true);
  };

  const handleCardEditClick = (index: number) => {
    setEditingCardIndex(index);
    setEditForm(whyAttendItems[index]);
  };

  const handleSaveCardEdit = () => {
    if (editingCardIndex !== null) {
      updateWhyAttend(editForm);
      const updatedItems = [...whyAttendItems];
      updatedItems[editingCardIndex] = editForm;
      setWhyAttendItems(updatedItems);
      setEditingCardIndex(null);
      setEditForm({ icon: '', title: '', description: '' });
    }
  };

  const handleCancelCardEdit = () => {
    setEditingCardIndex(null);
    setEditForm({icon: '', title: '', description: '' });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setHasUnsavedChanges(false);
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Why Attend section saved successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleResetChanges = () => {
    setSectionHeading(initialHeading);
    setWhyAttendItems(initialWhyAttendItems);
    setHasUnsavedChanges(false);
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
              <EditableHeading
                text={sectionHeading}
                onSave={setSectionHeading}
                isEditable={isHeadingEditable}
                onEditClick={() => setIsHeadingEditable(true)}
                className="text-4xl md:text-6xl font-extrabold text-textDark"
                level={2}
              />
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

            <motion.span
              className="block w-32 h-1 bg-gradient-to-r from-ctaOrange to-heroHighlight mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyAttendItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center relative group"
              >
                {/* Single Edit Button */}
                {isEditMode && (
                  <motion.button
                    onClick={() => handleCardEditClick(index)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-heroHighlight text-white hover:bg-blue-700 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit this card"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Edit size={16} />
                  </motion.button>
                )}

                <motion.div
                  className="text-6xl mb-6 relative inline-block"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-textDark mb-4">
                  {item.title}
                </h3>
                
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Card Edit Modal */}
      <AnimatePresence>
        {editingCardIndex !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelCardEdit}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-heroHighlight to-success p-6 text-white rounded-t-2xl">
                  <motion.button
                    onClick={handleCancelCardEdit}
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
                      <h2 className="text-2xl font-bold">Edit Card</h2>
                      <p className="text-white/90">Update icon, title, and description</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                  {/* Icon */}
                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      id="icon"
                      value={editForm.icon}
                      onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent text-center text-2xl"
                      placeholder="🎓"
                      maxLength={2}
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                      placeholder="Enter description"
                      rows={4}
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancelCardEdit}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleSaveCardEdit}
                      className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={16} />
                      Save Card
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

export default WhyAttendSection;