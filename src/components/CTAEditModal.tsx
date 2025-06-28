import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Link, Save, Palette } from 'lucide-react';

export interface CTAButton {
  id: string;
  text: string;
  url?: string;
  style: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
}

interface CTAEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (button: CTAButton) => void;
  button: CTAButton;
}

const CTAEditModal: React.FC<CTAEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  button 
}) => {
  const [formData, setFormData] = useState<CTAButton>(button);

  useEffect(() => {
    setFormData(button);
  }, [button, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData(button);
    onClose();
  };

  const styleOptions = [
    { value: 'primary', label: 'Primary (Orange)', preview: 'bg-ctaOrange text-white' },
    { value: 'secondary', label: 'Secondary (Blue)', preview: 'bg-heroHighlight text-white' },
    { value: 'outline', label: 'Outline', preview: 'border-2 border-heroHighlight text-heroHighlight bg-white' }
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small', preview: 'py-2 px-4 text-sm' },
    { value: 'medium', label: 'Medium', preview: 'py-3 px-6 text-base' },
    { value: 'large', label: 'Large', preview: 'py-4 px-8 text-lg' }
  ];

  const getButtonClasses = (style: string, size: string) => {
    const baseClasses = 'font-bold rounded-full transition-all duration-300 shadow-lg';
    
    const styleClasses = {
      primary: 'bg-ctaOrange hover:bg-orange-600 text-white',
      secondary: 'bg-heroHighlight hover:bg-blue-700 text-white',
      outline: 'border-2 border-heroHighlight text-heroHighlight bg-white hover:bg-heroHighlight hover:text-white'
    };

    const sizeClasses = {
      small: 'py-2 px-4 text-sm',
      medium: 'py-3 px-6 text-base',
      large: 'py-4 px-8 text-lg'
    };

    return `${baseClasses} ${styleClasses[style as keyof typeof styleClasses]} ${sizeClasses[size as keyof typeof sizeClasses]}`;
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
              <div className="relative bg-gradient-to-r from-ctaOrange to-heroHighlight p-6 text-white rounded-t-2xl">
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
                    <Type size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Edit CTA Button</h2>
                    <p className="text-white/90">Customize button text, link, and appearance</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Button Text */}
                <div>
                  <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text *
                  </label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="text"
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="Enter button text"
                      required
                    />
                  </div>
                </div>

                {/* Button URL */}
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL (Optional)
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="url"
                      id="url"
                      value={formData.url || ''}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heroHighlight focus:border-transparent"
                      placeholder="https://example.com/register"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty for scroll-to-next behavior
                  </p>
                </div>

                {/* Button Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Button Style *
                  </label>
                  <div className="space-y-3">
                    {styleOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, style: option.value as CTAButton['style'] })}
                        className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                          formData.style === option.value
                            ? 'border-heroHighlight bg-heroHighlight/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <Palette size={16} className="text-gray-400" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${option.preview}`}>
                          Preview
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Button Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Button Size *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {sizeOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, size: option.value as CTAButton['size'] })}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          formData.size === option.value
                            ? 'border-heroHighlight bg-heroHighlight/10 text-heroHighlight'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-medium">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Live Preview
                  </label>
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <motion.button
                      className={getButtonClasses(formData.style, formData.size)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                    >
                      {formData.text || 'Button Text'}
                    </motion.button>
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
                    className="flex-1 bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={16} />
                    Save Button
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

export default CTAEditModal;