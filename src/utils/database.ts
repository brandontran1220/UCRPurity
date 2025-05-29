import { createClient } from "@/utils/supabase/client";

export interface UserScore {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
  updated_at: string;
}

export const databaseService = {
  // Initialize user score when they first register (only if they don't have one)
  async initializeUserScore(userId: string): Promise<UserScore | null> {
    const supabase = createClient();
    if (!supabase) return null;

    // Use upsert to safely initialize score, but only update if no score exists
    const { data, error } = await supabase
      .from("user_scores")
      .upsert([{ user_id: userId, score: 100 }], {
        onConflict: "user_id",
        ignoreDuplicates: true, // Don't update if record already exists
      })
      .select()
      .single();

    if (error) {
      console.error("Error initializing user score:", error);
      return null;
    }

    console.log("Initialized new user score:", data);
    return data;
  },

  // Get user's current score
  async getUserScore(userId: string): Promise<number | null> {
    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("user_scores")
      .select("score")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user score:", error);
      return null;
    }

    return data?.score || null;
  },

  // Update user's score
  async updateUserScore(userId: string, newScore: number): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    console.log("Updating user score:", { userId, newScore });

    // First check if the user has an existing score
    const { data: existingData, error: fetchError } = await supabase
      .from("user_scores")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Error checking existing score:", fetchError);
      return false;
    }

    let result;
    if (existingData) {
      // Update existing record
      result = await supabase
        .from("user_scores")
        .update({
          score: newScore,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      // Insert new record
      result = await supabase.from("user_scores").insert([
        {
          user_id: userId,
          score: newScore,
        },
      ]);
    }

    if (result.error) {
      console.error("Error updating user score:", result.error);
      return false;
    }

    console.log("Successfully updated user score");
    return true;
  },
};
