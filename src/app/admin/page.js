'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';

const StatCard = ({ title, value }) => ( <div className="bg-gray-700 p-4 rounded-lg shadow-sm text-center"><p className="text-sm font-medium text-gray-400">{title}</p><p className="mt-1 text-3xl font-semibold text-white">{value}</p></div>);

const PricingTierInput = ({ tier, index, onChange, onRemove }) => (
  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
    <span className="text-sm text-gray-500">First</span>
    <input type="number" name="up_to_seat" value={tier.up_to_seat} onChange={(e) => onChange(index, e)} className="w-20 px-2 py-1 border rounded-md text-black" placeholder="Seats"/>
    <span className="text-sm text-gray-500">at ₹</span>
    <input type="number" name="price" value={tier.price} onChange={(e) => onChange(index, e)} className="w-24 px-2 py-1 border rounded-md text-black" placeholder="Price"/>
    <button type="button" onClick={() => onRemove(index)} className="text-red-500 font-bold">&times;</button>
  </div>
);

const AdminPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [eventData, setEventData] = useState({ title: '', artist_name: '', is_active: true });
  const [imageFile, setImageFile] = useState(null);
  const [sessions, setSessions] = useState([{ 
    session_title: '', date: '', time: '', total_seats: 50, use_tiered_pricing: false, cost: '1000', 
    pricing_tiers: [{ up_to_seat: 20, price: 800 }, { up_to_seat: 50, price: 1000 }] 
  }]);

  const [allSessions, setAllSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dateFilters, setDateFilters] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { /* Auth check logic */ const checkUser = async () => {const { data: { session } } = await supabase.auth.getSession();if (!session) {router.push('/login');} else {setUser(session.user);setAuthLoading(false);}}; checkUser(); }, [router]);

  const SESSIONS_PER_PAGE = 10;
  const fetchWorkshops = async (page = 1, filters = dateFilters) => { /* Fetch logic */ const params = new URLSearchParams({page: page.toString(),...(filters.startDate && { startDate: filters.startDate }),...(filters.endDate && { endDate: filters.endDate }),});const response = await fetch(`/api/get-workshops?${params.toString()}`);const { data, count } = await response.json();if (data) {setAllSessions(data);setFilteredSessions(data);setTotalCount(count || 0);setCurrentPage(page);}};
  const fetchTotalStats = async () => { /* Stats logic */ const response = await fetch('/api/get-workshops'); const { data } = await response.json();if (data) {const uniqueEvents = [...new Map(data.map(item => [item.workshop_events.id, item.workshop_events])).values()];const total = uniqueEvents.length;const active = uniqueEvents.filter(w => w.is_active).length;setStats({ total, active, inactive: total - active });}};

  useEffect(() => {if (!authLoading) {fetchWorkshops(1, dateFilters);fetchTotalStats();}}, [dateFilters, authLoading]);
  useEffect(() => { /* Search logic */ let result = allSessions;if (searchTerm) {result = allSessions.filter(session =>session.workshop_events.title.toLowerCase().includes(searchTerm.toLowerCase()) ||session.workshop_events.artist_name.toLowerCase().includes(searchTerm.toLowerCase()));}setFilteredSessions(result);}, [searchTerm, allSessions]);

  const handleEventChange = (e) => {if (e.target.type === 'checkbox') {setEventData({ ...eventData, [e.target.name]: e.target.checked });} else {setEventData({ ...eventData, [e.target.name]: e.target.value });}};
  const handleFileChange = (e) => {if (e.target.files) setImageFile(e.target.files[0]);};

  const handleSessionChange = (index, e) => {
    const updatedSessions = [...sessions];
    if (e.target.type === 'checkbox') {
      updatedSessions[index][e.target.name] = e.target.checked;
    } else {
      updatedSessions[index][e.target.name] = e.target.value;
    }
    setSessions(updatedSessions);
  };

  const addSession = () => {if (sessions.length < 10) {setSessions([...sessions, { session_title: '', date: '', time: '', total_seats: 50, use_tiered_pricing: false, cost: '1000', pricing_tiers: [{ up_to_seat: 20, price: 800 }, { up_to_seat: 50, price: 1000 }] }]);}};
  const removeSession = (index) => {if (sessions.length > 1) {setSessions(sessions.filter((_, i) => i !== index));}};

  const handleTierChange = (sessionIndex, tierIndex, e) => {const updatedSessions = [...sessions];updatedSessions[sessionIndex].pricing_tiers[tierIndex][e.target.name] = e.target.value;setSessions(updatedSessions);};
  const addTier = (sessionIndex) => {const updatedSessions = [...sessions];updatedSessions[sessionIndex].pricing_tiers.push({ up_to_seat: '', price: '' });setSessions(updatedSessions);};
  const removeTier = (sessionIndex, tierIndex) => {const updatedSessions = [...sessions];if (updatedSessions[sessionIndex].pricing_tiers.length > 1) {updatedSessions[sessionIndex].pricing_tiers.splice(tierIndex, 1);setSessions(updatedSessions);}};

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!imageFile) {setMessage('Error: Please select a poster image.'); return;} setLoading(true); setMessage(''); const formData = new FormData(); formData.append('title', eventData.title); formData.append('artist_name', eventData.artist_name); formData.append('is_active', eventData.is_active); formData.append('image', imageFile); formData.append('sessions', JSON.stringify(sessions)); const response = await fetch('/api/create-workshop', {method: 'POST', body: formData,}); const result = await response.json(); if (response.ok) {setMessage('Workshop Event and all Sessions created successfully!'); setEventData({ title: '', artist_name: '', is_active: true }); setImageFile(null); setSessions([{ session_title: '', date: '', time: '', total_seats: 50, use_tiered_pricing: false, cost: '1000', pricing_tiers: [{ up_to_seat: 20, price: 800 }, { up_to_seat: 50, price: 1000 }] }]); document.getElementById('image').value = ''; fetchWorkshops(); fetchTotalStats();} else {setMessage(`Error: ${result.error}`);} setLoading(false);
  };

  const handleDateFilterChange = (e) => { setDateFilters({ ...dateFilters, [e.target.name]: e.target.value }); };
  const handleLogout = async () => {await supabase.auth.signOut();router.push('/login');};
  const totalPages = Math.ceil(totalCount / SESSIONS_PER_PAGE);

  if (authLoading) {
    return <div className="text-center p-12 text-white">Verifying access...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard title="Total Workshop Events" value={stats.total} />
        <StatCard title="Active Events" value={stats.active} />
        <StatCard title="Inactive Events" value={stats.inactive} />
      </div>

      <div className="mt-12">
        <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
          <h2 className="text-2xl font-bold text-white">Manage Sessions</h2>
          {/* ... filter controls ... */}
        </div>
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* ... table content ... */}
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          {/* ... pagination controls ... */}
        </div>
      </div>

      <div className="mt-12">
        <div className="text-center mb-8"><h2 className="text-2xl font-bold text-white">Create New Workshop Event</h2></div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4 p-4 border border-gray-300 rounded-md">
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 text-black">Main Event Details</h2>
              {/* ... main event fields ... */}
            </div>

            <div className="space-y-4 p-4 border border-gray-300 rounded-md">
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 text-black">Workshop Sessions</h2>
              {sessions.map((session, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4 relative">
                  <h3 className="font-medium text-gray-800">Session {index + 1}</h3>
                  {/* ... session_title, date, time inputs ... */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Seats</label>
                    <input type="number" name="total_seats" required value={session.total_seats} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border rounded-md text-black" />
                  </div>

                  {/* Tiered Pricing Toggle */}
                  <div className="flex items-center">
                    <input type="checkbox" name="use_tiered_pricing" id={`use_tiered_pricing_${index}`} checked={session.use_tiered_pricing} onChange={(e) => handleSessionChange(index, e)} className="h-4 w-4 text-teal-600 border-gray-300 rounded"/>
                    <label htmlFor={`use_tiered_pricing_${index}`} className="ml-2 block text-sm font-medium text-gray-900">Use Tiered Pricing</label>
                  </div>

                  {/* Conditional Pricing Inputs */}
                  {session.use_tiered_pricing ? (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pricing Tiers</label>
                      <div className="space-y-2 mt-2">
                        {session.pricing_tiers.map((tier, tierIndex) => (
                          <PricingTierInput key={tierIndex} tier={tier} index={tierIndex} onChange={(idx, e) => handleTierChange(index, idx, e)} onRemove={() => removeTier(index, tierIndex)} />
                        ))}
                      </div>
                      <button type="button" onClick={() => addTier(index)} className="mt-2 text-sm text-teal-600 font-semibold">+ Add Tier</button>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Flat Cost</label>
                      <input type="text" name="cost" required value={session.cost} onChange={(e) => handleSessionChange(index, e)} className="mt-1 w-full px-4 py-2 border rounded-md text-black" placeholder="e.g., ₹1500"/>
                    </div>
                  )}

                  {sessions.length > 1 && (<button type="button" onClick={() => removeSession(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>)}
                </div>
              ))}
              {sessions.length < 10 && (<button type="button" onClick={addSession} className="w-full text-teal-600 font-semibold py-2 px-4 rounded-md border-2 border-dashed border-teal-500 hover:bg-teal-50">+ Add Another Session</button>)}
            </div>
            <div>
              <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-400">{loading ? 'Saving...' : 'Save Full Workshop'}</button>
            </div>
          </form>
          {message && <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;