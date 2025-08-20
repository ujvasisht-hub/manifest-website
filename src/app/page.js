'use client' // This is important for fetching data in the browser

import React, { useState, useEffect } from 'react';
import WorkshopCard from '../components/WorkshopCard';
import { supabase } from '../utils/supabaseClient'; // We import our supabase connection

const Home = () => {
  // We use "state" to hold the workshops data. It starts as an empty list.
  const [workshops, setWorkshops] = useState([]);

  // This "useEffect" hook runs once when the page loads
  useEffect(() => {
    // This is an async function to get the data from Supabase
    const getWorkshops = async () => {
      // We use the supabase client to select all rows from our 'workshops' table
      const { data, error } = await supabase
        .from('workshop_events')
        .select('*'); // '*' means select all columns

      if (error) {
        console.error('Error fetching workshops:', error);
      } else {
        // If data is fetched successfully, we update our workshops list
        setWorkshops(data);
      }
    };

    getWorkshops(); // We call the function to start fetching
  }, []); // The empty array [] means this runs only once on load

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

      {/* Workshop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} />
        ))}
      </div>
    </div>
  );
};

export default Home;