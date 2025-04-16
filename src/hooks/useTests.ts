
import { useState, useEffect } from 'react';
import { TypingTest, TestAttempt } from '@/lib/types';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export const useTests = () => {
  const [tests, setTests] = useState<TypingTest[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all available tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('typing_tests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform to match our TypingTest interface
        const formattedTests: TypingTest[] = data.map(test => ({
          id: test.id,
          title: test.title,
          content: test.content,
          category: test.category,
          difficulty: test.difficulty as 'easy' | 'medium' | 'hard',
          duration: test.duration,
          createdAt: test.created_at
        }));
        
        setTests(formattedTests);
      } catch (error) {
        console.error('Error fetching tests:', error);
        toast.error('Failed to fetch typing tests');
      } finally {
        setLoading(false);
      }
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
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('test_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform to match our TestAttempt interface
        const formattedAttempts: TestAttempt[] = data.map(attempt => ({
          id: attempt.id,
          userId: attempt.user_id,
          testId: attempt.test_id,
          wpm: attempt.wpm,
          accuracy: attempt.accuracy,
          cpm: attempt.cpm,
          mistypedWords: attempt.mistyped_words,
          completedAt: attempt.completed_at,
          duration: attempt.duration
        }));
        
        setAttempts(formattedAttempts);
      } catch (error) {
        console.error('Error fetching attempts:', error);
        toast.error('Failed to fetch your test attempts');
      } finally {
        setLoading(false);
      }
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

    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .insert({
          test_id: testId,
          user_id: user.id,
          wpm: results.wpm,
          accuracy: results.accuracy,
          cpm: results.cpm,
          mistyped_words: results.mistypedWords,
          duration: results.duration
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Format the attempt to match our interface
      const newAttempt: TestAttempt = {
        id: data.id,
        userId: data.user_id,
        testId: data.test_id,
        wpm: data.wpm,
        accuracy: data.accuracy,
        cpm: data.cpm,
        mistypedWords: data.mistyped_words,
        completedAt: data.completed_at,
        duration: data.duration
      };
      
      setAttempts(prev => [newAttempt, ...prev]);
      toast.success('Test results saved successfully');
      return newAttempt;
    } catch (error) {
      console.error('Error saving attempt:', error);
      toast.error('Failed to save test results');
      return null;
    }
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
