import React from 'react';
import { ArrowLeftCircle, RotateCcw, SkipForward, RefreshCcw } from 'lucide-react';

interface SpinningWheelProps {
  isSpinning: boolean;
  result: number | null;
  onSpin: () => void;
  gameStarted?: boolean;
  extraTurn?: boolean;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ 
  isSpinning, 
  result, 
  onSpin, 
  gameStarted = false,
  extraTurn = false
}) => {
  const wheelSize = 300;

  const getResultText = () => {
    if (!result) return '';
    
    if (gameStarted) {
      switch (result) {
        case 13: return 'Cambia el Sentido';
        case 14: return 'Usa una del Grupo Anterior';
        case 15: return extraTurn ? '2° Turno Extra' : '1° Turno Extra';
        case 16: return 'Pierde el Turno';
        default: return result.toString();
      }
    }
    
    return result.toString();
  };

  const getResultIcon = () => {
    if (!result || !gameStarted) return null;
    
    switch (result) {
      case 13: return <RefreshCcw className="text-indigo-600" />;
      case 14: return <ArrowLeftCircle className="text-indigo-600" />;
      case 15: return <RotateCcw className="text-indigo-600" />;
      case 16: return <SkipForward className="text-indigo-600" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-start gap-8">
      <div className="relative inline-block" style={{ width: wheelSize, height: wheelSize }}>
        <div 
          onClick={!isSpinning ? onSpin : undefined}
          className={`cursor-pointer relative rounded-full overflow-hidden ${isSpinning ? 'spinning-wheel' : ''}`}
          style={{ 
            width: wheelSize, 
            height: wheelSize,
            backgroundColor: '#f3f4f6',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                80% { transform: rotate(${360 * 15}deg); }
                95% { transform: rotate(${360 * 16}deg); }
                100% { transform: rotate(${360 * 16 + 30}deg); }
              }
              .spinning-wheel {
                animation: spin 4s cubic-bezier(0.2, 0, 0.15, 1) forwards;
              }
            `}
          </style>
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
          >
            {[...Array(6)].map((_, i) => (
              <path
                key={i}
                d="M50,50 L50,0 A50,50 0 0,1 93.3,25 z"
                fill={i % 2 ? '#4F46E5' : '#6366F1'}
                transform={`rotate(${i * 60} 50 50)`}
              />
            ))}
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="#312E81"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <span className="font-bold text-lg">GIRAR</span>
            </div>
          </div>
        </div>
        
        {!isSpinning && result && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-white rounded-lg px-4 py-2 shadow-lg border-2 border-indigo-600
                         text-xl font-bold min-w-[100px] text-center">
            <div className="flex items-center justify-center gap-2">
              {getResultIcon()}
              <span>{getResultText()}</span>
            </div>
          </div>
        )}
      </div>

      {gameStarted && (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-4">Acciones Especiales</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <RefreshCcw className="text-indigo-600" />
              </div>
              <span>Cambia el Sentido</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <ArrowLeftCircle className="text-indigo-600" />
              </div>
              <span>Usa una del Grupo Anterior</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <RotateCcw className="text-indigo-600" />
              </div>
              <span>Turno Extra</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <SkipForward className="text-indigo-600" />
              </div>
              <span>Pierde el Turno</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinningWheel;