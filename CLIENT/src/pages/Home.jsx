import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <section className="max-w-5xl mx-auto p-8 mt-16 text-center bg-gradient-to-br from-white via-sky-50 to-sky-100 shadow-xl rounded-xl">
      <h1 className="text-5xl font-extrabold text-sky-700 mb-6 drop-shadow-sm animate-fade-in">
        Welcome to the School Event Management System
      </h1>

      <p className="text-gray-700 text-xl mb-10 leading-relaxed max-w-3xl mx-auto">
        Discover and participate in exciting school events. Students can explore and register, while
        admins effortlessly organize and manage all activities.
      </p>

      <div className="flex justify-center gap-4 flex-wrap mb-6">
        <Link
          to="/events"
          className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition duration-200 shadow"
        >
          🎉 Browse Events
        </Link>

        {!currentUser && (
          <>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-400 transition duration-200 shadow"
            >
              🔐 Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition duration-200 shadow"
            >
              📝 Register
            </Link>
          </>
        )}

        {currentUser && (
          <Link
            to="/profile"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition duration-200 shadow"
          >
            🙍 Go to Profile
          </Link>
        )}
      </div>

      {currentUser?.is_admin && (
        <p className="text-sm text-gray-500 italic">
          Logged in as <span className="font-semibold text-sky-700">{currentUser.name}</span> (Admin)
        </p>
      )}
    </section>
  );
};

export default Home;
