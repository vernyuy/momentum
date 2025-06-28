/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, FileText, Save, Camera, Upload, Trash2 } from 'lucide-react';
import { Speaker } from '../data/conference';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

interface SpeakerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (speaker: Speaker, originalId?: boolean) => void;
  speaker?: Speaker;
}

const SpeakerEditModal: React.FC<SpeakerEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  speaker 
}) => {
  const [formData, setFormData] = useState<Speaker>({
    id: '',
    name: '',
    title: '',
    bio: '',
    fullBio: '',
    image: ''
  });
  
    function createSpeaker() {
      client.models.Speaker.create({ 
        name: 'Jill Glenn',
        title: 'Founder, CEO',
        bio: 'An industry leader with over 25 years of experience building and managing sleep programs across the U.S.',
        fullBio: 'Jill has been an advocate and a leader within the sleep field for more than 25 years. She has been personally involved in the development, integration, and management of hundreds of sleep centers and DME providers, helping diverse organizations launch and sustain long-term sleep apnea programs. Recognized as an expert in medical billing and regulatory compliance, Jill has helped thousands of patients access essential sleep testing, durable medical equipment (DME), and compliance support. She is the founder and CEO of Dedicated Sleep.',
        image: ''
      });
    }

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (speaker) {
      setFormData(speaker);
      setImagePreview(speaker.image || '');
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        title: '',
        bio: '',
        fullBio: '',
        image: ''
      });
      setImagePreview('');
    }
  }, [speaker, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, !speaker?.id);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      id: '',
      name: '',
      title: '',
      bio: '',
      fullBio: '',
      image: ''
    });
    setImagePreview('');
    onClose();
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {speaker ? 'Edit Speaker' : 'Add New Speaker'}
                    </h2>
                    <p className="text-white/90">Manage speaker information and photo</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Speaker Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Speaker Photo
                  </label>
                  
                  <div className="flex flex-col items-center gap-4">
                    {/* Photo Preview */}
                    <div className="relative">
                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Speaker preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          <motion.button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Remove photo"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-heroHighlight to-success flex items-center justify-center">
                          <Camera className="text-white/80" size={32} />
                        </div>
                      )}
                    </div>

                    {/* Upload Area */}
                    <div
                      className={`w-full max-w-md border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                        isDragging
                          ? 'border-heroHighlight bg-blue-50'
                          : 'border-gray-300 hover:border-heroHighlight hover:bg-gray-50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <Upload className="mx-auto mb-3 text-gray-400" size={24} />
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium text-heroHighlight">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Upload Button */}
                    <motion.button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2 px-4 py-2 bg-heroHighlight/10 text-heroHighlight rounded-lg hover:bg-heroHighlight/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Camera size={16} />
                      {imagePreview ? 'Change Photo' : 'Add Photo'}
                    </motion.button>
                  </div>
                </div>

                {/* Speaker Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter speaker name"
                      required
                    />
                  </div>
                </div>

                {/* Speaker Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title/Position *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter title or position"
                      required
                    />
                  </div>
                </div>

                {/* Short Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Short Bio
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                      placeholder="Enter a brief bio (1-2 sentences)"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Full Bio */}
                <div>
                  <label htmlFor="fullBio" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Biography
                  </label>
                  <textarea
                    id="fullBio"
                    value={formData.fullBio || ''}
                    onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                    placeholder="Enter detailed biography (separate paragraphs with line breaks)"
                    rows={6}
                  />
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
                    className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={16} />
                    {speaker ? 'Update Speaker' : 'Add Speaker'}
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

export default SpeakerEditModal;