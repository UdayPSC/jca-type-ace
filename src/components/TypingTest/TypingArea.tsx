
import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Keyboard, ArrowRight } from 'lucide-react';

interface TypingAreaProps {
  targetText: string;
  onProgress: (progress: number, correct: number, errors: number) => void;
  onComplete: (typed: string) => void;
  testCompleted: boolean;
}

const TypingArea = ({ targetText, onProgress, onComplete, testCompleted }: TypingAreaProps) => {
  const [typedText, setTypedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Focus the textarea when the component mounts
    if (textareaRef.current && !testCompleted) {
      textareaRef.current.focus();
    }
  }, [testCompleted]);
  
  useEffect(() => {
    // Calculate progress metrics
    const typed = typedText.slice(0, targetText.length);
    const progress = Math.min(typed.length / targetText.length, 1);
    
    // Count correct characters and errors
    let correctChars = 0;
    let errors = 0;
    
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === targetText[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }
    
    onProgress(progress, correctChars, errors);
    
    // Check if typing is complete
    if (typed.length === targetText.length) {
      onComplete(typed);
    }
    
    setCursorPosition(typed.length);
  }, [typedText, targetText, onProgress, onComplete]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (testCompleted) return;
    
    // Only allow typing up to the target text length
    if (e.target.value.length <= targetText.length) {
      setTypedText(e.target.value);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center mb-2">
        <Keyboard className="h-5 w-5 mr-2 text-typeace-purple" />
        <h3 className="font-medium">Type here:</h3>
      </div>
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={typedText}
          onChange={handleChange}
          placeholder="Start typing here..."
          disabled={testCompleted}
          className="typing-area h-56 bg-white border-typeace-purple focus:ring-typeace-purple font-mono"
        />
        
        {!typedText.length && !testCompleted && (
          <div className="absolute top-4 left-4 flex items-center text-muted-foreground opacity-70">
            <ArrowRight className="h-4 w-4 mr-2" />
            <span className="text-sm">Begin typing to start the test</span>
          </div>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground">
        {Math.round((typedText.length / targetText.length) * 100)}% complete
      </div>
    </div>
  );
};

export default TypingArea;
