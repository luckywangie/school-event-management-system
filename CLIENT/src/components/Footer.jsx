import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config.json';


const Footer = () => {
  return (
    <footer className="bg-gray-100 rounded-lg shadow-sm dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              School Events
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-800 sm:mb-0 dark:text-gray-400">
            <li>
              <Link to="/about" className="hover:underline me-4 md:me-6">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline me-4 md:me-6">
                Terms & Policies
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:underline me-4 md:me-6">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-800 sm:text-center dark:text-gray-400">
          © 2025 <span className="font-semibold">School Events</span>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
