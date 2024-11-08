import React, { useState } from 'react';
import { Users, Brain, HelpCircle } from 'lucide-react';
import InstructionsModal from './InstructionsModal';

interface IntroSectionProps {
  onStart: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStart }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-lg text-indigo-700 max-w-2xl mx-auto mb-12">
        Un juego educativo para explorar y debatir diferentes perspectivas
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">4 Grupos</h3>
          <p className="text-gray-600">Compite con otros equipos</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">48 Cartas</h3>
          <p className="text-gray-600">Debate ideas y conceptos</p>
        </div>
        <button 
          onClick={() => setShowInstructions(true)}
          className="bg-white p-6 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <HelpCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Instrucciones</h3>
          <p className="text-gray-600">Aprende cómo jugar</p>
        </button>
      </div>

      <button
        onClick={onStart}
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        Comenzar Juego
      </button>

      <InstructionsModal
        show={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </div>
  );
};

export default IntroSection;