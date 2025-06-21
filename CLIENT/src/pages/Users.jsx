import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(data);
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
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
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
        fetchUsers(); // Refresh
      } else {
        toast.error(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating user');
    }
  };

  const deactivateUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success('User deactivated');
        fetchUsers();
      } else {
        toast.error('Could not deactivate user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Users</h2>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="p-3 border">{user.id}</td>
              <td className="p-3 border">{user.name}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">
                {user.is_admin ? 'Admin' : 'Student'}
              </td>
              <td className="p-3 border space-x-2">
                <button
                  onClick={() => toggleAdmin(user.id, user.is_admin)}
                  className="text-blue-600 hover:underline"
                >
                  {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                </button>
                <button
                  onClick={() => deactivateUser(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Users;
