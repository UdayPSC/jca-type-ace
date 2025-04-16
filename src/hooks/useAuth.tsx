
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { toast } from '@/components/ui/sonner';

// Mock data for demo purposes
const mockUsers = [
  { id: '1', email: 'test@example.com', password: 'password123' },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing login in localStorage
    const savedUser = localStorage.getItem('typeace_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find the user (in a real app, this would be an API call)
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const userToSave = { id: foundUser.id, email: foundUser.email };
      localStorage.setItem('typeace_user', JSON.stringify(userToSave));
      setUser(userToSave);
      toast.success('Logged in successfully');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        toast.error(e.message);
      } else {
        setError('An unknown error occurred');
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }

      // In a real app, this would be an API call to create the user
      const newUser = { id: `${mockUsers.length + 1}`, email, password };
      mockUsers.push(newUser);

      const userToSave = { id: newUser.id, email: newUser.email };
      localStorage.setItem('typeace_user', JSON.stringify(userToSave));
      setUser(userToSave);
      toast.success('Account created successfully');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        toast.error(e.message);
      } else {
        setError('An unknown error occurred');
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('typeace_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
