/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit, Trash2, GripVertical, Upload, Camera, Save } from 'lucide-react';

import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getUrl, uploadData } from 'aws-amplify/storage';

const client = generateClient<Schema>();
export interface CarouselImage {
  url: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (images: CarouselImage[]) => void;
  images: any[];
  type?: string;
}

const ImageCarouselEditModal: React.FC<ImageCarouselEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  images,
  type
}) => {
  const [localImages, setLocalImages] = useState<any[]>(images);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ url: '', alt: '', caption: '' });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   setLocalImages(images);
  // }, [images, isOpen]);
    useEffect(() => {
      if (type !== 'resort') {
      client.models.CarouselImage.observeQuery().subscribe({
        next: (data: any) =>{ 
          console.log('carousel data:', data.items);
          setLocalImages(data.items);
      }});
    }else{

      client.models.ResortImages.observeQuery().subscribe({
        next: (data: any) =>{ 
          console.log('resort data:', data.items);
          setLocalImages(data.items);
      }});
    }
    }, [images, isOpen]);
  async function createCarouselImage(data?: any) {
      console.log('createCarouselImage response:');
      const res = await client.models.CarouselImage.create(data);
      console.log('createCarouselImage response:', res);
    }

    async function createResortImage(data?: any) {
      const res = await client.models.ResortImages.create(data);
      console.log('createCarouselImage response:', res);
    }

    function updateCarouselImage(data: any) {
      client.models.CarouselImage.update(data);
    }
    function updateResortImage(data: any) {
      client.models.ResortImages.update(data);
    }
    function deleteCarouselImage(id: any) {
      client.models.CarouselImage.delete(id);
    }
    function deleteResortImage(id: any) {
      client.models.ResortImages.delete(id);
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localImages);
    onClose();
  };

  const handleClose = () => {
    setLocalImages(images);
    setEditingIndex(null);
    setEditForm({url: '', alt: '', caption: '' });
    onClose();
  };

  const handleAddImage = () => {
    setEditingIndex(-1);
    setEditForm({url: '', alt: '', caption: '' });
  };

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    const image = localImages[index];
    setEditForm({url: image?.url!, alt: image?.alt!, caption: image?.caption! || '' });
  };

  const handleSaveEdit = () => {
    console.log('handleSaveEdit', editForm);
    if (editingIndex === -1) {
      // Adding new image
      console.log('editForm', editForm);
        createResortImage(editForm);
      if( type === 'resort') {
        createResortImage(editForm);
      } else if( type === 'carousel'){
      createCarouselImage(editForm);
      }
      setLocalImages([...localImages, editForm]);
    } else if (editingIndex !== null) {
      // Editing existing image
      if( type === 'resort') {
        updateResortImage(editForm);
      } else if( type === 'carousel'){
      console.log('editForm', editForm);
      updateCarouselImage(editForm);
      }
      const updated = [...localImages];
      updated[editingIndex] = editForm;
      setLocalImages(updated);
    }
    setEditingIndex(null);
    setEditForm({url: '', alt: '', caption: '' });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({url: '', alt: '', caption: '' });
  };

  const handleDeleteImage = (index: number) => {
    if (type === 'resort') {
      deleteResortImage(localImages[index].id);
    } else {
      deleteCarouselImage(localImages[index].id);
    }
    setLocalImages(localImages.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (file: File) => {
    let imageUrl = '';
    if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const uploadResult = await uploadData({
          key: fileName,
          data: file,
        }).result;
        const { url } = await getUrl({
              key: fileName
            });
        // imageUrl = `https://amplify-amplifyvitereactt-momentumstoragebucket569-f2ydx7csbjip.s3.amazonaws.com/public/${uploadResult.key}`;
        setEditForm({ ...editForm, url: url.toString() });

      }
    // if (file && file.type.startsWith('image/')) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const result = e.target?.result as string;
    //     setEditForm({ ...editForm, url: result });
    //   };
    //   reader.readAsDataURL(file);
    // }
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

  // Drag and Drop for reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeaveItem = () => {
    setDragOverIndex(null);
  };

  const handleDropItem = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;
    if (draggedIndex === dropIndex) return;
    
    const newImages = [...localImages];
    const [removed] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, removed);
    
    setLocalImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
                    <Camera size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Edit Carousel Images</h2>
                    <p className="text-white/90">Manage conference photos and captions</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Add New Image Button */}
                <div className="mb-6">
                  <motion.button
                    onClick={handleAddImage}
                    className="flex items-center gap-2 px-4 py-3 bg-ctaOrange text-white rounded-lg hover:bg-orange-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus size={20} />
                    Add New Image
                  </motion.button>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {localImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className={`bg-gray-50 rounded-xl p-4 group relative ${
                        dragOverIndex === index ? 'ring-2 ring-heroHighlight bg-blue-50' : ''
                      } ${
                        draggedIndex === index ? 'opacity-50 scale-95' : ''
                      }`}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, index)}
                      onDragOver={(e: any) => handleDragOverItem(e, index)}
                      onDragLeave={handleDragLeaveItem}
                      onDrop={(e) => handleDropItem(e, index)}
                      onDragEnd={handleDragEnd}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Drag Handle */}
                      <div className="absolute top-2 left-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                        <GripVertical size={16} />
                      </div>

                      {/* Controls */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          onClick={() => handleEditImage(index)}
                          className="p-2 bg-heroHighlight text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit Image"
                        >
                          <Edit size={14} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteImage(index)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Image"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>

                      {/* Image Preview */}
                      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                        <img
                          src={image?.url!}
                          alt={image?.alt!}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Image Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{image?.alt!}</h4>
                        {image.caption && (
                          <p className="text-sm text-gray-600">{image?.caption!}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Edit Form */}
                <AnimatePresence>
                  {editingIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50 rounded-xl p-6 mb-6"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        {editingIndex === -1 ? 'Add New Image' : 'Edit Image'}
                      </h3>

                      <div className="space-y-4">
                        {/* Image URL or Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                          </label>
                          
                          {/* Upload Area */}
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 cursor-pointer mb-3 ${
                              isDragging
                                ? 'border-heroHighlight bg-blue-50'
                                : 'border-gray-300 hover:border-heroHighlight hover:bg-gray-50'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-heroHighlight">Click to upload</span> or drag and drop
                            </p>
                          </div>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />

                          <input
                            type="url"
                            value={editForm.url}
                            onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                            placeholder="Or enter image URL"
                          />

                          {/* Image Preview */}
                          {editForm.url && (
                            <div className="mt-3 aspect-[4/3] max-w-xs rounded-lg overflow-hidden">
                              <img
                                src={editForm?.url!}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {/* Alt Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Alt Text *
                          </label>
                          <input
                            type="text"
                            value={editForm?.alt!}
                            onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                            placeholder="Describe the image"
                            required
                          />
                        </div>

                        {/* Caption */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Caption (Optional)
                          </label>
                          <textarea
                            value={editForm.caption}
                            onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent resize-none"
                            placeholder="Add a caption for this image"
                            rows={2}
                          />
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <motion.button
                            type="button"
                            onClick={handleSaveEdit}
                            disabled={!editForm.url || !editForm.alt}
                            className="px-4 py-2 bg-heroHighlight hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {editingIndex === -1 ? 'Add Image' : 'Save Changes'}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tips:</strong> Drag images to reorder them. Use high-quality images (recommended: 800x600px or larger). 
                    Add descriptive captions to help visitors understand the context.
                  </p>
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
                    onClick={handleSubmit}
                    className="flex-1 bg-success hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={16} />
                    Save All Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageCarouselEditModal;
