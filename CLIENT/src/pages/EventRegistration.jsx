import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import config from '../config.json';


const handleRegister = async (eventId) => {
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

export default EventRegistration;
