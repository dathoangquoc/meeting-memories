"use client";

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  // States
  user: User | null;
  email: string;
  password: string;
  isLoading: boolean;
  isSignedIn: boolean;
  error: string | null;

  // State operations
  setEmail: Dispatch<SetStateAction<string>>
  setPassword: Dispatch<SetStateAction<string>>

  // Auth methods
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  signUp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  // States
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check active session on mount
    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setIsLoading(false);
    };

    initAuth();

    // 2. Listen for changes (Sign in, Sign out, Token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Auth methods
  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error logging in:", error);
      setError(error.message);
    }
  };

  const googleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error logging in via Google:", error);
      setError(error.message);
    }
  };

  const signUp = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing up:", error);
      setError(error.message);
    }
  };

  const value = {
    user,
    isLoading,
    isSignedIn: !!user,
    email,
    password,
    error,
    // State operations
    setEmail,
    setPassword,
    // Auth methods
    signOut,
    signIn,
    googleSignIn,
    signUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
