import React, { useState } from 'react';
import { toast } from 'react-toastify';
import config from '../config.json';

const EventRegistration = () => {
  const [eventId, setEventId] = useState('');

  const handleRegister = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${config.api_url}/registrations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.success || 'Registered successfully!');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Network error');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register for an Event</h1>
      <input
        type="text"
        placeholder="Enter Event ID"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={handleRegister}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Register
      </button>
    </div>
  );
};

export default EventRegistration;
