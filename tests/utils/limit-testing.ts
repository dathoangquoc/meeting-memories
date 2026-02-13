import { supabaseAdmin } from "./supabase-client";

export const NOTE_LIMITS = {
  FREE: 10,
  PREMIUM: 100,
};

export async function setUserSubscription(
  userId: string,
  tier: "free" | "premium",
) {
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_plan: tier,
    })
    .eq("user_id", userId);

  if (error) throw error;
}

export async function setNotesCreatedCount(userId: string, count: number) {
    const yearMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    
    const { error } = await supabaseAdmin
    .from('usage_tracking')
    .upsert({
        user_id: userId,
        year_month: yearMonth,
        notes_created: count
    }, {
        onConflict: "user_id,year_month"
    })

    if (error) throw error
}
