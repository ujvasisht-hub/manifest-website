'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      setMessage('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ fullName: '', phoneNumber: '', email: '', message: '' }); // Reset form
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input type="text" id="fullName" name="fullName" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black" placeholder="Enter your full name"/>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" required value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black" placeholder="+91 XXXXX XXXXX"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
              <input type="email" id="email" name="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black" placeholder="your.email@example.com"/>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
              <textarea id="message" name="message" required rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical text-black" placeholder="Tell us about your interest..."></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg disabled:bg-gray-400">
              {loading ? 'Submitting...' : 'Submit Message'}
            </button>
          </form>
          {message && <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
        </div>

        <div className="space-y-8 text-white">
          {/* ... The rest of your contact info blocks ... */}
        </div>
      </div>
    </div>
  );
};