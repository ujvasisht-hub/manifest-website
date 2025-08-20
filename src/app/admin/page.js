'use client';

import React, { useState } from 'react';

const AdminPage = () => {
  // State to hold the text form data
  const [workshopData, setWorkshopData] = useState({
    title: '',
    artist_name: '',
    // Note: date, cost, and razorpay_link are removed for now
  });
  // State to hold the selected image file
  const [imageFile, setImageFile] = useState(null);
  // State to manage loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Function to update state for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkshopData(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle the file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage('Error: Please select an image to upload.');
      return;
    }
    setLoading(true);
    setMessage('');

    // We use FormData to send both text and a file
    const formData = new FormData();
    formData.append('title', workshopData.title);
    formData.append('artist_name', workshopData.artist_name);
    formData.append('image', imageFile);
    
    const response = await fetch('/api/create-workshop', {
      method: 'POST',
      body: formData, // No headers needed, browser sets it for FormData
    });

    const result = await response.json();

    if (response.ok) {
      setMessage('Workshop Event created successfully!');
      // Reset form
      setWorkshopData({ title: '', artist_name: '' });
      setImageFile(null);
      document.getElementById('image').value = ''; // Clear file input
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Workshop Event</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Workshop Title</label>
            <input type="text" name="title" id="title" required value={workshopData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
            <input type="text" name="artist_name" id="artist_name" required value={workshopData.artist_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          {/* New Image Upload Field */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Workshop Poster</label>
            <input type="file" name="image" id="image" required onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
          </div>

          <div>
            <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-400">
              {loading ? 'Saving...' : 'Save Workshop Event'}
            </button>
          </div>
        </form>
        {message && <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default AdminPage;