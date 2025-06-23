import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import config from '../config.json';


const Categories = () => {
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${config.api_url}/categories/`);
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${config.api_url}/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Category added!');
        setNewCategory({ name: '', description: '' });
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to create category');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${config.api_url}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  const handleEdit = (category) => {
    setEditCategoryId(category.id);
    setEditData({ name: category.name, description: category.description });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${config.api_url}/categories/${editCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Category updated');
        setEditCategoryId(null);
        fetchCategories();
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-center text-sky-700">
        Event Categories
      </h2>

      {/* Admin-only category creation form */}
      {currentUser?.is_admin && (
        <form onSubmit={handleCreate} className="space-y-4 mb-10">
          <input
            type="text"
            placeholder="Category Name"
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <textarea
            placeholder="Category Description"
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition duration-200"
          >
            Create Category
          </button>
        </form>
      )}

      {/* Rendered category list for all users */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="border rounded-lg p-5 bg-sky-50 shadow hover:shadow-md transition duration-200"
            >
              {editCategoryId === cat.id && currentUser?.is_admin ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 transition"
                      onClick={() => setEditCategoryId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-sky-800">{cat.name}</h3>
                  <p className="text-gray-700 mt-1 text-sm">{cat.description}</p>
                  {currentUser?.is_admin && (
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No categories found.</p>
        )}
      </div>
    </section>
  );
};

export default Categories;
