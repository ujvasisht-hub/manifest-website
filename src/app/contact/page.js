'use client'

import React, { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', email: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We\'ll get back to you soon.');
        setFormData({ fullName: '', phoneNumber: '', email: '', message: '' });
    };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        {/* Changed text color to white */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get In Touch
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Have questions about our workshops or want to discuss a custom creative session? 
          We'd love to hear from you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form action="YOUR_FORMSPREE_URL" method="POST" className="space-y-6">
            {/* ... your form inputs ... */}
             <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input type="text" id="fullName" name="fullName" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-black" placeholder="Enter your full name"/></div><div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label><input type="tel" id="phoneNumber" name="phoneNumber" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-black" placeholder="+91 XXXXX XXXXX"/></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label><input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-black" placeholder="your.email@example.com"/></div><div><label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label><textarea id="message" name="message" required rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-vertical text-black" placeholder="Tell us about your interest..."></textarea></div><button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">Submit Message</button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8 text-white">
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-pink-400 mb-4">Ready to Start Your Creative Journey?</h3>
            <p className="text-gray-300 mb-4">Our team is here to guide you every step of the way.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Contact Information</h3>
            <div className="space-y-3 text-gray-300">
              <p><span className="font-medium">Phone:</span> +91 98765 43210</p>
              <p><span className="font-medium">Email:</span> hello@manifestbytmn.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};