import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useAuth() {
    const supabase = createClient();
    
    // States
    const [user, setUser] = useState<any>(null);
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Operations
    const updateSessionState = async (newSession: any) => {
        setSession(newSession);
        setIsSignedIn(!!newSession)  // 1st ! convert to bool then invert, 2nd ! invert again 

        if (newSession?.user) {
            setIsLoading(true);
        } else {
            setUser(null);
            setIsLoading(false);
        }
    }

    // Auth methods
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setSession(null);
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

    // init auth
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { user  } } = await supabase.auth.getUser();
                setUser(user)
                updateSessionState(session)
            } catch (error: any) {
                console.error("Error initializing auth", error);
                setError(error.message);
                await signOut()
            }
        }

        initAuth();

        // Subscribe to event listener on auth state changes by providing a callback func
        const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
            updateSessionState(session);
        })

        // unsubcribe on clean up
        return () => subscription.unsubscribe()
    }, [])
    
    return {
        // States
        user,
        session,
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