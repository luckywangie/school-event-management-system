import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Event not found');
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading event...</p>;
  if (!event) return <p className="text-center mt-10 text-red-500">Event not found.</p>;

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-2">
        {new Date(event.date).toDateString()} at {event.Time}
      </p>
      <p className="mb-2 font-medium">
        Location: <span className="text-gray-700">{event.location}</span>
      </p>
      <p className="mb-4 text-gray-800">{event.description}</p>
      <p className="mb-4 text-sm text-gray-500">Capacity: {event.capacity}</p>
      <p className="text-sm text-gray-500">
        Category: {event.category?.name || 'Uncategorized'}
      </p>

      {/* Admin-only: View Participants link */}
      {currentUser?.is_admin && (
        <Link
          to={`/events/${event.id}/participants`}
          className="inline-block mt-6 text-blue-600 hover:underline"
        >
          View Registered Participants
        </Link>
      )}
    </section>
  );
};

export default EventDetails;
