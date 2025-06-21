import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);

  return (
    <nav className="bg-white border-gray-200 shadow dark:bg-gray-900">
      <div className="container flex flex-wrap items-center justify-between mx-auto px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-sky-700 dark:text-white">
          School Events
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-sky-700 dark:text-white md:p-0"
          >
            Home
          </Link>

          <Link
            to="/events"
            className="text-gray-700 hover:text-sky-700 dark:text-white md:p-0"
          >
            Events
          </Link>

          {currentUser ? (
            <>
              {currentUser.is_admin ? (
                <>
                  <Link
                    to="/users"
                    className="text-gray-700 hover:text-sky-700 dark:text-white md:p-0"
                  >
                    Users
                  </Link>
                  <Link
                    to="/categories"
                    className="text-gray-700 hover:text-sky-700 dark:text-white md:p-0"
                  >
                    Categories
                  </Link>
                </>
              ) : (
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-sky-700 dark:text-white md:p-0"
                >
                  Profile
                </Link>
              )}

              <span className="text-sm text-sky-700 font-medium ml-4">
                {currentUser.name}
              </span>

              <button
                onClick={logout_user}
                className="ml-2 text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-sky-700 dark:text-white md:p-0"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-sky-700 dark:text-white md:p-0"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
