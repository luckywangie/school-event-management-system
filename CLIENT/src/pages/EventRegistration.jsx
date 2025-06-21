import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const EventRegistration = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    // Temporarily using fake data to test UI
    setRegistrations([
      {
        id: 1,
        event: {
          title: "Science Fair",
          date: "2025-07-01",
          location: "Main Hall"
        },
        registered_at: "2025-06-15"
      }
    ]);
  }, []);

  return (
    <section className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">My Event Registrations</h2>

      {registrations.length > 0 ? (
        registrations.map((reg) => (
          <div key={reg.id} className="border rounded p-4 mb-4 bg-gray-50">
            <h3 className="text-lg font-semibold">{reg.event.title}</h3>
            <p className="text-sm text-gray-700">
              Date: {new Date(reg.event.date).toDateString()}
            </p>
            <p className="text-sm text-gray-600">Location: {reg.event.location}</p>
            <p className="text-xs text-gray-500">
              Registered at: {new Date(reg.registered_at).toDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No registrations found.</p>
      )}
    </section>
  );
};

export default EventRegistration; // ✅ THIS LINE IS REQUIRED
