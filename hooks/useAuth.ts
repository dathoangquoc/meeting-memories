import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function useAuth() {
    const supabase = createClient();
    
    // States
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = async (userId: string, userEmail: string) => {
        try {
            const [profileResponse, usageResponse] = await Promise.all([
                supabase.from("profiles").select("*").eq("user_id", userId).single(),
                supabase
                    .from("usage_tracking")
                    .select("notes_created")
                    .eq("user_id", userId)
                    .eq("year_month", new Date().toISOString().slice(0, 7))
                    .maybeSingle(),
            ]);
            
            if (profileResponse.error) throw profileResponse.error;

        } catch (error) {
            console.error("Error fetching user profile:", error)
            await signOut();
        } finally {
            setIsLoading(false);
        }
    };
    const updateSessionState = 0;

    // Auth methods
    const signOut = async () => {};
    const handleLogin = 0;
    const handleGoogleLogin = 0;
    const handleSignUp = 0;
    
    return {
        // States
        user,
        session,
        email,
        password,
        isLoading,
        isLoggedIn,
        isSignUpMode,
        error,

        // Auth methods
        fetchUserProfile,
        updateSessionState,
        signOut,
        handleLogin,
        handleGoogleLogin,
        handleSignUp
    }
}