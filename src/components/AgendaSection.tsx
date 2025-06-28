/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Mic, Utensils, Music, Plus, Edit, Trash2, Settings, Save, RotateCcw } from 'lucide-react';
import { fridayAgenda, saturdayAgenda, AgendaItem } from '../data/conference';
import PinModal from './PinModal';
import AgendaItemModal from './AgendaItemModal';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();
const AgendaSection: React.FC = () => {
  const [agendaItems, setAgendaItems] = useState<Array<Schema["Agenda"]["type"]>>([]);

  useEffect(() => {
    client.models.Agenda.observeQuery().subscribe({
      next: (data) => setAgendaItems([...data.items]),
    });
  }, []);

  function createAgendaItem(agenda: any) {
    client.models.Agenda.create(agenda);
  }
  async function deleteAgendaItem(agendaId: string) {
    console.log("Deleting agenda with ID:", agendaId);
    await client.models.Agenda.delete({
      id: agendaId
    });
  }
  async function updateAgendaItem(agenda: any) {
    await client.models.Agenda.update(agenda);
  }

  const [activeTab, setActiveTab] = useState<'friday' | 'saturday'>('friday');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | undefined>();
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [pendingAction, setPendingAction] = useState<'edit' | 'add' | null>(null);

  // Local state for agenda items
  const [localFridayAgenda, setLocalFridayAgenda] = useState(fridayAgenda);
  const [localSaturdayAgenda, setLocalSaturdayAgenda] = useState(saturdayAgenda);
  
  // Track if changes have been made
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check for changes whenever local agenda changes
  useEffect(() => {
    const fridayChanged = JSON.stringify(localFridayAgenda) !== JSON.stringify(fridayAgenda);
    const saturdayChanged = JSON.stringify(localSaturdayAgenda) !== JSON.stringify(saturdayAgenda);
    setHasUnsavedChanges(fridayChanged || saturdayChanged);
  }, [localFridayAgenda, localSaturdayAgenda]);

  const getIcon = (type: AgendaItem['type']) => {
    switch (type) {
      case 'session':
        return <Mic size={20} className="text-heroHighlight" />;
      case 'meal':
        return <Utensils size={20} className="text-success" />;
      case 'party':
        return <Music size={20} className="text-ctaOrange" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  const currentAgenda = activeTab === 'friday' ? localFridayAgenda : localSaturdayAgenda;

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (pendingAction === 'edit') {
      setIsEditMode(true);
    } else if (pendingAction === 'add') {
      setShowItemModal(true);
    }
    setPendingAction(null);
  };

  const handleEditClick = () => {
    setPendingAction('edit');
    setShowPinModal(true);
  };

  const handleAddClick = () => {
    setPendingAction('add');
    setEditingItem(undefined);
    setEditingIndex(undefined);
    setShowPinModal(true);
  };

  const handleEditItem = (item: AgendaItem, index: number) => {
    setEditingItem(item);
    setEditingIndex(index);
    setShowItemModal(true);
  };

  const handleDeleteItem = (agenda: any) => {
    deleteAgendaItem({
      id: agenda.id as string,
    });
    // if (activeTab === 'friday') {
    //   setLocalFridayAgenda(prev => prev.filter((_, i) => i !== index));
    // } else {
    //   setLocalSaturdayAgenda(prev => prev.filter((_, i) => i !== index));
    // }
  };

  const handleSaveItem = (item: AgendaItem, originalIndex?: number) => {
    const targetDay = (item as any).day || activeTab;
    const itemWithoutDay = { ...item };
    delete (itemWithoutDay as any).day;

    if (originalIndex !== undefined) {
      // Editing existing item
      if (activeTab === 'friday') {
        setLocalFridayAgenda(prev => prev.map((existingItem, i) => 
          i === originalIndex ? itemWithoutDay : existingItem
        ));
      } else {
        setLocalSaturdayAgenda(prev => prev.map((existingItem, i) => 
          i === originalIndex ? itemWithoutDay : existingItem
        ));
      }
    } else {
      // Adding new item
      if (targetDay === 'friday') {
        createAgendaItem({...itemWithoutDay, day: 'friday'});
        setLocalFridayAgenda(prev => [...prev, itemWithoutDay].sort((a, b) => {
          const timeA = a.time.replace(/[^\d:]/g, '');
          const timeB = b.time.replace(/[^\d:]/g, '');
          return timeA.localeCompare(timeB);
        }));
      } else {
        createAgendaItem({...itemWithoutDay, day: 'saturday'});
        setLocalSaturdayAgenda(prev => [...prev, itemWithoutDay].sort((a, b) => {
          const timeA = a.time.replace(/[^\d:]/g, '');
          const timeB = b.time.replace(/[^\d:]/g, '');
          return timeA.localeCompare(timeB);
        }));
      }
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Simulate saving to backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would save to your backend here
    console.log('Saving agenda changes:', {
      friday: localFridayAgenda,
      saturday: localSaturdayAgenda
    });
    
    setIsSaving(false);
    setHasUnsavedChanges(false);
    
    // Show success feedback
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Agenda saved successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleResetChanges = () => {
    setLocalFridayAgenda(fridayAgenda);
    setLocalSaturdayAgenda(saturdayAgenda);
    setHasUnsavedChanges(false);
  };

  const formatTime = (time: string, timezone?: string) => {
    if (!time) return time;
    
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;
    
    return timezone ? `${formattedTime} ${timezone}` : formattedTime;
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
                Agenda
              </h2>
              <div className="flex gap-2">
                <motion.button
                  onClick={handleEditClick}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isEditMode 
                      ? 'bg-success text-white shadow-lg' 
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-heroHighlight'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={isEditMode ? 'Exit Edit Mode' : 'Edit Agenda'}
                >
                  <Settings size={20} />
                </motion.button>
                {isEditMode && (
                  <motion.button
                    onClick={handleAddClick}
                    className="p-3 rounded-full bg-ctaOrange text-white hover:bg-orange-600 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Add New Event"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Plus size={20} />
                  </motion.button>
                )}
              </div>
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

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row justify-center mb-12">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="flex">
                {[
                  { key: 'friday' as const, label: 'Friday • September 19, 2025' },
                  { key: 'saturday' as const, label: 'Saturday • September 20, 2025' },
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeTab === tab.key
                        ? 'bg-heroHighlight text-white shadow-lg'
                        : 'text-gray-600 hover:text-heroHighlight'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">
                      {tab.key === 'friday' ? 'Friday 19th' : 'Saturday 20th'}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Agenda Content */}
          <motion.div
            // key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-4">
              {agendaItems.map((item, index) => (
                <motion.div
                  // key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative group ${
                    item.type === 'party' ? 'ring-2 ring-ctaOrange/20 bg-gradient-to-r from-orange-50 to-yellow-50' : ''
                  }`}
                >
                  {/* Edit Controls */}
                  {isEditMode && (
                    <motion.div
                      className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <motion.button
                        onClick={() => handleEditItem(item, index)}
                        className="p-2 bg-heroHighlight text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit Event"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteItem(item)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 sm:w-40">
                      {getIcon(item.type)}
                      <span className="font-bold text-textDark text-lg">
                        {formatTime(item.time, (item as any).timezone)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${
                        item.type === 'party' ? 'text-ctaOrange' : 'text-textDark'
                      }`}>
                        {(item as any).emoji && (
                          <span className="text-xl">{(item as any).emoji}</span>
                        )}
                        {item.title}
                        {item.type === 'party' && !((item as any).emoji) && (
                          <motion.span
                            className="inline-block ml-2"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            🎸
                          </motion.span>
                        )}
                      </h3>
                      {item.agenda && (
                        <p className="text-gray-600">
                          <span className="font-medium">AgendaItem:</span> {item.agenda}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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

      {/* Agenda Item Modal */}
      <AgendaItemModal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setEditingItem(undefined);
          setEditingIndex(undefined);
        }}
        onSave={handleSaveItem}
        item={editingItem}
        editIndex={editingIndex}
        day={activeTab}
      />
    </>
  );
};

export default AgendaSection;