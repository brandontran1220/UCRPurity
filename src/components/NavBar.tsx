"use client";

import { usePathname } from "next/navigation";

const NavBar = () => {
  const currentPath = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Statistics", href: "/stats" },
    { label: "Team", href: "/board" },
  ];

  return (
    <nav className="z-10 mt-5 flex w-full items-center justify-around">
      {/* Left side: UCRPurity as a link */}
      <a
        href="/"
        className="font-Inter text-purity-black-100 text-3xl font-bold"
      >
        <span className="text-blue-600">UCR</span>Purity
      </a>

      {/* Right side: Nav links */}
      <ul className="font-Inter text-purity-black-100 relative flex space-x-9 text-xl">
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
