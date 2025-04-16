
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface TypingTest {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in seconds
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  wpm: number;
  accuracy: number;
  cpm: number;
  mistypedWords: number;
  completedAt: string;
  duration: number; // actual time taken in seconds
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
