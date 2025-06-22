import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const Events = () => {
  const { currentUser } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    category_id: '',
  });

  const [editEventId, setEditEventId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchEvents = () => {
    setLoading(true);
    fetch('http://localhost:5000/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events) setEvents(data.events);
      })
      .catch((err) => console.error('Failed to fetch events:', err))
      .finally(() => setLoading(false));
  };

  const fetchCategories = async () => {
    const res = await fetch('http://localhost:5000/categories');
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const fetchUserRegistrations = async () => {
    if (!currentUser || currentUser.is_admin) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/registrations/users/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const registeredIds = data.registrations.map((reg) => reg.event_id);
        const filtered = events.filter((e) => registeredIds.includes(e.id));
        setUserRegistrations(filtered);
      }
    } catch (err) {
      console.error('Error fetching user registrations:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (events.length && currentUser) {
      fetchUserRegistrations();
    }
  }, [events, currentUser]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      Time: newEvent.time,
      location: newEvent.location,
      capacity: parseInt(newEvent.capacity, 10),
      category_id: parseInt(newEvent.category_id, 10),
    };

    const res = await fetch('http://localhost:5000/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success('Event created!');
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        category_id: '',
      });
      fetchEvents();
    } else {
      toast.error(data.error || 'Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      toast.success('Event deleted');
      fetchEvents();
    } else {
      toast.error('Failed to delete event');
    }
  };

  const handleEdit = (event) => {
    setEditEventId(event.id);
    setEditData({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '',
      time: event.date ? event.date.split('T')[1]?.slice(0, 5) : '',
      location: event.location || '',
      capacity: event.capacity?.toString() || '',
      category_id: event.category_id?.toString() || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'capacity', 'category_id'];
    for (let field of requiredFields) {
      if (!editData[field] || editData[field].toString().trim() === '') {
        toast.error('All fields are required');
        return;
      }
    }

    const payload = {
      title: editData.title,
      description: editData.description,
      date: editData.date,
      Time: editData.time,
      location: editData.location,
      capacity: parseInt(editData.capacity, 10),
      category_id: parseInt(editData.category_id, 10),
    };

    try {
      const res = await fetch(`http://localhost:5000/events/${editEventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Event updated');
        setEditEventId(null);
        fetchEvents();
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-sky-700">Upcoming Events</h1>

      {currentUser?.is_admin && (
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 bg-white p-6 rounded shadow">
          {['title', 'description', 'date', 'time', 'location', 'capacity'].map((field) => (
            <input
              key={field}
              type={field === 'date' ? 'date' : field === 'time' ? 'time' : 'text'}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="border p-2 rounded"
              value={newEvent[field]}
              onChange={(e) => setNewEvent({ ...newEvent, [field]: e.target.value })}
              required
            />
          ))}

          <select
            value={newEvent.category_id}
            onChange={(e) => setNewEvent({ ...newEvent, category_id: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 transition"
          >
            Create Event
          </button>
        </form>
      )}

      {!currentUser?.is_admin && userRegistrations.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Registered Events</h2>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userRegistrations.map((event) => (
              <li key={event.id} className="p-4 border rounded-lg shadow bg-white">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
                <p className="text-sm text-gray-500">📍 {event.location}</p>
                <p className="text-sm text-gray-500">🏷️ {event.category_name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {editEventId === event.id ? (
                <form onSubmit={handleUpdate} className="space-y-2">
                  {['title', 'description', 'date', 'time', 'location', 'capacity'].map((field) => (
                    <input
                      key={field}
                      type={field === 'date' ? 'date' : field === 'time' ? 'time' : 'text'}
                      placeholder={field}
                      className="border p-2 rounded w-full"
                      value={editData[field]}
                      onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                      required
                    />
                  ))}
                  <select
                    value={editData.category_id}
                    onChange={(e) => setEditData({ ...editData, category_id: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-3 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
                    <button onClick={() => setEditEventId(null)} type="button" className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
                  <p className="text-sm text-gray-500 mb-1">{new Date(event.date).toDateString()}</p>
                  <p className="text-gray-700 mb-2">{event.description}</p>
                  <p className="text-sm text-gray-600 mb-1">📍 <span className="font-medium">{event.location}</span></p>
                  <p className="text-sm text-gray-600 mb-1">👥 Capacity: <span className="font-medium">{event.capacity}</span></p>
                  <p className="text-sm text-gray-600 mb-4">🏷️ Category: <span className="font-medium">{event.category_name || 'Uncategorized'}</span></p>

                  <Link
                    to={`/events/${event.id}`}
                    className="inline-block text-white bg-sky-600 hover:bg-sky-700 font-medium py-2 px-4 rounded transition-colors"
                  >
                    View Details
                  </Link>

                  {currentUser?.is_admin && (
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={() => handleEdit(event)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No events available.</p>
      )}
    </section>
  );
};

export default Events;
