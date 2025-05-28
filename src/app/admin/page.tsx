"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@supabase/supabase-js";

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Note: This requires RLS policies to be set up properly
      // For now, this will only work if you have proper admin permissions
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      setUsers(data.users);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to fetch users";
      setError(`Unable to fetch users: ${errorMessage}`);
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Simple admin check (you might want to implement proper role-based access)
  const isAdmin = user?.email === "your-admin-email@example.com"; // Change this to your admin email

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Admin Access Required
          </h1>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              User Management
            </h1>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-red-600">{error}</p>
                <p className="mt-2 text-sm text-red-500">
                  Note: To view users programmatically, you need to set up
                  proper admin permissions or use the Supabase dashboard.
                </p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Total registered users:{" "}
                <span className="font-semibold">{users.length}</span>
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Last Sign In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {user.email || "No email"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {user.app_metadata?.provider || "email"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            user.email_confirmed_at
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.email_confirmed_at ? "Confirmed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && !error && (
              <div className="py-8 text-center">
                <p className="text-gray-500">No users found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
