import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <section className="max-w-4xl mx-auto p-6 mt-12 text-center">
      <h1 className="text-4xl font-bold mb-4 text-sky-700">
        Welcome to the School Event Management System
      </h1>

      <p className="text-gray-700 text-lg mb-8">
        A platform where students can explore, register, and manage their participation in school events —
        and where admins can organize, manage, and track participation with ease.
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <Link
          to="/events"
          className="px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          Browse Events
        </Link>

        {!currentUser && (
          <>
            <Link
              to="/login"
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}

        {currentUser && (
          <Link
            to="/profile"
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Profile
          </Link>
        )}
      </div>

      {currentUser?.is_admin && (
        <p className="mt-6 text-sm text-gray-500">
          Logged in as <strong>{currentUser.name}</strong> (Admin)
        </p>
      )}
    </section>
  );
};

export default Home;
