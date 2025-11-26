import React from 'react';
import Image from 'next/image';

interface FooterProps {}

const LOGO_SRC = '/Logo.webp';
const LOGO_ALT = 'CredePath Logo';

const Footer: React.FC<FooterProps> = () => {
  const socialLinks = [
    'https://twitter.com',
    'https://linkedin.com',
    'https://facebook.com',
  ];

  return (
    <footer className="bg-blue-600 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-blue-500 pb-8 mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-12">
            <div className="relative w-28 h-12 flex items-center justify-center">
              <Image
                src={LOGO_SRC}
                alt={LOGO_ALT}
                fill
                className="object-contain"
                priority
              />
            </div>

            <p className="text-xl font-light text-white">
              Subheading three words
            </p>
          </div>

         <div className="flex space-x-4 mt-6 md:mt-0">
  {socialLinks.map((url, index) => (
    <a
      key={index}
      href={url}
      target="_blank"
      className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:opacity-90 transition text-blue-600 font-semibold"
    >
      {index + 1}
    </a>
  ))}
</div>

        </div>

        <div className="flex justify-center md:justify-end text-sm space-x-6 text-center">
          <a href="/privacy" className="hover:text-gray-200 transition duration-150">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-200 transition duration-150">
            Terms & Conditions
          </a>
          <a href="/sitemap" className="hover:text-gray-200 transition duration-150">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
