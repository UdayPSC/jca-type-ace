
import { useState, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  className?: string;
}

const Timer = ({ duration, onTimeUp, className }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use useEffect with a proper interval to ensure consistent timing
  useEffect(() => {
    if (!isRunning) return;
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    // Cleanup function to clear interval
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onTimeUp]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const percentage = (timeLeft / duration) * 100;
  const isWarning = percentage < 20;
  
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isWarning ? (
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          ) : (
            <Clock className="h-4 w-4 mr-2" />
          )}
          <span className={cn(
            "text-sm font-medium",
            isWarning && "text-amber-500"
          )}>
            Time Remaining
          </span>
        </div>
        <span className={cn(
          "text-sm font-medium",
          isWarning && "text-amber-500"
        )}>
          {formatTime(timeLeft)}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2 transition-all",
          isWarning ? "bg-amber-200" : "bg-gray-200"
        )}
      />
    </div>
  );
};

export default Timer;
