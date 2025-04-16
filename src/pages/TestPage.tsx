
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTests } from '@/hooks/useTests';
import Navbar from '@/components/Layout/Navbar';
import Timer from '@/components/TypingTest/Timer';
import TypingArea from '@/components/TypingTest/TypingArea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { AlertTriangle, Save, ChevronLeft, CheckCircle2 } from 'lucide-react';

const TestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { getTestById, saveAttempt } = useTests();
  
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState<{
    wpm: number;
    accuracy: number;
    cpm: number;
    mistypedWords: number;
    duration: number;
  } | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const test = id ? getTestById(id) : null;
  
  useEffect(() => {
    if (test) {
      document.title = `${test.title} | TypingKaro`;
    }
  }, [test]);
  
  // Start timer when component mounts
  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, [startTime]);
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  if (!test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Test Not Found</h1>
          <p className="text-gray-600 mb-6">The test you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const handleProgress = (progressValue: number, correct: number, errorCount: number) => {
    setProgress(progressValue);
    setCorrectChars(correct);
    setErrors(errorCount);
  };
  
  const calculateResults = (typed: string) => {
    if (!startTime) return;
    
    const endTime = new Date();
    const timeElapsedInMinutes = (endTime.getTime() - startTime.getTime()) / 60000;
    
    // Words per minute calculation (assuming average word length of 5 characters)
    const wordCount = test.content.split(/\s+/).length;
    const wpm = Math.round(wordCount * (progress) / timeElapsedInMinutes);
    
    // Accuracy calculation
    const accuracy = (correctChars / (correctChars + errors)) * 100;
    
    // Characters per minute
    const cpm = Math.round(correctChars / timeElapsedInMinutes);
    
    // Mistyped words (approximation based on error count)
    const mistypedWords = Math.ceil(errors / 5);
    
    const duration = Math.round(timeElapsedInMinutes * 60);
    
    setResults({
      wpm,
      accuracy,
      cpm,
      mistypedWords,
      duration
    });
  };
  
  const handleComplete = (typed: string) => {
    setTestCompleted(true);
    calculateResults(typed);
    toast.success('Test completed! Your results are ready.');
  };
  
  const handleTimeUp = () => {
    setTestCompleted(true);
    calculateResults(test.content.substring(0, correctChars + errors));
    toast.info('Time\'s up! Your results have been calculated.');
  };
  
  const handleSaveResults = async () => {
    if (!results || !id) return;
    
    await saveAttempt(id, {
      ...results,
      testId: id
    });
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="mb-4 p-0 h-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Back to Dashboard</span>
            </Button>
            <h1 className="text-2xl font-bold">{test.title}</h1>
            <div className="flex items-center mt-1 space-x-2">
              <Badge>{test.category}</Badge>
              <Badge variant="outline" className="capitalize">{test.difficulty}</Badge>
            </div>
          </div>
          
          {!testCompleted && (
            <div className="mt-4 md:mt-0 w-full md:w-1/3">
              <Timer 
                duration={test.duration} 
                onTimeUp={handleTimeUp} 
              />
            </div>
          )}
        </div>

        {testCompleted && results ? (
          <div className="border rounded-lg p-6 bg-white mb-8">
            <div className="flex items-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold">Test Results</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-typeace-lightPurple p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Typing Speed</h3>
                <p className="text-2xl font-bold text-typeace-purple">{results.wpm} WPM</p>
              </div>
              
              <div className="bg-typeace-lightPurple p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Accuracy</h3>
                <p className="text-2xl font-bold text-typeace-purple">{results.accuracy.toFixed(1)}%</p>
              </div>
              
              <div className="bg-typeace-lightPurple p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Characters/Min</h3>
                <p className="text-2xl font-bold text-typeace-purple">{results.cpm} CPM</p>
              </div>
              
              <div className="bg-typeace-lightPurple p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Mistyped Words</h3>
                <p className="text-2xl font-bold text-typeace-purple">{results.mistypedWords}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleSaveResults}
              className="bg-typeace-purple hover:bg-typeace-darkPurple"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Results
            </Button>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 gap-8">
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-lg font-medium mb-4">Sample Text</h2>
            <div className="sample-text bg-gray-50 border">
              {test.content}
            </div>
          </div>
          
          <div className="border rounded-lg p-6 bg-white">
            <TypingArea
              targetText={test.content}
              onProgress={handleProgress}
              onComplete={handleComplete}
              testCompleted={testCompleted}
            />
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-gray-50">
        <div className="container text-center text-gray-500 text-sm">
          © 2023 JCA Type-Ace. Designed for SCI JCA exam candidates.
        </div>
      </footer>
    </div>
  );
};

export default TestPage;
