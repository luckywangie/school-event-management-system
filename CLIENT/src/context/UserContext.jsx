import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../config.json';


export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on first mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  // ✅ LOGOUT function
  const logout_user = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch(`${config.api_url}/auth/logout`, {

        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout_user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
