'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../utils/supabaseClient';

const EditWorkshopPage = ({ params }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const eventId = params.id; // Get the ID from the URL

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        const { data, error } = await supabase
          .from('workshop_events')
          .select('*, workshop_sessions(*)')
          .eq('id', eventId)
          .single(); // Fetch a single record

        if (error) {
          console.error('Error fetching event:', error);
        } else {
          setEvent(data);
        }
        setLoading(false);
      };

      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return <div className="text-center p-12">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center p-12">Workshop event not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        Edit Workshop: {event.title}
      </h1>
      {/* The full edit form will go here later */}
    </div>
  );
};

export default EditWorkshopPage;