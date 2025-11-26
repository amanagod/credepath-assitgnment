// components/Header.tsx

import React from 'react';
import Image from 'next/image'; // Import the Image component from Next.js
import { UserCircleIcon } from '@heroicons/react/24/solid';

// Define the props interface
interface HeaderProps {}

// IMPORTANT: Replace '/path/to/your/logo.png' with the actual path 
// to your logo image file (e.g., '/credepath-logo.png' if it's in the public folder).
const LOGO_SRC = '/Logo.webp'; 
const LOGO_ALT = 'CredePath Logo';

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Navigation Links */}
          <div className="flex items-center">
            
            {/* Logo Section (CredePath) */}
            <div className="flex items-center space-x-2">
              <div className="relative w-40 h-40"> 
                <Image
                  src={LOGO_SRC}
                  alt={LOGO_ALT}
                  fill // Stretches the image to fill the parent div (w-8 h-8)
                  className="object-contain" // Ensures the image fits without cropping
                  priority // Good for LCP element like a logo
                />
              </div>
              {/* <span className="text-xl font-semibold text-gray-800">CredePath</span> */}
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex ml-10 space-x-8">
              <a 
                href="#" 
                className="text-blue-600 font-medium hover:text-blue-700 transition duration-150 ease-in-out"
                aria-current="page"
              >
                Jobs
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
              >
                Hiring Partners
              </a>
            </nav>
          </div>

          {/* User Profile Icon */}
          <div className="flex items-center">
            {/* Blue profile icon representing the user */}
            <UserCircleIcon className="h-8 w-8 text-blue-600 cursor-pointer hover:text-blue-700 transition duration-150 ease-in-out" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;