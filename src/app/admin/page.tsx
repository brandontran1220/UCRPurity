"use client";

import { useAuth } from "@/contexts/AuthContext";
import { saveUserScore } from "@/utils/saveScore";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

const AdminPage = () => {
  const { user, isGuest, loading } = useAuth();
  const [testScore, setTestScore] = useState(75);
  const [saveResult, setSaveResult] = useState<string>("");
  const [dbTestResult, setDbTestResult] = useState<string>("");
  const [allScores, setAllScores] = useState<
    Array<{
      id: number;
      user_id: string;
      score: number;
      created_at: string;
      updated_at: string;
      user?: { email: string };
    }>
  >([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  // List of authorized admin emails (you can modify this)
  const adminEmails = ["brandontran1220@gmail.com", "btran159@ucr.edu"];

  useEffect(() => {
    if (user && !loading) {
      setIsAuthorized(adminEmails.includes(user.email || ""));
    }
  }, [user, loading]);
  const testDatabaseConnection = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const supabase = createClient();

      // Test 1: Try to query the user_scores table structure
      const { error } = await supabase.from("user_scores").select("*").limit(0); // Just get the structure, no data

      if (error) {
        // If table doesn't exist, we'll get a specific error
        if (error.message.includes('relation "user_scores" does not exist')) {
          return {
            success: false,
            message:
              'Table "user_scores" does not exist. Please run the setup_database.sql script in your Supabase SQL Editor.',
          };
        }
        return {
          success: false,
          message: `Database error: ${error.message}`,
        };
      }

      // Test 2: Try to get a count of records (this tests basic SELECT permissions)
      const { count, error: countError } = await supabase
        .from("user_scores")
        .select("*", { count: "exact", head: true });

      if (countError) {
        return {
          success: false,
          message: `Permission error: ${countError.message}. Check RLS policies.`,
        };
      }

      return {
        success: true,
        message: `Database connection successful! Table exists with ${count || 0} records.`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection error: ${error}`,
      };
    }
  };

  const handleDatabaseTest = async () => {
    setDbTestResult("⏳ Testing database connection...");
    const result = await testDatabaseConnection();
    setDbTestResult(
      result.success ? `✅ ${result.message}` : `❌ ${result.message}`,
    );
  };

  const handleTestSave = async () => {
    if (!user || isGuest) {
      setSaveResult("❌ No authenticated user - please sign in first");
      return;
    }

    setSaveResult("⏳ Saving...");

    try {
      const result = await saveUserScore(user.id, testScore);
      setSaveResult(
        result.success ? `✅ ${result.message}` : `❌ ${result.message}`,
      );
    } catch (error) {
      setSaveResult(`❌ Error: ${error}`);
    }
  };
  const loadAllScores = async () => {
    if (!isAuthorized) return;

    try {
      const supabase = createClient();

      // First, get all scores
      const { data: scoresData, error: scoresError } = await supabase
        .from("user_scores")
        .select("*")
        .order("score", { ascending: false });

      if (scoresError) {
        console.error("Error loading scores:", scoresError);
        return;
      }

      // Then get user details for each score
      const scoresWithUsers = await Promise.all(
        (scoresData || []).map(async (score) => {
          const { data: userData } = await supabase.auth.admin.getUserById(
            score.user_id,
          );
          return {
            ...score,
            user: userData.user ? { email: userData.user.email } : null,
          };
        }),
      );

      setAllScores(scoresWithUsers);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || isGuest) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Access Denied
          </h1>
          <p>Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Unauthorized</h1>
          <p>You don't have permission to access this admin page.</p>
          <p className="mt-2 text-sm text-gray-600">
            Signed in as: {user.email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Admin Dashboard</h1>

      {/* Auth Status */}
      <div className="mb-6 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Authentication Status</h2>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>User ID:</strong>{" "}
            {user ? `${user.id.slice(0, 8)}...` : "None"}
          </p>
          <p>
            <strong>Role:</strong> Admin ✅
          </p>
        </div>
      </div>

      {/* Environment Variables Check */}
      <div className="mb-6 rounded-lg bg-yellow-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Environment Variables</h2>
        <div className="space-y-2">
          <p>
            <strong>SUPABASE_URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
          </p>
          <p>
            <strong>SUPABASE_ANON_KEY:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? "✅ Set"
              : "❌ Missing"}
          </p>
          {process.env.NEXT_PUBLIC_SUPABASE_URL && (
            <p>
              <strong>URL Preview:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 30)}...
            </p>
          )}
        </div>
      </div>

      {/* Database Connection Test */}
      <div className="mb-6 rounded-lg bg-green-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Database Connection Test</h2>
        <div className="space-y-4">
          <button
            onClick={handleDatabaseTest}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Test Database Connection
          </button>
          {dbTestResult && (
            <div className="rounded-md border border-green-200 bg-white p-3">
              <p className="font-mono text-sm">{dbTestResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* Score Test */}
      <div className="mb-6 rounded-lg bg-blue-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Score Saving Test</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Test Score:
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={testScore}
              onChange={(e) => setTestScore(parseInt(e.target.value) || 0)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            onClick={handleTestSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Test Save Score
          </button>
          {saveResult && (
            <div className="rounded-md border border-blue-200 bg-white p-3">
              <p className="font-mono text-sm">{saveResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* All Scores View */}
      <div className="rounded-lg bg-purple-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">All User Scores</h2>
        <div className="space-y-4">
          <button
            onClick={loadAllScores}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Load All Scores
          </button>
          {allScores.length > 0 && (
            <div className="overflow-hidden rounded-md border border-purple-200 bg-white">
              <table className="w-full">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Created</th>
                    <th className="px-4 py-2 text-left">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {allScores.map((score, index) => (
                    <tr
                      key={score.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2">
                        {score.user?.email || "Unknown"}
                      </td>
                      <td className="px-4 py-2 font-semibold">{score.score}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(score.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(score.updated_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
