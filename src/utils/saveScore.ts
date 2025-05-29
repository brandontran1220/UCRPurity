import { createClient } from "@/utils/supabase/client";

export const saveUserScore = async (
  userId: string,
  score: number,
): Promise<{ success: boolean; message: string }> => {
  console.log("saveUserScore called with:", { userId, score });

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const message = "Missing Supabase environment variables";
    console.error(message);
    return { success: false, message };
  }

  const supabase = createClient();
  if (!supabase) {
    const message = "Failed to create Supabase client";
    console.error(message);
    return { success: false, message };
  }

  try {
    console.log("Attempting to save score to database...");

    // First, try to check if a record exists for this user
    const { data: existingData, error: checkError } = await supabase
      .from("user_scores")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error checking existing score:", checkError);
      return {
        success: false,
        message: `Database error: ${checkError.message}`,
      };
    }

    let result;

    if (existingData) {
      // Update existing record
      console.log("Updating existing score for user:", userId);
      result = await supabase
        .from("user_scores")
        .update({
          score: score,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select();
    } else {
      // Insert new record
      console.log("Inserting new score for user:", userId);
      result = await supabase
        .from("user_scores")
        .insert({
          user_id: userId,
          score: score,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();
    }

    if (result.error) {
      console.error("Error saving user score:", result.error);
      return {
        success: false,
        message: `Database error: ${result.error.message}`,
      };
    }

    console.log("User score saved successfully:", {
      userId,
      score,
      data: result.data,
    });
    return {
      success: true,
      message: `Score ${score} saved successfully`,
    };
  } catch (error) {
    console.error("Error in saveUserScore:", error);
    return {
      success: false,
      message: `Unexpected error: ${error}`,
    };
  }
};
