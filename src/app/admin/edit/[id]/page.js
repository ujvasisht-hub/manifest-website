'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabaseClient';

const EditWorkshopPage = ({ params }) => {
  const router = useRouter();
  const eventId = params.id;

  // State for the form
  const [eventData, setEventData] = useState({ title: '', artist_name: '', razorpay_link: '', is_active: true });
  const [sessions, setSessions] = useState([]);

  // State for loading and messages
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch the existing event data when the page loads
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        const { data, error } = await supabase
          .from('workshop_events')
          .select('*, workshop_sessions(*)')
          .eq('id', eventId)
          .single();

        if (error) {
          console.error('Error fetching event:', error);
          setMessage('Error: Could not load workshop data.');
        } else {
          setEventData({
            title: data.title,
            artist_name: data.artist_name,
            razorpay_link: data.razorpay_link,
            is_active: data.is_active,
          });
          setSessions(data.workshop_sessions);
        }
        setLoading(false);
      };
      fetchEvent();
    }
  }, [eventId]);

  // ... (Add the same handle... and add/remove session functions from your create form)
  const handleEventChange = (e) => {if (e.target.type === 'checkbox') {setEventData({ ...eventData, [e.target.name]: e.target.checked });} else {setEventData({ ...eventData, [e.target.name]: e.target.value });}};
  const handleSessionChange = (index, e) => {const updatedSessions = sessions.map((session, i) => index === i ? { ...session, [e.target.name]: e.target.value } : session); setSessions(updatedSessions);};
  const addSession = () => {if (sessions.length < 10) {setSessions([...sessions, { session_title: '', date: '', time: '', cost: '' }]);}};
  const removeSession = (index) => {if (sessions.length > 1) {setSessions(sessions.filter((_, i) => i !== index));}};


  // Handle the form submission to UPDATE the data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('eventId', eventId);
    formData.append('title', eventData.title);
    formData.append('artist_name', eventData.artist_name);
    formData.append('razorpay_link', eventData.razorpay_link);
    formData.append('is_active', eventData.is_active);
    formData.append('sessions', JSON.stringify(sessions));

    const response = await fetch('/api/update-workshop', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setMessage('Workshop updated successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin'); // Go back to the admin dashboard
      }, 2000);
    } else {
      const result = await response.json();
      setMessage(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  if (loading && !eventData.title) {
    return <div className="text-center p-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Workshop Event</h1>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* The Edit Form - looks just like the Create form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Event Details Section */}
          <div className="space-y-4 p-4 border rounded-md">
            <h2 className="text-lg font-semibold border-b pb-2">Main Event Details</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Workshop Title</label>
              <input type="text" name="title" id="title" required value={eventData.title} onChange={handleEventChange} className="mt-1 w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700">Artist Name</label>
              <input type="text" name="artist_name" id="artist_name" required value={eventData.artist_name} onChange={handleEventChange} className="mt-1 w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="razorpay_link" className="block text-sm font-medium text-gray-700">Main Razorpay Link</label>
              <input type="url" name="razorpay_link" id="razorpay_link" required value={eventData.razorpay_link} onChange={handleEventChange} className="mt-1 w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="is_active" id="is_active" checked={eventData.is_active} onChange={handleEventChange} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"/>
              <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-900">Set workshop as active</label>
            </div>
          </div>

          {/* Dynamic Sessions Section */}
          <div className="space-y-4 p-4 border rounded-md">
             <h2 className="text-lg font-semibold border-b pb-2">Workshop Sessions</h2>
             {sessions.map((session, index) => (
              <div key={index} className="p-3 border rounded-md space-y-3 relative">
                <h3 className="font-medium text-gray-600">Session {index + 1}</h3>
                <div><label className="text-sm font-medium text-gray-700">Session Title</label><input type="text" name="session_title" required value={session.session_title} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border rounded-md" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-gray-700">Date</label><input type="text" name="date" required value={session.date} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border rounded-md" /></div>
                  <div><label className="text-sm font-medium text-gray-700">Time</label><input type="text" name="time" required value={session.time} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border rounded-md" /></div>
                </div>
                <div><label className="text-sm font-medium text-gray-700">Cost</label><input type="text" name="cost" required value={session.cost} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border rounded-md" /></div>
                {sessions.length > 1 && (<button type="button" onClick={() => removeSession(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>)}
              </div>
             ))}
             {sessions.length < 10 && (<button type="button" onClick={addSession} className="w-full text-teal-600 font-semibold py-2 px-4 rounded-md border-2 border-dashed border-teal-500 hover:bg-teal-50">+ Add Another Session</button>)}
          </div>

          <div>
            <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-400">
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
        {message && <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default EditWorkshopPage;