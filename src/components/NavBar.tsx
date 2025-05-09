import React from "react";

const NavBar = () => {
  return (
    <nav className="fixed top-3 left-94 flex w-full items-center justify-between p-4">
      {/* Left side: UCRPurity as a link */}
      <a href="/" className="font-Inter text-lg font-bold text-gray-800">
        <span className="text-blue-600">UCR</span>Purity
      </a>

      {/* Right side: Nav links */}
      <ul className="font-Inter relative right-190 flex space-x-8 text-gray-800">
        <li>
          <a href="/" className="border-b-2 border-blue-600 text-blue-600">
            Home
          </a>
        </li>
        <li>
          <a
            href="/stats"
            className="border-b-2 border-transparent hover:border-blue-200 hover:text-blue-200"
          >
            Statistics
          </a>
        </li>
        <li>
          <a
            href="/board"
            className="border-b-2 border-transparent hover:border-blue-200 hover:text-blue-200"
          >
            Team
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
