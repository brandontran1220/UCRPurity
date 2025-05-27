"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // for "hamburger and the close icons"

const NavBar = () => {
  const currentPath = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Statistics", href: "/stats" },
    { label: "Team", href: "/board" },
  ];

  return (
    <nav className="z-10 mt-5 w-full px-8">
      <div className="flex items-center justify-between">
        <a
          href="/"
          className="font-Inter text-purity-black-100 text-3xl font-bold"
        >
          <span className="text-blue-600">UCR</span>Purity
        </a>

        {/* desktop nav */}
        <ul className="font-Inter text-purity-black-100 hidden space-x-9 text-xl md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`border-b-2 transition-all duration-200 ${
                  currentPath === item.href
                    ? "border-purity-blue-200 text-purity-blue-200"
                    : "border-transparent hover:border-blue-200 hover:text-blue-200"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* mobile "hamburger icon" */}
        <button
          className="text-3xl text-blue-600 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* mobile menu (drop down) */}
      {menuOpen && (
        <div className="bg-purity-white-100 absolute top-20 right-0 z-50 w-3/4 max-w-xs rounded-lg p-6 shadow-lg md:hidden">
          <ul className="flex flex-col space-y-4 text-right text-xl font-semibold text-blue-700">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`transition ${
                    currentPath === item.href
                      ? "text-blue-600 underline"
                      : "hover:text-blue-500"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
