"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // for "hamburger icon"

const NavBar = () => {
  const currentPath = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Statistics", href: "/stats" },
    { label: "Team", href: "/board" },
  ];

  return (
    <nav className="z-10 w-full">
      {/* Top bar */}
      <div className="bg-purity-blue-200 flex items-center justify-between px-8 py-4 md:bg-transparent">
        {/* only show logo on desktop */}
        <a
          href="/"
          className="font-Inter text-purity-black-100 hidden text-3xl font-bold md:block"
        >
          <span className="text-purity-blue-200">UCR</span>Purity
        </a>

        {/* desktop nav */}
        <ul className="font-Inter hidden space-x-9 text-xl md:flex">
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
        </ul>

        {/* mobile hamburger icon */}
        <button
          className="text-3xl text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* mobile dropdown nav */}
      {menuOpen && (
        <div className="font-Inter text-purity-blue-200 mt-4 flex flex-col items-center space-y-4 text-center text-xl font-semibold md:hidden">
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
        </div>
      )}
    </nav>
  );
};

export default NavBar;
