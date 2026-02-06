import { supabase } from "./supabase-client";

export interface TestUser {
  id?: string;
  name?: string;
  email: string;
  password: string;
}

export async function getOrCreateTestUser({
  email,
  password,
}: TestUser): Promise<TestUser> {
  // Try to sign in first
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // If user exists, return user
    if (data.user) {
      console.log("✅ Test User Logged In")
      return {
        id: data.user.id,
        email: email,
        password: password,
      };
    }
  } catch (error: any) {
    console.error(error.message);
  }

  // If user doesn't exist, signup user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  if (!data.user) throw new Error("User creation failed");
  console.log("✅ Test User Signed Up")
  return {
    id: data.user.id,
    email: email,
    password: password,
  };
}

export async function cleanupTestUser(userId?: string) {
    if (!userId) return;
    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) throw error
}
