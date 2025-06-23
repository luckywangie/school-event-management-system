import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  console.log("Current user context:", currentUser);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        setCurrentUser(data.user);
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  if (!currentUser || !currentUser.id) {
    return <p className="text-center mt-12 text-lg text-gray-600">Loading user data...</p>;
  }

  return (
    <section className="max-w-xl mx-auto p-8 mt-16 bg-white rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-extrabold text-sky-700 text-center mb-8 drop-shadow-sm">
        Your Profile
      </h2>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition duration-200 shadow"
        >
          Update Profile
        </button>
      </form>
    </section>
  );
};

export default Profile;
