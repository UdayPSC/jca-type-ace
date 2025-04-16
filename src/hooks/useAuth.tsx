
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      
      if (data.session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.session.user.id)
          .single();
        
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: profileData?.name || undefined
        });
      }
      
      setIsLoading(false);
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // User is logged in
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profileData?.name || undefined
          });
        } else {
          // User is logged out
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    checkSession();
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Logged in successfully');
        return true;
      }
      return false;
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        throw error;
      }

      if (data.user) {
        // Update profile with name if provided
        if (name) {
          await supabase
            .from('profiles')
            .update({ name })
            .eq('id', data.user.id);
        }
        
        toast.success('Account created successfully');
        return true;
      }
      return false;
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      return false;
    } else {
      toast.success('Logged out successfully');
      return true;
    }
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
