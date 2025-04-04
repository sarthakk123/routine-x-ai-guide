
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from './supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session on component mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error.message);
          return;
        }
        
        if (data?.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error("User data error:", userError.message);
            return;
          }
          setUser(userData.user as User);
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    // Setup auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session) {
            const { data: userData, error } = await supabase.auth.getUser();
            if (error) {
              console.error("Auth state user data error:", error.message);
              return;
            }
            setUser(userData.user as User);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Auth state change error:", err);
        } finally {
          setLoading(false);
        }
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign up with:", { email, name });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      console.log("Sign up successful:", data);
      toast.success("Registration successful! Please verify your email.");
      navigate('/login');
    } catch (error: any) {
      console.error("Sign up exception:", error);
      toast.error(error.message || "Failed to sign up. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign in with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      toast.success("Logged in successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Sign in exception:", error);
      toast.error(error.message || "Failed to sign in. Please check your credentials or connection.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error: any) {
      console.error("Sign out exception:", error);
      toast.error(error.message || "Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
