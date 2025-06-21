import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';

const Categories = () => {
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
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
      const res = await fetch('http://localhost:5000/categories', {
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
      const res = await fetch(`http://localhost:5000/categories/${id}`, {
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
      const res = await fetch(`http://localhost:5000/categories/${editCategoryId}`, {
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
    <section className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Event Categories</h2>

      {currentUser?.is_admin && (
        <form onSubmit={handleCreate} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Category Name"
            className="w-full px-3 py-2 border rounded"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <textarea
            placeholder="Category Description"
            className="w-full px-3 py-2 border rounded"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
          >
            Create Category
          </button>
        </form>
      )}

      {categories.length > 0 ? (
        categories.map((cat) => (
          <div
            key={cat.id}
            className="border rounded p-4 mb-4 bg-gray-50 shadow-sm"
          >
            {editCategoryId === cat.id ? (
              <form onSubmit={handleUpdate} className="space-y-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-400 text-white px-4 py-1 rounded"
                    onClick={() => setEditCategoryId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{cat.name}</h3>
                <p className="text-sm text-gray-700">{cat.description}</p>
                {currentUser?.is_admin && (
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:underline"
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
        <p>No categories found.</p>
      )}
    </section>
  );
};

export default Categories;
