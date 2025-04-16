
import { useState, useEffect } from 'react';
import { TypingTest, TestAttempt } from '@/lib/types';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/sonner';

// Mock data
const mockTests: TypingTest[] = [
  {
    id: '1',
    title: 'Basic SCI JCA Test - Regulations Summary',
    content: 'The Financial Conduct Authority (FCA) regulates the financial services industry in the UK. Its role includes protecting consumers, keeping the industry stable, and promoting healthy competition between financial service providers. The FCA has the power to regulate conduct related to the marketing of financial products.',
    category: 'Regulations',
    difficulty: 'easy',
    duration: 180, // 3 minutes
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Intermediate SCI JCA Test - Financial Concepts',
    content: 'Investment products can be classified according to their risk profile and expected returns. Bonds typically offer lower risk and lower returns compared to equities. Investment funds can contain a mixture of different asset classes, providing diversification benefits to investors. The correlation between assets in a portfolio is an important consideration for risk management.',
    category: 'Financial Concepts',
    difficulty: 'medium',
    duration: 300, // 5 minutes
    createdAt: '2023-02-20T14:45:00Z',
  },
  {
    id: '3',
    title: 'Advanced SCI JCA Test - Legal Documentation',
    content: 'When preparing legal documentation for financial products, it is essential to ensure compliance with all relevant regulations and guidelines. The documentation should clearly disclose all material information that could influence an investor\'s decision. Risk factors must be prominently displayed and explained in plain language that can be understood by the target investor audience. The terms and conditions must not contain unfair or misleading clauses.',
    category: 'Legal',
    difficulty: 'hard',
    duration: 600, // 10 minutes
    createdAt: '2023-03-10T09:15:00Z',
  },
];

const mockAttempts: TestAttempt[] = [];

export const useTests = () => {
  const [tests, setTests] = useState<TypingTest[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all available tests
  useEffect(() => {
    const fetchTests = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setTests(mockTests);
      setLoading(false);
    };

    fetchTests();
  }, []);

  // Fetch user attempts if logged in
  useEffect(() => {
    if (!user) {
      setAttempts([]);
      return;
    }

    const fetchAttempts = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter attempts for current user
      const userAttempts = mockAttempts.filter(a => a.userId === user.id);
      setAttempts(userAttempts);
      setLoading(false);
    };

    fetchAttempts();
  }, [user]);

  // Get a specific test by ID
  const getTestById = (id: string) => {
    return tests.find(test => test.id === id) || null;
  };

  // Save a test attempt
  const saveAttempt = async (testId: string, results: Omit<TestAttempt, 'id' | 'userId' | 'completedAt'>) => {
    if (!user) {
      toast.error('You must be logged in to save results');
      return null;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newAttempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      userId: user.id,
      testId,
      completedAt: new Date().toISOString(),
      ...results
    };

    // In a real app, this would be an API call
    mockAttempts.push(newAttempt);
    setAttempts(prev => [...prev, newAttempt]);
    
    toast.success('Test results saved successfully');
    return newAttempt;
  };

  // Get user's attempts for a specific test
  const getAttemptsForTest = (testId: string) => {
    if (!user) return [];
    return attempts.filter(a => a.testId === testId);
  };

  // Get user's best attempt for a specific test
  const getBestAttemptForTest = (testId: string) => {
    const testAttempts = getAttemptsForTest(testId);
    if (testAttempts.length === 0) return null;
    
    // Sort by WPM (highest first)
    return testAttempts.sort((a, b) => b.wpm - a.wpm)[0];
  };

  return {
    tests,
    attempts,
    loading,
    getTestById,
    saveAttempt,
    getAttemptsForTest,
    getBestAttemptForTest
  };
};
