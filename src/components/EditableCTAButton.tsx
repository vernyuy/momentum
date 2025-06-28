import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import CTAEditModal, { CTAButton } from './CTAEditModal';
import PinModal from './PinModal';

interface EditableCTAButtonProps {
  button: CTAButton;
  onSave: (button: CTAButton) => void;
  isEditable?: boolean;
  onEditClick?: () => void;
  className?: string;
  onClick?: () => void;
}

const EditableCTAButton: React.FC<EditableCTAButtonProps> = ({ 
  button, 
  onSave, 
  isEditable = false,
  onEditClick,
  className = '',
  onClick
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const getButtonClasses = () => {
    const baseClasses = 'font-bold rounded-full transition-all duration-300 shadow-lg relative group';
    
    const styleClasses = {
      primary: 'bg-ctaOrange hover:bg-orange-600 text-white',
      secondary: 'bg-heroHighlight hover:bg-blue-700 text-white',
      outline: 'border-2 border-heroHighlight text-heroHighlight bg-white hover:bg-heroHighlight hover:text-white'
    };

    const sizeClasses = {
      small: 'py-2 px-4 text-sm',
      medium: 'py-3 px-6 text-base',
      large: 'py-4 px-8 text-lg sm:text-xl md:text-2xl'
    };

    return `${baseClasses} ${styleClasses[button?.style!]} ${sizeClasses[button?.size!]} ${className}`;
  };

  const handleButtonClick = () => {
    if (button.url) {
      window.open(button.url, '_blank');
    } else if (onClick) {
      onClick();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditable) {
      setShowEditModal(true);
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (onEditClick) {
      onEditClick();
    }
    setShowEditModal(true);
  };

  return (
    <>
      <motion.button
        className={getButtonClasses()}
        onClick={handleButtonClick}
        whileHover={{ 
          scale: 1.05, 
          boxShadow: button.style === 'primary' 
            ? '0 0 40px rgba(253, 126, 20, 0.6)' 
            : '0 0 40px rgba(42, 99, 255, 0.6)',
          y: -3
        }}
        whileTap={{ scale: 0.95 }}
      >
        {button?.text!}
        
        {/* Edit Button */}
        <motion.button
          onClick={handleEditClick}
          className={`absolute -top-2 -right-2 p-2 rounded-full transition-all duration-300 ${
            isEditable 
              ? 'bg-success text-white shadow-lg opacity-100' 
              : 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white/80 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isEditable ? 'Edit button' : 'Login to edit button'}
        >
          <Edit size={16} />
        </motion.button>
      </motion.button>

      {/* PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        title="Admin Access Required"
      />

      {/* CTA Edit Modal */}
      <CTAEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={onSave}
        button={button}
      />
    </>
  );
};

export default EditableCTAButton;

export type { CTAButton };