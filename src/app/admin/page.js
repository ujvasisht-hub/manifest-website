'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const StatCard = ({ title, value }) => (
  <div className="bg-gray-700 p-4 rounded-lg shadow-sm text-center">
    <p className="text-sm font-medium text-gray-400">{title}</p>
    <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
  </div>
);

const AdminPage = () => {
  // Create Form State
  const [eventData, setEventData] = useState({ title: '', artist_name: '', razorpay_link: '', is_active: true });
  const [imageFile, setImageFile] = useState(null);
  const [sessions, setSessions] = useState([{ session_title: '', date: '', time: '', cost: '' }]);

  // Dashboard View State
  const [allSessions, setAllSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination and Date Filters State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dateFilters, setDateFilters] = useState({ startDate: '', endDate: '' });

  const SESSIONS_PER_PAGE = 10;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchWorkshops = async (page = 1, filters = dateFilters) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    });

    const response = await fetch(`/api/get-workshops?${params.toString()}`);
    const { data, count } = await response.json();

    if (data) {
      setAllSessions(data);
      setFilteredSessions(data);
      setTotalCount(count || 0);
      setCurrentPage(page);
    }
  };

  // We need to fetch total stats separately so they aren't affected by filters
  const fetchTotalStats = async () => {
    // This could be a separate, simpler API endpoint in the future
    const response = await fetch('/api/get-workshops'); 
    const { data } = await response.json();
    if (data) {
      const uniqueEvents = [...new Map(data.map(item => [item.workshop_events.id, item.workshop_events])).values()];
      const total = uniqueEvents.length;
      const active = uniqueEvents.filter(w => w.is_active).length;
      setStats({ total, active, inactive: total - active });
    }
  };

  useEffect(() => {
    fetchWorkshops(1, dateFilters);
    fetchTotalStats();
  }, [dateFilters]);

  // Client-side search logic
  useEffect(() => {
    let result = allSessions;
    if (searchTerm) {
      result = allSessions.filter(session =>
        session.workshop_events.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.workshop_events.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSessions(result);
  }, [searchTerm, allSessions]);

  const handleEventChange = (e) => {if (e.target.type === 'checkbox') {setEventData({ ...eventData, [e.target.name]: e.target.checked });} else {setEventData({ ...eventData, [e.target.name]: e.target.value });}};
  const handleFileChange = (e) => {if (e.target.files) setImageFile(e.target.files[0]);};
  const handleSessionChange = (index, e) => {const updatedSessions = sessions.map((session, i) => index === i ? { ...session, [e.target.name]: e.target.value } : session); setSessions(updatedSessions);};
  const addSession = () => {if (sessions.length < 10) {setSessions([...sessions, { session_title: '', date: '', time: '', cost: '' }]);}};
  const removeSession = (index) => {if (sessions.length > 1) {setSessions(sessions.filter((_, i) => i !== index));}};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {setMessage('Error: Please select a poster image.'); return;} setLoading(true); setMessage(''); const formData = new FormData(); formData.append('title', eventData.title); formData.append('artist_name', eventData.artist_name); formData.append('razorpay_link', eventData.razorpay_link); formData.append('is_active', eventData.is_active); formData.append('image', imageFile); formData.append('sessions', JSON.stringify(sessions)); const response = await fetch('/api/create-workshop', {method: 'POST', body: formData,}); const result = await response.json(); if (response.ok) {setMessage('Workshop Event and all Sessions created successfully!'); setEventData({ title: '', artist_name: '', razorpay_link: '', is_active: true }); setImageFile(null); setSessions([{ session_title: '', date: '', time: '', cost: '' }]); document.getElementById('image').value = ''; fetchWorkshops(); fetchTotalStats();} else {setMessage(`Error: ${result.error}`);} setLoading(false);
  };

  const handleDateFilterChange = (e) => {
    setDateFilters({ ...dateFilters, [e.target.name]: e.target.value });
  };

  const totalPages = Math.ceil(totalCount / SESSIONS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard title="Total Workshop Events" value={stats.total} />
        <StatCard title="Active Events" value={stats.active} />
        <StatCard title="Inactive Events" value={stats.inactive} />
      </div>

      <div className="mt-12">
        <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
          <h2 className="text-2xl font-bold text-white">Manage Sessions</h2>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <input type="date" name="startDate" value={dateFilters.startDate} onChange={handleDateFilterChange} className="px-4 py-2 border border-gray-300 rounded-md text-black"/>
            <input type="date" name="endDate" value={dateFilters.endDate} onChange={handleDateFilterChange} className="px-4 py-2 border border-gray-300 rounded-md mt-2 md:mt-0 text-black"/>
            <input 
              type="text" 
              placeholder="Search by title or artist..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md mt-2 md:mt-0 bg-gray-800 text-white placeholder-gray-400"
            />
          </div>
        </div>
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artist Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.workshop_events.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.workshop_events.artist_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{session.session_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.workshop_events.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {session.workshop_events.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/edit/${session.workshop_events.id}`} className="text-teal-600 hover:text-teal-900">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <button 
                onClick={() => fetchWorkshops(currentPage - 1)} 
                disabled={currentPage <= 1}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md border border-gray-600 disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-sm text-gray-300">Page {currentPage} of {totalPages}</span>
            <button 
                onClick={() => fetchWorkshops(currentPage + 1)} 
                disabled={currentPage >= totalPages}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md border border-gray-600 disabled:opacity-50"
            >
                Next
            </button>
        </div>
      </div>

      <div className="mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Create New Workshop Event</h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4 p-4 border border-gray-300 rounded-md">
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 text-black">Main Event Details</h2>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Workshop Title</label>
                <input type="text" name="title" id="title" required value={eventData.title} onChange={handleEventChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500" />
              </div>
              <div>
                <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700">Artist Name</label>
                <input type="text" name="artist_name" id="artist_name" required value={eventData.artist_name} onChange={handleEventChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500" />
              </div>
              <div>
                <label htmlFor="razorpay_link" className="block text-sm font-medium text-gray-700">Main Razorpay Link</label>
                <input type="url" name="razorpay_link" id="razorpay_link" required value={eventData.razorpay_link} onChange={handleEventChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500" placeholder="https://rzp.io/l/..."/>
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Workshop Poster</label>
                <input type="file" name="image" id="image" required onChange={handleFileChange} accept="image/png, image/jpeg" className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="is_active" id="is_active" checked={eventData.is_active} onChange={handleEventChange} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"/>
                <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-900">Set workshop as active</label>
              </div>
            </div>

            <div className="space-y-4 p-4 border border-gray-300 rounded-md">
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 text-black">Workshop Sessions</h2>
              {sessions.map((session, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md space-y-3 relative">
                  <h3 className="font-medium text-gray-600">Session {index + 1}</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Session Title</label>
                    <input type="text" name="session_title" required value={session.session_title} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500" placeholder="e.g., 11am - 12pm Slot"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <input type="text" name="date" required value={session.date} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500" placeholder="e.g., Saturday, 25 Oct 2025"/>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <input type="text" name="time" required value={session.time} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500" placeholder="e.g., 11:00 AM - 12:00 PM"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cost</label>
                    <input type="text" name="cost" required value={session.cost} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500" placeholder="e.g., ₹1500"/>
                  </div>
                  {sessions.length > 1 && (<button type="button" onClick={() => removeSession(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>)}
                </div>
              ))}
              {sessions.length < 10 && (<button type="button" onClick={addSession} className="w-full text-teal-600 font-semibold py-2 px-4 rounded-md border-2 border-dashed border-teal-500 hover:bg-teal-50">+ Add Another Session</button>)}
            </div>
            <div><button type="submit" disabled={loading} className="w-full bg-teal-600 text-white font-medium py-3 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-400">{loading ? 'Saving...' : 'Save Full Workshop'}</button></div>
          </form>
          {message && <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;