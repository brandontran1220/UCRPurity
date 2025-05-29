"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // for "hamburger icon"

const NavBar = () => {
  const currentPath = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isGuest, signOut, loading } = useAuth();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Statistics", href: "/stats" },
    { label: "Team", href: "/board" },
  ];

  return (
    <nav className="z-10 w-full">
      {" "}
      {/* Top bar */}
      <div className="bg-purity-blue-200 flex items-center justify-between px-8 py-4 md:grid md:grid-cols-3 md:items-center md:bg-transparent">
        {/* Left: Logo (desktop only) */}
        <div className="hidden md:block">
          <a
            href="/"
            className="font-Inter text-purity-black-100 text-3xl font-bold"
          >
            <span className="text-purity-blue-200">UCR</span>Purity
          </a>
        </div>
        {/* Center: Desktop nav */}
        <ul className="font-Inter hidden space-x-9 text-xl md:flex md:justify-center">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`border-b-2 transition-all duration-200 ${
                  currentPath === item.href
                    ? "border-purity-blue-200 text-purity-blue-200"
                    : "hover:border-purity-blue-200 hover:text-purity-blue-200 border-transparent"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>{" "}
        {/* Right: Desktop auth actions */}
        <div className="hidden items-center space-x-4 md:flex md:justify-end">
          {loading ? (
            <div className="flex items-center space-x-4">
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email || "User"}
              </span>
              <button
                onClick={signOut}
                className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : isGuest ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Guest</span>
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>
        {/* mobile hamburger icon */}
        <button
          className="ml-auto text-3xl text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>{" "}
      {/* mobile dropdown nav */}
      {menuOpen && (
        <div className="font-Inter text-purity-white-100 bg-purity-blue-200 -mt-1 flex flex-col items-center space-y-6 py-6 text-center text-xl font-semibold md:hidden">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`transition ${
                currentPath === item.href
                  ? "underline"
                  : "hover:text-purity-blue-200"
              }`}
            >
              {item.label}
            </a>
          ))}
          {/* mobile auth actions */}
          <div className="flex w-full flex-col items-center space-y-4">
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-white/20"></div>
                <div className="h-8 w-16 animate-pulse rounded bg-white/20"></div>
              </div>
            ) : user ? (
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm text-white/80">
                  {user.email || "User"}
                </span>
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : isGuest ? (
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm text-white/80">Guest</span>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-purity-white-100 text-purity-blue-200 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-blue-700"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-purity-white-100 text-purity-blue-200 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
