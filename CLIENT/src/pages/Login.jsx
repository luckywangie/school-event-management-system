import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import config from '../config.json';


const Login = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${config.api_url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);

        const userRes = await fetch(`${config.api_url}/auth/current_user`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
          credentials: 'include',
        });

        const user = await userRes.json();

        if (userRes.ok) {
          setCurrentUser(user.user);
          localStorage.setItem('user', JSON.stringify(user.user));
          toast.success('Login successful');
          navigate('/');
        } else {
          toast.error(user.error || 'Failed to load user data');
        }
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-8 mt-16 bg-white rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-extrabold text-sky-700 text-center mb-8 drop-shadow-sm">
        Login
      </h2>

      <form onSubmit={handleLogin} className="space-y-6">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition duration-200 shadow"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </section>
  );
};

export default Login;
