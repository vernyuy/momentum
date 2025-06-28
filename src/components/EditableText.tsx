import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Save, X } from 'lucide-react';
import PinModal from './PinModal';

interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  isEditable?: boolean;
  onEditClick?: () => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  text,
  onSave,
  isEditable = false,
  onEditClick,
  className = '',
  multiline = false,
  placeholder = 'Enter text...'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    setEditText(text);
  }, [text]);

  const handleEditClick = () => {
    if (isEditable) {
      setIsEditing(true);
    } else {
      setShowPinModal(true);
    }
  };

  const handleSave = () => {
    onSave(editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (onEditClick) {
      onEditClick();
    }
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white/90 backdrop-blur-md border-2 border-heroHighlight rounded-lg p-2 resize-none min-h-[100px]`}
            placeholder={placeholder}
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white/90 backdrop-blur-md border-2 border-heroHighlight rounded-lg p-2`}
            placeholder={placeholder}
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        )}
        <div className="absolute -top-2 -right-2 flex gap-1">
          <motion.button
            onClick={handleSave}
            className="p-2 bg-success text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Save changes"
          >
            <Save size={16} />
          </motion.button>
          <motion.button
            onClick={handleCancel}
            className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Cancel"
          >
            <X size={16} />
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative group inline-block">
        {multiline ? (
          <div className={className} style={{ whiteSpace: 'pre-wrap' }}>
            {text}
          </div>
        ) : (
          <span className={className}>{text}</span>
        )}
        <motion.button
          onClick={handleEditClick}
          className={`absolute -top-2 -right-2 p-2 rounded-full transition-all duration-300 ${
            isEditable 
              ? 'bg-success text-white shadow-lg opacity-100' 
              : 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-600 hover:text-heroHighlight opacity-0 group-hover:opacity-100'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isEditable ? 'Edit text' : 'Login to edit text'}
        >
          <Edit size={16} />
        </motion.button>
      </div>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        title="Admin Access Required"
      />
    </>
  );
};

export default EditableText;