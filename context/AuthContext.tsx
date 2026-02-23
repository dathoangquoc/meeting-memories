"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { isAuthApiError, User } from "@supabase/supabase-js";
import { Profile, Usage } from "@/types/models";


interface AuthContextType {
  // States
  user: User | null;
  profile: Profile | null;
  usage: Usage | null;
  email: string;
  password: string;
  isLoading: boolean;
  isSignedIn: boolean;
  error: string | null;

  // State operations
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  clearError: () => void;
  getUsage: () => void;

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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
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
      if (user) {
        await getProfile();
        await getUsage();
      }
      setUser(user ?? null);
      setIsLoading(false);
    };

    initAuth();

    // 2. Listen for changes (Sign in, Sign out, Token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setUsage(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const getUsage = async () => {
    try {      
      const { data: usage, error } = await supabase
      .from('usage_tracking')
      .select()
      .eq('year_month', new Date().toISOString().slice(0, 7))
      .single()
      if (error) throw error
      setUsage(usage || null)
    } catch (error: any) {
      console.error("Error getting usage: ", error.message) 
    }
  }

  const getProfile = async () => {
    try {      
      const { data: profile, error } = await supabase
      .from('profiles')
      .select()
      .single()
      if (error) throw error
      setProfile(profile || null)
    } catch (error: any) {
      console.error("Error getting usage: ", error.message) 
    }
  }

  // Auth methods
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
    } catch (error: any) {
      if (isAuthApiError(error)) {
        if (error.code === "invalid_credentials") {
          setError("Invalid credentials");
        }
      } else {
        console.error("Error logging in:", error);
        setError(error.message);
      }
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
      if (isAuthApiError(error)) {
        if (error.code === "user_already_exists") {
          setError("Account already existed");
        }
      } else {
        console.error("Error signing up:", error);
        setError(error.message);
      }
    }
  };

  const value = {
    user,
    profile,
    usage,
    isLoading,
    isSignedIn: !!user,
    email,
    password,
    error,
    // State operations
    setEmail,
    setPassword,
    clearError,
    getUsage,
    // Auth methods
    signOut,
    signIn,
    googleSignIn,
    signUp,
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
