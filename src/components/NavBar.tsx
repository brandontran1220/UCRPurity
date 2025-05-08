import React from 'react';

const NavBar = () => {
  return (
    <nav className="w-full flex justify-between items-center p-4 fixed top-4 left-94">
      {/* Left side: UCRPurity */}
      <div className="text-gray-800 font-Inter font-bold text-lg">
        <span className="text-blue-600">UCR</span>Purity
      </div>

      {/* Right side: Nav links */}
      <ul className="flex space-x-8 text-gray-800 font-Inter relative right-190">
        <li>
          <a
            href="#"
            className="text-blue-600 border-b-2 border-blue-600"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#"
            className="border-b-2 border-transparent hover:text-blue-200 hover:border-blue-200"
          >
            Statistics
          </a>
        </li>
        <li>
          <a
            href="#"
            className="border-b-2 border-transparent hover:text-blue-200 hover:border-blue-200"
          >
            Team
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
