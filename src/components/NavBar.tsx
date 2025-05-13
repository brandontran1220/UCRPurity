"use client";

import React, { useEffect, useState } from "react";

const NavBar = () => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Statistics", href: "/stats" },
    { label: "Team", href: "/board" },
  ];

  return (
    <nav className="flex w-full items-center justify-center gap-[430px] mt-5">
      {/* Left side: UCRPurity as a link */}
      <a href="/" className="font-Inter text-lg font-bold text-purity-black-100">
        <span className="text-blue-600">UCR</span>Purity
      </a>

      {/* Right side: Nav links */}
      <ul className="font-Inter relative flex text-purity-black-100 space-x-9">
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
    </nav>
  );
};

export default NavBar;
