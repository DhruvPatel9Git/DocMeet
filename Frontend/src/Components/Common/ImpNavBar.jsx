import React, { useState } from "react";
import img from "../../assets/images/image.png";
import { Link } from 'react-router-dom';

function Navbar1() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-100 shadow-lg py-3 px-5 font-['Poppins']">
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Logo Section */}
        <a href="/" className="flex items-center no-underline" style={{ textDecoration: "none" }}>
          <img
            src={img}
            alt="Logo"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full mr-2 md:mr-3 border-2 border-white"
          />
          <h3 className="text-black font-semibold tracking-wider text-sm md:text-base">
            D<span className="text-[#5D6BFF]">o</span>cM
            <span className="text-[#5D6BFF]">ee</span>t
          </h3>
        </a>

        {/* Desktop Menu - hidden on mobile, visible on md and above */}
        <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <a
            href="/features"
            className="text-gray-800 hover:text-[#5D6BFF] transition-colors duration-300 font-medium"
            style={{ textDecoration: "none" }}
          >
            HOME
          </a>
          <a
            href="/AllDoctors"
            className="text-gray-800 hover:text-[#5D6BFF] transition-colors duration-300 font-medium"
            style={{ textDecoration: "none" }}
          >
            ALL DOCTORS
          </a>
          <a
            href="/about"
            className="text-gray-800 hover:text-[#5D6BFF] transition-colors duration-300 font-medium"
            style={{ textDecoration: "none" }}
          >
            ABOUT
          </a>
          <Link
            to="/contact"
            className="text-gray-800 hover:text-[#5D6BFF] transition-colors duration-300 font-medium"
            style={{ textDecoration: "none" }}
          >
            CONTACT
          </Link>
        </div>

        {/* Button Section - Modified for responsive */}
        <div className="flex items-center">
          {/* Buttons - Hidden on small screens */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="bg-[#5D6BFF] text-white px-3 py-1 rounded-xl text-xs hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              SignUp
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-gray-300 text-black px-3 py-1 rounded-xl text-xs hover:bg-[#5D6BFF] hover:text-white transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              SignIn
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center p-2 rounded-md text-gray-700 hover:text-[#5D6BFF] focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Shown only when menu is open on mobile */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 pt-2 pb-4 border-t border-gray-200">
          <div className="flex flex-col space-y-3 px-2">
            <a
              href="/features"
              className="text-gray-800 hover:text-[#5D6BFF] transition-colors duration-300 font-medium text-center py-2"
              style={{ textDecoration: "none" }}
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </a>
            <a
              href="/AllDoctors"
              className="text-gray-800 hover:text-[#5D6BFF] transition-colors duration-300 font-medium text-center py-2"
              style={{ textDecoration: "none" }}
              onClick={() => setIsMenuOpen(false)}
            >
              ALL DOCTORS
            </a>
            <a
              href="/about"
              className="text-gray-800 hover:text-[#5D6BFF] transition-colors duration-300 font-medium text-center py-2"
              style={{ textDecoration: "none" }}
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </a>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-[#5D6BFF] transition-colors duration-300 font-medium text-center py-2"
              style={{ textDecoration: "none" }}
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </Link>
            
            {/* Mobile buttons */}
            <div className="flex justify-center space-x-4 pt-2">
              <button
                className="bg-[#5D6BFF] text-white px-4 py-1 rounded-xl text-xs hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                SignUp
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-gray-300 text-black px-4 py-1 rounded-xl text-xs hover:bg-[#5D6BFF] hover:text-white transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                SignIn
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar1;