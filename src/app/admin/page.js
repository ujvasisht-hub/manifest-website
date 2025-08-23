'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';

const StatCard = ({ title, value }) => (
  <div className="bg-gray-700 p-4 rounded-lg shadow-sm text-center">
    <p className="text-sm font-medium text-gray-400">{title}</p>
    <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
  </div>
);

const AdminPage = () => {
  const router = useRouter();
  // New state for authentication
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // All your existing state variables
  const [eventData, setEventData] = useState({ title: '', artist_name: '', razorpay_link: '', is_active: true });
  const [imageFile, setImageFile] = useState(null);
  const [sessions, setSessions] = useState([{ session_title: '', date: '', time: '', cost: '' }]);
  const [allSessions, setAllSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dateFilters, setDateFilters] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // New Security Check Effect
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login'); // Redirect if not logged in
      } else {
        setUser(session.user);
        setAuthLoading(false); // Allow the rest of the page to load
      }
    };
    checkUser();
  }, [router]);

  const SESSIONS_PER_PAGE = 10;
  
  // All your existing functions remain the same
  const fetchWorkshops = async (page = 1, filters = dateFilters) => {const params = new URLSearchParams({page: page.toString(),...(filters.startDate && { startDate: filters.startDate }),...(filters.endDate && { endDate: filters.endDate }),});const response = await fetch(`/api/get-workshops?${params.toString()}`);const { data, count } = await response.json();if (data) {setAllSessions(data);setFilteredSessions(data);setTotalCount(count || 0);setCurrentPage(page);}};
  const fetchTotalStats = async () => {const response = await fetch('/api/get-workshops'); const { data } = await response.json();if (data) {const uniqueEvents = [...new Map(data.map(item => [item.workshop_events.id, item.workshop_events])).values()];const total = uniqueEvents.length;const active = uniqueEvents.filter(w => w.is_active).length;setStats({ total, active, inactive: total - active });}};
  
  // Modified useEffect to wait for auth check before fetching data
  useEffect(() => {
    if (!authLoading) {
      fetchWorkshops(1, dateFilters);
      fetchTotalStats();
    }
  }, [dateFilters, authLoading]);
  
  useEffect(() => {let result = allSessions;if (searchTerm) {result = allSessions.filter(session =>session.workshop_events.title.toLowerCase().includes(searchTerm.toLowerCase()) ||session.workshop_events.artist_name.toLowerCase().includes(searchTerm.toLowerCase()));}setFilteredSessions(result);}, [searchTerm, allSessions]);
  const handleEventChange = (e) => {if (e.target.type === 'checkbox') {setEventData({ ...eventData, [e.target.name]: e.target.checked });} else {setEventData({ ...eventData, [e.target.name]: e.target.value });}};
  const handleFileChange = (e) => {if (e.target.files) setImageFile(e.target.files[0]);};
  const handleSessionChange = (index, e) => {const updatedSessions = sessions.map((session, i) => index === i ? { ...session, [e.target.name]: e.target.value } : session); setSessions(updatedSessions);};
  const addSession = () => {if (sessions.length < 10) {setSessions([...sessions, { session_title: '', date: '', time: '', cost: '' }]);}};
  const removeSession = (index) => {if (sessions.length > 1) {setSessions(sessions.filter((_, i) => i !== index));}};
  const handleSubmit = async (e) => { e.preventDefault(); if (!imageFile) {setMessage('Error: Please select a poster image.'); return;} setLoading(true); setMessage(''); const formData = new FormData(); formData.append('title', eventData.title); formData.append('artist_name', eventData.artist_name); formData.append('razorpay_link', eventData.razorpay_link); formData.append('is_active', eventData.is_active); formData.append('image', imageFile); formData.append('sessions', JSON.stringify(sessions)); const response = await fetch('/api/create-workshop', {method: 'POST', body: formData,}); const result = await response.json(); if (response.ok) {setMessage('Workshop Event and all Sessions created successfully!'); setEventData({ title: '', artist_name: '', razorpay_link: '', is_active: true }); setImageFile(null); setSessions([{ session_title: '', date: '', time: '', cost: '' }]); document.getElementById('image').value = ''; fetchWorkshops(); fetchTotalStats();} else {setMessage(`Error: ${result.error}`);} setLoading(false); };
  const handleDateFilterChange = (e) => { setDateFilters({ ...dateFilters, [e.target.name]: e.target.value }); };
  const totalPages = Math.ceil(totalCount / SESSIONS_PER_PAGE);

  // New Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  // Show loading screen while checking auth
  if (authLoading) {
    return <div className="text-center p-12 text-white">Verifying access...</div>;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
      
      {/* The rest of your admin page JSX remains exactly the same */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3"><StatCard title="Total Workshop Events" value={stats.total} /><StatCard title="Active Events" value={stats.active} /><StatCard title="Inactive Events" value={stats.inactive} /></div><div className="mt-12"><div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-center"><h2 className="text-2xl font-bold text-white">Manage Sessions</h2><div className="flex flex-col md:flex-row md:items-center md:space-x-4"><input type="date" name="startDate" value={dateFilters.startDate} onChange={handleDateFilterChange} className="px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400"/><input type="date" name="endDate" value={dateFilters.endDate} onChange={handleDateFilterChange} className="px-4 py-2 border border-gray-600 rounded-md mt-2 md:mt-0 bg-gray-800 text-white placeholder-gray-400"/><input type="text" placeholder="Search by title or artist..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border border-gray-600 rounded-md mt-2 md:mt-0 bg-gray-800 text-white placeholder-gray-400"/></div></div><div className="mt-4 bg-white p-4 rounded-lg shadow-md overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artist Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{filteredSessions.map((session) => (<tr key={session.id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.workshop_events.title}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.workshop_events.artist_name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{session.session_title}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.date}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.time}</td><td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.workshop_events.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{session.workshop_events.is_active ? 'Active' : 'Inactive'}</span></td><td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><Link href={`/admin/edit/${session.workshop_events.id}`} className="text-teal-600 hover:text-teal-900">Edit</Link></td></tr>))}</tbody></table></div><div className="mt-4 flex justify-between items-center"><button onClick={() => fetchWorkshops(currentPage - 1)} disabled={currentPage <= 1} className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md border border-gray-600 disabled:opacity-50">Previous</button><span className="text-sm text-gray-300">Page {currentPage} of {totalPages}</span><button onClick={() => fetchWorkshops(currentPage + 1)} disabled={currentPage >= totalPages} className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md border border-gray-600 disabled:opacity-50">Next</button></div></div><div className="mt-12"><div className="text-center mb-8"><h2 className="text-2xl font-bold text-white">Create New Workshop Event</h2></div><div className="bg-white p-8 rounded-lg shadow-md"><form onSubmit={handleSubmit} className="space-y-8">{/* ... Your form ... */}</form>{message && <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}</div></div>
    </div>
  );
};

export default AdminPage;