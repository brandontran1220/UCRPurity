"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  useEffect(() => {
    // Check for guest login first
    const guestStatus = localStorage.getItem("isGuest");
    if (guestStatus === "true") {
      setIsGuest(true);
      setUser(null); // Make sure user is null for guests
      setLoading(false);
    } else {
      // Get initial session for non-guest users
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setIsGuest(false);
          localStorage.removeItem("isGuest"); // Clear guest status if user is authenticated
        } else {
          // No authenticated user, set as guest by default
          setUser(null);
          setIsGuest(true);
          localStorage.setItem("isGuest", "true");
        }
        setLoading(false);
      });
    }

    // Listen for auth changes (for non-guest users)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          // User is authenticated, clear guest status
          localStorage.removeItem("isGuest");
          setIsGuest(false);
          setUser(session.user);
        } else {
          // User signed out or no session, set as guest
          setUser(null);
          setIsGuest(true);
          localStorage.setItem("isGuest", "true");
        }
        setLoading(false);
      },
    );

    // Listen for localStorage changes (for guest status)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isGuest") {
        const newGuestStatus = e.newValue === "true";
        setIsGuest(newGuestStatus);
        if (newGuestStatus) {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [supabase.auth]);
  const signOut = async () => {
    await supabase.auth.signOut();
    // After signing out, set user as guest by default
    setUser(null);
    setIsGuest(true);
    localStorage.setItem("isGuest", "true");
  };

  const value = {
    user,
    isGuest,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
