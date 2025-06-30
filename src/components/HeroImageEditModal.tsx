import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Save, Image as ImageIcon } from 'lucide-react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getUrl, uploadData } from 'aws-amplify/storage';

const client = generateClient<Schema>();

interface HeroImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string) => void;
  currentImage: string;
}

const HeroImageEditModal: React.FC<HeroImageEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentImage
}) => {
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [imagePreview, setImagePreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [suggestedImages, setSuggestedImages] = useState<any[]>([])

  useEffect(() => {
    setImageUrl(currentImage);
    setImagePreview(currentImage);
  }, [currentImage, isOpen]);


  async function createHeroImage(data: any) {
    console.log('createHeroImage response:');
    const res = await client.models.Hero.create(data)
    console.log('createHeroImage response:', res);
  }

  async function updateHero(data: any){
    await client.models.Hero.update(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    createHeroImage({
      id: '1',
      isActive: true,
      imageUrl: imageUrl
    })
    updateHero({imageUrl: imageUrl, id: '1'})
    onSave(imageUrl);
    setIsLoading(false);
    onClose();
  };

  const handleClose = () => {
    setImageUrl(currentImage);
    setImagePreview(currentImage);
    onClose();
  };

  const handleImageUpload = async (file: File) => {
    let imageUrl = '';
    if (file) {
      const fileName = `${Date.now()}-${file?.name}`;
      const uploadResult = await uploadData({
        key: fileName,
        data: file,
      }).result;
      const { url } = await getUrl({
        key: fileName
      });
      imageUrl = `https://amplify-d2lj6r12cbff8k-ma-momentumstoragebucket569-zj8tzldtlmb3.s3.amazonaws.com/public/${uploadResult.key.replace(' ', '+')}`;
      setImagePreview(imageUrl);
      setImageUrl(imageUrl);

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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Suggested high-quality background images
  const suggestedImages = [
    {
      url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Conference Presentation',
      description: 'Professional conference setting'
    },
    {
      url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Business Networking',
      description: 'Professional networking event'
    },
    {
      url: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Modern Venue',
      description: 'Contemporary conference venue'
    },
    {
      url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Workshop Session',
      description: 'Interactive learning environment'
    },
    {
      url: 'https://images.pexels.com/photos/2774570/pexels-photo-2774570.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Keynote Speaker',
      description: 'Inspiring keynote presentation'
    },
    {
      url: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Conference Dining',
      description: 'Professional dining experience'
    }
  ];

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
                    <ImageIcon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Edit Hero Background</h2>
                    <p className="text-white/90">Change the main background image</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Current Image Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current Background Preview
                  </label>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={imagePreview}
                      alt="Hero background preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay to simulate the actual hero design */}
                    <div className="absolute inset-0 bg-gradient-to-br from-heroHighlight/85 via-purple-600/75 to-success/85" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl md:text-4xl font-bold mb-2">Momentum 2025!</h3>
                        <p className="text-sm md:text-base opacity-90">Preview with overlay</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload New Image
                  </label>

                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-4 ${isDragging
                        ? 'border-heroHighlight bg-blue-50'
                        : 'border-gray-300 hover:border-heroHighlight hover:bg-gray-50'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    <Upload className="mx-auto mb-4 text-gray-400" size={32} />
                    <p className="text-lg text-gray-600 mb-2">
                      <span className="font-medium text-heroHighlight">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB • Recommended: 1920x1080px or larger
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter image URL
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Suggested Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Suggested Professional Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {suggestedImages.length !==0 && suggestedImages.map((image, index) => (
                      <motion.div
                        key={index}
                        className={`relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${imageUrl === image?.url!
                            ? 'border-heroHighlight ring-2 ring-heroHighlight/20'
                            : 'border-gray-200 hover:border-heroHighlight/50'
                          }`}
                        onClick={() => {
                          updateHero({imageUrl:image?.url!, id: "1" })
                          setImageUrl(image?.url!);
                          setImagePreview(image?.url!);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img
                          src={image?.url!}
                          alt={image?.title!}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <p className="text-xs font-semibold">{image?.title!}</p>
                          <p className="text-xs opacity-80">{image?.description!}</p>
                        </div>
                        {imageUrl === image?.url! && (
                          <div className="absolute top-2 right-2 bg-heroHighlight text-white rounded-full p-1">
                            <Camera size={12} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📸 Image Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use high-resolution images (1920x1080px or larger)</li>
                    <li>• Choose images with good contrast for text overlay</li>
                    <li>• Professional conference or business themes work best</li>
                    <li>• Avoid images with busy centers where text appears</li>
                  </ul>
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
                    disabled={isLoading || !imageUrl}
                    className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
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
                        Save Background
                      </>
                    )}
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

export default HeroImageEditModal;