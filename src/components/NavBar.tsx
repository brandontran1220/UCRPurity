import React from "react";

const NavBar = () => {
  return (

    <nav className="flex w-full items-center justify-center gap-[430px] mt-5">
      {/* Left side: UCRPurity as a link */}
      <a href="/" className="font-Inter text-lg font-bold text-gray-800">
        <span className="text-blue-600">UCR</span>Purity
      </a>

      {/* Right side: Nav links */}
      <ul className="font-Inter relative flex text-gray-800 space-x-9">
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
