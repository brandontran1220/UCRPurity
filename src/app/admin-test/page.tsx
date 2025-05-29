"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface UserScoreData {
  score: number;
  updated_at: string;
  user_email: string;
  user_id: string;
}

const AdminTestPage = () => {
  const [scores, setScores] = useState<UserScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllScores();
  }, []);

  const fetchAllScores = async () => {
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase client not available");
      setLoading(false);
      return;
    }

    try {
      // Note: This requires admin access or proper RLS policies
      const { data, error } = await supabase
        .from("user_scores")
        .select(
          `
          score,
          updated_at,
          user_id
        `,
        )
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Get user emails (this might not work due to RLS on auth.users)
      const scoresWithEmails: UserScoreData[] = [];
      for (const score of data || []) {
        scoresWithEmails.push({
          ...score,
          user_email: `User ${score.user_id.slice(0, 8)}...`, // Shortened ID for privacy
        });
      }

      setScores(scoresWithEmails);
    } catch (error) {
      console.error("Error fetching scores:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch scores",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">User Scores (Test Page)</h1>
        <p>Loading scores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">User Scores (Test Page)</h1>
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">Error: {error}</p>
          <p className="mt-2 text-sm text-red-500">
            Note: You might not have permission to view all scores. Use the
            Supabase Dashboard instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">User Scores (Test Page)</h1>

      <div className="mb-6 rounded border border-blue-200 bg-blue-50 p-4">
        <p className="text-blue-800">
          <strong>Note:</strong> This is a test page. For production, use the
          Supabase Dashboard to view user scores.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {scores.length > 0 ? (
              scores.map((score, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {score.user_email}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {score.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {new Date(score.updated_at).toLocaleDateString()}{" "}
                    {new Date(score.updated_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No scores found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>
          <strong>Total users with scores:</strong> {scores.length}
        </p>
        {scores.length > 0 && (
          <p>
            <strong>Average score:</strong>{" "}
            {(
              scores.reduce((sum, s) => sum + s.score, 0) / scores.length
            ).toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminTestPage;
