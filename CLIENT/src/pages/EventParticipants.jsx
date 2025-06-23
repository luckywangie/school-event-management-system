import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../config.json';


const EventParticipants = () => {
  const { id } = useParams(); 
  const [participants, setParticipants] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

     const res = await fetch(`${config.api_url}/registrations/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setParticipants(data.participants || []);
        setEventTitle(data.event_title || 'Event');
      } else {
        toast.error(data.error || 'Failed to load participants');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [id]);

  return (
    <section className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Participants for: {eventTitle}
      </h2>

      {loading ? (
        <p className="text-center">Loading participants...</p>
      ) : participants.length > 0 ? (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.user.id} className="text-center">
                <td className="p-3 border">{p.user.id}</td>
                <td className="p-3 border">{p.user.name}</td>
                <td className="p-3 border">{p.user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No participants registered yet.</p>
      )}
    </section>
  );
};

export default EventParticipants;
