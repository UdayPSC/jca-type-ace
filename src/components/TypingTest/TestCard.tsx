
import { TypingTest, TestAttempt } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Keyboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestCardProps {
  test: TypingTest;
  bestAttempt?: TestAttempt | null;
}

const TestCard = ({ test, bestAttempt }: TestCardProps) => {
  const navigate = useNavigate();
  
  const difficultyColor = {
    'easy': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'hard': 'bg-red-100 text-red-800'
  }[test.difficulty];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{test.title}</CardTitle>
          <Badge className={difficultyColor}>
            {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
          </Badge>
        </div>
        <CardDescription>{test.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center mb-3">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{formatDuration(test.duration)}</span>
        </div>
        <p className="text-sm line-clamp-3">
          {test.content.substring(0, 120)}
          {test.content.length > 120 ? '...' : ''}
        </p>
        
        {bestAttempt && (
          <div className="mt-4 p-2 bg-typeace-lightPurple rounded-md">
            <p className="text-sm font-medium">Best attempt:</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm">
                {bestAttempt.wpm} WPM
              </span>
              <span className="text-sm">
                {bestAttempt.accuracy.toFixed(1)}% accuracy
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(`/test/${test.id}`)} 
          className="w-full bg-typeace-purple hover:bg-typeace-darkPurple"
        >
          <Keyboard className="mr-2 h-4 w-4" />
          Start Test
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestCard;
