'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';

// ... (StatCard and PricingTierInput components remain the same)
const StatCard = ({ title, value }) => ( <div className="bg-gray-700 p-4 rounded-lg shadow-sm text-center"><p className="text-sm font-medium text-gray-400">{title}</p><p className="mt-1 text-3xl font-semibold text-white">{value}</p></div>);
const PricingTierInput = ({ tier, index, onChange, onRemove }) => ( <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded"><input type="text" name="tier_name" value={tier.tier_name} onChange={(e) => onChange(index, e)} className="w-28 px-2 py-1 border rounded-md text-black" placeholder="Tier Name"/><span className="text-sm text-gray-500">First</span><input type="number" name="up_to_seat" value={tier.up_to_seat} onChange={(e) => onChange(index, e)} className="w-20 px-2 py-1 border rounded-md text-black" placeholder="Seats"/><span className="text-sm text-gray-500">seats at ₹</span><input type="number" name="price" value={tier.price} onChange={(e) => onChange(index, e)} className="w-24 px-2 py-1 border rounded-md text-black" placeholder="Price"/><button type="button" onClick={() => onRemove(index)} className="text-red-500 font-bold">&times;</button></div>);


const AdminPage = () => {
  const router = useRouter();
  // ... (All other state variables remain the same)
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const newSessionStructure = { session_title: '', date: '', time: '', total_seats: 50, use_tiered_pricing: false, cost: '1000', is_active: true, pricing_tiers: [{ tier_name: 'Early Bird', up_to_seat: 50, price: 1000 }] };
  const [eventData, setEventData] = useState({ title: '', artist_name: '', is_active: true });
  const [imageFile, setImageFile] = useState(null);
  const [sessions, setSessions] = useState([newSessionStructure]);
  const [allSessions, setAllSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dateFilters, setDateFilters] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  // ... (All fetch logic and useEffects remain the same)
  useEffect(() => { const checkUser = async () => {const { data: { session } } = await supabase.auth.getSession();if (!session) {router.push('/login');} else {setUser(session.user);setAuthLoading(false);}}; checkUser(); }, [router]);
  const SESSIONS_PER_PAGE = 10;
  const fetchWorkshops = async (page = 1, filters = dateFilters) => { const params = new URLSearchParams({page: page.toString(),...(filters.startDate && { startDate: filters.startDate }),...(filters.endDate && { endDate: filters.endDate }),});const response = await fetch(`/api/get-workshops?${params.toString()}`);const { data, count } = await response.json();if (data) {setAllSessions(data);setFilteredSessions(data);setTotalCount(count || 0);setCurrentPage(page);}};
  const fetchTotalStats = async () => { const response = await fetch('/api/get-workshops'); const { data } = await response.json();if (data) {const uniqueEvents = [...new Map(data.map(item => [item.workshop_events.id, item.workshop_events])).values()];const total = uniqueEvents.length;const active = uniqueEvents.filter(w => w.is_active).length;setStats({ total, active, inactive: total - active });}};
  useEffect(() => {if (!authLoading) {fetchWorkshops(1, dateFilters);fetchTotalStats();}}, [dateFilters, authLoading]);
  useEffect(() => { let result = allSessions;if (searchTerm) {result = allSessions.filter(session =>session.workshop_events.title.toLowerCase().includes(searchTerm.toLowerCase()) ||session.workshop_events.artist_name.toLowerCase().includes(searchTerm.toLowerCase()));}setFilteredSessions(result);}, [searchTerm, allSessions]);

  // ... (All handle... functions for the form remain the same, but add is_active to newSessionStructure)
  const handleEventChange = (e) => {if (e.target.type === 'checkbox') {setEventData({ ...eventData, [e.target.name]: e.target.checked });} else {setEventData({ ...eventData, [e.target.name]: e.target.value });}};
  const handleFileChange = (e) => {if (e.target.files) setImageFile(e.target.files[0]);};
  const handleSessionChange = (index, e) => {const updatedSessions = [...sessions];if (e.target.type === 'checkbox') {updatedSessions[index][e.target.name] = e.target.checked;} else {updatedSessions[index][e.target.name] = e.target.value;}setSessions(updatedSessions);};
  const addSession = () => {if (sessions.length < 10) {setSessions([...sessions, newSessionStructure]);}};
  const removeSession = (index) => {if (sessions.length > 1) {setSessions(sessions.filter((_, i) => i !== index));}};
  const handleTierChange = (sessionIndex, tierIndex, e) => {const updatedSessions = [...sessions];updatedSessions[sessionIndex].pricing_tiers[tierIndex][e.target.name] = e.target.value;setSessions(updatedSessions);};
  const addTier = (sessionIndex) => {const updatedSessions = [...sessions];const newTierIndex = updatedSessions[sessionIndex].pricing_tiers.length;let defaultName = `Phase ${newTierIndex + 1}`;if (newTierIndex === 0) defaultName = 'Early Bird';if (newTierIndex === 1) defaultName = 'Phase 2';if (newTierIndex === 2) defaultName = 'OTC';updatedSessions[sessionIndex].pricing_tiers.push({ tier_name: defaultName, up_to_seat: '', price: '' });setSessions(updatedSessions);};
  const removeTier = (sessionIndex, tierIndex) => {const updatedSessions = [...sessions];if (updatedSessions[sessionIndex].pricing_tiers.length > 1) {updatedSessions[sessionIndex].pricing_tiers.splice(tierIndex, 1);setSessions(updatedSessions);}};
  const handleSubmit = async (e) => { e.preventDefault(); /* ... (Your existing submit logic) ... */ setMessage(''); for (const session of sessions) {if (session.use_tiered_pricing) {const sumOfTieredSeats = session.pricing_tiers.reduce((sum, tier) => sum + Number(tier.up_to_seat || 0), 0);if (sumOfTieredSeats > Number(session.total_seats)) {setMessage(`Error: In '${session.session_title}', the sum of tiered seats (${sumOfTieredSeats}) cannot exceed the total seats (${session.total_seats}).`);return;}}} if (!imageFile) {setMessage('Error: Please select a poster image.'); return;} setLoading(true); const formData = new FormData(); formData.append('title', eventData.title); formData.append('artist_name', eventData.artist_name); formData.append('is_active', eventData.is_active); formData.append('image', imageFile); formData.append('sessions', JSON.stringify(sessions)); const response = await fetch('/api/create-workshop', {method: 'POST', body: formData,}); const result = await response.json(); if (response.ok) {setMessage('Workshop Event and all Sessions created successfully!'); setEventData({ title: '', artist_name: '', is_active: true }); setImageFile(null); setSessions([newSessionStructure]); document.getElementById('image').value = ''; fetchWorkshops(); fetchTotalStats();} else {setMessage(`Error: ${result.error}`);} setLoading(false);};
  const handleDateFilterChange = (e) => { setDateFilters({ ...dateFilters, [e.target.name]: e.target.value }); };
  const handleLogout = async () => {await supabase.auth.signOut();router.push('/login');};
  const totalPages = Math.ceil(totalCount / SESSIONS_PER_PAGE);

  const handleSessionStatusToggle = async (sessionId, currentStatus) => {
    const response = await fetch('/api/toggle-session-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, newStatus: !currentStatus }),
    });
    if (response.ok) {
      fetchWorkshops(currentPage, dateFilters); // Refetch to show changes
    } else {
      alert('Failed to update session status.');
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete the event "${eventTitle}" and all of its sessions? This action cannot be undone.`)) {
      const response = await fetch('/api/delete-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      if (response.ok) {
        fetchWorkshops(1, {}); // Go back to page 1 with no filters
        fetchTotalStats();
      } else {
        alert('Failed to delete workshop.');
      }
    }
  };
  
  if (authLoading) { return <div className="text-center p-12 text-white">Verifying access...</div>; }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-white">Admin Dashboard</h1><button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button></div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3"><StatCard title="Total Workshop Events" value={stats.total} /><StatCard title="Active Events" value={stats.active} /><StatCard title="Inactive Events" value={stats.inactive} /></div>

      <div className="mt-12">
        <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-center"><h2 className="text-2xl font-bold text-white">Manage Sessions</h2>{/* ... filter controls ... */}</div>
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artist Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.workshop_events.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.workshop_events.artist_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{session.session_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleSessionStatusToggle(session.id, session.is_active)} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {session.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link href={`/admin/edit/${session.workshop_events.id}`} className="text-teal-600 hover:text-teal-900">Edit</Link>
                    <button onClick={() => handleDeleteEvent(session.workshop_events.id, session.workshop_events.title)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">{/* ... pagination controls ... */}</div>
      </div>
      
      <div className="mt-12">
        {/* ... Create Form Section (unchanged) ... */}
      </div>
    </div>
  );
};

export default AdminPage;