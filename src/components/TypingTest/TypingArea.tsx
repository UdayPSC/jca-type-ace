import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Keyboard, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface TypingAreaProps {
  targetText: string;
  onProgress: (progress: number, correct: number, errors: number, mistypedIndexes: number[]) => void;
  onComplete: (typed: string) => void;
  testCompleted: boolean;
}

const TypingArea = ({ targetText, onProgress, onComplete, testCompleted }: TypingAreaProps) => {
  const [typedText, setTypedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mistypedIndexes, setMistypedIndexes] = useState<number[]>([]);
  
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
    const newMistypedIndexes: number[] = [];
    
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === targetText[i]) {
        correctChars++;
      } else {
        errors++;
        newMistypedIndexes.push(i);
      }
    }
    
    setMistypedIndexes(newMistypedIndexes);
    onProgress(progress, correctChars, errors, newMistypedIndexes);
    
    // Auto-complete when 100% done
    if (progress === 1 && !testCompleted) {
      onComplete(typed);
    }
    
  }, [typedText, targetText, onProgress, onComplete, testCompleted]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (testCompleted) return;
    
    // Only allow typing up to the target text length
    if (e.target.value.length <= targetText.length) {
      setTypedText(e.target.value);
    }
  };
  
  // Prevent paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast.error("Pasting is not allowed during the typing test");
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
          onPaste={handlePaste}
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
