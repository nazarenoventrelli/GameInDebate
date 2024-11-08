import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface GameTimerProps {
  isActive: boolean;
  onTimeUp: () => void;
}

const GameTimer: React.FC<GameTimerProps> = ({ isActive, onTimeUp }) => {
  const TOTAL_SECONDS = 30 * 60; // 30 minutes
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, onTimeUp, seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const percentage = (seconds / TOTAL_SECONDS) * 100;
  const strokeDasharray = `${percentage} 100`;

  const getColorClass = () => {
    if (seconds < 300) return 'text-red-600'; // Last 5 minutes
    if (seconds < 600) return 'text-amber-600'; // Last 10 minutes
    return 'text-emerald-600';
  };

  const colorClass = getColorClass();

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          className={`transition-all duration-1000 ${colorClass}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <TimerIcon className={`w-5 h-5 ${colorClass}`} />
        <span className={`font-bold text-sm ${colorClass}`}>
          {minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default GameTimer;