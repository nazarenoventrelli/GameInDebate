import React from 'react';
import { X } from 'lucide-react';

interface InstructionsModalProps {
  show: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-indigo-800 mb-4">¿Cómo se juega?</h2>
        <div className="space-y-4 text-left">
          <p className="text-gray-700">
            <span className="font-semibold">Objetivo:</span> Debatir y reflexionar sobre diferentes aspectos del juego en la sociedad actual.
          </p>
          <div className="space-y-2">
            <p className="font-semibold text-gray-800">Instrucciones:</p>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>Formar 4 grupos de participantes</li>
              <li>Cada grupo debe girar la ruleta inicialmente para determinar el orden de inicio</li>
              <li>El grupo con el número más bajo comienza el juego</li>
              <li>Durante el juego, al girar la ruleta pueden ocurrir diferentes acciones:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Obtener una tarjeta para debatir y responder</li>
                  <li>Cambiar el sentido del juego</li>
                  <li>Usar una tarjeta del grupo anterior</li>
                  <li>Obtener un turno extra</li>
                  <li>Perder el turno</li>
                </ul>
              </li>
              <li>Cada grupo tiene 60 segundos para debatir y decidir si está de acuerdo o en desacuerdo con la tarjeta</li>
              <li>El juego termina cuando un grupo completa 12 tarjetas o cuando se agota el tiempo (30 minutos)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;