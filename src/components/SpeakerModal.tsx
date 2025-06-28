import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Speaker } from '../data/conference';

interface SpeakerModalProps {
  speaker: Speaker | null;
  isOpen: boolean;
  onClose: () => void;
}

const SpeakerModal: React.FC<SpeakerModalProps> = ({ speaker, isOpen, onClose }) => {
  if (!speaker) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              <div className="relative bg-gradient-to-r from-heroHighlight to-success p-8 text-white">
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>

                <div className="flex items-center gap-6">
                  {/* Speaker Image */}
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {speaker.image ? (
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover rounded-full border-4 border-white/20"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center rounded-full">
                        <span className="text-3xl text-white/80">👤</span>
                      </div>
                    )}
                  </motion.div>

                  <div>
                    <motion.h2
                      className="text-3xl font-bold mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {speaker.name}
                    </motion.h2>
                    <motion.p
                      className="text-xl text-white/90 font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {speaker.title}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {speaker.bio && (
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-textDark mb-3">Overview</h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {speaker.bio}
                    </p>
                  </motion.div>
                )}

                {speaker.fullBio && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-textDark mb-3">Biography</h3>
                    <div className="text-gray-700 text-base leading-relaxed space-y-4">
                      {speaker.fullBio.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {speaker.title === 'TBA' && (
                  <motion.div
                    className="bg-gradient-to-r from-ctaOrange/10 to-heroHighlight/10 rounded-xl p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-4xl mb-3">🎉</div>
                    <h3 className="text-lg font-semibold text-heroHighlight mb-2">
                      Exciting Announcement Coming Soon!
                    </h3>
                    <p className="text-gray-600">
                      We're working on bringing you another amazing speaker. Stay tuned for updates!
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
                <motion.button
                  onClick={onClose}
                  className="w-full bg-heroHighlight hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SpeakerModal;