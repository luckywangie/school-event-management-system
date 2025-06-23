import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import config from '../config.json';


const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${config.api_url}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdmin = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${config.api_url}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_admin: !currentStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('User updated');
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating user');
    }
  };

  const toggleActive = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${config.api_url}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('User status updated');
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update user status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-sky-700">Manage Users</h2>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="p-3 border">{user.id}</td>
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.is_admin ? 'Admin' : 'Student'}</td>
                <td className="p-3 border">
                  {user.is_active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => toggleAdmin(user.id, user.is_admin)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => toggleActive(user.id, user.is_active)}
                    className={`${
                      user.is_active
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white px-3 py-1 rounded transition`}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default Users;
