
import { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    if (!isRunning) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      setIsRunning(false);
      return;
    }
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft, isRunning, onTimeUp]);
  
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
        indicatorClassName={isWarning ? "bg-amber-500" : "bg-typeace-purple"}
      />
    </div>
  );
};

export default Timer;
