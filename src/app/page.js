'use client' 

import React, { useState, useEffect } from 'react';
import WorkshopCard from '../components/WorkshopCard';
import { supabase } from '../utils/supabaseClient';

const Home = () => {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    const getWorkshops = async () => {
      // This query now fetches events AND their related sessions
      const { data, error } = await supabase
        .from('workshop_events')
        .select('*, workshop_sessions(*)') // 👈 This is the updated line
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching workshops:', error);
      } else {
        setWorkshops(data);
      }
    };

    getWorkshops();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Upcoming Workshops
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join our creative community and explore your artistic potential through hands-on workshops led by experienced artists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} />
        ))}
      </div>
    </div>
  );
};

export default Home;