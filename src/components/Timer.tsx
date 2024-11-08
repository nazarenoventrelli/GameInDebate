import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  seconds: number;
  isActive: boolean;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ seconds: initialSeconds, isActive, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

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

  const percentage = (seconds / initialSeconds) * 100;
  const strokeDasharray = `${percentage} 100`;
  const colorClass = seconds <= 10 ? 'text-red-600' : 'text-indigo-600';

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          className={`transition-all duration-1000 ${colorClass}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <TimerIcon className={`w-4 h-4 ${colorClass}`} />
        <span className={`font-bold text-sm ${colorClass}`}>{seconds}s</span>
      </div>
    </div>
  );
};

export default Timer;