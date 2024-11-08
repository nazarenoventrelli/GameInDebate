import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface CardDisplayProps {
  text: string;
  color: string;
  bgColor: string;
  show: boolean;
  onClose: () => void;
  onResponse?: (agree: boolean) => void;
  showResponseButtons?: boolean;
  previousResponse?: boolean;
  timer?: React.ReactNode;
  onTimeUp?: () => void;
  isFromPreviousGroup?: boolean;
  mode: 'review' | 'game';
}

const CardDisplay: React.FC<CardDisplayProps> = ({ 
  text, 
  color, 
  bgColor, 
  show, 
  onClose,
  onResponse,
  showResponseButtons = true,
  previousResponse,
  timer,
  onTimeUp,
  isFromPreviousGroup,
  mode
}) => {
  if (!show) return null;

  const isReviewMode = mode === 'review';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="relative max-w-md w-full mx-4"
      >
        <div 
          className="p-8 rounded-lg shadow-xl"
          style={{ backgroundColor: bgColor }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {timer && !isReviewMode && (
            <div className="absolute top-2 left-2">
              {timer}
            </div>
          )}

          {isFromPreviousGroup && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow text-sm font-medium text-gray-600">
              Carta del grupo anterior
            </div>
          )}

          <div className={`text-2xl font-bold text-center ${isReviewMode ? 'mt-4' : 'mt-12'} mb-8`} style={{ color }}>
            {text}
          </div>

          {!isReviewMode && showResponseButtons && onResponse && (
            <>
              {previousResponse !== undefined && (
                <p className="text-center mb-4 text-gray-600">
                  El grupo anterior respondió: {previousResponse ? 'De Acuerdo' : 'En Desacuerdo'}
                </p>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => onResponse(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  De Acuerdo
                </button>
                <button
                  onClick={() => onResponse(false)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  En Desacuerdo
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CardDisplay;