'use client'; // This is required for an interactive form

import React, { useState } from 'react';

const AdminPage = () => {
  // State to hold the form data
  const [workshopData, setWorkshopData] = useState({
    title: '',
    artist_name: '',
    date: '',
    cost: '',
    razorpay_link: '',
  });
  // State to manage loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Function to update state when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkshopData(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // We will send the data to our new API endpoint
    const response = await fetch('/api/create-workshop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workshopData),
    });

    const result = await response.json();

    if (response.ok) {
      setMessage('Workshop created successfully!');
      // Reset form
      setWorkshopData({
        title: '',
        artist_name: '',
        date: '',
        cost: '',
        razorpay_link: '',
      });
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Workshop</h1>
        <p className="text-gray-600 mt-2">Fill out the details below to add a new workshop to the website.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Workshop Title</label>
            <input type="text" name="title" id="title" required value={workshopData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
            <input type="text" name="artist_name" id="artist_name" required value={workshopData.artist_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
            <input type="text" name="date" id="date" required value={workshopData.date} onChange={handleChange} placeholder="e.g., Saturday, 25 Oct 2025 - 4:00 PM" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
            <input type="text" name="cost" id="cost" required value={workshopData.cost} onChange={handleChange} placeholder="e.g., ₹1500" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label htmlFor="razorpay_link" className="block text-sm font-medium text-gray-700 mb-1">Razorpay Payment Link</label>
            <input type="url" name="razorpay_link" id="razorpay_link" required value={workshopData.razorpay_link} onChange={handleChange} placeholder="https://rzp.io/l/..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-400 transition-colors">
              {loading ? 'Saving...' : 'Save Workshop'}
            </button>
          </div>
        </form>
        {/* Message Display */}
        {message && <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default AdminPage;