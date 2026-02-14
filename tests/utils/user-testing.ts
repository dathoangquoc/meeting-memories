import { supabase, supabaseAdmin } from "./supabase-client";

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
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  // If user exists, return it
  if (signInData.user) {
    return {
      id: signInData.user.id,
      email,
      password,
    };
  }

  // If user doesn't exist, signup user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  if (!data.user) throw new Error("User creation failed");
  return {
    id: data.user.id,
    email: email,
    password: password,
  };
}

export async function cleanupTestUser(userId?: string) {
  if (!userId) return;
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw error;
}

export async function createTestNote(userId: string, title: string) {
  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: userId,
      title: title,
      content: "This note was created from testing",
    })
    .select();
  return { data, error };
}
