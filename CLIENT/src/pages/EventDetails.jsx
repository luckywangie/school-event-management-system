import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Event not found');
        return res.json();
      })
      .then((data) => {
        setEvent(data.event);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleRegister = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to register.');
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch('http://localhost:5000/registrations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          event_id: event.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Successfully registered for this event!');
      } else {
        toast.error(data.error || 'Failed to register');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while registering');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading event...</p>;
  if (!event) return <p className="text-center mt-10 text-red-500">Event not found.</p>;

  return (
    <section className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-4xl font-extrabold text-sky-700 mb-4">{event.title}</h1>

      <p className="text-gray-600 text-sm mb-4">
        {new Date(event.date).toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
      </p>

      <p className="text-lg font-semibold text-gray-800 mb-2">
        Location: <span className="font-normal">{event.location}</span>
      </p>

      <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
        <p>Capacity: <span className="text-gray-800 font-medium">{event.capacity}</span></p>
        <p>Category: <span className="text-gray-800 font-medium">{event.category?.name || 'Uncategorized'}</span></p>
      </div>

      {!currentUser?.is_admin && (
        <button
          onClick={handleRegister}
          disabled={registering}
          className="mt-6 bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
        >
          {registering ? 'Registering...' : 'Register for this Event'}
        </button>
      )}

      {currentUser?.is_admin && (
        <Link
          to={`/events/${event.id}/participants`}
          className="inline-block mt-6 text-sm text-blue-600 font-medium hover:underline"
        >
          View Registered Participants
        </Link>
      )}
    </section>
  );
};

export default EventDetails;
