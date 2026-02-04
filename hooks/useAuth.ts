import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useAuth() {
    const supabase = createClient();
    
    // States
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auth methods
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setIsSignedIn(false);
            setEmail("");
            setPassword("");
        } catch (error: any) {
            console.error("Error signing out:", error);
            setError(error.message);
        }
    };

    const signIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
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
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
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
                options: { emailRedirectTo: `${window.location.origin}/`}
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Error signing up:", error);
            setError(error.message);
        }
    };

    const updateUserState = async () => {
        setIsLoading(true);
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            setUser(user || null);
            setIsSignedIn(!!user);
        } catch (error: any) {
            setUser(null);
            setIsSignedIn(false);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    // init auth
    useEffect(() => {
        updateUserState();

        // Subscribe to event listener on auth state changes by providing a callback func
        const { data: { subscription }} = supabase.auth.onAuthStateChange(async () => {
            await updateUserState();
        });

        // unsubcribe on clean up
        return () => subscription.unsubscribe();
    }, []);
    
    return {
        // States
        user,
        email,
        password,
        isLoading,
        isSignedIn,
        isSignUpMode,
        error,

        // Auth methods
        signOut,
        signIn,
        googleSignIn,
        signUp,
        
        // Operations
        setEmail,
        setPassword,
        setIsSignUpMode
    }
}