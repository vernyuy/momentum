import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, MapPin, Smile } from 'lucide-react';
import { AgendaItem } from '../data/conference';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

interface AgendaItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: AgendaItem, originalIndex?: number, isNew?: boolean) => void;
  item?: AgendaItem;
  editIndex?: number;
  day: 'friday' | 'saturday';
}

const AgendaItemModal: React.FC<AgendaItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  item, 
  editIndex,
  day 
}) => {
    const [agendaItems, setAgendaItems] = useState<Array<Schema["Agenda"]["type"]>>([]);

  useEffect(() => {
    client.models.Agenda.observeQuery().subscribe({
      next: (data) => setAgendaItems([...data.items]),
    });
  }, []);

  async function createAgendaItem(agenda: AgendaItem) {
    console.log("Creating agenda item:", agenda); 
    const res = await client.models.Agenda.create(agenda);
    console.log("Created agenda item:", res);
  }
  async function deleteAgendaItem(agendaId: string) {
    console.log("Deleting agenda with ID:", agendaId);
    await client.models.Agenda.delete({
      id: agendaId
    });
  }
  async function updateAgendaItem(agenda: AgendaItem) {
    await client.models.Agenda.update(agenda);
  }

  const [formData, setFormData] = useState<AgendaItem>({
    time: '',
    title: '',
    speaker: '',
    type: 'session',
    emoji: '',
    timezone: 'MST'
  });

  const [selectedDate, setSelectedDate] = useState<'friday' | 'saturday'>(day);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        time: '',
        title: '',
        speaker: '',
        type: 'session',
        emoji: '',
        timezone: 'MST'
      });
    }
    setSelectedDate(day);
  }, [item, day, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    const txt =  e.nativeEvent?.submitter.childNodes[0].nodeValue
    e.preventDefault();
    const itemToSave = {
      ...formData,
      day: selectedDate
    };
    console.log('Saving item:', itemToSave);
    if (txt === 'Create Event') {
      onSave(itemToSave, editIndex, true);
      createAgendaItem(itemToSave);
    } else {
      onSave(itemToSave, editIndex, false);
      updateAgendaItem(itemToSave);
    }
    onClose();
  };

  const handleClose = () => {
    setFormData({
      time: '',
      title: '',
      speaker: '',
      type: 'session',
      emoji: '',
      timezone: 'MST'
    });
    onClose();
  };

  const eventTypes = [
    { value: 'session', label: 'Session', icon: '🎤' },
    { value: 'break', label: 'Break', icon: '☕' },
    { value: 'meal', label: 'Meal', icon: '🍽️' },
    { value: 'party', label: 'Party', icon: '🎉' }
  ];

  const timezones = ['MST', 'PST', 'EST', 'CST'];

  const commonEmojis = ['🎤', '☕', '🍽️', '🎉', '📚', '💼', '🤝', '🎯', '💡', '🏆', '🎸', '🎊'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-heroHighlight to-success p-6 text-white rounded-t-2xl">
                <motion.button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>

                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {item ? 'Edit Agenda Item' : 'Create Agenda Item'}
                    </h2>
                    <p className="text-white/90">Add or modify conference schedule</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Conference Day
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'friday' as const, label: 'Friday • September 19, 2025' },
                      { key: 'saturday' as const, label: 'Saturday • September 20, 2025' },
                    ].map((option) => (
                      <motion.button
                        key={option.key}
                        type="button"
                        onClick={() => setSelectedDate(option.key)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedDate === option.key
                            ? 'border-heroHighlight bg-heroHighlight/10 text-heroHighlight'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-sm font-medium">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Event Name */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                    placeholder="Enter event name"
                    required
                  />
                </div>

                {/* Speaker */}
                <div>
                  <label htmlFor="speaker" className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="speaker"
                      value={formData.speaker || ''}
                      onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter speaker name (optional)"
                    />
                  </div>
                </div>

                {/* Time and Timezone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="time"
                        id="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        id="timezone"
                        value={formData.timezone || 'MST'}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent appearance-none"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Event Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {eventTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value as AgendaItem['type'] })}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                          formData.type === type.value
                            ? 'border-heroHighlight bg-heroHighlight/10 text-heroHighlight'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Emoji */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Emoji (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {commonEmojis.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, emoji })}
                        className={`w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center text-xl ${
                          formData.emoji === emoji
                            ? 'border-heroHighlight bg-heroHighlight/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                  <div className="relative">
                    <Smile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.emoji || ''}
                      onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Or enter custom emoji"
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item ? 'Update Event' : 'Create Event'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AgendaItemModal;