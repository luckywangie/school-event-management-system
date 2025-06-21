import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/events') // Update this if your API base URL is different
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error('Failed to fetch events:', err));
  }, []);

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-4 border rounded shadow hover:shadow-md">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600">{new Date(event.date).toDateString()}</p>
              <p className="mt-2">{event.description}</p>
              <p className="mt-1 text-sm text-gray-500">Location: {event.location}</p>

              <Link
                to={`/events/${event.id}`}
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No events available.</p>
        )}
      </div>
    </section>
  );
};

export default Events;
